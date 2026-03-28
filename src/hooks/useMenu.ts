import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { MenuItem, MenuCategory } from '../types'
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
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order')
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const createItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('menu_items').insert(item)
    if (!error) await fetchAll()
    return error
  }

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await supabase.from('menu_items').update(updates).eq('id', id)
    if (!error) await fetchAll()
    return error
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) await fetchAll()
    return error
  }

  const toggleAvailability = async (id: string, available: boolean) => {
    return updateItem(id, { available })
  }

  return { items, loading, createItem, updateItem, deleteItem, toggleAvailability, refetch: fetchAll }
}
