-- Main record table
CREATE TABLE IF NOT EXISTS carbon_footprint_records (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year BETWEEN 2000 AND 2100),

    gas_m3 DOUBLE PRECISION NOT NULL CHECK (gas_m3 >= 0),
    electricity_kwh DOUBLE PRECISION NOT NULL CHECK (electricity_kwh >= 0),
    impact_co2kg DOUBLE PRECISION NOT NULL CHECK (impact_co2kg >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_carbon_footprint_records_user_year_month
    ON carbon_footprint_records (user_id, year, month);


-- Waste breakdown table (1:n)
CREATE TABLE IF NOT EXISTS carbon_footprint_records_waste (
    record_id UUID NOT NULL REFERENCES carbon_footprint_records(id) ON DELETE CASCADE,
    waste_type TEXT NOT NULL CHECK (waste_type IN (
        'glass',
        'plastic',
        'metal',
        'paper_and_cardboard',
        'general_waste',
        'bio_waste'
    )),
    weight_kg DOUBLE PRECISION NOT NULL CHECK (weight_kg >= 0),

    PRIMARY KEY (record_id, waste_type)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_carbon_footprint_records_waste_record
    ON carbon_footprint_records_waste (record_id, waste_type);