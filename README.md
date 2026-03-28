# Delight Dining

**Full-Stack Restaurant Reservation and Ordering Platform**

A modern, full-stack restaurant web application built with React, TypeScript, and Supabase. Features real-time menu browsing, table reservations with availability checking, a complete ordering flow with cart management, and a full admin dashboard for restaurant operations.

---

## Tech Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | React 19, TypeScript, Vite                  |
| Routing     | React Router v7                             |
| Backend/DB  | Supabase (PostgreSQL, Auth, Row Level Security) |
| Styling     | Custom CSS with design system (CSS variables, Playfair Display + Inter) |
| Deployment  | Vercel (frontend), Supabase Cloud (backend) |

## Features

### Customer-Facing
- **Menu Browsing** — Data-driven menu loaded from database with category filtering, dietary tags, and pricing
- **Cart & Ordering** — Add items to cart, adjust quantities, choose pickup or delivery, and checkout with order confirmation
- **Table Reservations** — Real booking form with date/time availability checking, guest limits, and form validation
- **Catering** — Tiered catering packages with pricing and feature comparisons
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile with hamburger menu

### Admin Dashboard (`/admin`)
- **Menu Management** — Create, edit, delete menu items; toggle availability; manage categories and pricing
- **Reservation Management** — View all reservations with date/status filters; confirm or cancel bookings
- **Order Management** — Track order lifecycle (pending → preparing → ready → completed); view order details
- **Dashboard Overview** — Today's reservations, active orders, total revenue, menu item count

### Technical Quality
- **TypeScript** — Full type safety across all components, hooks, and data models
- **Supabase Integration** — Row Level Security policies, real-time data, auth-protected admin operations
- **Cart Persistence** — Cart state saved to localStorage and survives page refresh
- **Form Validation** — Real-time client-side validation with inline error messages
- **Toast Notifications** — Success/error/info toasts for all user actions
- **Loading States** — Skeleton loading placeholders while data fetches
- **Empty States** — Friendly messages when no data is available
- **Graceful Fallback** — App works with local fallback data when Supabase is not configured

## Screenshots

> Add screenshots of: Home page hero, Menu with cart, Reservation form, Checkout flow, Admin dashboard, Admin menu manager

## Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/dipteshhh/Delight-Dining.git
cd Delight-Dining
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql` to create tables and seed data
3. Go to **Authentication > Users** and create an admin user (email/password)
4. Copy your project URL and anon key from **Settings > API**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the app

```bash
npm run dev
```

> **Note:** The app works without Supabase configured — it falls back to local demo data. Supabase is needed for reservations, orders, and admin features to persist.

### 5. Access admin

Navigate to `/admin/login` and sign in with the admin user you created in Supabase.

## Project Structure

```
src/
  lib/supabase.ts              # Supabase client initialization
  types/index.ts               # Shared TypeScript interfaces
  data/fallbackMenu.ts         # Local fallback menu data
  context/
    CartContext.tsx             # Cart state management (useReducer + localStorage)
    AuthContext.tsx             # Supabase Auth session management
  hooks/
    useMenu.ts                 # Menu data fetching + admin CRUD
    useReservations.ts         # Reservation creation + admin management
    useOrders.ts               # Order placement + admin management
  components/
    Header.tsx                 # Navigation with cart icon and admin link
    Footer.tsx                 # Site footer with links and contact info
    Cart.tsx                   # Slide-out cart sidebar
    CartIcon.tsx               # Header cart badge with item count
    Toast.tsx                  # Toast notification system (context + provider)
    LoadingSkeleton.tsx        # Skeleton loading placeholders
    EmptyState.tsx             # Empty state component
    ProtectedRoute.tsx         # Auth guard for admin routes
  pages/
    Home.tsx                   # Landing page with hero, features, testimonials
    Menu.tsx                   # Interactive menu with Add to Cart
    Reservations.tsx           # Reservation form with validation and availability
    Catering.tsx               # Catering packages and pricing
    Checkout.tsx               # Cart review, pickup/delivery, payment
    OrderConfirmation.tsx      # Post-checkout success page
    AdminLogin.tsx             # Admin authentication
    admin/
      Dashboard.tsx            # Admin overview with stats
      MenuManager.tsx          # CRUD for menu items
      ReservationManager.tsx   # Reservation list with filters
      OrderManager.tsx         # Order tracking and status updates
supabase/
  schema.sql                   # Database schema, RLS policies, seed data
```

## Database Schema

- **menu_items** — Menu items with category, pricing, tags, availability
- **reservations** — Guest reservations with date/time, status tracking
- **orders** — Customer orders with pickup/delivery type, status lifecycle
- **order_items** — Individual items within each order

All tables use Row Level Security: public users can browse menu and submit reservations/orders; only authenticated admin can manage data.

## Roadmap

- [ ] Email confirmation via Resend/SendGrid
- [ ] Real-time order status updates (Supabase Realtime)
- [ ] Search/filter/sort for menu items
- [ ] Payment integration (Stripe)
- [ ] Image upload for menu items
- [ ] Customer accounts with order history
- [ ] CI/CD pipeline with GitHub Actions
- [ ] E2E test coverage

## License

MIT
