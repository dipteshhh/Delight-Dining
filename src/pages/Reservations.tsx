import { type FormEvent, useState } from 'react'

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

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = data.get('first-name') as string
    const date = data.get('date') as string
    const time = data.get('time') as string
    const timeLabel = timeSlots.find(t => t.value === time)?.label ?? time

    alert(`Thank you, ${name}! Your reservation for ${date} at ${timeLabel} has been received. We'll send a confirmation to your email shortly.`)
    setSubmitted(true)
    e.currentTarget.reset()
    setTimeout(() => setSubmitted(false), 3000)
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
              <h3>{submitted ? '✓ Reservation Received!' : 'Book Your Table'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first-name">First Name</label>
                    <input type="text" id="first-name" name="first-name" placeholder="John" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">Last Name</label>
                    <input type="text" id="last-name" name="last-name" placeholder="Doe" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="john@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <select id="time" name="time" required defaultValue="">
                      <option value="" disabled>Select a time</option>
                      {timeSlots.map(slot => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select id="guests" name="guests" required defaultValue="">
                    <option value="" disabled>How many guests?</option>
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                    <option value="8">8+ Guests</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="requests">Special Requests</label>
                  <textarea
                    id="requests"
                    name="requests"
                    placeholder="Allergies, dietary restrictions, special occasions, seating preferences..."
                  />
                </div>
                <button type="submit" className="btn btn-wine form-submit">
                  Confirm Reservation
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
