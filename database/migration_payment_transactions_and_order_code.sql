-- Migration: Payment Transactions & Order Code & GHN fields
-- Adds order_code, tracking_code, shipping_partner, discount_amount to orders table
-- Creates payment_transactions table for MoMo V2 and other gateways

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_code VARCHAR(30),
  ADD COLUMN IF NOT EXISTS tracking_code VARCHAR(100),
  ADD COLUMN IF NOT EXISTS shipping_partner VARCHAR(50) DEFAULT 'GHN Express',
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Backfill order_code for existing orders (format: CAM-XXXXXX)
UPDATE orders 
SET order_code = 'CAM-' || LPAD(id::text, 6, '0') 
WHERE order_code IS NULL;

-- Ensure order_code is unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON orders(tracking_code);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway VARCHAR(50) NOT NULL DEFAULT 'momo',
  gateway_order_id VARCHAR(100) NULL,
  transaction_id VARCHAR(100) NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, initiated, paid, failed
  result_code INT NULL,
  message VARCHAR(255) NULL,
  request_payload JSONB NULL,
  response_payload JSONB NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway_order_id ON payment_transactions(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
