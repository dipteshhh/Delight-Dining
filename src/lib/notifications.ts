import type { CateringInquiry, Reservation } from '../types'
import { isSupabaseConfigured, supabase } from './supabase'

type NotificationPayload =
  | { type: 'reservation'; record: Reservation }
  | { type: 'catering'; record: CateringInquiry }

export async function sendConfirmationEmail(payload: NotificationPayload) {
  if (!isSupabaseConfigured) return

  const { error } = await supabase.functions.invoke('send-confirmation', {
    body: payload,
  })

  if (error) {
    console.warn('Confirmation email could not be sent:', error.message)
  }
}
