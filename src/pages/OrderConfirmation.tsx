import { Link, useLocation } from 'react-router-dom'
import type { CartItem, Order } from '../types'

interface LocationState {
  order: Order
  items: CartItem[]
}

export default function OrderConfirmation() {
  const location = useLocation()
  const state = location.state as LocationState | null

  if (!state) {
    return (
      <>
        <section className="page-hero">
          <div className="container">
            <h1 className="section-title animate-fade-up">Order Status</h1>
          </div>
        </section>
        <section className="reservation-section">
          <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
            <div className="reservation-form animate-fade-up" style={{ textAlign: 'center' }}>
              <h3>No Order Found</h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>
                This page is only accessible after placing an order.
              </p>
              <Link to="/menu" className="btn btn-wine">Browse Menu</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  const { order, items } = state

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">Thank You!</span>
          <h1 className="section-title animate-fade-up delay-1">Order Confirmed</h1>
        </div>
      </section>

      <section className="reservation-section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="reservation-form animate-fade-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
            <h3 style={{ color: 'var(--clr-success)', marginBottom: 8 }}>Order Placed Successfully!</h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 8 }}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 32 }}>
              {order.type === 'pickup'
                ? "We'll have your order ready for pickup shortly."
                : "Your order is being prepared and will be delivered to you."}
              <br />A confirmation has been sent to {order.customer_email}.
            </p>

            <div className="checkout-items" style={{ textAlign: 'left' }}>
              {items.map((item) => (
                <div className="checkout-item" key={item.menuItem.id}>
                  <span className="checkout-item-emoji">{item.menuItem.emoji}</span>
                  <div className="checkout-item-info">
                    <h4>{item.menuItem.name}</h4>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-totals" style={{ textAlign: 'left' }}>
              <div className="checkout-row checkout-total">
                <span>Total Charged</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-dark">Order Again</Link>
              <Link to="/" className="btn btn-outline" style={{ borderColor: 'var(--clr-border)', color: 'var(--clr-text)' }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
