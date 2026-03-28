export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  emoji: string
  tags: string[]
  image_url: string | null
  available: boolean
  sort_order: number
  created_at: string
}

export interface Reservation {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  type: 'pickup' | 'delivery'
  address: string | null
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  total: number
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string | null
  item_name: string
  quantity: number
  unit_price: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export type ReservationInsert = Omit<Reservation, 'id' | 'status' | 'created_at'>

export type OrderInsert = Omit<Order, 'id' | 'status' | 'created_at' | 'order_items'>

export type OrderItemInsert = Omit<OrderItem, 'id'>

export interface MenuCategory {
  icon: string
  title: string
  items: MenuItem[]
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Starters & Small Plates': '🍴',
  'Main Courses': '🍝',
  'Desserts': '🍰',
  'Beverages': '🍷',
}

export const CATEGORY_ORDER = [
  'Starters & Small Plates',
  'Main Courses',
  'Desserts',
  'Beverages',
]
