-- Create the contacts table in Cloudflare D1
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  processed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp);
CREATE INDEX IF NOT EXISTS idx_contacts_processed ON contacts(processed);

-- Optional: Create a view for unprocessed contacts
CREATE VIEW IF NOT EXISTS unprocessed_contacts AS
SELECT * FROM contacts WHERE processed = 0 ORDER BY timestamp ASC;