import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Reservation, ReservationInsert } from '../types'

const MAX_RESERVATIONS_PER_SLOT = 8

export function useReservations() {
  const createReservation = async (data: ReservationInsert) => {
    if (!isSupabaseConfigured) {
      return { data: { id: crypto.randomUUID(), ...data, status: 'pending' as const, created_at: new Date().toISOString() }, error: null }
    }
    const { data: result, error } = await supabase
      .from('reservations')
      .insert(data)
      .select()
      .single()
    return { data: result, error }
  }

  const checkAvailability = async (date: string, time: string): Promise<{ available: boolean; count: number }> => {
    if (!isSupabaseConfigured) {
      return { available: true, count: 0 }
    }
    const { count } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')

    const current = count ?? 0
    return { available: current < MAX_RESERVATIONS_PER_SLOT, count: current }
  }

  return { createReservation, checkAvailability }
}

export function useAdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false })
    setReservations(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const updateStatus = async (id: string, status: Reservation['status']) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
    if (!error) await fetchAll()
    return error
  }

  return { reservations, loading, updateStatus, refetch: fetchAll }
}
