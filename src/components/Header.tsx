import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CartIcon from './CartIcon'
import Cart from './Cart'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { isAdmin } = useAuth()

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src="/images/Delight.png" alt="Delight Dining" />
            <span className="logo-text">Delight <span>Dining</span></span>
          </Link>

          <div className="header-right">
            <CartIcon onClick={() => setCartOpen(true)} />

            <button
              className="menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span /><span /><span />
            </button>
          </div>

          <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
            <NavLink to="/reservations" onClick={closeMenu}>Reservations</NavLink>
            <NavLink to="/catering" onClick={closeMenu}>Catering</NavLink>
            {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
            <NavLink to="/reservations" className="nav-cta" onClick={closeMenu}>
              Book a Table
            </NavLink>
          </nav>
        </div>
      </header>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
