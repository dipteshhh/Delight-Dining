import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  getDemoCateringInquiries,
  saveDemoCateringInquiries,
} from '../lib/demoStore'
import { sendConfirmationEmail } from '../lib/notifications'
import type { CateringInquiry, CateringInquiryInsert } from '../types'

function sortByEventDate(inquiries: CateringInquiry[]) {
  return [...inquiries].sort((a, b) => {
    const dateCompare = a.event_date.localeCompare(b.event_date)
    if (dateCompare !== 0) return dateCompare
    return b.created_at.localeCompare(a.created_at)
  })
}

export function useCatering() {
  const createInquiry = async (
    data: CateringInquiryInsert
  ): Promise<{ data: CateringInquiry | null; error: string | null }> => {
    if (!isSupabaseConfigured) {
      const existingInquiries = getDemoCateringInquiries()
      const newInquiry: CateringInquiry = {
        id: crypto.randomUUID(),
        ...data,
        status: 'new',
        created_at: new Date().toISOString(),
      }

      saveDemoCateringInquiries(sortByEventDate([newInquiry, ...existingInquiries]))
      return { data: newInquiry, error: null }
    }

    const { error } = await supabase
      .from('catering_inquiries')
      .insert(data)

    if (error) {
      return { data: null, error: error.message }
    }

    const createdInquiry: CateringInquiry = {
      id: crypto.randomUUID(),
      ...data,
      status: 'new',
      created_at: new Date().toISOString(),
    }

    await sendConfirmationEmail({ type: 'catering', record: createdInquiry })

    return { data: createdInquiry, error: null }
  }

  return { createInquiry }
}

export function useAdminCatering() {
  const [inquiries, setInquiries] = useState<CateringInquiry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setInquiries(sortByEventDate(getDemoCateringInquiries()))
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('catering_inquiries')
      .select('*')
      .order('event_date', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Failed to load catering inquiries:', error.message)
      setInquiries([])
    } else {
      setInquiries((data ?? []) as CateringInquiry[])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const updateStatus = async (
    id: string,
    status: CateringInquiry['status']
  ): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const updated = getDemoCateringInquiries().map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )
      saveDemoCateringInquiries(sortByEventDate(updated))
      setInquiries(sortByEventDate(updated))
      return null
    }

    const { error } = await supabase
      .from('catering_inquiries')
      .update({ status })
      .eq('id', id)

    if (error) return error.message

    await fetchAll()
    return null
  }

  return { inquiries, loading, updateStatus, refetch: fetchAll }
}
