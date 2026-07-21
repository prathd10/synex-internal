-- ===================================================
-- SYNEX REALTY 10 PROPERTIES DB SEED SCRIPT
-- Paste & Run directly in your Supabase SQL Editor
-- ===================================================

-- Ensure property_type_enum includes 'Retail'
ALTER TYPE property_type_enum ADD VALUE IF NOT EXISTS 'Retail';

-- Ensure assigned_agent_id column supports text agent names (Amit Kumar, etc.)
ALTER TABLE IF EXISTS internal_crm_metadata 
ALTER COLUMN assigned_agent_id TYPE VARCHAR(150);

-- Clear existing sample data if re-seeding
TRUNCATE listings CASCADE;

-- Insert 10 Core Properties
INSERT INTO listings (id, listing_id, property_type, transaction_type, listing_type, property_status, lead_source) VALUES
('a1000000-0000-0000-0000-000000000001', 'SR-MUM-1001', 'Apartment', 'Rent', 'Exclusive', 'Available', 'Direct Call'),
('a1000000-0000-0000-0000-000000000002', 'SR-MUM-1002', 'Villa', 'Sale', 'Exclusive', 'Available', 'Website'),
('a1000000-0000-0000-0000-000000000003', 'SR-GUR-1003', 'Apartment', 'Rent', 'Exclusive', 'Rented', 'Referral'),
('a1000000-0000-0000-0000-000000000004', 'SR-BLR-1004', 'Penthouse', 'Sale', 'Exclusive', 'Under Negotiation', 'Direct Call'),
('a1000000-0000-0000-0000-000000000005', 'SR-GUR-1005', 'Office', 'Rent', 'Exclusive', 'Available', 'Corporate Portal'),
('a1000000-0000-0000-0000-000000000006', 'SR-NOI-1006', 'Apartment', 'Sale', 'Exclusive', 'Fresh', 'Direct Call'),
('a1000000-0000-0000-0000-000000000007', 'SR-MUM-1007', 'Penthouse', 'Sale', 'Exclusive', 'Available', 'Private Referral'),
('a1000000-0000-0000-0000-000000000008', 'SR-MUM-1008', 'Apartment', 'Rent', 'Exclusive', 'Available', 'Website'),
('a1000000-0000-0000-0000-000000000009', 'SR-GUR-1009', 'Retail', 'Rent', 'Exclusive', 'Available', 'Walk-in'),
('a1000000-0000-0000-0000-000000000010', 'SR-BLR-1010', 'Villa', 'Sale', 'Exclusive', 'Available', 'VIP Event');

-- Property Locations
INSERT INTO property_locations (listing_id, address, building, floor, total_floors, society, locality, city) VALUES
('a1000000-0000-0000-0000-000000000001', 'Flat 802, Block C, near primary gate', 'Prestige Heights', 8, 18, 'Prestige Heights', 'Lower Parel', 'Mumbai'),
('a1000000-0000-0000-0000-000000000002', 'Villa 24, Phase 2, behind Golf Club', 'Sobha Meadows', 2, 2, 'Sobha Meadows', 'Golf Course Extension', 'Gurgaon'),
('a1000000-0000-0000-0000-000000000003', 'Tower 2, Flat 1204, Sector 43', 'DLF Phase 5', 12, 24, 'DLF Phase 5', 'DLF Cybercity', 'Gurgaon'),
('a1000000-0000-0000-0000-000000000004', 'Block A, Penthouse Suite 2201', 'Phoenix Towers', 22, 22, 'Phoenix Towers', 'Whitefield', 'Bangalore'),
('a1000000-0000-0000-0000-000000000005', 'Unit 304, Tower B', 'One Horizon Hub', 3, 10, 'One Horizon Hub', 'Golf Course Road', 'Gurgaon'),
('a1000000-0000-0000-0000-000000000006', 'Tower D, Flat 403, Forest View Layout', 'Godrej Woods', 4, 16, 'Godrej Woods', 'Sector 43', 'Noida'),
('a1000000-0000-0000-0000-000000000007', 'Tower 1, Sky Suite 5202, Sea Face Road', 'Lodha World View', 52, 78, 'Lodha World View', 'Worli', 'Mumbai'),
('a1000000-0000-0000-0000-000000000008', 'Tower B, Flat 1804, WEH Highway Junction', 'Oberoi Sky City', 18, 40, 'Oberoi Sky City', 'Borivali East', 'Mumbai'),
('a1000000-0000-0000-0000-000000000009', 'Unit G-12, Ground Floor Promenade', 'DLF Cyber Hub Boulevard', 0, 4, 'DLF Cyber Hub Boulevard', 'Cyber City Phase 2', 'Gurgaon'),
('a1000000-0000-0000-0000-000000000010', 'Villa 108, Augusta Green Loop', 'Prestige Golfshire', 3, 3, 'Prestige Golfshire', 'Nandi Hills', 'Bangalore');

