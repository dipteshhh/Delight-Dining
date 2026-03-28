import { type FormEvent, useRef, useState } from 'react'
import { useCatering } from '../hooks/useCatering'
import { useToast } from '../components/Toast'
import { CATERING_SERVICE_OPTIONS } from '../types'

interface Package {
  name: string
  description: string
  price: string
  unit: string
  features: string[]
  featured?: boolean
}

const packages: Package[] = [
  {
    name: 'Essentials',
    description: 'Great for casual get-togethers and office lunches.',
    price: '$25',
    unit: 'per person',
    features: [
      'Choice of 2 entrées',
      '2 sides & salad',
      'Bread & butter',
      'Disposable serviceware',
      'Pickup or delivery',
    ],
  },
  {
    name: 'Signature',
    description: 'Ideal for weddings, galas, and milestone celebrations.',
    price: '$55',
    unit: 'per person',
    featured: true,
    features: [
      'Choice of 4 entrées',
      '3 sides, salad & soup',
      'Artisan bread selection',
      '2 dessert options',
      'Premium serviceware',
      'On-site service staff',
      'Setup & cleanup',
    ],
  },
  {
    name: 'Grand',
    description: 'The full luxury experience for unforgettable events.',
    price: '$95',
    unit: 'per person',
    features: [
      'Unlimited entrée selection',
      'Full appetizer bar',
      'Premium sides & salads',
      'Dessert & coffee station',
      'Fine china & linens',
      'Dedicated event coordinator',
      'Bar service available',
    ],
  },
]

const benefits = [
  'Fully customizable menus tailored to your event theme and preferences',
  'Professional setup, service staff, and cleanup included',
  'Accommodations for all dietary needs — vegan, gluten-free, halal, and more',
  'Pickup or delivery options — order by 5 PM for next-day delivery',
  'Servicing events from 10 to 500+ guests',
]

