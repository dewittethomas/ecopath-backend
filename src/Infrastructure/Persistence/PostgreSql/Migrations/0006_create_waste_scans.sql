CREATE TABLE IF NOT EXISTS waste_scans (
    id UUID PRIMARY KEY,
    image TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    waste_type TEXT NOT NULL CHECK (waste_type IN (
        'glass',
        'plastic',
        'metal',
        'paper_and_cardboard',
        'general_waste',
        'bio_waste'
        )
    ),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
)