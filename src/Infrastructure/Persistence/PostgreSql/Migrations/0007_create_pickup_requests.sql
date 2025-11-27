CREATE TABLE IF NOT EXISTS pickup_requests (
    id UUID PRIMARY KEY,
    house_number TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    image TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    notes TEXT NULL
)