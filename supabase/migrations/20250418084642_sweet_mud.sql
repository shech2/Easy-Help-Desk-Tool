/*
  # Create network monitoring tables

  1. New Tables
    - `network_stats`
      - `id` (uuid, primary key)
      - `host` (text)
      - `latency` (float)
      - `packet_loss` (float)
      - `dns_resolution` (float)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `network_stats` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS network_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  latency float NOT NULL,
  packet_loss float NOT NULL,
  dns_resolution float NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE network_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read network stats"
  ON network_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert network stats"
  ON network_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_network_stats_host ON network_stats(host);
CREATE INDEX IF NOT EXISTS idx_network_stats_timestamp ON network_stats(timestamp);

-- Add function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_network_stats()
RETURNS void AS $$
BEGIN
  DELETE FROM network_stats
  WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every day
SELECT cron.schedule(
  'cleanup-network-stats',
  '0 0 * * *',  -- Run at midnight every day
  'SELECT cleanup_old_network_stats()'
);