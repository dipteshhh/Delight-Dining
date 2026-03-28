import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Reservations from './pages/Reservations'
import Catering from './pages/Catering'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import MenuManager from './pages/admin/MenuManager'
import ReservationManager from './pages/admin/ReservationManager'
import OrderManager from './pages/admin/OrderManager'
import CateringManager from './pages/admin/CateringManager'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function isAdminRoute(pathname: string) {
  return pathname.startsWith('/admin')
}

function AppLayout() {
  const { pathname } = useLocation()
  const isAdmin = isAdminRoute(pathname)

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main className={isAdmin ? 'admin-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute><MenuManager /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute><ReservationManager /></ProtectedRoute>} />
          <Route path="/admin/catering" element={<ProtectedRoute><CateringManager /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><OrderManager /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
