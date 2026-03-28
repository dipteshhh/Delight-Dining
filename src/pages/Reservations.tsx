import { type FormEvent, useEffect, useState } from 'react'
import {
  MAX_RESERVATIONS_PER_SLOT,
  useReservations,
} from '../hooks/useReservations'
import { useToast } from '../components/Toast'

const timeSlots = [
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '17:30', label: '5:30 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '18:30', label: '6:30 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '19:30', label: '7:30 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '20:30', label: '8:30 PM' },
  { value: '21:00', label: '9:00 PM' },
]

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

interface FormErrors {
  [key: string]: string
}

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availabilityByTime, setAvailabilityByTime] = useState<Record<string, number>>({})
  const { createReservation, checkAvailability, getAvailabilityForDate } = useReservations()
  const { addToast } = useToast()

  useEffect(() => {
    let isCancelled = false

    if (!selectedDate) {
      setAvailabilityByTime({})
      return
    }

    setLoadingAvailability(true)

    void getAvailabilityForDate(selectedDate)
      .then((availability) => {
        if (!isCancelled) {
          setAvailabilityByTime(availability)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoadingAvailability(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [selectedDate])

  const validate = (form: FormData): FormErrors => {
    const errs: FormErrors = {}
    const firstName = (form.get('first-name') as string).trim()
    const lastName = (form.get('last-name') as string).trim()
    const email = form.get('email') as string
    const phone = form.get('phone') as string
    const date = form.get('date') as string
    const time = form.get('time') as string
    const guests = form.get('guests') as string

    if (!firstName) errs['first-name'] = 'First name is required'
    if (!lastName) errs['last-name'] = 'Last name is required'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required'
    if (!phone || phone.replace(/\D/g, '').length < 7) errs.phone = 'Valid phone number is required'
    if (!date) errs.date = 'Please select a date'
    else if (date < getTodayString()) errs.date = 'Date must be today or later'
    if (!time) errs.time = 'Please select a time'
    if (!guests) errs.guests = 'Please select number of guests'
    return errs
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const validationErrors = validate(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      addToast('Please fix the errors in the form.', 'error')
      return
    }

    setErrors({})
    setSubmitting(true)

    const date = form.get('date') as string
    const time = form.get('time') as string

    const { available } = await checkAvailability(date, time)
    if (!available) {
      addToast('Sorry, that time slot is fully booked. Please choose another.', 'error')
      setSubmitting(false)
      return
    }

    const { error } = await createReservation({
      first_name: (form.get('first-name') as string).trim(),
      last_name: (form.get('last-name') as string).trim(),
      email: (form.get('email') as string).trim(),
      phone: (form.get('phone') as string).trim(),
      date,
      time,
      guests: parseInt(form.get('guests') as string),
      special_requests: (form.get('requests') as string)?.trim() || null,
    })

    setSubmitting(false)

    if (error) {
      addToast(error, 'error')
      return
    }

    setSubmitted(true)
    e.currentTarget.reset()
    setSelectedDate('')
    setSelectedTime('')
    setAvailabilityByTime({})
    const timeLabel = timeSlots.find((t) => t.value === time)?.label ?? time
    addToast(`Reservation confirmed for ${date} at ${timeLabel}!`, 'success')
  }

  if (submitted) {
    return (
      <>
        <section className="page-hero">
          <div className="container">
            <span className="section-label animate-fade-up">All Set!</span>
            <h1 className="section-title animate-fade-up delay-1">Reservation Confirmed</h1>
          </div>
        </section>
        <section className="reservation-section">
          <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
            <div className="reservation-form animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
              <h3 style={{ color: 'var(--clr-success)', marginBottom: 12 }}>You're All Set!</h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 32 }}>
                Your reservation has been received. We look forward to welcoming you at Delight Dining.
              </p>
              <button className="btn btn-wine" onClick={() => setSubmitted(false)}>
                Make Another Reservation
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">Reserve Your Spot</span>
          <h1 className="section-title animate-fade-up delay-1">Make a Reservation</h1>
          <p className="section-subtitle mx-auto animate-fade-up delay-2">
            Secure your table at Delight Dining. We can't wait to welcome you
            for an unforgettable dining experience.
          </p>
        </div>
      </section>

      <section className="reservation-section">
        <div className="container">
          <div className="reservation-grid">
            <div className="reservation-form animate-fade-up">
              <h3>Book Your Table</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first-name">First Name</label>
                    <input type="text" id="first-name" name="first-name" placeholder="John" required
                      className={errors['first-name'] ? 'input-error' : ''}
                      onChange={() => setErrors((e) => { const n = { ...e }; delete n['first-name']; return n })} />
                    {errors['first-name'] && <span className="field-error">{errors['first-name']}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">Last Name</label>
                    <input type="text" id="last-name" name="last-name" placeholder="Doe" required
                      className={errors['last-name'] ? 'input-error' : ''}
                      onChange={() => setErrors((e) => { const n = { ...e }; delete n['last-name']; return n })} />
                    {errors['last-name'] && <span className="field-error">{errors['last-name']}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="john@example.com" required
                      className={errors.email ? 'input-error' : ''}
                      onChange={() => setErrors((e) => { const n = { ...e }; delete n.email; return n })} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required
                      className={errors.phone ? 'input-error' : ''}
                      onChange={() => setErrors((e) => { const n = { ...e }; delete n.phone; return n })} />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" min={getTodayString()} required
                      className={errors.date ? 'input-error' : ''}
                      onChange={(event) => {
                        setSelectedDate(event.target.value)
                        setSelectedTime('')
                        setErrors((e) => { const n = { ...e }; delete n.date; return n })
                      }} />
                    {errors.date && <span className="field-error">{errors.date}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <select id="time" name="time" required
                      className={errors.time ? 'input-error' : ''}
                      disabled={!selectedDate || loadingAvailability}
                      value={selectedTime}
                      onChange={(event) => {
                        setSelectedTime(event.target.value)
                        setErrors((e) => { const n = { ...e }; delete n.time; return n })
                      }}>
                      <option value="" disabled>Select a time</option>
                      {timeSlots.map((slot) => {
                        const currentCount = availabilityByTime[slot.value] ?? 0
                        const isFull = currentCount >= MAX_RESERVATIONS_PER_SLOT

                        return (
                          <option disabled={isFull} key={slot.value} value={slot.value}>
                            {slot.label}{isFull ? ' · Fully booked' : ''}
                          </option>
                        )
                      })}
                    </select>
                    {!selectedDate && (
                      <span className="field-hint">
                        Pick a date first to see live availability.
                      </span>
                    )}
                    {loadingAvailability && (
                      <span className="field-hint">Checking live availability...</span>
                    )}
                    {selectedDate && !loadingAvailability && (
                      <div className="slot-summary-grid">
                        {timeSlots.map((slot) => {
                          const currentCount = availabilityByTime[slot.value] ?? 0
                          const remaining = Math.max(
                            MAX_RESERVATIONS_PER_SLOT - currentCount,
                            0
                          )

                          return (
                            <div
                              className={`slot-pill${remaining === 0 ? ' full' : ''}${
                                selectedTime === slot.value ? ' selected' : ''
                              }`}
                              key={slot.value}
                            >
                              <span>{slot.label}</span>
                              <strong>
                                {remaining === 0 ? 'Full' : `${remaining} left`}
                              </strong>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {errors.time && <span className="field-error">{errors.time}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select id="guests" name="guests" required defaultValue=""
                    className={errors.guests ? 'input-error' : ''}
                    onChange={() => setErrors((e) => { const n = { ...e }; delete n.guests; return n })}>
                    <option value="" disabled>How many guests?</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                    <option value="8">8+ Guests</option>
                  </select>
                  {errors.guests && <span className="field-error">{errors.guests}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="requests">Special Requests</label>
                  <textarea id="requests" name="requests"
                    placeholder="Allergies, dietary restrictions, special occasions, seating preferences..." />
                </div>
                <button type="submit" className="btn btn-wine form-submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Confirm Reservation'}
                </button>
              </form>
            </div>

            <div className="reservation-info animate-fade-up delay-2">
              <h3>Good to Know</h3>
              <p>
                We hold reservations for 15 minutes past the booked time.
                For parties of 8 or more, please call us directly so we can
                ensure the perfect arrangement.
              </p>
              <div className="info-card">
                <div className="info-card-icon">📅</div>
                <div>
                  <h4>Opening Hours</h4>
                  <p>Mon–Fri: 11 AM – 10 PM<br />Sat: 10 AM – 11 PM<br />Sun: 10 AM – 9 PM</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">📍</div>
                <div>
                  <h4>Our Location</h4>
                  <p>123 Flavor Street<br />Culinary City, CC 10001</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">☎</div>
                <div>
                  <h4>Call Us</h4>
                  <p>(555) 123-4567<br />We're happy to help with any questions.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">🎉</div>
                <div>
                  <h4>Private Events</h4>
                  <p>Celebrating something special? We offer private dining rooms for birthdays, anniversaries, and corporate events.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
