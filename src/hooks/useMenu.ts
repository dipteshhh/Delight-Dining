import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getDemoMenuItems, saveDemoMenuItems } from '../lib/demoStore'
import type { MenuItem, MenuCategory, MenuItemInput } from '../types'
import { CATEGORY_ICONS, CATEGORY_ORDER } from '../types'
import { FALLBACK_MENU } from '../data/fallbackMenu'

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenu = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setItems(FALLBACK_MENU)
      setLoading(false)
      return
    }

    const { data, error: err } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('sort_order')

    if (err) {
      setError(err.message)
      setItems(FALLBACK_MENU)
    } else {
      setItems(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  const categories: MenuCategory[] = CATEGORY_ORDER
    .map((cat) => ({
      icon: CATEGORY_ICONS[cat] ?? '🍽️',
      title: cat,
      items: items.filter((i) => i.category === cat),
    }))
    .filter((c) => c.items.length > 0)

  return { items, categories, loading, error, refetch: fetchMenu }
}

export function useAdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setItems(getDemoMenuItems())
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order')

    if (error) {
      console.warn('Failed to load menu items:', error.message)
      setItems([])
    } else {
      setItems((data ?? []) as MenuItem[])
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const createItem = async (item: MenuItemInput): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const nextItem: MenuItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...item,
      }
      const nextItems = [...getDemoMenuItems(), nextItem].sort(
        (a, b) => a.sort_order - b.sort_order
      )
      saveDemoMenuItems(nextItems)
      setItems(nextItems)
      return null
    }

    const { error } = await supabase.from('menu_items').insert(item)
    if (error) return error.message

    await fetchAll()
    return null
  }

  const updateItem = async (
    id: string,
    updates: Partial<MenuItemInput>
  ): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const nextItems = getDemoMenuItems().map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
      saveDemoMenuItems(nextItems)
      setItems(nextItems)
      return null
    }

    const { error } = await supabase.from('menu_items').update(updates).eq('id', id)
    if (error) return error.message

    await fetchAll()
    return null
  }

  const deleteItem = async (id: string): Promise<string | null> => {
    if (!isSupabaseConfigured) {
      const nextItems = getDemoMenuItems().filter((item) => item.id !== id)
      saveDemoMenuItems(nextItems)
      setItems(nextItems)
      return null
    }

    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) return error.message

    await fetchAll()
    return null
  }

  const toggleAvailability = async (id: string, available: boolean) => {
    return updateItem(id, { available })
  }

  return { items, loading, createItem, updateItem, deleteItem, toggleAvailability, refetch: fetchAll }
}
