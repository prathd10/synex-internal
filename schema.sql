-- ==========================================
-- SYNEX REALTY INTERNAL CRM SYSTEM SCHEMAS
-- Executable directly in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. DROP EXISTING CONSTRUCTS (IF RE-RUNNING)
-- ------------------------------------------
-- Note: Dropping tables with CASCADE automatically drops their associated triggers.
DROP TABLE IF EXISTS activity_timeline CASCADE;
DROP TABLE IF EXISTS property_media CASCADE;
DROP TABLE IF EXISTS internal_crm_metadata CASCADE;
DROP TABLE IF EXISTS legal_documentation CASCADE;
DROP TABLE IF EXISTS listing_furnishing CASCADE;
DROP TABLE IF EXISTS furnishing_master CASCADE;
DROP TABLE IF EXISTS listing_amenities CASCADE;
DROP TABLE IF EXISTS amenities_master CASCADE;
DROP TABLE IF EXISTS listing_owners CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS plot_dimensions CASCADE;
DROP TABLE IF EXISTS property_specifications CASCADE;
DROP TABLE IF EXISTS property_locations CASCADE;
DROP TABLE IF EXISTS financial_details CASCADE;
DROP TABLE IF EXISTS listings CASCADE;

DROP FUNCTION IF EXISTS func_generate_listing_id() CASCADE;
DROP SEQUENCE IF EXISTS seq_listing_index CASCADE;

DROP TYPE IF EXISTS property_type_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS listing_type_enum CASCADE;
DROP TYPE IF EXISTS property_status_enum CASCADE;
DROP TYPE IF EXISTS bhk_size_enum CASCADE;
DROP TYPE IF EXISTS possession_status_enum CASCADE;
DROP TYPE IF EXISTS facing_direction_enum CASCADE;
DROP TYPE IF EXISTS maintenance_period_enum CASCADE;
DROP TYPE IF EXISTS plot_shape_enum CASCADE;
DROP TYPE IF EXISTS priority_enum CASCADE;
DROP TYPE IF EXISTS media_type_enum CASCADE;
DROP TYPE IF EXISTS action_type_enum CASCADE;

