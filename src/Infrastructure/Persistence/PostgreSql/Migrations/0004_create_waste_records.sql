CREATE TABLE IF NOT EXISTS waste_records (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    waste_type TEXT NOT NULL CHECK (waste_type IN (
        'glass',
        'plastic',
        'metal',
        'paper_and_cardboard',
        'general_waste',
        'bio_waste'
        )
    ),
    weight_kg DOUBLE PRECISION NOT NULL CHECK (weight_kg >= 0),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year BETWEEN 2000 AND 2100)
);

CREATE INDEX IF NOT EXISTS idx_waste_records_user_year_month
    ON waste_records (user_id, year, month);