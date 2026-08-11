-- Allow a signed-in customer to create only an order belonging to themselves.
-- Run once after create-orders-foundation.sql.
drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
on public.orders for insert
to authenticated
with check (user_id = auth.uid());
