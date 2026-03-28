-- ============================================
-- DELIGHT DINING — Database Schema
-- Run this in Supabase SQL Editor to set up
-- ============================================

-- Menu Items
create table if not exists menu_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  category text not null,
  emoji text not null default '🍽️',
  tags text[] default '{}',
  image_url text,
  available boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Reservations
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time text not null,
  guests integer not null,
  special_requests text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  type text not null check (type in ('pickup', 'delivery')),
  address text,
  status text default 'pending' check (status in ('pending', 'preparing', 'ready', 'completed')),
  total numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  menu_item_id uuid references menu_items(id) on delete set null,
  item_name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null
);

-- ============================================
-- Row Level Security
-- ============================================

alter table menu_items enable row level security;
alter table reservations enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Menu: anyone can read available items
create policy "Anyone can view available menu items"
  on menu_items for select
  using (available = true);

-- Menu: authenticated users (admin) can do everything
create policy "Admin full access to menu items"
  on menu_items for all
  using (auth.role() = 'authenticated');

-- Reservations: anyone can insert
create policy "Anyone can create a reservation"
  on reservations for insert
  with check (true);

-- Reservations: authenticated users (admin) can view/update/delete
create policy "Admin full access to reservations"
  on reservations for all
  using (auth.role() = 'authenticated');

-- Orders: anyone can insert
create policy "Anyone can create an order"
  on orders for insert
  with check (true);

-- Orders: public can view their own order by id (for confirmation page)
create policy "Anyone can view orders"
  on orders for select
  using (true);

-- Orders: admin can update/delete
create policy "Admin full access to orders"
  on orders for all
  using (auth.role() = 'authenticated');

-- Order items: anyone can insert (when placing order)
create policy "Anyone can create order items"
  on order_items for insert
  with check (true);

-- Order items: anyone can view
create policy "Anyone can view order items"
  on order_items for select
  using (true);

-- Order items: admin full access
create policy "Admin full access to order items"
  on order_items for all
  using (auth.role() = 'authenticated');

-- ============================================
-- Seed Data — Menu Items
-- ============================================

insert into menu_items (name, description, price, category, emoji, tags, sort_order) values
  -- Starters
  ('Bruschetta al Pomodoro', 'Toasted sourdough topped with vine-ripened tomatoes, garlic, fresh basil, and extra virgin olive oil.', 9.99, 'Starters & Small Plates', '🥗', '{Vegetarian}', 1),
  ('Crispy Calamari', 'Lightly battered squid rings served golden and crisp, with lemon aioli and marinara dip.', 12.99, 'Starters & Small Plates', '🦑', '{Seafood,Crispy}', 2),
  ('Burrata & Prosciutto', 'Creamy burrata cheese paired with aged prosciutto, arugula, and a balsamic honey drizzle.', 14.99, 'Starters & Small Plates', '🧀', '{"Chef''s Pick"}', 3),
  ('Stuffed Mushrooms', 'Button mushrooms filled with herbed cream cheese, roasted garlic, and toasted breadcrumbs.', 10.99, 'Starters & Small Plates', '🍄', '{Vegetarian}', 4),
  -- Main Courses
  ('Margherita Pizza', 'Hand-stretched dough, San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves.', 12.99, 'Main Courses', '🍕', '{Popular,Vegetarian}', 10),
  ('Spaghetti Carbonara', 'Al dente spaghetti with crispy guanciale, pecorino romano, cracked pepper, and a silky egg yolk sauce.', 14.99, 'Main Courses', '🍝', '{"Chef''s Pick"}', 11),
  ('Grilled Atlantic Salmon', 'Pan-seared salmon fillet with lemon-dill butter, served on a bed of roasted vegetables and quinoa.', 22.99, 'Main Courses', '🐟', '{Seafood,Healthy}', 12),
  ('Osso Buco', 'Slow-braised veal shanks in a rich tomato and wine sauce, topped with gremolata. Served with saffron risotto.', 26.99, 'Main Courses', '🥩', '{Signature}', 13),
  ('Truffle Mushroom Risotto', 'Creamy Arborio rice slow-cooked with wild mushrooms, finished with truffle oil and shaved Parmigiano.', 18.99, 'Main Courses', '🍚', '{Vegetarian,Rich}', 14),
  ('8oz Filet Mignon', 'Prime beef tenderloin, char-grilled to your preference, with red wine reduction and roasted garlic mash.', 34.99, 'Main Courses', '🥩', '{Premium}', 15),
  -- Desserts
  ('Chocolate Lava Cake', 'Warm, rich Valrhona chocolate cake with a molten center, paired with vanilla bean gelato.', 8.99, 'Desserts', '🍫', '{Popular}', 20),
  ('Tiramisu', 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with Dutch cocoa powder.', 9.99, 'Desserts', '🍰', '{Classic}', 21),
  ('Panna Cotta', 'Silky vanilla bean custard with a vibrant seasonal berry compote and fresh mint.', 7.99, 'Desserts', '🍮', '{Light,Gluten-free}', 22),
  ('Affogato', 'A scoop of house-made vanilla gelato drowned in a shot of freshly pulled espresso.', 6.99, 'Desserts', '🍨', '{"Quick Bite"}', 23),
  -- Beverages
  ('House Red Wine', 'A smooth, full-bodied Chianti with notes of cherry and subtle oak. By the glass.', 10.99, 'Beverages', '🍷', '{}', 30),
  ('Craft Cocktails', 'Seasonal craft cocktails mixed by our expert bartender. Ask your server for today''s specials.', 13.99, 'Beverages', '🍸', '{}', 31),
  ('Espresso / Cappuccino', 'Premium single-origin espresso served straight, or as a perfectly frothed cappuccino.', 4.99, 'Beverages', '☕', '{}', 32),
  ('Fresh Pressed Juice', 'Daily fresh-pressed juices — orange, apple, or seasonal berry blend. No added sugar.', 5.99, 'Beverages', '🍓', '{Healthy}', 33);
