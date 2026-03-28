import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">Est. 2020 · Fine Dining Experience</div>
          <h1>Where Every Meal Becomes a <em>Celebration</em></h1>
          <p className="hero-desc">
            Discover hand-crafted dishes made from the freshest local ingredients,
            served in an atmosphere designed to delight every sense.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary">Explore Our Menu</Link>
            <Link to="/reservations" className="btn btn-outline">Reserve a Table</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <span className="section-label">How to Order</span>
            <h2 className="section-title">Your Meal, Your Way</h2>
            <p className="section-subtitle mx-auto">
              Whether you're dining in, grabbing a quick bite, or hosting a grand event —
              we've got you covered.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-fade-up delay-1">
              <img src="/images/to-go.png" alt="To Go" />
              <h3>To Go</h3>
              <p>Order your favorites online — from individual entrées to family-style meals, ready when you are.</p>
              <Link to="/menu" className="btn btn-dark">Order To Go</Link>
            </div>
            <div className="feature-card animate-fade-up delay-2">
              <img src="/images/catering-pickup.png" alt="Catering Pickup" />
              <h3>Catering Pickup</h3>
              <p>Perfect for any occasion. Pick up a beautifully prepared spread for your next gathering.</p>
              <Link to="/catering" className="btn btn-dark">Explore Catering</Link>
            </div>
            <div className="feature-card animate-fade-up delay-3">
              <img src="/images/catering-delivery.png" alt="Catering Delivery" />
              <h3>Catering Delivery</h3>
              <p>Order by 5 PM for next-day delivery. We'll bring the feast right to your doorstep.</p>
              <Link to="/catering" className="btn btn-dark">Schedule Delivery</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image animate-fade-up">
              <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80"
                alt="Chef preparing a dish"
              />
              <div className="about-image-badge">
                <div className="badge-number">5+</div>
                <div className="badge-label">Years of Excellence</div>
              </div>
            </div>
            <div className="about-content">
              <span className="section-label">Our Story</span>
              <h2 className="section-title">Crafted With Passion, Served With Love</h2>
              <p className="section-subtitle">
                Born from a love of bringing people together through food,
                Delight Dining has grown from a small kitchen dream into a
                beloved culinary destination. Every dish tells a story of
                tradition, creativity, and the finest ingredients.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Signature Dishes</div>
                </div>
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Guests</div>
                </div>
                <div className="stat">
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="menu-preview">
        <div className="container">
          <div className="menu-preview-header">
            <div>
              <span className="section-label">From the Kitchen</span>
              <h2 className="section-title">Featured Dishes</h2>
              <p className="section-subtitle">A taste of what's waiting for you.</p>
            </div>
            <Link to="/menu" className="btn btn-dark">View Full Menu</Link>
          </div>
          <div className="menu-preview-grid">
            <div className="dish-card animate-fade-up delay-1">
              <div className="dish-card-image">
                <img
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
                  alt="Margherita Pizza"
                />
                <span className="dish-tag">Popular</span>
              </div>
              <div className="dish-card-body">
                <h3>Margherita Pizza</h3>
                <p>Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and fragrant basil.</p>
                <div className="dish-card-footer">
                  <span className="dish-price">$12.99</span>
                  <button className="dish-order-btn">Add to Order</button>
                </div>
              </div>
            </div>
            <div className="dish-card animate-fade-up delay-2">
              <div className="dish-card-image">
                <img
                  src="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80"
                  alt="Spaghetti Carbonara"
                />
                <span className="dish-tag">Chef's Pick</span>
              </div>
              <div className="dish-card-body">
                <h3>Spaghetti Carbonara</h3>
                <p>Silky pasta tossed with crispy guanciale, pecorino romano, and a velvety egg yolk sauce.</p>
                <div className="dish-card-footer">
                  <span className="dish-price">$14.99</span>
                  <button className="dish-order-btn">Add to Order</button>
                </div>
              </div>
            </div>
            <div className="dish-card animate-fade-up delay-3">
              <div className="dish-card-image">
                <img
                  src="https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80"
                  alt="Chocolate Lava Cake"
                />
                <span className="dish-tag">Dessert</span>
              </div>
              <div className="dish-card-body">
                <h3>Chocolate Lava Cake</h3>
                <p>Warm, rich chocolate cake with a molten center, served with vanilla bean gelato.</p>
                <div className="dish-card-footer">
                  <span className="dish-price">$8.99</span>
                  <button className="dish-order-btn">Add to Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-label">What People Say</span>
            <h2 className="section-title">Loved by Our Guests</h2>
            <p className="section-subtitle mx-auto">
              Don't just take our word for it — hear from the people who make our restaurant come alive.
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card animate-fade-up delay-1">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                "An absolutely incredible dining experience. The Carbonara was the best I've ever had —
                creamy, rich, and perfectly al dente. We'll be back every week!"
              </blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SR</div>
                <div className="testimonial-author-info">
                  <h4>Sarah R.</h4>
                  <span>Regular Guest</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card animate-fade-up delay-2">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                "We hired Delight Dining for our wedding catering and they exceeded every expectation.
                Stunning presentation and flavors that had our guests raving for months."
              </blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MJ</div>
                <div className="testimonial-author-info">
                  <h4>Michael J.</h4>
                  <span>Catering Client</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card animate-fade-up delay-3">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote>
                "The ambiance is warm and inviting, the staff genuinely cares, and the food?
                Absolutely outstanding. This place is a hidden gem."
              </blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">LP</div>
                <div className="testimonial-author-info">
                  <h4>Lisa P.</h4>
                  <span>Food Blogger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Ready to Dine?</span>
          <h2>Your Table Is Waiting</h2>
          <p>Reserve your spot today and experience a meal you won't forget.</p>
          <Link to="/reservations" className="btn btn-primary">Make a Reservation</Link>
        </div>
      </section>
    </>
  )
}
