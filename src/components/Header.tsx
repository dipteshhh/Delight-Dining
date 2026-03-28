import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CartIcon from './CartIcon'
import Cart from './Cart'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { isAdmin } = useAuth()
  const { pathname } = useLocation()

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (typeof document === 'undefined') return

    document.body.classList.toggle('mobile-menu-open', menuOpen)

    return () => {
      document.body.classList.remove('mobile-menu-open')
    }
  }, [menuOpen])

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
              className={`menu-toggle${menuOpen ? ' active' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="site-navigation"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span /><span /><span />
            </button>
          </div>

          <nav
            className={`nav-links${menuOpen ? ' open' : ''}`}
            id="site-navigation"
          >
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
            <NavLink to="/reservations" onClick={closeMenu}>Reservations</NavLink>
            <NavLink to="/catering" onClick={closeMenu}>Catering</NavLink>
            <NavLink to="/admin" onClick={closeMenu}>
              {isAdmin ? 'Dashboard' : 'Admin'}
            </NavLink>
            <NavLink to="/reservations" className="nav-cta" onClick={closeMenu}>
              Book a Table
            </NavLink>
          </nav>
        </div>
      </header>
      {menuOpen && <button className="mobile-nav-backdrop" onClick={closeMenu} type="button" aria-label="Close menu" />}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
