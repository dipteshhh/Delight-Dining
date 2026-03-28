import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminReservations } from '../../hooks/useReservations'
import { useAdminOrders } from '../../hooks/useOrders'
import { useAdminMenu } from '../../hooks/useMenu'

export default function Dashboard() {
  const { signOut } = useAuth()
  const { reservations } = useAdminReservations()
  const { orders } = useAdminOrders()
  const { items: menuItems } = useAdminMenu()

  const today = new Date().toISOString().split('T')[0]
  const todayReservations = reservations.filter((r) => r.date === today)
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing')
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
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
          <div className="admin-stat-number">{menuItems.length}</div>
          <div className="admin-stat-label">Menu Items</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">${totalRevenue.toFixed(0)}</div>
          <div className="admin-stat-label">Total Revenue</div>
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
        <Link to="/admin/orders" className="admin-nav-card">
          <span className="admin-nav-icon">📦</span>
          <h3>Orders</h3>
          <p>Track and update customer order statuses.</p>
        </Link>
      </div>
    </div>
  )
}
