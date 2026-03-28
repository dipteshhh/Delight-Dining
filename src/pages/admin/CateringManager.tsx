import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminCatering } from '../../hooks/useCatering'
import { useToast } from '../../components/Toast'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import EmptyState from '../../components/EmptyState'
import type { CateringInquiry } from '../../types'

const STATUS_COLORS: Record<CateringInquiry['status'], string> = {
  contacted: 'status-preparing',
  closed: 'status-completed',
  new: 'status-pending',
  quoted: 'status-active',
}

const STATUS_OPTIONS: CateringInquiry['status'][] = [
  'new',
  'contacted',
  'quoted',
  'closed',
]

export default function CateringManager() {
  const { inquiries, loading, updateStatus } = useAdminCatering()
  const { addToast } = useToast()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = inquiries.filter((inquiry) => {
    if (filterStatus !== 'all' && inquiry.status !== filterStatus) return false
    return true
  })

  const handleStatus = async (
    inquiry: CateringInquiry,
    nextStatus: CateringInquiry['status']
  ) => {
    const error = await updateStatus(inquiry.id, nextStatus)
    if (error) {
      addToast(error, 'error')
      return
    }

    addToast(`${inquiry.contact_name} marked ${nextStatus}.`, 'success')
  }

  const formatDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="admin-back">← Dashboard</Link>
          <h1>Catering Leads</h1>
        </div>
      </div>

      <div className="admin-filters">
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} type="admin" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No catering inquiries yet" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Package</th>
                <th>Service</th>
                <th>Guests</th>
                <th>Event Date</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <strong>{inquiry.contact_name}</strong>
                    <div style={{ fontSize: '0.82rem' }}>{inquiry.contact_email}</div>
                    <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.78rem' }}>
                      {inquiry.contact_phone}
                    </div>
                  </td>
                  <td>{inquiry.package_name}</td>
                  <td>{inquiry.service_type}</td>
                  <td>{inquiry.guest_count}</td>
                  <td>{formatDate(inquiry.event_date)}</td>
                  <td style={{ maxWidth: 280 }}>
                    {inquiry.notes || 'No additional notes'}
                  </td>
                  <td>
                    <div className="status-actions">
                      <span className={`status-badge ${STATUS_COLORS[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                      <select
                        onChange={(event) =>
                          handleStatus(
                            inquiry,
                            event.target.value as CateringInquiry['status']
                          )
                        }
                        value={inquiry.status}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
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
