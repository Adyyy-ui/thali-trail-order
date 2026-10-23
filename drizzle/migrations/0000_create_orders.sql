create type public.order_status as enum ('new','accepted','preparing','ready','served','cancelled');

create table public.orders (
  id bigint generated always as identity (start with 1001) primary key,
  table_number int not null default 12,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  items jsonb not null,
  subtotal int not null,
  gst int not null,
  total int not null,
  status public.order_status not null default 'new',
  payment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.orders to anon, authenticated;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

create policy "Anyone can view orders"
  on public.orders for select
  to anon, authenticated
  using (true);

create policy "Anyone can place orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Staff can update order status"
  on public.orders for update
  to anon, authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.orders;

insert into public.orders (table_number, customer_name, customer_phone, notes, items, subtotal, gst, total, status, payment_status, created_at) values
(12, 'Rahul Verma', '9876501234', 'Less spicy please', '[{"id":"butter-chicken","name":"Butter Chicken","price":389,"qty":1},{"id":"garlic-naan","name":"Butter Garlic Naan","price":59,"qty":2}]'::jsonb, 507, 25, 532, 'new', 'pending', now() - interval '4 minutes'),
(7, 'Ananya Iyer', '9845098450', null, '[{"id":"chicken-biryani","name":"Hyderabadi Chicken Biryani","price":349,"qty":2},{"id":"mango-lassi","name":"Mango Lassi","price":119,"qty":1}]'::jsonb, 817, 41, 858, 'preparing', 'pending', now() - interval '12 minutes');