import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminReservations } from '../../hooks/useReservations'
import { useAdminOrders } from '../../hooks/useOrders'
import { useAdminMenu } from '../../hooks/useMenu'
import { useAdminCatering } from '../../hooks/useCatering'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function Dashboard() {
  const { signOut } = useAuth()
  const { reservations } = useAdminReservations()
  const { orders } = useAdminOrders()
  const { items: menuItems } = useAdminMenu()
  const { inquiries } = useAdminCatering()

  const today = new Date().toISOString().split('T')[0]
  const todayReservations = reservations.filter((r) => r.date === today)
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing')
  const newCateringLeads = inquiries.filter((inquiry) => inquiry.status === 'new')

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <span className="section-label">Operations Center</span>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            {isSupabaseConfigured
              ? 'Connected to live Supabase data.'
              : 'Running in local demo mode with persistent browser storage.'}
          </p>
        </div>
        <button className="btn btn-outline admin-signout" onClick={signOut}>Sign Out</button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{todayReservations.length}</div>
          <div className="admin-stat-label">Today's Reservations</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{pendingOrders.length}</div>
          <div className="admin-stat-label">Active Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{newCateringLeads.length}</div>
          <div className="admin-stat-label">New Catering Leads</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{menuItems.filter((item) => item.available).length}</div>
          <div className="admin-stat-label">Live Menu Items</div>
        </div>
      </div>

      <div className="admin-nav-grid">
        <Link to="/admin/menu" className="admin-nav-card">
          <span className="admin-nav-icon">🍽️</span>
          <h3>Menu Manager</h3>
          <p>Add, edit, or remove menu items. Toggle availability.</p>
        </Link>
        <Link to="/admin/reservations" className="admin-nav-card">
          <span className="admin-nav-icon">📅</span>
          <h3>Reservations</h3>
          <p>View and manage upcoming table reservations.</p>
        </Link>
        <Link to="/admin/catering" className="admin-nav-card">
          <span className="admin-nav-icon">🥂</span>
          <h3>Catering Leads</h3>
          <p>Track inquiries, outreach, and quote follow-up for events.</p>
        </Link>
        <Link to="/admin/orders" className="admin-nav-card">
          <span className="admin-nav-icon">📦</span>
          <h3>Orders</h3>
          <p>Track and update customer order statuses.</p>
        </Link>
      </div>
    </div>
  )
}