export default function Catering() {
  const [selectedPackage, setSelectedPackage] = useState(
    packages.find((pkg) => pkg.featured)?.name ?? packages[0].name
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{
    eventDate: string
    guestCount: number
    packageName: string
  } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const inquirySectionRef = useRef<HTMLElement | null>(null)
  const { createInquiry } = useCatering()
  const { addToast } = useToast()

  const getTodayString = () => new Date().toISOString().split('T')[0]

  const validate = (form: FormData) => {
    const nextErrors: Record<string, string> = {}
    const contactName = (form.get('contact-name') as string).trim()
    const email = (form.get('contact-email') as string).trim()
    const phone = (form.get('contact-phone') as string).trim()
    const guestCount = Number(form.get('guest-count'))
    const eventDate = form.get('event-date') as string

    if (!contactName) nextErrors['contact-name'] = 'Contact name is required.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors['contact-email'] = 'Enter a valid email address.'
    }
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      nextErrors['contact-phone'] = 'Enter a valid phone number.'
    }
    if (!Number.isFinite(guestCount) || guestCount < 10) {
      nextErrors['guest-count'] = 'Guest count must be at least 10.'
    }
    if (!eventDate) {
      nextErrors['event-date'] = 'Choose an event date.'
    } else if (eventDate < getTodayString()) {
      nextErrors['event-date'] = 'Event date must be today or later.'
    }

    return nextErrors
  }

  const jumpToInquiry = (packageName: string) => {
    setSelectedPackage(packageName)
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const validationErrors = validate(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      addToast('Please fix the catering inquiry form.', 'error')
      return
    }

    setErrors({})
    setSubmitting(true)

    const guestCount = Number(form.get('guest-count'))
    const eventDate = form.get('event-date') as string

    const { error } = await createInquiry({
      package_name: selectedPackage,
      service_type: form.get('service-type') as 'pickup' | 'delivery' | 'full-service',
      guest_count: guestCount,
      event_date: eventDate,
      contact_name: (form.get('contact-name') as string).trim(),
      contact_email: (form.get('contact-email') as string).trim(),
      contact_phone: (form.get('contact-phone') as string).trim(),
      notes: ((form.get('notes') as string) || '').trim() || null,
    })

    setSubmitting(false)

    if (error) {
      addToast(error, 'error')
      return
    }

    setSubmitted({
      packageName: selectedPackage,
      eventDate,
      guestCount,
    })
    event.currentTarget.reset()
    setSelectedPackage(packages.find((pkg) => pkg.featured)?.name ?? packages[0].name)
    addToast('Catering inquiry received.', 'success')
  }

  if (submitted) {
    return (
      <>
        <section className="page-hero">
          <div className="container">
            <span className="section-label animate-fade-up">Inquiry Received</span>
            <h1 className="section-title animate-fade-up delay-1">Catering Request Submitted</h1>
            <p className="section-subtitle mx-auto animate-fade-up delay-2">
              We have your {submitted.packageName} request for {submitted.guestCount} guests
              on {submitted.eventDate}. Our team will follow up with next steps.
            </p>
          </div>
        </section>

        <section className="reservation-section">
          <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
            <div className="reservation-form animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
              <h3 style={{ color: 'var(--clr-success)', marginBottom: 12 }}>
                Thanks for reaching out
              </h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 32 }}>
                We review every catering inquiry manually so we can match menu,
                staffing, and logistics to the event.
              </p>
              <button className="btn btn-wine" onClick={() => setSubmitted(null)} type="button">
                Submit Another Inquiry
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
          <span className="section-label animate-fade-up">Catering Services</span>
          <h1 className="section-title animate-fade-up delay-1">Bring Delight to Your Event</h1>
          <p className="section-subtitle mx-auto animate-fade-up delay-2">
            From intimate gatherings to grand celebrations, our catering team
            delivers exceptional food and flawless service, every time.
          </p>
        </div>
      </section>

      <section className="catering-intro">
        <div className="container">
          <div className="catering-intro-grid">
            <div className="catering-intro-content animate-fade-up">
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">Events Made Effortless</h2>
              <p className="section-subtitle">
                Let us handle the food so you can focus on what matters — your guests.
                We customize every menu to match your vision, dietary needs, and budget.
              </p>
              <div className="catering-features">
                {benefits.map((b) => (
                  <div className="catering-feature-item" key={b}>
                    <span className="check-icon">✓</span>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="catering-image animate-fade-up delay-2">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80"
                alt="Catering spread"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="catering-packages">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Our Packages</span>
            <h2 className="section-title">Choose Your Perfect Package</h2>
            <p className="section-subtitle mx-auto">
              Three tiers designed to fit every occasion and budget.
              Every package can be fully customized to your taste.
            </p>
          </div>
          <div className="packages-grid">
            {packages.map((pkg, i) => (
              <div
                className={`package-card animate-fade-up delay-${i + 1}${pkg.featured ? ' featured' : ''}`}
                key={pkg.name}
              >
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-desc">{pkg.description}</p>
                <div className="package-price">{pkg.price}</div>
                <div className="package-price-unit">{pkg.unit}</div>
                <ul className="package-features">
                  {pkg.features.map((f) => (
                    <li key={f}><span className="pf-check">✓</span> {f}</li>
                  ))}
                </ul>
                <button
                  className={`btn ${pkg.featured ? 'btn-wine' : 'btn-dark'}`}
                  onClick={() => jumpToInquiry(pkg.name)}
                  type="button"
                >
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reservation-section" ref={inquirySectionRef}>
        <div className="container">
          <div className="reservation-grid">
            <div className="reservation-form animate-fade-up">
              <span className="section-label">Start Your Request</span>
              <h3>Catering Inquiry Form</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="package-name">Package</label>
                  <select
                    id="package-name"
                    name="package-name"
                    onChange={(event) => setSelectedPackage(event.target.value)}
                    value={selectedPackage}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.name} value={pkg.name}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guest-count">Guest Count</label>
                    <input
                      id="guest-count"
                      min="10"
                      name="guest-count"
                      onChange={() => setErrors((current) => {
                        const next = { ...current }
                        delete next['guest-count']
                        return next
                      })}
                      placeholder="75"
                      required
                      type="number"
                    />
                    {errors['guest-count'] && (
                      <span className="field-error">{errors['guest-count']}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="event-date">Event Date</label>
                    <input
                      id="event-date"
                      min={getTodayString()}
                      name="event-date"
                      onChange={() => setErrors((current) => {
                        const next = { ...current }
                        delete next['event-date']
                        return next
                      })}
                      required
                      type="date"
                    />
                    {errors['event-date'] && (
                      <span className="field-error">{errors['event-date']}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="service-type">Service Type</label>
                  <select id="service-type" name="service-type" defaultValue="delivery">
                    {CATERING_SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'full-service'
                          ? 'Full Service'
                          : option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Contact Name</label>
                    <input
                      id="contact-name"
                      name="contact-name"
                      onChange={() => setErrors((current) => {
                        const next = { ...current }
                        delete next['contact-name']
                        return next
                      })}
                      placeholder="Jordan Lee"
                      required
                      type="text"
                    />
                    {errors['contact-name'] && (
                      <span className="field-error">{errors['contact-name']}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone</label>
                    <input
                      id="contact-phone"
                      name="contact-phone"
                      onChange={() => setErrors((current) => {
                        const next = { ...current }
                        delete next['contact-phone']
                        return next
                      })}
                      placeholder="(555) 123-4567"
                      required
                      type="tel"
                    />
                    {errors['contact-phone'] && (
                      <span className="field-error">{errors['contact-phone']}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="contact-email"
                    onChange={() => setErrors((current) => {
                      const next = { ...current }
                      delete next['contact-email']
                      return next
                    })}
                    placeholder="jordan@example.com"
                    required
                    type="email"
                  />
                  {errors['contact-email'] && (
                    <span className="field-error">{errors['contact-email']}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Event Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Venue, dietary needs, service timeline, or special requests."
                  />
                </div>

                <button className="btn btn-wine form-submit" disabled={submitting} type="submit">
                  {submitting ? 'Submitting Inquiry...' : 'Submit Catering Inquiry'}
                </button>
              </form>
            </div>

            <div className="reservation-info animate-fade-up delay-2">
              <h3>What Happens Next</h3>
              <p>
                Once your request comes in, our team reviews availability, staffing,
                and menu fit before preparing a custom quote.
              </p>
              <div className="info-card">
                <div className="info-card-icon">1</div>
                <div>
                  <h4>Inquiry Review</h4>
                  <p>We validate guest count, logistics, and package fit within one business day.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">2</div>
                <div>
                  <h4>Proposal & Quote</h4>
                  <p>You'll receive a tailored menu plan and service recommendation for the event.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">3</div>
                <div>
                  <h4>Execution Planning</h4>
                  <p>Once approved, we lock in timing, service style, and final staffing details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Let's Plan Together
          </span>
          <h2>Have Something Special in Mind?</h2>
          <p>Choose a package, submit the details, and we’ll take it from there.</p>
          <button className="btn btn-primary" onClick={() => jumpToInquiry(selectedPackage)} type="button">
            Start Your Inquiry
          </button>
        </div>
      </section>
    </>
  )
}
