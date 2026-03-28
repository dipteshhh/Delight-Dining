import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart()

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
      <aside className={`cart-sidebar${isOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <h3>Your Order ({totalItems})</h3>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <span>Browse the menu to add items</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.menuItem.id}>
                  <div className="cart-item-emoji">{item.menuItem.emoji}</div>
                  <div className="cart-item-info">
                    <h4>{item.menuItem.name}</h4>
                    <span className="cart-item-price">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.menuItem.id)}
                    aria-label={`Remove ${item.menuItem.name}`}
                  >✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="cart-subtotal-price">${subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-wine cart-checkout-btn" onClick={onClose}>
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
