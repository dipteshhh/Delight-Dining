import { FALLBACK_MENU } from '../data/fallbackMenu'
import type { CateringInquiry, MenuItem, Order, Reservation } from '../types'

const STORAGE_KEYS = {
  adminSession: 'delight-dining-demo-admin-session',
  catering: 'delight-dining-demo-catering',
  menu: 'delight-dining-demo-menu',
  orders: 'delight-dining-demo-orders',
  reservations: 'delight-dining-demo-reservations',
} as const

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredValue<T>(key: string): T | null {
  if (!canUseStorage()) return null

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : null
  } catch {
    return null
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (!canUseStorage()) return

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getDemoMenuItems(): MenuItem[] {
  const storedItems = readStoredValue<MenuItem[]>(STORAGE_KEYS.menu)
  if (storedItems) return storedItems

  const seededItems = FALLBACK_MENU.map((item, index) => ({
    ...item,
    created_at:
      item.created_at || new Date(Date.now() - index * 60_000).toISOString(),
  }))

  writeStoredValue(STORAGE_KEYS.menu, seededItems)
  return seededItems
}

export function saveDemoMenuItems(items: MenuItem[]) {
  writeStoredValue(STORAGE_KEYS.menu, items)
}

export function getDemoReservations(): Reservation[] {
  return readStoredValue<Reservation[]>(STORAGE_KEYS.reservations) ?? []
}

export function saveDemoReservations(reservations: Reservation[]) {
  writeStoredValue(STORAGE_KEYS.reservations, reservations)
}

export function getDemoCateringInquiries(): CateringInquiry[] {
  return readStoredValue<CateringInquiry[]>(STORAGE_KEYS.catering) ?? []
}

export function saveDemoCateringInquiries(inquiries: CateringInquiry[]) {
  writeStoredValue(STORAGE_KEYS.catering, inquiries)
}

export function getDemoOrders(): Order[] {
  return readStoredValue<Order[]>(STORAGE_KEYS.orders) ?? []
}

export function saveDemoOrders(orders: Order[]) {
  writeStoredValue(STORAGE_KEYS.orders, orders)
}

export function getDemoAdminSession() {
  return readStoredValue<boolean>(STORAGE_KEYS.adminSession) ?? false
}

export function saveDemoAdminSession(isAdmin: boolean) {
  writeStoredValue(STORAGE_KEYS.adminSession, isAdmin)
}
