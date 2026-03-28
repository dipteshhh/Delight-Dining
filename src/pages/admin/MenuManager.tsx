import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminMenu } from '../../hooks/useMenu'
import { useToast } from '../../components/Toast'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import EmptyState from '../../components/EmptyState'
import type { MenuItem } from '../../types'
import { CATEGORY_ORDER } from '../../types'

type FormMenuItem = Omit<MenuItem, 'id' | 'created_at'>

const defaultItem: FormMenuItem = {
  name: '', description: '', price: 0, category: CATEGORY_ORDER[0],
  emoji: '🍽️', tags: [], image_url: null, available: true, sort_order: 0,
}

export default function MenuManager() {
  const { items, loading, createItem, updateItem, deleteItem, toggleAvailability } = useAdminMenu()
  const { addToast } = useToast()
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormMenuItem>(defaultItem)
  const [tagsInput, setTagsInput] = useState('')

  const openCreate = () => {
    setEditing(null)
    setForm(defaultItem)
    setTagsInput('')
    setCreating(true)
  }

  const openEdit = (item: MenuItem) => {
    setCreating(false)
    setEditing(item)
    setForm({ ...item })
    setTagsInput(item.tags.join(', '))
  }

  const closeModal = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSave = async () => {
    const itemData = { ...form, tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean) }

    if (editing) {
      const err = await updateItem(editing.id, itemData)
      if (err) addToast('Failed to update item', 'error')
      else addToast('Menu item updated', 'success')
    } else {
      const err = await createItem(itemData)
      if (err) addToast('Failed to create item', 'error')
      else addToast('Menu item created', 'success')
    }
    closeModal()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const err = await deleteItem(id)
    if (err) addToast('Failed to delete item', 'error')
    else addToast('Item deleted', 'success')
  }

  const handleToggle = async (id: string, available: boolean, name: string) => {
    await toggleAvailability(id, !available)
    addToast(`${name} is now ${!available ? 'available' : 'unavailable'}`, 'info')
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="admin-back">← Dashboard</Link>
          <h1>Menu Manager</h1>
        </div>
        <button className="btn btn-wine" onClick={openCreate}>+ Add Item</button>
      </div>

      {loading ? (
        <LoadingSkeleton type="admin" count={4} />
      ) : items.length === 0 ? (
        <EmptyState message="No menu items yet" action="Add your first menu item" onAction={openCreate} />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={!item.available ? 'row-muted' : ''}>
                  <td className="td-emoji">{item.emoji}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button
                      className={`status-badge ${item.available ? 'status-active' : 'status-inactive'}`}
                      onClick={() => handleToggle(item.id, item.available, item.name)}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="td-actions">
                    <button className="action-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button className="action-btn action-danger" onClick={() => handleDelete(item.id, item.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Menu Item' : 'New Menu Item'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label>Emoji</label>
                <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Popular, Vegetarian, Healthy" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
                <input type="checkbox" id="available" checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  style={{ width: 'auto' }} />
                <label htmlFor="available" style={{ marginBottom: 0 }}>Available</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-wine" onClick={handleSave} style={{ flex: 1 }}>
                {editing ? 'Save Changes' : 'Create Item'}
              </button>
              <button className="btn btn-outline" onClick={closeModal}
                style={{ flex: 0, borderColor: 'var(--clr-border)', color: 'var(--clr-text)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
