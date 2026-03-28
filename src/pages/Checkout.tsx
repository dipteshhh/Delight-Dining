import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../hooks/useOrders'
import { useToast } from '../components/Toast'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [submitting, setSubmitting] = useState(false)

  const tax = subtotal * 0.08
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <>
        <section className="page-hero">
          <div className="container">
            <h1 className="section-title animate-fade-up">Checkout</h1>
          </div>
        </section>
        <section className="reservation-section">
          <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
            <div className="reservation-form animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
              <h3>Your Cart is Empty</h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>
                Add some items from the menu to get started.
              </p>
              <Link to="/menu" className="btn btn-wine">Browse Menu</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)

    const { data: order, error } = await placeOrder(
      {
        customer_name: form.get('name') as string,
        customer_email: form.get('email') as string,
        customer_phone: form.get('phone') as string,
        type: orderType,
        address: orderType === 'delivery' ? (form.get('address') as string) : null,
        total: parseFloat(total.toFixed(2)),
      },
      items
    )

    setSubmitting(false)

    if (error || !order) {
      addToast(error || 'Failed to place order', 'error')
      return
    }

    clearCart()
    navigate(`/order-confirmation/${order.id}`, { state: { order, items } })
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">Almost There</span>
          <h1 className="section-title animate-fade-up delay-1">Checkout</h1>
        </div>
      </section>

      <section className="reservation-section">
        <div className="container">
          <div className="reservation-grid">
            <div className="reservation-form animate-fade-up">
              <h3>Your Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="john@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Order Type</label>
                  <div className="order-type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn${orderType === 'pickup' ? ' active' : ''}`}
                      onClick={() => setOrderType('pickup')}
                    >Pickup</button>
                    <button
                      type="button"
                      className={`toggle-btn${orderType === 'delivery' ? ' active' : ''}`}
                      onClick={() => setOrderType('delivery')}
                    >Delivery</button>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="form-group">
                    <label htmlFor="address">Delivery Address</label>
                    <textarea id="address" name="address" placeholder="Enter your full delivery address" required />
                  </div>
                )}

                <button type="submit" className="btn btn-wine form-submit" disabled={submitting}>
                  {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </form>
            </div>

            <div className="reservation-info animate-fade-up delay-2">
              <h3>Order Summary</h3>
              <div className="checkout-items">
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
              <div className="checkout-totals">
                <div className="checkout-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="checkout-row checkout-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
