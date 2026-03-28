import { Link } from 'react-router-dom'
import { useMenu } from '../hooks/useMenu'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import type { MenuItem } from '../types'

export default function Menu() {
  const { categories, loading, error } = useMenu()
  const { addItem, totalItems } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = (item: MenuItem) => {
    addItem(item)
    addToast(`${item.name} added to cart`, 'success')
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">What We Serve</span>
          <h1 className="section-title animate-fade-up delay-1">Our Menu</h1>
          <p className="section-subtitle mx-auto animate-fade-up delay-2">
            Explore our curated selection of dishes, crafted daily with the freshest
            seasonal ingredients and bold, inspired flavors.
          </p>
        </div>
      </section>

      <section className="menu-section">
        <div className="container">
          {error && (
            <div className="form-info-banner" style={{ marginBottom: 24 }}>
              Live menu data could not be loaded. Showing fallback menu items instead.
            </div>
          )}

          {totalItems > 0 && (
            <div className="menu-quick-actions">
              <p>{totalItems} item{totalItems > 1 ? 's are' : ' is'} in your cart.</p>
              <Link className="btn btn-dark" to="/checkout">Go to Checkout</Link>
            </div>
          )}

          {loading ? (
            <LoadingSkeleton type="menu" count={6} />
          ) : categories.length === 0 ? (
            <EmptyState message="No menu items are available right now." />
          ) : (
            categories.map((cat) => (
              <div className="menu-category animate-fade-up" key={cat.title}>
                <h2 className="menu-category-title">
                  <span className="cat-icon">{cat.icon}</span> {cat.title}
                </h2>
                <div className="menu-list">
                  {cat.items.map((item) => (
                    <div className="menu-item-card" key={item.id}>
                      <div className="menu-item-emoji">{item.emoji}</div>
                      <div className="menu-item-info">
                        <div className="menu-item-header">
                          <h3>{item.name}</h3>
                          <span className="menu-item-price">${item.price.toFixed(2)}</span>
                        </div>
                        <p>{item.description}</p>
                        {item.tags.length > 0 && (
                          <div className="menu-item-tags">
                            {item.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        )}
                        <button
                          className="menu-add-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          + Add to Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Hungry Yet?</span>
          <h2>Ready to Order?</h2>
          <p>Book your table or head straight to checkout with your cart.</p>
          <Link to={totalItems > 0 ? '/checkout' : '/reservations'} className="btn btn-primary">
            {totalItems > 0 ? 'Checkout Now' : 'Reserve a Table'}
          </Link>
        </div>
      </section>
    </>
  )
}
