/*
  # Create payments table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, not null)
      - `currency` (text, not null)
      - `status` (text, not null)
      - `payment_method` (text, not null)
      - `transaction_id` (text, unique)
      - `order_data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payments` table
    - Add policies for authenticated users to:
      - Create their own payments
      - Read their own payments
*/

-- Create payments table
CREATE TABLE payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0),
    currency text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method text NOT NULL,
    transaction_id text UNIQUE,
    order_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_currency CHECK (currency ~ '^[A-Z]{3}$'),
    CONSTRAINT valid_payment_method CHECK (payment_method IN ('paypal', 'test'))
);

-- Create indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own payments"
    ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments"
    ON payments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE payments IS 'Stores payment records for user transactions';
COMMENT ON COLUMN payments.user_id IS 'References the auth.users table';
COMMENT ON COLUMN payments.amount IS 'Payment amount in smallest currency unit';
COMMENT ON COLUMN payments.currency IS 'Three-letter currency code (e.g., EUR, USD)';
COMMENT ON COLUMN payments.status IS 'Payment status (pending, completed, failed, refunded)';
COMMENT ON COLUMN payments.payment_method IS 'Payment method used (paypal, test)';
COMMENT ON COLUMN payments.transaction_id IS 'Unique transaction identifier';
COMMENT ON COLUMN payments.order_data IS 'Additional payment/order metadata';