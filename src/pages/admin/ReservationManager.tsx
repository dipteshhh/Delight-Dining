import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminReservations } from '../../hooks/useReservations'
import { useToast } from '../../components/Toast'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import EmptyState from '../../components/EmptyState'
import type { Reservation } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending',
  confirmed: 'status-active',
  cancelled: 'status-inactive',
}

export default function ReservationManager() {
  const { reservations, loading, updateStatus } = useAdminReservations()
  const { addToast } = useToast()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('')

  const filtered = reservations.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (filterDate && r.date !== filterDate) return false
    return true
  })

  const handleStatus = async (id: string, status: Reservation['status']) => {
    const err = await updateStatus(id, status)
    if (err) addToast('Failed to update status', 'error')
    else addToast(`Reservation ${status}`, 'success')
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hour}:${String(m).padStart(2, '0')} ${period}`
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="admin-back">← Dashboard</Link>
          <h1>Reservations</h1>
        </div>
      </div>

      <div className="admin-filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        {filterDate && <button className="action-btn" onClick={() => setFilterDate('')}>Clear Date</button>}
      </div>

      {loading ? (
        <LoadingSkeleton type="admin" count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No reservations found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.first_name} {r.last_name}</strong></td>
                  <td>{r.date}</td>
                  <td>{formatTime(r.time)}</td>
                  <td>{r.guests}</td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{r.email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>{r.phone}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="td-actions">
                    {r.status === 'pending' && (
                      <button className="action-btn action-success" onClick={() => handleStatus(r.id, 'confirmed')}>Confirm</button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button className="action-btn action-danger" onClick={() => handleStatus(r.id, 'cancelled')}>Cancel</button>
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