-- ------------------------------------------
-- 2. CREATE CUSTOM ENUM DATA TYPES
-- ------------------------------------------
CREATE TYPE property_type_enum AS ENUM ('Apartment', 'Villa', 'Penthouse', 'Office', 'Retail', 'Warehouse', 'Plot');
CREATE TYPE transaction_type_enum AS ENUM ('Rent', 'Sale', 'Lease', 'JV');
CREATE TYPE listing_type_enum AS ENUM ('Exclusive', 'Open Listing', 'Co-Brokerage', 'Direct Owner');
CREATE TYPE property_status_enum AS ENUM ('Fresh', 'Available', 'Hold', 'Under Negotiation', 'Offer Received', 'Token Received', 'Sold', 'Rented', 'Duplicate', 'Inactive');
CREATE TYPE bhk_size_enum AS ENUM ('1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'N/A');
CREATE TYPE possession_status_enum AS ENUM ('Ready to Move', 'Under Construction', 'Pre-Launch');
CREATE TYPE facing_direction_enum AS ENUM ('North', 'East', 'West', 'South', 'North-East', 'North-West', 'South-East', 'South-West');
CREATE TYPE maintenance_period_enum AS ENUM ('Monthly', 'Quarterly', 'Annual');
CREATE TYPE plot_shape_enum AS ENUM ('Square', 'Rectangle', 'L-Shape', 'Irregular');
CREATE TYPE priority_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE media_type_enum AS ENUM ('Photo', 'Video', 'Floor Plan', '360 Tour', 'Drone Video', 'Document');
CREATE TYPE action_type_enum AS ENUM ('Created', 'Edited', 'Price Changed', 'Offer Received', 'Status Changed', 'Site Visit', 'Document Uploaded', 'Deleted', 'Restored');

-- ------------------------------------------
-- 3. CORE TABLE DECLARATIONS
-- ------------------------------------------

-- Generate indexing sequence for unique visual property numbers
CREATE SEQUENCE seq_listing_index START WITH 1001;

-- Table: listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id VARCHAR(25) UNIQUE,
    property_type property_type_enum NOT NULL,
    transaction_type transaction_type_enum NOT NULL,
    listing_type listing_type_enum NOT NULL,
    property_status property_status_enum NOT NULL DEFAULT 'Fresh',
    is_hot_property BOOLEAN DEFAULT false,
    lead_source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: property_locations
CREATE TABLE property_locations (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    building VARCHAR(150) NOT NULL,
    wing VARCHAR(50),
    floor INT NOT NULL,
    total_floors INT NOT NULL,
    society VARCHAR(150) NOT NULL,
    locality VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    google_maps_link TEXT,
    nearby_landmarks TEXT,
    metro_distance_meters INT,
    school_distance_meters INT,
    hospital_distance_meters INT,
    highway_distance_meters INT,
    airport_distance_meters INT
);

-- Table: property_specifications
CREATE TABLE property_specifications (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    bhk_size bhk_size_enum NOT NULL DEFAULT 'N/A',
    carpet_area_sqft INT NOT NULL,
    built_up_area_sqft INT,
    super_built_up_area_sqft INT,
    plot_area_sqyd INT,
    balcony_count INT DEFAULT 0,
    balcony_area_sqft INT DEFAULT 0,
    terrace_area_sqft INT DEFAULT 0,
    garden_area_sqft INT DEFAULT 0,
    ceiling_height_feet NUMERIC(3,1),
    age_of_property_years INT DEFAULT 0,
    possession_status possession_status_enum NOT NULL,
    facing_direction facing_direction_enum NOT NULL,
    entrance_direction facing_direction_enum,
    is_vastu_compliant BOOLEAN DEFAULT false,
    kitchen_direction facing_direction_enum,
    master_bedroom_direction facing_direction_enum
);

-- Table: plot_dimensions (Only populated for land parcels and villas)
CREATE TABLE plot_dimensions (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    length_feet INT,
    width_feet INT,
    frontage_feet INT,
    depth_feet INT,
    road_width_meters INT,
    is_corner_plot BOOLEAN DEFAULT false,
    plot_shape plot_shape_enum
);

-- Table: financial_details
CREATE TABLE financial_details (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    asking_price_inr NUMERIC(12,2) NOT NULL,
    is_negotiable BOOLEAN DEFAULT true,
    minimum_closing_price_inr NUMERIC(12,2), -- Confidential/Admin Only
    token_amount_inr NUMERIC(12,2) DEFAULT 0,
    brokerage_percentage NUMERIC(3,2) DEFAULT 2.00,
    maintenance_charge_inr NUMERIC(8,2) DEFAULT 0,
    maintenance_period maintenance_period_enum DEFAULT 'Monthly',
    property_tax_annual_inr NUMERIC(8,2),
    society_transfer_charges_inr NUMERIC(8,2) DEFAULT 0,
    parking_charge_one_time_inr NUMERIC(8,2) DEFAULT 0,
    gst_applicable_percentage NUMERIC(3,2) DEFAULT 0.00,
    estimated_rental_yield_percentage NUMERIC(3,2),
    expected_annual_appreciation_percentage NUMERIC(3,2),
    is_bank_loan_approved BOOLEAN DEFAULT true,
    approved_banks TEXT[]
);

-- Table: owners
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    primary_phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50),
    email VARCHAR(150),
    preferred_contact_time VARCHAR(100),
    pan_number VARCHAR(50), -- Confidential encrypted
    current_city VARCHAR(100),
    owner_rating INT CHECK (owner_rating >= 1 AND owner_rating <= 5) DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Joint Table: listing_owners (Many-to-Many)
CREATE TABLE listing_owners (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, owner_id)
);

-- Table: amenities_master (Master Amenities List)
CREATE TABLE amenities_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL -- Residential, Commercial, Common
);

-- Joint Table: listing_amenities (Many-to-Many relation)
CREATE TABLE listing_amenities (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    amenity_id INT REFERENCES amenities_master(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, amenity_id)
);

-- Table: furnishing_master (Master Furnishing Checklist)
CREATE TABLE furnishing_master (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(150) UNIQUE NOT NULL
);

