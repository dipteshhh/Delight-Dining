import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getDemoReservations, saveDemoReservations } from '../lib/demoStore'
import { sendConfirmationEmail } from '../lib/notifications'
import type { Reservation, ReservationInsert } from '../types'

export const MAX_RESERVATIONS_PER_SLOT = 8

function sortReservations(reservations: Reservation[]) {
  return [...reservations].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    const timeCompare = a.time.localeCompare(b.time)
    if (timeCompare !== 0) return timeCompare
    return b.created_at.localeCompare(a.created_at)
  })
}

function buildAvailabilityMap(reservations: Reservation[]) {
  return reservations.reduce<Record<string, number>>((availability, reservation) => {
    if (reservation.status !== 'cancelled') {
      availability[reservation.time] = (availability[reservation.time] ?? 0) + 1
    }
    return availability
  }, {})
}

export function useReservations() {
  const checkAvailability = async (
    date: string,
    time: string
  ): Promise<{ available: boolean; count: number }> => {
    if (!isSupabaseConfigured) {
      const currentReservations = getDemoReservations()
      const count = currentReservations.filter(
        (reservation) =>
          reservation.date === date &&
          reservation.time === time &&
          reservation.status !== 'cancelled'
      ).length

      return { available: count < MAX_RESERVATIONS_PER_SLOT, count }
    }

    const { count, error } = await supabase
      .from('reservations')

      .select('*', { count: 'exact', head: true })
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')

    if (error) {
      console.warn('Failed to check reservation availability:', error.message)
    }

    const currentCount = count ?? 0
    return { available: currentCount < MAX_RESERVATIONS_PER_SLOT, count: currentCount }
  }

  const getAvailabilityForDate = async (date: string) => {
    if (!isSupabaseConfigured) {
      return buildAvailabilityMap(
        getDemoReservations().filter((reservation) => reservation.date === date)
      )
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('time, status')
      .eq('date', date)

    if (error) {
      console.warn('Failed to load reservation slots:', error.message)
      return {}
    }

    return (data ?? []).reduce<Record<string, number>>((availability, reservation) => {
      if (reservation.status !== 'cancelled') {
        availability[reservation.time] = (availability[reservation.time] ?? 0) + 1
      }
      return availability
    }, {})
  }

  const createReservation = async (
    data: ReservationInsert
  ): Promise<{ data: Reservation | null; error: string | null }> => {
    if (!isSupabaseConfigured) {
      const { available } = await checkAvailability(data.date, data.time)
      if (!available) {
        return { data: null, error: 'This reservation slot is fully booked.' }
      }

      const nextReservation: Reservation = {
        id: crypto.randomUUID(),
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
      }

      const nextReservations = sortReservations([
        ...getDemoReservations(),
        nextReservation,
      ])
      saveDemoReservations(nextReservations)
      return { data: nextReservation, error: null }
    }

    const { data: bookedReservation, error: bookingError } = await supabase.rpc(
      'book_reservation',
      {
        p_date: data.date,
        p_email: data.email,
        p_first_name: data.first_name,
        p_guests: data.guests,
        p_last_name: data.last_name,
        p_phone: data.phone,
        p_special_requests: data.special_requests,
        p_time: data.time,
      }
    )

    if (!bookingError && bookedReservation) {
      const record = bookedReservation as Reservation
      await sendConfirmationEmail({ type: 'reservation', record })
      return { data: record, error: null }
    }

    const isMissingFunction =
      bookingError?.code === '42883' ||
      bookingError?.message.toLowerCase().includes('book_reservation')

    if (!isMissingFunction) {
      return { data: null, error: bookingError?.message ?? 'Reservation failed.' }
    }

    const { available } = await checkAvailability(data.date, data.time)
    if (!available) {
      return { data: null, error: 'This reservation slot is fully booked.' }
    }

    const { data: insertedReservation, error } = await supabase
      .from('reservations')
      .insert(data)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    const record = insertedReservation as Reservation
    await sendConfirmationEmail({ type: 'reservation', record })
    return { data: record, error: null }
  }

  return { createReservation, checkAvailability, getAvailabilityForDate }
}

export function useAdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setReservations(sortReservations(getDemoReservations()))
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (error) {
      console.warn('Failed to load reservations:', error.message)
      setReservations([])
    } else {
      setReservations((data ?? []) as Reservation[])
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const updateStatus = async (
    id: string,
    status: Reservation['status']
  ): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const updatedReservations = getDemoReservations().map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation
      )
      const sortedReservations = sortReservations(updatedReservations)
      saveDemoReservations(sortedReservations)
      setReservations(sortedReservations)
      return null
    }

    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
    if (error) return error.message

    await fetchAll()
    return null
  }

  return { reservations, loading, updateStatus, refetch: fetchAll }
}