-- Property Specifications
INSERT INTO property_specifications (listing_id, bhk_size, carpet_area_sqft, possession_status, facing_direction) VALUES
('a1000000-0000-0000-0000-000000000001', '3 BHK', 1600, 'Ready to Move', 'North-East'),
('a1000000-0000-0000-0000-000000000002', '4+ BHK', 3500, 'Ready to Move', 'East'),
('a1000000-0000-0000-0000-000000000003', '2 BHK', 1150, 'Ready to Move', 'North'),
('a1000000-0000-0000-0000-000000000004', '3 BHK', 2800, 'Ready to Move', 'East'),
('a1000000-0000-0000-0000-000000000005', 'N/A', 4200, 'Ready to Move', 'North'),
('a1000000-0000-0000-0000-000000000006', '3 BHK', 1450, 'Under Construction', 'South-East'),
('a1000000-0000-0000-0000-000000000007', '4+ BHK', 2900, 'Ready to Move', 'West'),
('a1000000-0000-0000-0000-000000000008', '3 BHK', 1420, 'Ready to Move', 'East'),
('a1000000-0000-0000-0000-000000000009', 'N/A', 2200, 'Ready to Move', 'North-East'),
('a1000000-0000-0000-0000-000000000010', '4+ BHK', 5400, 'Ready to Move', 'East');

-- Financial Details
INSERT INTO financial_details (listing_id, asking_price_inr, is_negotiable, maintenance_charge_inr) VALUES
('a1000000-0000-0000-0000-000000000001', 145000, true, 5000),
('a1000000-0000-0000-0000-000000000002', 45000000, true, 12000),
('a1000000-0000-0000-0000-000000000003', 35000, false, 3500),
('a1000000-0000-0000-0000-000000000004', 28000000, false, 8000),
('a1000000-0000-0000-0000-000000000005', 180000, true, 15000),
('a1000000-0000-0000-0000-000000000006', 15000000, true, 6000),
('a1000000-0000-0000-0000-000000000007', 145000000, true, 22000),
('a1000000-0000-0000-0000-000000000008', 110000, true, 6500),
('a1000000-0000-0000-0000-000000000009', 250000, true, 20000),
('a1000000-0000-0000-0000-000000000010', 98000000, true, 18000);

-- Internal CRM Metadata & Team Allocations
INSERT INTO internal_crm_metadata (listing_id, assigned_agent_id, internal_notes, suitability_tags) VALUES
('a1000000-0000-0000-0000-000000000001', 'Amit Kumar', 'Owner expects corporate profile. Key #402 at security office.', ARRAY['Vastu Compliant', 'Near Metro Station']),
('a1000000-0000-0000-0000-000000000002', 'Siddharth Sharma', 'NRI owner living in Dubai. 24h advance notice required.', ARRAY['Vastu Compliant', 'Newly Renovated']),
('a1000000-0000-0000-0000-000000000003', 'Pooja Verma', 'Leased to TechCorp India.', ARRAY['Near Metro Station']),
('a1000000-0000-0000-0000-000000000004', 'Amit Kumar', 'Negotiation in progress. Token advance expected.', ARRAY['Vastu Compliant', 'Top Floor View']),
('a1000000-0000-0000-0000-000000000005', 'Siddharth Sharma', 'Lease minimum 3 years lock-in.', ARRAY['Close to IT Park', 'Near Metro Station']),
('a1000000-0000-0000-0000-000000000006', 'Pooja Verma', 'Draft listing pending land boundary clearance.', ARRAY['Gated Community']),
('a1000000-0000-0000-0000-000000000007', 'Amit Kumar', 'Ultra-high net worth seller. Proof of funds required.', ARRAY['Sea View', 'Private Elevator']),
('a1000000-0000-0000-0000-000000000008', 'Siddharth Sharma', 'Direct skywalk access to Metro station.', ARRAY['Near Metro Station', 'Vastu Compliant']),
('a1000000-0000-0000-0000-000000000009', 'Pooja Verma', 'Double-height frontage in Cyber Hub promenade.', ARRAY['High Footfall', 'Ground Floor Frontage']),
('a1000000-0000-0000-0000-000000000010', 'Amit Kumar', 'Private pool and 18-hole golf course access.', ARRAY['Private Pool', 'Golf Course Facing']);

-- Property Media
INSERT INTO property_media (listing_id, media_type, file_url) VALUES
('a1000000-0000-0000-0000-000000000001', 'Photo', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000002', 'Photo', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000003', 'Photo', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000004', 'Photo', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000005', 'Photo', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000006', 'Photo', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000007', 'Photo', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000008', 'Photo', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000009', 'Photo', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80'),
('a1000000-0000-0000-0000-000000000010', 'Photo', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80');