-- Joint Table: listing_furnishing (Many-to-Many checklist)
CREATE TABLE listing_furnishing (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    furnishing_id INT REFERENCES furnishing_master(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    PRIMARY KEY (listing_id, furnishing_id)
);

-- Table: legal_documentation
CREATE TABLE legal_documentation (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    is_title_clear BOOLEAN DEFAULT false,
    rera_number VARCHAR(100),
    is_oc_received BOOLEAN DEFAULT false,
    is_cc_received BOOLEAN DEFAULT false,
    is_commencement_certificate_received BOOLEAN DEFAULT false,
    is_litigated BOOLEAN DEFAULT false,
    litigation_description TEXT,
    current_mortgage_details TEXT,
    noc_status JSONB -- e.g. {"society_noc": true, "fire_noc": false}
);

-- Table: internal_crm_metadata
CREATE TABLE internal_crm_metadata (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    assigned_agent_id UUID, -- References Supabase Auth table
    assigned_freelancer_id UUID,
    internal_notes TEXT,
    next_followup_date DATE,
    priority priority_enum DEFAULT 'Medium',
    physical_key_location VARCHAR(200),
    last_physical_inspection_date DATE,
    suitability_tags TEXT[] -- GIN Indexed
);

-- Table: property_media
CREATE TABLE property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    media_type media_type_enum NOT NULL,
    file_url TEXT NOT NULL,
    imagekit_file_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: activity_timeline (Full audit trails)
CREATE TABLE activity_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    changed_by_user_id UUID, -- References auth.users
    action_type action_type_enum NOT NULL,
    previous_value_snapshot JSONB,
    new_value_snapshot JSONB,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------
-- 4. UTILITIES & TRIGGERS
-- ------------------------------------------

-- Function: Generate a readable Listing ID (SR-MUM-XXXX)
CREATE OR REPLACE FUNCTION func_generate_listing_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.listing_id := 'SR-MUM-' || nextval('seq_listing_index');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to bind on Listing Creation
CREATE TRIGGER trg_set_listing_id
BEFORE INSERT ON listings
FOR EACH ROW
EXECUTE FUNCTION func_generate_listing_id();

-- ------------------------------------------
-- 5. PERFORMANCE AND SEARCH INDEXES
-- ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(property_status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(property_type);
CREATE INDEX IF NOT EXISTS idx_locations_society ON property_locations(society);
CREATE INDEX IF NOT EXISTS idx_locations_locality ON property_locations(locality);
CREATE INDEX IF NOT EXISTS idx_financials_price ON financial_details(asking_price_inr);
CREATE INDEX IF NOT EXISTS idx_specs_carpet ON property_specifications(carpet_area_sqft);

-- GIN Indexes for array / tags searching
CREATE INDEX IF NOT EXISTS idx_crm_suitability_tags ON internal_crm_metadata USING GIN(suitability_tags);
CREATE INDEX IF NOT EXISTS idx_financials_banks ON financial_details USING GIN(approved_banks);

-- ------------------------------------------
-- 6. SEED DATA FOR AMENITIES & FURNISHINGS
-- ------------------------------------------
INSERT INTO amenities_master (name, category) VALUES
('Swimming Pool', 'Residential'),
('Gymnasium', 'Residential'),
('Clubhouse', 'Residential'),
('24x7 Power Backup', 'Common'),
('High Speed Lifts', 'Common'),
('EV Charging Station', 'Common'),
('CCTV Surveillance', 'Common'),
('Intercom Facility', 'Common'),
('Central AC Plant', 'Commercial'),
('Conference Room', 'Commercial'),
('Cafeteria / Pantry', 'Commercial'),
('Visitor Parking', 'Common'),
('Rainwater Harvesting', 'Common'),
('Jogging Track', 'Residential'),
('Vastu Compliant layout', 'Common')
ON CONFLICT (name) DO NOTHING;

INSERT INTO furnishing_master (item_name) VALUES
('Modular Kitchen'),
('Electric Chimney'),
('Split Air Conditioner'),
('Geyser'),
('Wardrobe'),
('Sofa Set'),
('Dining Table'),
('Double Bed'),
('Office Workstation Desk'),
('Server Rack Cabinet'),
('Executive Desk Chair'),
('Refrigerator'),
('Microwave Oven')
ON CONFLICT (item_name) DO NOTHING;
