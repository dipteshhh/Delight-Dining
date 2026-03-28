import { Link } from 'react-router-dom'

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
                <Link
                  to="/reservations"
                  className={`btn ${pkg.featured ? 'btn-wine' : 'btn-dark'}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Let's Plan Together
          </span>
          <h2>Have Something Special in Mind?</h2>
          <p>Tell us about your event and we'll create a custom proposal just for you.</p>
          <Link to="/reservations" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  )
}
