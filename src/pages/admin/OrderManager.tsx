import { Link } from 'react-router-dom'
import { useAdminOrders } from '../../hooks/useOrders'
import { useToast } from '../../components/Toast'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import EmptyState from '../../components/EmptyState'
import type { Order } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending',
  preparing: 'status-preparing',
  ready: 'status-active',
  completed: 'status-completed',
}

const NEXT_STATUS: Record<string, Order['status'] | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
}

export default function OrderManager() {
  const { orders, loading, updateStatus } = useAdminOrders()
  const { addToast } = useToast()

  const handleAdvance = async (id: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus]
    if (!next) return
    const err = await updateStatus(id, next)
    if (err) addToast('Failed to update order', 'error')
    else addToast(`Order moved to ${next}`, 'success')
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="admin-back">← Dashboard</Link>
          <h1>Orders</h1>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="admin" count={4} />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><code>{o.id.slice(0, 8).toUpperCase()}</code></td>
                  <td>
                    <strong>{o.customer_name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{o.customer_email}</div>
                  </td>
                  <td>
                    <span className={`type-badge type-${o.type}`}>
                      {o.type === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                    </span>
                  </td>
                  <td>
                    {o.order_items?.map((oi) => (
                      <div key={oi.id} style={{ fontSize: '0.82rem' }}>
                        {oi.quantity}× {oi.item_name}
                      </div>
                    ))}
                  </td>
                  <td><strong>${o.total.toFixed(2)}</strong></td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{formatDate(o.created_at)}</td>
                  <td>
                    {NEXT_STATUS[o.status] && (
                      <button className="action-btn action-success"
                        onClick={() => handleAdvance(o.id, o.status)}>
                        → {NEXT_STATUS[o.status]}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
