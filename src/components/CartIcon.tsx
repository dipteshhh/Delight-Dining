import { useCart } from '../context/CartContext'

interface CartIconProps {
  onClick: () => void
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { totalItems } = useCart()

  return (
    <button className="cart-icon-btn" onClick={onClick} aria-label={`Cart with ${totalItems} items`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
    </button>
  )
}
