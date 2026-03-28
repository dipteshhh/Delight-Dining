const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
}

type ReservationRecord = {
  date: string
  email: string
  first_name: string
  guests: number
  id: string
  last_name: string
  time: string
}

type CateringRecord = {
  contact_email: string
  contact_name: string
  event_date: string
  guest_count: number
  id: string
  package_name: string
  service_type: string
}

type Payload =
  | { type: 'reservation'; record: ReservationRecord }
  | { type: 'catering'; record: CateringRecord }

type EmailRequest = {
  html: string
  subject: string
  to: string
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

function sendEmailFactory(
  resendApiKey: string,
  fromAddress: string
) {
  return async ({ html, subject, to }: EmailRequest) => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        html,
        subject,
        to: [to],
      }),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Resend request failed')
    }
  }
}

function buildReservationEmails(
  reservation: ReservationRecord,
  adminAddress: string | null
): EmailRequest[] {
  const reservationCode = reservation.id.slice(0, 8).toUpperCase()
  const customerEmail: EmailRequest = {
    to: reservation.email,
    subject: `Reservation received for ${reservation.date}`,
    html: `
      <h2>Reservation received</h2>
      <p>Hi ${reservation.first_name},</p>
      <p>We received your reservation request for <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong>.</p>
      <p>Party size: <strong>${reservation.guests}</strong></p>
      <p>Reference code: <strong>${reservationCode}</strong></p>
      <p>We look forward to welcoming you to Delight Dining.</p>
    `,
  }

  if (!adminAddress) return [customerEmail]

  return [
    customerEmail,
    {
      to: adminAddress,
      subject: `New reservation: ${reservation.first_name} ${reservation.last_name}`,
      html: `
        <h2>New reservation request</h2>
        <p><strong>Guest:</strong> ${reservation.first_name} ${reservation.last_name}</p>
        <p><strong>Date:</strong> ${reservation.date}</p>
        <p><strong>Time:</strong> ${reservation.time}</p>
        <p><strong>Party size:</strong> ${reservation.guests}</p>
        <p><strong>Email:</strong> ${reservation.email}</p>
        <p><strong>Reference:</strong> ${reservationCode}</p>
      `,
    },
  ]
}

function buildCateringEmails(
  inquiry: CateringRecord,
  adminAddress: string | null
): EmailRequest[] {
  const inquiryCode = inquiry.id.slice(0, 8).toUpperCase()
  const customerEmail: EmailRequest = {
    to: inquiry.contact_email,
    subject: `Catering inquiry received for ${inquiry.event_date}`,
    html: `
      <h2>Catering inquiry received</h2>
      <p>Hi ${inquiry.contact_name},</p>
      <p>We received your ${inquiry.package_name} catering inquiry for <strong>${inquiry.event_date}</strong>.</p>
      <p>Guest count: <strong>${inquiry.guest_count}</strong></p>
      <p>Service type: <strong>${inquiry.service_type}</strong></p>
      <p>Reference code: <strong>${inquiryCode}</strong></p>
      <p>Our team will follow up with a proposal and next steps.</p>
    `,
  }

  if (!adminAddress) return [customerEmail]

  return [
    customerEmail,
    {
      to: adminAddress,
      subject: `New catering inquiry: ${inquiry.contact_name}`,
      html: `
        <h2>New catering inquiry</h2>
        <p><strong>Contact:</strong> ${inquiry.contact_name}</p>
        <p><strong>Email:</strong> ${inquiry.contact_email}</p>
        <p><strong>Event date:</strong> ${inquiry.event_date}</p>
        <p><strong>Guests:</strong> ${inquiry.guest_count}</p>
        <p><strong>Package:</strong> ${inquiry.package_name}</p>
        <p><strong>Service type:</strong> ${inquiry.service_type}</p>
        <p><strong>Reference:</strong> ${inquiryCode}</p>
      `,
    },
  ]
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromAddress =
      Deno.env.get('RESEND_FROM_EMAIL') ?? 'Delight Dining <notifications@example.com>'
    const adminAddress = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')

    if (!resendApiKey) {
      return jsonResponse(
        { skipped: true, reason: 'RESEND_API_KEY is not configured.' },
        { status: 202 }
      )
    }

    const payload = (await request.json()) as Payload
    const sendEmail = sendEmailFactory(resendApiKey, fromAddress)

    const emails =
      payload.type === 'reservation'
        ? buildReservationEmails(payload.record, adminAddress)
        : payload.type === 'catering'
          ? buildCateringEmails(payload.record, adminAddress)
          : []

    if (emails.length === 0) {
      return jsonResponse({ error: 'Unsupported notification payload.' }, { status: 400 })
    }

    await Promise.all(emails.map(sendEmail))

    return jsonResponse({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, { status: 500 })
  }
})
