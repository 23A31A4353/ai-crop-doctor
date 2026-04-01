-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create restricted policy: users can only cancel pending orders
CREATE POLICY "Users can cancel own pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');