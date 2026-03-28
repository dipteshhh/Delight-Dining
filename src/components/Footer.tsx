import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">Delight <span>Dining</span></span>
            <p>
              Crafting unforgettable dining experiences with passion, premium
              ingredients, and a warm atmosphere since 2020.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">in</a>
              <a href="#" aria-label="Twitter">tw</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/reservations">Reservations</Link></li>
              <li><Link to="/catering">Catering</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hours</h4>
            <ul>
              <li>Mon – Fri: 11am – 10pm</li>
              <li>Saturday: 10am – 11pm</li>
              <li>Sunday: 10am – 9pm</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">⚐</span>
                <span>123 Flavor Street, Culinary City, CC 10001</span>
              </li>
              <li>
                <span className="contact-icon">☎</span>
                <span>(555) 123-4567</span>
              </li>
              <li>
                <span className="contact-icon">✉</span>
                <span>hello@delightdining.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Delight Dining. All rights reserved.</span>
          <span>
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
