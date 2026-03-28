import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getDemoOrders, saveDemoOrders } from '../lib/demoStore'
import type { Order, OrderInsert, OrderItemInsert, CartItem } from '../types'

export function useOrders() {
  const placeOrder = async (
    orderData: OrderInsert,
    cartItems: CartItem[]
  ): Promise<{ data: Order | null; error: string | null }> => {
    if (!isSupabaseConfigured) {
      const fakeOrder: Order = {
        id: crypto.randomUUID(),
        ...orderData,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
      saveDemoOrders([fakeOrder, ...getDemoOrders()])
      return { data: fakeOrder, error: null }
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderErr || !order) {
      return { data: null, error: orderErr?.message ?? 'Failed to create order' }
    }

    const orderItems: OrderItemInsert[] = cartItems.map((ci) => ({
      order_id: order.id,
      menu_item_id: ci.menuItem.id,
      item_name: ci.menuItem.name,
      quantity: ci.quantity,
      unit_price: ci.menuItem.price,
    }))

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsErr) {
      return { data: null, error: itemsErr.message }
    }

    return { data: order, error: null }
  }

  const getOrder = async (id: string) => {
    if (!isSupabaseConfigured) return null
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()
    return data
  }

  return { placeOrder, getOrder }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setOrders(getDemoOrders())
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Failed to load orders:', error.message)
      setOrders([])
    } else {
      setOrders((data ?? []) as Order[])
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const updateStatus = async (id: string, status: Order['status']) => {
    if (!isSupabaseConfigured) {
      const updatedOrders = getDemoOrders().map((order) =>
        order.id === id ? { ...order, status } : order
      )
      saveDemoOrders(updatedOrders)
      setOrders(updatedOrders)
      return null
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    if (error) return error.message

    await fetchAll()
    return null
  }

  return { orders, loading, updateStatus, refetch: fetchAll }
}
