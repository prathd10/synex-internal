export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Office' | 'Retail' | 'Warehouse' | 'Plot';

export interface Listing {
  id: string;
  purpose: 'Rent' | 'Sale';
  type: PropertyType;
  society: string;
  locality: string;
  city: string;
  address: string;
  bhk: string;
  bathrooms: number;
  balconies: number;
  carpetArea: number;
  floor: string;
  floorNum?: number;
  totalFloors?: number;
  facing: string;
  furnishing: string;
  amenities: string[];
  price: number;
  deposit: number;
  maintenance: number;
  negotiable: 'Yes' | 'No';
  availableDate: string;
  preferredTenant: string;
  image: string;
  media?: { url: string; type: 'Photo' | 'Video' }[];
  marketingTags: string[];
  marketingHighlights: string;
  aiDescription: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  assignedAgent: string;
  views: number;
  clicks: number;
  status: 'Active' | 'Negotiation' | 'Sold' | 'Rented' | 'Draft';
  internalNotes: string;
}

export type RoleType = 'admin' | 'consultant';
export type TabType = 'dashboard' | 'inventory' | 'find' | 'settings' | 'crm';
export type LayoutType = 'grid' | 'list';
export type ToneType = 'luxury' | 'professional' | 'speed';

export interface Showing {
  id: string;
  listingId: string;
  propertyName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  showingDate: string;
  agentName: string;
  status: 'Interested' | 'Offer Received' | 'Follow-up' | 'Not Interested';
  feedback: string;
}

export interface Offer {
  id: string;
  listingId: string;
  propertyName: string;
  clientName: string;
  clientPhone: string;
  offeredPrice: number;
  counterPrice?: number;
  tokenAmount?: number;
  stage: 'Offer Received' | 'Counter Offer' | 'Token Received' | 'Deal Closed';
  updatedAt: string;
  notes?: string;
}
