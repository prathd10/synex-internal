import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  LogOut, 
  Plus, 
  Search, 
  TrendingUp, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  Cloud,
  Briefcase,
  Compass,
  X,
  Menu,
  SlidersHorizontal,
  DollarSign,
  Percent,
  Calculator,
  Users,
  Phone,
  Calendar,
  PlusCircle,
  Target,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Listing, RoleType, TabType, LayoutType, ToneType, Showing, Offer, PropertyType } from './types';

interface CustomSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  variant?: 'standard' | 'minimal';
}

function CustomSelect({ label, value, options, onChange, variant = 'standard' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === String(value));

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => setIsOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const buttonStyle = variant === 'minimal'
    ? 'flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest-light transition-colors text-left focus:outline-none'
    : 'flex items-center justify-between w-full px-3 py-2 border border-slate-200 rounded bg-white text-xs font-semibold text-forest shadow-sm text-left hover:border-forest/30 transition-colors';

  return (
    <div className="flex flex-col gap-1 relative w-full" onClick={e => e.stopPropagation()}>
      {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyle}
      >
        <span>{selectedOption?.label || value}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute top-[102%] right-0 min-w-[150px] bg-white border border-slate-200/80 rounded shadow-lg py-1 z-40 max-h-60 overflow-y-auto animate-fade-in">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                  String(value) === opt.value
                    ? 'bg-pastel-mint text-forest font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Initial Mock Database (Now with realistic local pricing in INR)
const INITIAL_DATABASE: Listing[] = [
  {
    id: "prop-1",
    purpose: "Rent",
    type: "Apartment",
    society: "Prestige Heights",
    locality: "Sector 54",
    city: "Bangalore",
    address: "Flat 802, Block C, near primary gate",
    bhk: "3",
    bathrooms: 3,
    balconies: 2,
    carpetArea: 1600,
    floor: "8th of 18 floors",
    facing: "North-East",
    furnishing: "Fully Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Power Backup", "24x7 Security"],
    price: 45000,
    deposit: 150000,
    maintenance: 5000,
    negotiable: "Yes",
    availableDate: "2026-08-01",
    preferredTenant: "Families",
    image: "/assets/apartment.png",
    marketingTags: ["Vastu Compliant", "Near Metro Station", "Zero Brokerage", "Gated Community"],
    marketingHighlights: "Vastu Compliant, Near Metro Station, Zero Brokerage, Gated Community",
    aiDescription: "Presenting a premium 3 BHK apartment in Prestige Heights, Sector 54, Bangalore. Spanning 1600 sq ft, this Vastu Compliant residence is fully furnished with modular cabinetry, air conditioning, and top-tier security systems. Offering gorgeous north-east facing views from the 8th floor, it is perfect for families seeking comfort and connectivity.",
    ownerName: "Ramesh Prasad",
    ownerPhone: "+91 98765 43210",
    ownerEmail: "ramesh.prasad@gmail.com",
    assignedAgent: "Amit Kumar",
    views: 954,
    clicks: 124,
    status: "Active",
    internalNotes: "Owner expects a corporate family profile only. Keys are at the society management office under key ID #402. No pets allowed."
  },
  {
    id: "prop-2",
    purpose: "Sale",
    type: "Villa",
    society: "Sobha Meadows",
    locality: "Indiranagar",
    city: "Bangalore",
    address: "Villa 24, Phase 2, behind Indiranagar Club",
    bhk: "4+",
    bathrooms: 5,
    balconies: 3,
    carpetArea: 3500,
    floor: "Ground + 1 Floor",
    facing: "East",
    furnishing: "Semi-Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "24x7 Security"],
    price: 45000000,
    deposit: 0,
    maintenance: 12000,
    negotiable: "Yes",
    availableDate: "2026-09-01",
    preferredTenant: "Anyone",
    image: "/assets/villa.png",
    marketingTags: ["Vastu Compliant", "Newly Renovated", "Spacious Balconies", "Gated Community"],
    marketingHighlights: "Vastu Compliant, Newly Renovated, Spacious Balconies, Gated Community",
    aiDescription: "An architectural marvel: a bespoke 4+ BHK luxury Villa in Sobha Meadows, Indiranagar. Features over 3500 sq ft of built-up area, East facing facade, beautifully landscaped lawns, and high-end semi-furnished interiors. Completely renovated in 2026. Perfect for high-profile buyers searching for privacy and premium luxury.",
    ownerName: "Sanjay Singhania",
    ownerPhone: "+91 91234 56789",
    ownerEmail: "sanjay.s@singhaniagroup.com",
    assignedAgent: "Siddharth Sharma",
    views: 785,
    clicks: 98,
    status: "Active",
    internalNotes: "Owner is an NRI living in Dubai. Viewings require a 24-hour advance notice. Vastu compliant layout is a key selling highlight."
  },
  {
    id: "prop-3",
    purpose: "Rent",
    type: "Apartment",
    society: "DLF Phase 5",
    locality: "DLF Cybercity",
    city: "Gurgaon",
    address: "Tower 2, Flat 1204, Sector 43",
    bhk: "2",
    bathrooms: 2,
    balconies: 1,
    carpetArea: 1150,
    floor: "12th of 24 floors",
    facing: "North",
    furnishing: "Unfurnished",
    amenities: ["Modular Kitchen", "Power Backup", "24x7 Security"],
    price: 35000,
    deposit: 70000,
    maintenance: 3500,
    negotiable: "No",
    availableDate: "2026-07-25",
    preferredTenant: "Bachelors",
    image: "/assets/apartment.png",
    marketingTags: ["Near Metro Station", "No Common Walls"],
    marketingHighlights: "Near Metro Station, No Common Walls",
    aiDescription: "Conveniently located 2 BHK unfurnished apartment in DLF Phase 5, Gurgaon. Positioned on the 12th floor with excellent cross-ventilation and zero common walls. Super close to Rapid Metro station, making it perfect for corporate professionals working in Cybercity.",
    ownerName: "Priya Sharma",
    ownerPhone: "+91 99998 88877",
    ownerEmail: "priya.sharma@dlf.net",
    assignedAgent: "Pooja Verma",
    views: 420,
    clicks: 62,
    status: "Rented",
    internalNotes: "Rented to corporate lease from TechCorp India. Security deposit cleared, keys handed over to the tenant on July 19."
  },
  {
    id: "prop-4",
    purpose: "Sale",
    type: "Penthouse",
    society: "Phoenix Towers",
    locality: "Whitefield",
    city: "Bangalore",
    address: "Block A, Penthouse Suite 2201",
    bhk: "3",
    bathrooms: 4,
    balconies: 4,
    carpetArea: 2800,
    floor: "22nd (Top Floor)",
    facing: "East",
    furnishing: "Fully Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Sofa Set", "Refrigerator", "Power Backup", "24x7 Security"],
    price: 28000000,
    deposit: 0,
    maintenance: 8000,
    negotiable: "No",
    availableDate: "2026-10-15",
    preferredTenant: "Anyone",
    image: "/assets/penthouse.png",
    marketingTags: ["Vastu Compliant", "Top Floor View", "Spacious Balconies", "Gated Community"],
    marketingHighlights: "Vastu Compliant, Top Floor View, Spacious Balconies, Gated Community",
    aiDescription: "Magnificent 3 BHK fully furnished Penthouse overlooking the Whitefield skyline. Located on the 22nd top floor of Phoenix Towers, it features 4 spacious balconies, modular designer kitchen, luxury furnishings, and exclusive terrace access. High rental yields expected for investment buyers.",
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 90001 23456",
    ownerEmail: "vikram.m@malhotrahomes.in",
    assignedAgent: "Amit Kumar",
    views: 650,
    clicks: 85,
    status: "Negotiation",
    internalNotes: "Client offered $475K. Broker negotiating up to $482K. Token advance expected by end of week."
  },
  {
    id: "prop-5",
    purpose: "Rent",
    type: "Office",
    society: "One Horizon Hub",
    locality: "Golf Course Road",
    city: "Gurgaon",
    address: "Unit 304, Tower B",
    bhk: "N/A",
    bathrooms: 2,
    balconies: 0,
    carpetArea: 4200,
    floor: "3rd of 10 floors",
    facing: "North",
    furnishing: "Semi-Furnished",
    amenities: ["Air Conditioning", "Power Backup", "24x7 Security"],
    price: 180000,
    deposit: 540000,
    maintenance: 15000,
    negotiable: "Yes",
    availableDate: "2026-08-15",
    preferredTenant: "Corporate Lease",
    image: "/assets/office.png",
    marketingTags: ["Close to IT Park", "Near Metro Station", "High Rental Yield"],
    marketingHighlights: "Close to IT Park, Near Metro Station, High Rental Yield",
    aiDescription: "Premium commercial office space in One Horizon Hub, Golf Course Road. Offering 4200 sq ft carpet area, outfitted with central air conditioning, glass cabins, meeting space, and dedicated reception desk. A highly prestigious business address, ideal for startups and established teams.",
    ownerName: "Synex Holdings Pvt Ltd",
    ownerPhone: "+91 88888 77777",
    ownerEmail: "leasing@synexholdings.com",
    assignedAgent: "Siddharth Sharma",
    views: 320,
    clicks: 45,
    status: "Active",
    internalNotes: "Corporate owner. Lease terms minimum 3 years lock-in with a 5% escalation year-on-year. Contact corporate agent directly."
  },
  {
    id: "prop-6",
    purpose: "Sale",
    type: "Apartment",
    society: "Godrej Woods",
    locality: "Sector 43",
    city: "Noida",
    address: "Tower D, Flat 403, Forest View Layout",
    bhk: "3",
    bathrooms: 3,
    balconies: 2,
    carpetArea: 1450,
    floor: "4th of 16 floors",
    facing: "South-East",
    furnishing: "Unfurnished",
    amenities: ["Modular Kitchen", "Power Backup", "24x7 Security"],
    price: 15000000,
    deposit: 0,
    maintenance: 6000,
    negotiable: "Yes",
    availableDate: "2026-11-01",
    preferredTenant: "Anyone",
    image: "/assets/apartment.png",
    marketingTags: ["Gated Community", "Newly Renovated"],
    marketingHighlights: "Gated Community, Newly Renovated",
    aiDescription: "Scenic 3 BHK forest-facing apartment in Godrej Woods, Noida. Spans 1450 sq ft with two balconies facing natural woodland reserves. Standard unfurnished floor plan with modular kitchen layout. Located in a high-end gated community with massive club amenities.",
    ownerName: "Karan Johar",
    ownerPhone: "+91 96543 21098",
    ownerEmail: "karan@dharmaprod.com",
    assignedAgent: "Pooja Verma",
    views: 119,
    clicks: 25,
    status: "Draft",
    internalNotes: "Property listed in draft stage pending verify documentation on land boundary clearance. Do not share publicly."
  },
  {
    id: "prop-7",
    purpose: "Sale",
    type: "Penthouse",
    society: "Lodha World View",
    locality: "Worli",
    city: "Mumbai",
    address: "Tower 1, Sky Suite 5202, Sea Face Road",
    bhk: "4 BHK",
    bathrooms: 5,
    balconies: 3,
    carpetArea: 2900,
    floor: "52nd of 78 floors",
    facing: "West",
    furnishing: "Fully Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Sofa Set", "Power Backup", "24x7 Security", "Private Elevator"],
    price: 145000000,
    deposit: 0,
    maintenance: 22000,
    negotiable: "Yes",
    availableDate: "Immediate",
    preferredTenant: "Anyone",
    image: "/assets/penthouse.png",
    marketingTags: ["Sea View", "Vastu Compliant", "Private Elevator", "Gated Community"],
    marketingHighlights: "Sea View, Vastu Compliant, Private Elevator, Gated Community",
    aiDescription: "Ultra-luxury 4 BHK Sky Residence in Lodha World View, Worli, Mumbai. Perched on the 52nd floor with panoramic Arabian Sea views. Includes private keycard elevator, Italian marble flooring, designer modular kitchen, and double-height living room.",
    ownerName: "Anil Ambani",
    ownerPhone: "+91 98200 11223",
    ownerEmail: "anil.a@reliancegroup.com",
    assignedAgent: "Amit Kumar",
    views: 1240,
    clicks: 210,
    status: "Active",
    internalNotes: "Ultra-high net worth seller. Requires proof of funds prior to scheduling physical inspections."
  },
  {
    id: "prop-8",
    purpose: "Rent",
    type: "Apartment",
    society: "Oberoi Sky City",
    locality: "Borivali East",
    city: "Mumbai",
    address: "Tower B, Flat 1804, WEH Highway Junction",
    bhk: "3",
    bathrooms: 3,
    balconies: 2,
    carpetArea: 1420,
    floor: "18th of 40 floors",
    facing: "East",
    furnishing: "Semi-Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Power Backup", "24x7 Security"],
    price: 110000,
    deposit: 400000,
    maintenance: 6500,
    negotiable: "Yes",
    availableDate: "2026-08-10",
    preferredTenant: "Families",
    image: "/assets/apartment.png",
    marketingTags: ["Near Metro Station", "Vastu Compliant", "Gated Community"],
    marketingHighlights: "Near Metro Station, Vastu Compliant, Gated Community",
    aiDescription: "Elegant 3 BHK apartment in Oberoi Sky City, Borivali East, Mumbai. Direct view of Sanjay Gandhi National Park, direct skywalk access to Metro station. Fitted with split air conditioners and modular storage wardrobes.",
    ownerName: "Sunita Kapoor",
    ownerPhone: "+91 97690 44332",
    ownerEmail: "sunita.kapoor@gmail.com",
    assignedAgent: "Siddharth Sharma",
    views: 810,
    clicks: 94,
    status: "Active",
    internalNotes: "Owner prefers corporate family tenants with long-term lock-in contract."
  },
  {
    id: "prop-9",
    purpose: "Rent",
    type: "Retail",
    society: "DLF Cyber Hub Boulevard",
    locality: "Cyber City Phase 2",
    city: "Gurgaon",
    address: "Unit G-12, Ground Floor Promenade",
    bhk: "N/A",
    bathrooms: 2,
    balconies: 0,
    carpetArea: 2200,
    floor: "Ground Floor",
    facing: "North-East",
    furnishing: "Unfurnished",
    amenities: ["Air Conditioning", "Power Backup", "24x7 Security"],
    price: 250000,
    deposit: 1000000,
    maintenance: 20000,
    negotiable: "Yes",
    availableDate: "Immediate",
    preferredTenant: "Corporate Lease",
    image: "/assets/office.png",
    marketingTags: ["High Footfall", "Ground Floor Frontage", "Near Metro Station"],
    marketingHighlights: "High Footfall, Ground Floor Frontage, Near Metro Station",
    aiDescription: "Prime commercial retail showroom space in DLF Cyber Hub, Gurgaon. Ground floor double-height frontage with massive footfall exposure across Cyber City. Ideal for luxury apparel retail, high-end cafe, or flagship tech store.",
    ownerName: "DLF Commercial Assets",
    ownerPhone: "+91 80000 55443",
    ownerEmail: "retail.leasing@dlf.in",
    assignedAgent: "Pooja Verma",
    views: 630,
    clicks: 78,
    status: "Active",
    internalNotes: "Ground floor unit with approved F&B hood ducting provisions. Contact DLF asset manager directly."
  },
  {
    id: "prop-10",
    purpose: "Sale",
    type: "Villa",
    society: "Prestige Golfshire",
    locality: "Nandi Hills",
    city: "Bangalore",
    address: "Villa 108, Augusta Green Loop",
    bhk: "4+",
    bathrooms: 6,
    balconies: 4,
    carpetArea: 5400,
    floor: "Ground + 2 Floors",
    facing: "East",
    furnishing: "Fully Furnished",
    amenities: ["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Sofa Set", "Private Pool", "Golf Course Access", "24x7 Security"],
    price: 98000000,
    deposit: 0,
    maintenance: 18000,
    negotiable: "Yes",
    availableDate: "Immediate",
    preferredTenant: "Anyone",
    image: "/assets/villa.png",
    marketingTags: ["Private Pool", "Golf Course Facing", "Vastu Compliant", "Ultra Luxury"],
    marketingHighlights: "Private Pool, Golf Course Facing, Vastu Compliant, Ultra Luxury",
    aiDescription: "Palatial 5 BHK Luxury Golf Villa at Prestige Golfshire, Nandi Hills. Spans 5400 sq ft carpet area overlooking 18-hole championship golf greens. Comes with private temperature-controlled pool, jacuzzi, private elevator, and manicured lawns.",
    ownerName: "Devendra Jhunjhunwala",
    ownerPhone: "+91 99000 88776",
    ownerEmail: "devendra.j@jhunjhunwalacorp.com",
    assignedAgent: "Amit Kumar",
    views: 1490,
    clicks: 240,
    status: "Active",
    internalNotes: "Vastu audited by celebrity astrologer. Price includes lifetime golf club membership."
  }
];

const isAssignedToUser = (agentName: string, email: string) => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  const cleanName = agentName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanEmail = normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
  if (cleanEmail.includes(cleanName) || cleanName.includes(cleanEmail)) return true;
  
  const nameParts = agentName.toLowerCase().split(/\s+/).filter(p => p.length > 2);
  return nameParts.some(part => cleanEmail.includes(part));
};

const INITIAL_SHOWINGS: Showing[] = [
  {
    id: "show-1",
    listingId: "prop-2",
    propertyName: "4+ BHK Villa in Sobha Meadows",
    clientName: "Rajesh Mehta",
    clientPhone: "+91 98201 54321",
    clientEmail: "rajesh.mehta@outlook.com",
    showingDate: "2026-07-15",
    agentName: "Siddharth Sharma",
    status: "Offer Received",
    feedback: "Offered ₹4.2 Cr (asking ₹4.5 Cr). Under consideration."
  },
  {
    id: "show-2",
    listingId: "prop-1",
    propertyName: "3 BHK Apartment in Prestige Heights",
    clientName: "Priya Sen",
    clientPhone: "+91 98112 34567",
    clientEmail: "priya.sen@gmail.com",
    showingDate: "2026-07-18",
    agentName: "Amit Kumar",
    status: "Interested",
    feedback: "Liked the Vastu compliance. Negotiating security deposit terms."
  },
  {
    id: "show-3",
    listingId: "prop-3",
    propertyName: "Office at One Horizon Hub",
    clientName: "Vikram Malhotra",
    clientPhone: "+91 99300 98765",
    clientEmail: "vikram.malhotra@yahoo.com",
    showingDate: "2026-07-20",
    agentName: "Pooja Verma",
    status: "Follow-up",
    feedback: "Needs office fit-outs layout map. Next site visit scheduled for Friday."
  }
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: "offer-1",
    listingId: "prop-2",
    propertyName: "4+ BHK Villa in Sobha Meadows",
    clientName: "Rajesh Mehta",
    clientPhone: "+91 98201 54321",
    offeredPrice: 42000000,
    counterPrice: 43500000,
    tokenAmount: 500000,
    stage: "Counter Offer",
    updatedAt: "2026-07-19",
    notes: "Buyer initial offer ₹4.2 Cr. Seller countered at ₹4.35 Cr with ₹5 Lakh earnest deposit."
  },
  {
    id: "offer-2",
    listingId: "prop-1",
    propertyName: "3 BHK Apartment in Prestige Heights",
    clientName: "Priya Sen",
    clientPhone: "+91 98112 34567",
    offeredPrice: 42000,
    counterPrice: 45000,
    stage: "Offer Received",
    updatedAt: "2026-07-18",
    notes: "Tenant proposed ₹42,000/mo rent for 2 year lease term."
  },
  {
    id: "offer-3",
    listingId: "prop-3",
    propertyName: "Office Unit 304 at One Horizon Hub",
    clientName: "Vikram Malhotra",
    clientPhone: "+91 99300 98765",
    offeredPrice: 180000,
    tokenAmount: 540000,
    stage: "Token Received",
    updatedAt: "2026-07-21",
    notes: "3 months advance rent token paid. Lease agreement drafting in progress."
  }
];

const calculateMatchScore = (
  listing: Listing,
  criteria: {
    purpose: string;
    type: string;
    maxBudget: number | '';
    locality: string;
    bhk: string;
  }
): number => {
  let score = 0;
  let maxPossible = 0;

  maxPossible += 25;
  if (criteria.purpose === 'all' || listing.purpose === criteria.purpose) {
    score += 25;
  }

  maxPossible += 25;
  if (criteria.type === 'all' || listing.type === criteria.type) {
    score += 25;
  }

  maxPossible += 25;
  if (criteria.locality === 'all') {
    score += 25;
  } else if (listing.locality.toLowerCase().includes(criteria.locality.toLowerCase()) || listing.city.toLowerCase().includes(criteria.locality.toLowerCase())) {
    score += 25;
  } else {
    score += 5;
  }

  maxPossible += 25;
  if (criteria.bhk === 'all' || listing.bhk === criteria.bhk) {
    score += 25;
  }

  maxPossible += 25;
  if (!criteria.maxBudget || criteria.maxBudget === 0) {
    score += 25;
  } else if (listing.price <= Number(criteria.maxBudget)) {
    score += 25;
  } else if (listing.price <= Number(criteria.maxBudget) * 1.15) {
    score += 15;
  } else {
    score += 5;
  }

  return Math.round((score / maxPossible) * 100);
};

export default function App() {
  // Navigation & Core States
  const [activeSessionUser, setActiveSessionUser] = useState<{ email: string, role?: RoleType } | null>(null);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Derived activeRole from user session metadata
  const activeRole: RoleType = activeSessionUser?.role || 'consultant';
  
  const layoutModeState = useState<LayoutType>('grid');
  const layoutMode = layoutModeState[0];
  const setLayoutMode = layoutModeState[1];
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchVal, setSearchVal] = useState('');

  // Rate Calculator State
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcMode, setCalcMode] = useState<'rate' | 'price'>('rate');
  const [calcArea, setCalcArea] = useState('');
  const [calcPrice, setCalcPrice] = useState('');
  const [calcRate, setCalcRate] = useState('');

  // Showings & CRM States
  const [showings, setShowings] = useState<Showing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [crmSubTab, setCrmSubTab] = useState<'allocation' | 'showings' | 'matcher' | 'offers'>('allocation');
  const [isLogShowingOpen, setIsLogShowingOpen] = useState(false);
  const [isLogOfferOpen, setIsLogOfferOpen] = useState(false);

  // Form states for Logging Showing
  const [showingListingId, setShowingListingId] = useState('');
  const [showingClientName, setShowingClientName] = useState('');
  const [showingClientPhone, setShowingClientPhone] = useState('');
  const [showingClientEmail, setShowingClientEmail] = useState('');
  const [showingDate, setShowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [showingAgent, setShowingAgent] = useState('Amit Kumar');
  const [showingStatus, setShowingStatus] = useState<Showing['status']>('Interested');
  const [showingFeedback, setShowingFeedback] = useState('');

  // Form states for Logging Offer / Negotiation
  const [targetOfferListingId, setTargetOfferListingId] = useState('');
  const [offerClientName, setOfferClientName] = useState('');
  const [offerClientPhone, setOfferClientPhone] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [offerCounterPrice, setOfferCounterPrice] = useState<number | ''>('');
  const [offerTokenAmount, setOfferTokenAmount] = useState<number | ''>('');
  const [offerStage, setOfferStage] = useState<Offer['stage']>('Offer Received');
  const [offerNotes, setOfferNotes] = useState('');

  // Matcher criteria state for CRM Matcher tab
  const [matcherPurpose, setMatcherPurpose] = useState('all');
  const [matcherType, setMatcherType] = useState('all');
  const [matcherBudget, setMatcherBudget] = useState<number | ''>('');
  const [matcherLocality, setMatcherLocality] = useState('all');
  const [matcherBhk, setMatcherBhk] = useState('all');

  // Filters State
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterBhk, setFilterBhk] = useState('all');
  const [filterFurnishing, setFilterFurnishing] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Find Portal Detailed Filters States
  const [filterCity, setFilterCity] = useState('all');
  const [filterMinPrice, setFilterMinPrice] = useState<number | ''>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | ''>('');
  const [filterMinArea, setFilterMinArea] = useState<number | ''>('');
  const [filterMaxArea, setFilterMaxArea] = useState<number | ''>('');
  const [filterFacing, setFilterFacing] = useState('all');
  const [filterBathrooms, setFilterBathrooms] = useState<number | 'all'>('all');
  const [filterBalconies, setFilterBalconies] = useState<number | 'all'>('all');
  const [filterPreferredTenant, setFilterPreferredTenant] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [filterNegotiable, setFilterNegotiable] = useState('all');
  const [filterSelectedAmenities, setFilterSelectedAmenities] = useState<string[]>([]);

  // Connection diagnostics
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [imagekitClient, setImagekitClient] = useState<boolean>(false);

  // Detail Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingListingId, setViewingListingId] = useState<string | null>(null);

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard Form Fields (INR Defaults)
  const [wPurpose, setWPurpose] = useState<'Rent' | 'Sale'>('Rent');
  const [wType, setWType] = useState<PropertyType>('Apartment');
  const [wSociety, setWSociety] = useState('');
  const [wLocality, setWLocality] = useState('');
  const [wCity, setWCity] = useState('');
  const [wAddress, setWAddress] = useState('');
  const [wBhk, setWBhk] = useState('2');
  const [wBathrooms, setWBathrooms] = useState(2);
  const [wBalconies, setWBalconies] = useState(1);
  const [wCarpetArea, setWCarpetArea] = useState(1200);
  const [wFloorNum, setWFloorNum] = useState<number>(4);
  const [wTotalFloors, setWTotalFloors] = useState<number>(12);
  const [wFacing, setWFacing] = useState('East');
  const [wFurnishing, setWFurnishing] = useState('Semi-Furnished');
  const [wAmenities, setWAmenities] = useState<string[]>(["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Power Backup", "24x7 Security"]);
  const [wPrice, setWPrice] = useState(45000);
  const [wDeposit, setWDeposit] = useState(150000);
  const [wMaintenance, setWMaintenance] = useState(5000);
  const [wNegotiable, setWNegotiable] = useState<'Yes' | 'No'>('Yes');
  const [wAvailableDate, setWAvailableDate] = useState('2026-08-01');
  const [wPreferredTenant, setWPreferredTenant] = useState('Anyone');
  const [wImageSrc, setWImageSrc] = useState('/assets/apartment.png');
  const [wPhotos, setWPhotos] = useState<string[]>(['/assets/apartment.png']);
  const [wVideo, setWVideo] = useState<string>('https://assets.mixkit.co/videos/preview/mixkit-luxury-home-entrance-with-modern-lighting-42416-large.mp4');
  const [wHighlights, setWHighlights] = useState('Vastu Compliant, Newly Renovated');
  const [wAiDescription, setWAiDescription] = useState('');
  const [wOwnerName, setWOwnerName] = useState('Ramesh Prasad');
  const [wOwnerPhone, setWOwnerPhone] = useState('+91 98765 43210');
  const [wOwnerEmail, setWOwnerEmail] = useState('ramesh.prasad@gmail.com');
  const [wAgent, setWAgent] = useState('Amit Kumar');
  const [wStatus, setWStatus] = useState<'Active' | 'Negotiation' | 'Sold' | 'Rented' | 'Draft'>('Active');
  const [wBrokerNotes, setWBrokerNotes] = useState('');

  const [selectedTags, setSelectedTags] = useState<string[]>(['Vastu Compliant', 'Newly Renovated']);
  const [aiTone, setAiTone] = useState<ToneType>('luxury');
  const [uploadStatus, setUploadStatus] = useState('');

  // ----------------------------------------------------
  // INITIALIZATIONS
  // ----------------------------------------------------
  useEffect(() => {
    // Configure API Clients
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnon) {
      try {
        const client = createClient(supabaseUrl, supabaseAnon);
        setSupabaseClient(client);
        
        client.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            setActiveSessionUser({ 
              email: user.email || '', 
              role: (user.user_metadata?.role as RoleType) || 'consultant'
            });
          }
        });
      } catch (err) {
        console.warn("Supabase connection skipped:", err);
      }
    }

    const ikPublic = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
    const ikUrl = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    if (ikPublic && !ikPublic.includes('public_your_imagekit_public_key') && ikUrl && !ikUrl.includes('your_imagekit_id')) {
      setImagekitClient(true);
    }

    // Load mock user session
    const mockUser = localStorage.getItem('synex_mock_session');
    const mockRole = localStorage.getItem('synex_mock_role') as RoleType || 'consultant';
    if (mockUser) {
      setActiveSessionUser({ email: mockUser, role: mockRole });
    }
  }, []);

  // Fetch Database whenever session is active or Supabase is connected
  useEffect(() => {
    if (activeSessionUser) {
      loadDatabase();
    }
  }, [activeSessionUser, supabaseClient]);

  // Sync AI description template whenever step 5 inputs change
  useEffect(() => {
    if (isWizardOpen && wizardStep === 5) {
      generateAIDescription();
    }
  }, [wPurpose, wType, wBhk, wSociety, wLocality, wCity, wCarpetArea, wFacing, wPrice, wFurnishing, wAmenities, selectedTags, aiTone]);

  const loadDatabase = async () => {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('listings')
          .select(`
            id,
            property_type,
            transaction_type,
            listing_type,
            property_status,
            is_hot_property,
            lead_source,
            created_at,
            property_locations (
              address, building, wing, floor, total_floors, society, locality, city,
              latitude, longitude, google_maps_link, nearby_landmarks,
              metro_distance_meters, school_distance_meters, hospital_distance_meters, highway_distance_meters, airport_distance_meters
            ),
            property_specifications (
              bhk_size, carpet_area_sqft, built_up_area_sqft, super_built_up_area_sqft, plot_area_sqyd,
              balcony_count, balcony_area_sqft, terrace_area_sqft, garden_area_sqft, ceiling_height_feet,
              age_of_property_years, possession_status, facing_direction, entrance_direction,
              is_vastu_compliant, kitchen_direction, master_bedroom_direction
            ),
            financial_details (
              asking_price_inr, is_negotiable, minimum_closing_price_inr, token_amount_inr,
              brokerage_percentage, maintenance_charge_inr, maintenance_period, property_tax_annual_inr,
              society_transfer_charges_inr, parking_charge_one_time_inr, gst_applicable_percentage,
              estimated_rental_yield_percentage, expected_annual_appreciation_percentage,
              is_bank_loan_approved, approved_banks
            ),
            internal_crm_metadata (
              assigned_agent_id, assigned_freelancer_id, internal_notes, next_followup_date,
              priority, physical_key_location, last_physical_inspection_date, suitability_tags
            ),
            property_media (
              media_type, file_url, imagekit_file_id
            ),
            listing_owners (
              owners (
                id, name, primary_phone, secondary_phone, email, preferred_contact_time, current_city, owner_rating
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const list: Listing[] = data.map((item: any) => {
            const loc = item.property_locations || {};
            const specs = item.property_specifications || {};
            const fin = item.financial_details || {};
            const crm = item.internal_crm_metadata || {};
            const mediaList = item.property_media || [];
            const primaryMedia = mediaList.find((m: any) => m.media_type === 'Photo') || mediaList[0] || {};
            const mediaMapped = mediaList.map((m: any) => ({
              url: m.file_url,
              type: m.media_type === 'Video' ? 'Video' : 'Photo'
            }));
            
            const relations = item.listing_owners || [];
            const primaryOwnerRelation = relations[0] || {};
            const owner = primaryOwnerRelation.owners || {};
            return {
              id: item.id,
              purpose: item.transaction_type === 'Rent' ? 'Rent' : 'Sale',
              type: item.property_type,
              society: loc.society || '',
              locality: loc.locality || '',
              city: loc.city || '',
              address: loc.address || '',
              bhk: specs.bhk_size === 'N/A' ? 'N/A' : (specs.bhk_size ? specs.bhk_size.split(' ')[0] : '2'),
              bathrooms: specs.balcony_count || 2,
              balconies: specs.balcony_count || 1,
              carpetArea: specs.carpet_area_sqft || 0,
              floor: loc.floor ? `${loc.floor}th of ${loc.total_floors || 10} floors` : '4th floor',
              facing: specs.facing_direction || 'East',
              furnishing: 'Semi-Furnished',
              amenities: ['Power Backup', '24x7 Security'],
              price: Number(fin.asking_price_inr || 0),
              deposit: Number(fin.asking_price_inr ? fin.asking_price_inr * 2 : 0),
              maintenance: Number(fin.maintenance_charge_inr || 0),
              negotiable: fin.is_negotiable ? 'Yes' : 'No',
              availableDate: 'Immediate',
              preferredTenant: 'Families',
              image: primaryMedia.file_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
              media: mediaMapped,
              marketingTags: crm.suitability_tags || [],
              marketingHighlights: crm.suitability_tags ? crm.suitability_tags.join(', ') : '',
              aiDescription: item.ai_description || '',
              ownerName: owner.name || 'Ramesh Prasad',
              ownerPhone: owner.primary_phone || '+91 98765 43210',
              ownerEmail: owner.email || 'ramesh.prasad@gmail.com',
              assignedAgent: crm.assigned_agent_id || 'Amit Kumar',
              views: item.views || Math.floor(Math.random() * 200) + 120,
              clicks: item.clicks || Math.floor(Math.random() * 20) + 10,
              status: item.property_status === 'Under Negotiation' ? 'Negotiation' : item.property_status,
              internalNotes: crm.internal_notes || ''
            };
          });
          setListings(list);
        }

        // Load Showings from Supabase
        const { data: showingsData } = await supabaseClient
          .from('client_showings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (showingsData && showingsData.length > 0) {
          setShowings(showingsData.map((s: any) => ({
            id: s.id,
            listingId: s.listing_id,
            propertyName: s.property_name,
            clientName: s.client_name,
            clientPhone: s.client_phone,
            clientEmail: s.client_email || '',
            showingDate: s.showing_date,
            agentName: s.agent_name,
            status: s.status,
            feedback: s.feedback || ''
          })));
        }

        // Load Offers from Supabase
        const { data: offersData } = await supabaseClient
          .from('property_offers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (offersData && offersData.length > 0) {
          setOffers(offersData.map((o: any) => ({
            id: o.id,
            listingId: o.listing_id,
            propertyName: o.property_name,
            clientName: o.client_name,
            clientPhone: o.client_phone,
            offeredPrice: Number(o.offered_price),
            counterPrice: o.counter_price ? Number(o.counter_price) : undefined,
            tokenAmount: o.token_amount ? Number(o.token_amount) : undefined,
            stage: o.stage,
            updatedAt: o.updated_at || new Date().toISOString().split('T')[0],
            notes: o.notes || ''
          })));
        }

        return;
      } catch (err: any) {
        console.warn("Supabase fetch failed. Falling back to LocalStorage:", err.message);
      }
    }

    // Local Storage Loading
    const cached = localStorage.getItem('synex_listings');
    if (cached && JSON.parse(cached).length >= 10) {
      setListings(JSON.parse(cached));
    } else {
      setListings(INITIAL_DATABASE);
      localStorage.setItem('synex_listings', JSON.stringify(INITIAL_DATABASE));
    }

    // Showings Loading
    const cachedShowings = localStorage.getItem('synex_showings');
    if (cachedShowings) {
      setShowings(JSON.parse(cachedShowings));
    } else {
      setShowings(INITIAL_SHOWINGS);
      localStorage.setItem('synex_showings', JSON.stringify(INITIAL_SHOWINGS));
    }

    // Offers Loading
    const cachedOffers = localStorage.getItem('synex_offers');
    if (cachedOffers) {
      setOffers(JSON.parse(cachedOffers));
    } else {
      setOffers(INITIAL_OFFERS);
      localStorage.setItem('synex_offers', JSON.stringify(INITIAL_OFFERS));
    }
  };

  // ----------------------------------------------------
  // AUTH PROCEDURES
  // ----------------------------------------------------
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: emailInput,
          password: passwordInput
        });
        if (error) throw error;
        if (data.user) {
          setActiveSessionUser({ 
            email: data.user.email || emailInput,
            role: (data.user.user_metadata?.role as RoleType) || 'consultant'
          });
        }
        return;
      } catch (err: any) {
        setAuthError(err.message || "Auth request failed.");
        return;
      }
    }

    // Mock Login
    let mockRole: RoleType = 'consultant';
    if (emailInput.toLowerCase().includes('admin')) {
      mockRole = 'admin';
    }
    localStorage.setItem('synex_mock_session', emailInput);
    localStorage.setItem('synex_mock_role', mockRole);
    setActiveSessionUser({ email: emailInput, role: mockRole });
  };

  const handleSignOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('synex_mock_session');
    localStorage.removeItem('synex_mock_role');
    setActiveSessionUser(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // ----------------------------------------------------
  // METRICS & ANALYSIS PREDICTIONS
  // ----------------------------------------------------
  const visibleListings = listings.filter(p => {
    if (activeRole === 'admin') return true;
    return isAssignedToUser(p.assignedAgent, activeSessionUser?.email || '');
  });

  const formatPriceShort = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCommissionPotential = (p: Listing) => {
    if (p.purpose === 'Sale') {
      return (p.price || 0) * 0.02;
    }
    return p.price || 0; // 1 month's rent
  };

  const handleReassignAgent = async (listingId: string, newAgent: string) => {
    if (activeRole !== 'admin') {
      alert("Consultant profile has read-only access. Reassignment requires Admin privileges.");
      return;
    }

    const updatedListings = listings.map(l => l.id === listingId ? { ...l, assignedAgent: newAgent } : l);
    setListings(updatedListings);
    localStorage.setItem('synex_listings', JSON.stringify(updatedListings));

    if (supabaseClient) {
      try {
        await supabaseClient
          .from('internal_crm_metadata')
          .upsert({ listing_id: listingId, assigned_agent_id: newAgent });
      } catch (err) {
        console.warn("Supabase agent reassign error:", err);
      }
    }
  };

  const activeListingsCount = visibleListings.filter(p => p.status === 'Active').length;

  const salesPipelineValue = visibleListings
    .filter(p => p.purpose === 'Sale' && (p.status === 'Active' || p.status === 'Negotiation'))
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const monthlyRentalPipeline = visibleListings
    .filter(p => p.purpose === 'Rent' && (p.status === 'Active' || p.status === 'Negotiation'))
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const commissionPotential = visibleListings
    .filter(p => p.status === 'Active' || p.status === 'Negotiation')
    .reduce((sum, p) => sum + getCommissionPotential(p), 0);

  // ----------------------------------------------------
  // FILTER PROCEDURES
  // ----------------------------------------------------
  const filteredListings = visibleListings.filter(p => {
    const query = searchVal.toLowerCase();
    
    // Keyword search match (across society, locality, city, address, notes, tags)
    const matchSearch = !query || 
      p.locality.toLowerCase().includes(query) ||
      p.society.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      (p.internalNotes && p.internalNotes.toLowerCase().includes(query)) ||
      p.marketingTags?.some(t => t.toLowerCase().includes(query)) ||
      p.assignedAgent.toLowerCase().includes(query);

    if (!matchSearch) return false;

    // Filters conditions
    if (filterPurpose !== 'all' && p.purpose !== filterPurpose) return false;
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterBhk !== 'all' && p.bhk !== filterBhk) return false;
    if (filterFurnishing !== 'all' && p.furnishing !== filterFurnishing) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;

    // Extended Filters
    if (filterCity !== 'all' && p.city !== filterCity) return false;
    if (filterMinPrice !== '' && p.price < filterMinPrice) return false;
    if (filterMaxPrice !== '' && p.price > filterMaxPrice) return false;
    if (filterMinArea !== '' && p.carpetArea < filterMinArea) return false;
    if (filterMaxArea !== '' && p.carpetArea > filterMaxArea) return false;
    if (filterFacing !== 'all' && p.facing !== filterFacing) return false;
    if (filterBathrooms !== 'all' && p.bathrooms !== Number(filterBathrooms)) return false;
    if (filterBalconies !== 'all' && p.balconies !== Number(filterBalconies)) return false;
    if (filterPreferredTenant !== 'all' && p.preferredTenant !== filterPreferredTenant) return false;
    if (filterAgent !== 'all' && p.assignedAgent !== filterAgent) return false;
    if (filterNegotiable !== 'all' && p.negotiable !== filterNegotiable) return false;

    if (filterSelectedAmenities.length > 0) {
      const hasAllAm = filterSelectedAmenities.every(am => p.amenities?.includes(am));
      if (!hasAllAm) return false;
    }

    return true;
  });

  const resetAllFilters = () => {
    setSearchVal('');
    setFilterPurpose('all');
    setFilterType('all');
    setFilterBhk('all');
    setFilterFurnishing('all');
    setFilterStatus('all');
    setFilterCity('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterMinArea('');
    setFilterMaxArea('');
    setFilterFacing('all');
    setFilterBathrooms('all');
    setFilterBalconies('all');
    setFilterPreferredTenant('all');
    setFilterAgent('all');
    setFilterNegotiable('all');
    setFilterSelectedAmenities([]);
  };

  // ----------------------------------------------------
  // ONBOARDING WIZARD METHODS
  // ----------------------------------------------------
  const openNewWizard = () => {
    if (activeRole !== 'admin') {
      alert("Consultant profile has read-only access. You cannot onboard properties.");
      return;
    }
    setEditingListingId(null);
    setWPurpose('Rent');
    setWType('Apartment');
    setWSociety('');
    setWLocality('');
    setWCity('');
    setWAddress('');
    setWBhk('2');
    setWBathrooms(2);
    setWBalconies(1);
    setWCarpetArea(1200);
    setWFloorNum(4);
    setWTotalFloors(12);
    setWFacing('East');
    setWFurnishing('Semi-Furnished');
    setWAmenities(["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Power Backup", "24x7 Security"]);
    setWPrice(45000);
    setWDeposit(150000);
    setWMaintenance(5000);
    setWNegotiable('Yes');
    setWAvailableDate('2026-08-01');
    setWPreferredTenant('Anyone');
    setWImageSrc('/assets/apartment.png');
    setWPhotos(['/assets/apartment.png']);
    setWVideo('https://assets.mixkit.co/videos/preview/mixkit-luxury-home-entrance-with-modern-lighting-42416-large.mp4');
    setSelectedTags(['Vastu Compliant', 'Newly Renovated']);
    setWHighlights('Vastu Compliant, Newly Renovated');
    setWAiDescription('');
    setWOwnerName('Ramesh Prasad');
    setWOwnerPhone('+91 98765 43210');
    setWOwnerEmail('ramesh.prasad@gmail.com');
    setWAgent('Amit Kumar');
    setWStatus('Active');
    setWBrokerNotes('');
    setUploadStatus('');

    setIsWizardOpen(true);
    setWizardStep(1);
  };

  const handleEditClick = (id: string) => {
    if (activeRole !== 'admin') {
      alert("Consultant profile has read-only access. Editing is locked.");
      return;
    }
    const p = listings.find(l => l.id === id);
    if (!p) return;

    setEditingListingId(p.id);
    setWPurpose(p.purpose);
    setWType(p.type);
    setWSociety(p.society);
    setWLocality(p.locality);
    setWCity(p.city);
    setWAddress(p.address);
    setWBhk(p.bhk);
    setWBathrooms(p.bathrooms);
    setWBalconies(p.balconies);
    setWCarpetArea(p.carpetArea);
    setWFloorNum(p.floorNum || 4);
    setWTotalFloors(p.totalFloors || 12);
    setWFacing(p.facing);
    setWFurnishing(p.furnishing);
    setWAmenities(p.amenities || []);
    setWPrice(p.price);
    setWDeposit(p.deposit || 0);
    setWMaintenance(p.maintenance || 0);
    setWNegotiable(p.negotiable);
    setWAvailableDate(p.availableDate);
    setWPreferredTenant(p.preferredTenant);
    setWImageSrc(p.image);
    setWPhotos(p.media?.filter(m => m.type === 'Photo').map(m => m.url) || [p.image]);
    setWVideo(p.media?.find(m => m.type === 'Video')?.url || '');
    setSelectedTags(p.marketingTags || []);
    setWHighlights(p.marketingHighlights || '');
    setWAiDescription(p.aiDescription || '');
    setWOwnerName(p.ownerName);
    setWOwnerPhone(p.ownerPhone);
    setWOwnerEmail(p.ownerEmail || '');
    setWAgent(p.assignedAgent);
    setWStatus(p.status);
    setWBrokerNotes(p.internalNotes || '');
    setUploadStatus('');

    setIsDrawerOpen(false);
    setIsWizardOpen(true);
    setWizardStep(1);
  };

  const toggleAmenity = (val: string) => {
    if (wAmenities.includes(val)) {
      setWAmenities(wAmenities.filter(a => a !== val));
    } else {
      setWAmenities([...wAmenities, val]);
    }
  };

  const handleFloorNumChange = (val: string) => {
    const f = parseInt(val);
    setWFloorNum(f);
    if (f > wTotalFloors) {
      setWTotalFloors(f);
    }
  };

  const handleTotalFloorsChange = (val: string) => {
    const tf = parseInt(val);
    setWTotalFloors(tf);
    if (tf < wFloorNum) {
      setWFloorNum(tf);
    }
  };

  const toggleMarketingTag = (tag: string) => {
    let updated;
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter(t => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    setSelectedTags(updated);
    setWHighlights(updated.join(', '));
  };

  const generateAIDescription = () => {
    const tagsStr = selectedTags.length > 0 ? selectedTags.join(' • ') : '';
    const amenitiesStr = wAmenities.length > 0 ? wAmenities.join(', ') : 'standard facilities';
    const formattedPrice = formatCurrency(wPrice);

    let text = "";
    if (aiTone === 'luxury') {
      text = `Nestled in the premium corridors of ${wSociety || '[Society Name]'}, ${wLocality || '[Locality]'}, ${wCity || '[City]'}, this exquisite ${wBhk === 'N/A' ? '' : wBhk + ' BHK '}${wType} represents the peak of high-end living. Spanning an expansive ${wCarpetArea} sq.ft of carpet space with optimal ${wFacing}-facing solar alignment, the custom home comes ${wFurnishing.toLowerCase()} with curated fixtures. Special highlights include: ${tagsStr || 'Premium styling'}. Equipped with ${amenitiesStr}. Asking rent/price at ${formattedPrice}. Ready to move in.`;
    } else if (aiTone === 'professional') {
      text = `INTERNAL MEMORANDUM & EXCLUSIVE LISTING: Verified ${wBhk === 'N/A' ? '' : wBhk + ' BHK '}${wType} property located at ${wSociety || '[Society Name]'}, ${wLocality || '[Locality]'}, ${wCity || '[City]'}. Net Carpet area: ${wCarpetArea} sq.ft. Vastu Facing: ${wFacing}. Furnishing: ${wFurnishing}. Fully serviced building featuring ${amenitiesStr}. Market analysis indicates a high demand node with rental/sale tag of ${formattedPrice}. Highly recommended for immediate viewing. Assigned Brokerage Terms: ${tagsStr || 'N/A'}.`;
    } else {
      text = `HOT INVENTORY! Gorgeous ${wBhk === 'N/A' ? '' : wBhk + ' BHK '}${wType} in ${wSociety || '[Society Name]'}, ${wLocality || '[Locality]'} is up for ${wPurpose.toLowerCase()}! Super close to landmarks. ${wFurnishing} with ${amenitiesStr}. Offers a rare ${wFacing} orientation, ${wCarpetArea} sqft carpet area. Listed at just ${formattedPrice}! High interest - won't last on the market. Call today for priority lock-in!`;
    }
    setWAiDescription(text);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus("Uploading to ImageKit...");
    try {
      const ikPublic = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
      const ikUrl = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
      const ikPrivate = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;

      if (!ikPublic || !ikUrl || !ikPrivate) {
        throw new Error("Missing ImageKit credentials in .env!");
      }

      const uploadedUrls: string[] = [];
      setUploadStatus(`Uploading ${files.length} file(s) to ImageKit...`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        setUploadStatus(`Uploading file ${i + 1} of ${files.length}: ${file.name}...`);

        // Create authentication params
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expire = Math.floor(Date.now() / 1000) + 1800; // 30 mins validity

        // Compute HMAC-SHA1 signature client-side using browser SubtleCrypto API
        const message = token + expire;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(ikPrivate);
        const messageData = encoder.encode(message);

        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: "SHA-1" },
          false,
          ["sign"]
        );

        const signatureBuffer = await window.crypto.subtle.sign(
          "HMAC",
          cryptoKey,
          messageData
        );

        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const signature = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");

        // Read file buffer as Base64 to construct standard POST body
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = (event.target?.result as string).split(',')[1];
            resolve(result);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        const bodyData = new URLSearchParams();
        bodyData.append('file', base64);
        bodyData.append('fileName', file.name);
        bodyData.append('publicKey', ikPublic);
        bodyData.append('signature', signature);
        bodyData.append('token', token);
        bodyData.append('expire', expire.toString());

        const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyData.toString()
        });

        if (!res.ok) {
          const errTxt = await res.text();
          throw new Error(`Upload failed: ${errTxt}`);
        }

        const result = await res.json();
        
        if (isVideo) {
          setWVideo(result.url);
        } else {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setWPhotos(prev => {
          const baseList = prev.filter(p => !p.startsWith('/assets/')); // clean presets if uploading custom
          return [...baseList, ...uploadedUrls];
        });
        setWImageSrc(uploadedUrls[0]);
      }
      setUploadStatus("🟢 Media Upload Complete!");
    } catch (err: any) {
      console.error(err);
      setUploadStatus("❌ Upload failed: " + err.message);
    }
  };

  const handleNextStep = () => {
    // Validation
    if (wizardStep === 1) {
      if (!wSociety || !wLocality || !wCity || !wAddress) {
        alert("Please fill in all required fields.");
        return;
      }
    }
    if (wizardStep < 6) {
      setWizardStep(wizardStep + 1);
    } else {
      handleSubmitWizard();
    }
  };

  const handleSubmitWizard = async () => {
    if (activeRole !== 'admin') {
      alert("Consultant profile has read-only access. You cannot submit listings.");
      return;
    }
    const id = editingListingId || `prop-${Date.now()}`;
    const oldItem = listings.find(l => l.id === id);
    const views = oldItem ? oldItem.views : Math.floor(Math.random() * 150) + 10;
    const clicks = oldItem ? oldItem.clicks : Math.floor(views * 0.12) + 2;

    const property: Listing = {
      id,
      purpose: wPurpose,
      type: wType,
      society: wSociety,
      locality: wLocality,
      city: wCity,
      address: wAddress,
      bhk: wBhk,
      bathrooms: wBathrooms,
      balconies: wBalconies,
      carpetArea: wCarpetArea,
      floor: `${wFloorNum}th of ${wTotalFloors} floors`,
      floorNum: wFloorNum,
      totalFloors: wTotalFloors,
      facing: wFacing,
      furnishing: wFurnishing,
      amenities: wAmenities,
      price: wPrice,
      deposit: wDeposit,
      maintenance: wMaintenance,
      negotiable: wNegotiable,
      availableDate: wAvailableDate,
      preferredTenant: wPreferredTenant,
      image: wImageSrc,
      marketingTags: selectedTags,
      marketingHighlights: wHighlights,
      aiDescription: wAiDescription,
      ownerName: wOwnerName,
      ownerPhone: wOwnerPhone,
      ownerEmail: wOwnerEmail,
      assignedAgent: wAgent,
      views,
      clicks,
      status: wStatus,
      internalNotes: wBrokerNotes
    };

    if (supabaseClient) {
      try {
        // 1. Upsert listings
        const { error: listErr } = await supabaseClient.from('listings').upsert({
          id: property.id,
          property_type: property.type,
          transaction_type: property.purpose,
          listing_type: 'Exclusive',
          property_status: property.status === 'Negotiation' ? 'Under Negotiation' : property.status,
          lead_source: 'Direct Call'
        });
        if (listErr) throw listErr;

        // 2. Upsert locations
        const { error: locErr } = await supabaseClient.from('property_locations').upsert({
          listing_id: property.id,
          address: property.address,
          building: property.society,
          society: property.society,
          locality: property.locality,
          city: property.city,
          floor: wFloorNum,
          total_floors: wTotalFloors
        });
        if (locErr) throw locErr;

        // 3. Upsert specs
        const { error: specErr } = await supabaseClient.from('property_specifications').upsert({
          listing_id: property.id,
          bhk_size: property.bhk === 'N/A' ? 'N/A' : `${property.bhk} BHK` as any,
          carpet_area_sqft: property.carpetArea,
          possession_status: 'Ready to Move',
          facing_direction: property.facing as any
        });
        if (specErr) throw specErr;

        // 4. Upsert financials
        const { error: finErr } = await supabaseClient.from('financial_details').upsert({
          listing_id: property.id,
          asking_price_inr: property.price,
          is_negotiable: property.negotiable === 'Yes',
          token_amount_inr: property.deposit,
          maintenance_charge_inr: property.maintenance
        });
        if (finErr) throw finErr;

        // 5. Upsert owner
        const { data: linkData } = await supabaseClient
          .from('listing_owners')
          .select('owner_id')
          .eq('listing_id', property.id);

        let ownerId;
        if (linkData && linkData.length > 0) {
          ownerId = linkData[0].owner_id;
          await supabaseClient.from('owners').update({
            name: property.ownerName,
            primary_phone: property.ownerPhone,
            email: property.ownerEmail
          }).eq('id', ownerId);
        } else {
          const { data: newOwner, error: ownerErr } = await supabaseClient.from('owners').insert({
            name: property.ownerName,
            primary_phone: property.ownerPhone,
            email: property.ownerEmail
          }).select();
          if (ownerErr) throw ownerErr;
          ownerId = newOwner[0].id;

          await supabaseClient.from('listing_owners').insert({
            listing_id: property.id,
            owner_id: ownerId
          });
        }

        // 6. Upsert metadata
        const { error: crmErr } = await supabaseClient.from('internal_crm_metadata').upsert({
          listing_id: property.id,
          internal_notes: property.internalNotes,
          suitability_tags: property.marketingTags
        });
        if (crmErr) throw crmErr;

        // 7. Upsert media
        await supabaseClient.from('property_media').delete().eq('listing_id', property.id);
        const mediaInserts = [
          ...wPhotos.map(url => ({
            listing_id: property.id,
            media_type: 'Photo',
            file_url: url
          })),
          ...(wVideo ? [{
            listing_id: property.id,
            media_type: 'Video',
            file_url: wVideo
          }] : [])
        ];
        if (mediaInserts.length > 0) {
          const { error: mediaErr } = await supabaseClient.from('property_media').insert(mediaInserts);
          if (mediaErr) throw mediaErr;
        }

        console.log("Relational database upsert completed successfully.");
      } catch (err: any) {
        console.warn("Supabase upsert failed, saving locally:", err.message);
      }
    }

    const updated = [...listings];
    const index = updated.findIndex(l => l.id === id);
    if (index !== -1) {
      updated[index] = property;
    } else {
      updated.push(property);
    }

    setListings(updated);
    localStorage.setItem('synex_listings', JSON.stringify(updated));
    setIsWizardOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (activeRole !== 'admin') {
      alert("Consultant profile has read-only access. Deleting is locked.");
      return;
    }
    const confirmation = window.confirm("Are you sure you want to delete this property? This action is permanent.");
    if (!confirmation) return;

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('listings')
          .delete()
          .eq('id', id);
        if (error) throw error;
        console.log("Deleted listing from Supabase.");
      } catch (err: any) {
        console.warn("Supabase delete failed:", err.message);
      }
    }

    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    localStorage.setItem('synex_listings', JSON.stringify(updated));
    setIsDrawerOpen(false);
  };

  // Indian Rupee formatting (en-IN)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // ----------------------------------------------------
  // AUTH SHIELD RENDER
  // ----------------------------------------------------
  if (!activeSessionUser) {
    return (
      <div 
        className="relative w-screen h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(15, 35, 29, 0.35) 0%, rgba(24, 59, 50, 0.25) 50%, rgba(10, 25, 20, 0.45) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')` 
        }}
      >
        {/* Subtle Ambient Glow Blobs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brass/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-forest/30 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Glassmorphic Login Card */}
        <div className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/30 animate-scale-up">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-forest" />
            <span className="text-[9px] font-bold tracking-widest text-forest uppercase">Internal Broker Portal</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-forest font-light tracking-wide mb-0.5">Synex Realty</h2>
          <p className="text-slate-600 text-xs mb-5">Enter credentials to access the inventory catalog.</p>

          {authError && (
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs mb-4 font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-forest">Email Address</label>
              <input 
                type="email" 
                className="w-full px-3.5 py-2 border border-white/80 rounded-lg focus:border-forest text-xs bg-white/70 focus:bg-white text-forest placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest/20 backdrop-blur-sm transition-all"
                placeholder="e.g. broker@synex.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-forest">Password</label>
              <input 
                type="password" 
                className="w-full px-3.5 py-2 border border-white/80 rounded-lg focus:border-forest text-xs bg-white/70 focus:bg-white text-forest placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest/20 backdrop-blur-sm transition-all"
                placeholder="••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-forest hover:bg-forest-light text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-widest shadow-md shadow-forest/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-1"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-white/40 text-center">
            <p className="text-[10px] text-slate-600">
              Need access? Contact administrator at <span className="font-semibold text-forest">admin@synex.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED-IN RENDER
  // ----------------------------------------------------
  return (
    <div className="flex h-screen h-[100dvh] w-screen w-full bg-pastel-bg overflow-hidden">
      
      {/* Sidebar Navigation - EXACTLY 3 OPTIONS IN ORDER */}
      {/* Mobile Backdrop overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-pastel-sidebar border-r border-slate-200/80 flex flex-col p-6 shrink-0 z-50 transition-transform duration-300 transform lg:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ paddingTop: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-top, 0px)))' }}
      >
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-forest" />
            <h1 className="font-display text-lg tracking-wider font-semibold text-forest">Synex Realty</h1>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-forest focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-1.5">
          <li className={`rounded-md ${activeTab === 'dashboard' ? 'bg-white font-semibold text-forest shadow-sm' : 'text-slate-400 hover:bg-white/40'}`}>
            <button onClick={() => switchTab('dashboard')} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-left">
              <LayoutDashboard className="w-4 h-4 text-forest shrink-0" />
              <span>Dashboard</span>
            </button>
          </li>
          <li className={`rounded-md ${activeTab === 'inventory' ? 'bg-white font-semibold text-forest shadow-sm' : 'text-slate-400 hover:bg-white/40'}`}>
            <button onClick={() => switchTab('inventory')} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-left">
              <Briefcase className="w-4 h-4 text-forest shrink-0" />
              <span>Inventory</span>
            </button>
          </li>
          <li className={`rounded-md ${activeTab === 'find' ? 'bg-white font-semibold text-forest shadow-sm' : 'text-slate-400 hover:bg-white/40'}`}>
            <button onClick={() => switchTab('find')} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-left">
              <Search className="w-4 h-4 text-forest shrink-0" />
              <span>Find Property</span>
            </button>
          </li>
          <li className={`rounded-md ${activeTab === 'crm' ? 'bg-white font-semibold text-forest shadow-sm' : 'text-slate-400 hover:bg-white/40'}`}>
            <button onClick={() => switchTab('crm')} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-left">
              <Users className="w-4 h-4 text-forest shrink-0" />
              <span>CRM Portal</span>
            </button>
          </li>
          {activeRole === 'admin' && (
            <li className={`rounded-md text-slate-400 hover:bg-white/40`}>
              <button onClick={() => { openNewWizard(); setIsMobileSidebarOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-left">
                <Plus className="w-4 h-4 text-forest shrink-0" />
                <span>Add Property</span>
              </button>
            </li>
          )}
        </ul>


        {/* Sidebar Footer Account Registry */}
        <div className="mt-auto border-t border-slate-200/80 pt-4">
          <div className="flex items-center gap-2.5 text-xs text-forest mb-3 pl-2 max-w-full overflow-hidden">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate font-semibold">{activeSessionUser.email}</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full bg-pastel-red text-red-800 border border-red-200/80 py-2.5 rounded-lg text-xs font-semibold hover:bg-red-200/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-grow flex flex-col overflow-y-auto bg-pastel-bg">
        
        {/* Topbar — burger left | brand center | spacer right */}
        <header 
          className="flex items-center justify-between px-4 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shrink-0"
          style={{ paddingTop: 'max(1rem, calc(1rem + env(safe-area-inset-top, 0px)))' }}
        >
          {/* Left: hamburger (mobile only) */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors lg:invisible"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-forest" />
          </button>

          {/* Centre: brand name */}
          <span className="font-display text-base font-semibold tracking-widest text-forest uppercase absolute left-1/2 -translate-x-1/2">
            Synex Realty
          </span>

          {/* Right: invisible spacer to keep title centred */}
          <div className="w-9 h-9" />
        </header>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 lg:p-10 flex-grow">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-4xl text-forest mb-1 font-light">Dashboard</h2>
              <p className="text-slate-400 text-xs mb-8">Overview of your agency's performance.</p>

              {/* Metrics Grid Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white border border-slate-200/80 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    <span>Active Listings</span>
                    <Home className="w-4 h-4 text-forest" />
                  </div>
                  <div className="font-serif text-4xl text-forest font-light mb-1">{activeListingsCount}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {visibleListings.filter(p => p.purpose === 'Sale' && p.status === 'Active').length} Sale • {visibleListings.filter(p => p.purpose === 'Rent' && p.status === 'Active').length} Rent
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    <span>Sales Pipeline Value</span>
                    <TrendingUp className="w-4 h-4 text-forest" />
                  </div>
                  <div className="font-serif text-4xl text-forest font-light mb-1">{formatPriceShort(salesPipelineValue)}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {visibleListings.filter(p => p.purpose === 'Sale' && (p.status === 'Active' || p.status === 'Negotiation')).length} properties in pipeline
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    <span>Monthly Rental Pipeline</span>
                    <DollarSign className="w-4 h-4 text-forest" />
                  </div>
                  <div className="font-serif text-4xl text-forest font-light mb-1">{formatPriceShort(monthlyRentalPipeline)}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {visibleListings.filter(p => p.purpose === 'Rent' && (p.status === 'Active' || p.status === 'Negotiation')).length} properties in pipeline
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    <span>Commission Potential</span>
                    <Percent className="w-4 h-4 text-forest" />
                  </div>
                  <div className="font-serif text-4xl text-brass font-light mb-1">{formatPriceShort(commissionPotential)}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Est. 2% Sale / 1mo Rent</div>
                </div>
              </div>

              {/* Pipeline & Commission Summary */}
              <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 font-serif text-xl font-medium text-forest">
                  Pipeline & Commission Summary
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4">Property</th>
                        <th className="px-6 py-4">Type & Purpose</th>
                        <th className="px-6 py-4 text-right">Asking Price</th>
                        <th className="px-6 py-4 text-right">Est. Commission</th>
                        <th className="px-6 py-4 text-right">Agent & Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...visibleListings]
                        .sort((a, b) => getCommissionPotential(b) - getCommissionPotential(a))
                        .map(p => {
                          const commission = getCommissionPotential(p);
                          return (
                            <tr key={p.id} onClick={() => triggerListingDrawer(p.id)} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img className="w-11 h-11 rounded object-cover border border-slate-200" src={p.image} alt="Thumbnail" />
                                  <div>
                                    <span className="font-semibold text-forest text-sm">{p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}</span>
                                    <div className="text-[11px] text-slate-400">{p.locality}, {p.city}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col items-start gap-1">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    p.purpose === 'Sale' ? 'bg-pastel-blue text-blue-800' : 'bg-pastel-lavender text-purple-800'
                                  }`}>
                                    {p.purpose}
                                  </span>
                                  <span className="text-[11px] text-slate-400">{p.type}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="font-serif text-base text-forest font-semibold">
                                  {formatPriceShort(p.price)}{p.purpose === 'Rent' && ' /mo'}
                                </span>
                                <div className="text-[11px] text-slate-400">
                                  {p.purpose === 'Rent' ? `Deposit: ${formatPriceShort(p.deposit)}` : `Negotiable: ${p.negotiable}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="font-serif text-base text-brass font-semibold">
                                  {formatPriceShort(commission)}
                                </span>
                                <div className="text-[11px] text-slate-400">
                                  {p.purpose === 'Sale' ? '2% of asking' : '1 month rent'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-xs text-slate-500 font-medium">{p.assignedAgent}</span>
                                <div className="mt-1">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    p.status === 'Active' ? 'bg-pastel-mint text-forest' : 
                                    p.status === 'Negotiation' ? 'bg-pastel-gold text-amber-800' : 
                                    p.status === 'Sold' ? 'bg-slate-200 text-slate-600' : 
                                    p.status === 'Rented' ? 'bg-slate-200 text-slate-600' : 
                                    'bg-pastel-peach text-red-800'
                                  }`}>
                                    {p.status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY REGISTRY (RAW VIEWS ONLY) */}
          {activeTab === 'inventory' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-4xl text-forest font-light">Inventory Registry</h2>
                
                <div className="flex bg-slate-200 p-0.5 rounded-md border border-slate-200/50">
                  <button 
                    onClick={() => setLayoutMode('grid')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${layoutMode === 'grid' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setLayoutMode('list')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${layoutMode === 'list' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Grid Mode Layout */}
              {layoutMode === 'grid' && visibleListings.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {visibleListings.map(p => {
                    const agentInitials = p.assignedAgent ? p.assignedAgent.split(' ').map(n=>n[0]).join('') : 'U';
                    const priceLabel = p.purpose === 'Rent' ? '/ m' : '';
                    return (
                      <div key={p.id} onClick={() => triggerListingDrawer(p.id)} className="bg-white border border-slate-200 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brass/30 transition-all flex flex-col">
                        <div className="h-28 sm:h-36 md:h-48 relative overflow-hidden shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" alt="Image" />
                          <span className="absolute top-1.5 left-1.5 md:top-3 md:left-3 text-[7px] md:text-[9px] font-bold px-1 md:px-2 py-0.5 rounded text-white bg-forest uppercase tracking-wider">
                            {p.status === 'Negotiation' ? 'Offer' : p.status}
                          </span>
                          <span className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-white/95 border border-slate-200 text-forest font-bold text-[7px] md:text-[9px] px-1 md:px-2 py-0.5 rounded uppercase tracking-wider">
                            {p.type.substring(0,5)} • {p.purpose}
                          </span>
                        </div>
                        <div className="p-3 md:p-5 flex-grow flex flex-col">
                          <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5 md:mb-1">{p.locality.substring(0, 15)}, {p.city}</span>
                          <h3 className="font-serif text-xs sm:text-sm md:text-xl text-forest font-medium leading-snug mb-1.5 md:mb-3 line-clamp-2 h-8 md:h-14">
                            {p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 md:gap-4 text-[8px] sm:text-[10px] md:text-xs text-slate-400 mb-2 md:mb-4">
                            <span className="flex items-center gap-0.5"><Compass className="w-3 h-3 shrink-0" /> {p.carpetArea} sqft</span>
                            <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3 shrink-0" /> {p.facing.substring(0,5)}</span>
                            <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 shrink-0" /> {p.furnishing.split('-')[0].split(' ')[0]}</span>
                          </div>
                          <div className="font-serif text-sm sm:text-base md:text-2xl text-forest font-semibold mt-auto flex items-baseline gap-0.5">
                            {formatCurrency(p.price)} <span className="font-sans text-[8px] md:text-[11px] font-medium text-slate-400">{priceLabel}</span>
                          </div>
                          <div className="border-t border-slate-100 pt-1.5 md:pt-3 mt-2 md:mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 md:w-6 h-6 rounded-full bg-pastel-sidebar flex items-center justify-center text-[7px] md:text-[9px] font-bold text-forest">{agentInitials}</span>
                              <span className="text-[9px] md:text-xs text-slate-500 font-medium hidden sm:inline">{p.assignedAgent}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List Mode Layout */}
              {layoutMode === 'list' && visibleListings.length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4">Property</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Locality</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Broker</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleListings.map(p => {
                        const priceLabel = p.purpose === 'Rent' ? '/ month' : '';
                        return (
                          <tr key={p.id} onClick={() => triggerListingDrawer(p.id)} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={p.image} className="w-10 h-10 rounded object-cover border border-slate-200" alt="Thumb" />
                                <div>
                                  <span className="font-semibold text-forest text-sm">{p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}</span>
                                  <div className="text-[11px] text-slate-400">{p.address}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-500">{p.type} ({p.purpose})</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-500">{p.locality}</td>
                            <td className="px-6 py-4 font-serif text-base text-forest font-semibold">
                              {formatCurrency(p.price)} <span className="font-sans text-[10px] text-slate-400">{priceLabel}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{p.assignedAgent}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                p.status === 'Active' ? 'bg-pastel-mint text-forest' : 
                                p.status === 'Negotiation' ? 'bg-pastel-gold text-amber-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="bg-pastel-sidebar border border-slate-200/50 px-3 py-1.5 rounded text-[10px] font-semibold text-forest uppercase tracking-wider hover:bg-white" onClick={(e) => { e.stopPropagation(); triggerListingDrawer(p.id); }}>
                                View CRM
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FIND PROPERTY (FULL-WIDTH + RIGHT FILTER DRAWER) */}
          {activeTab === 'find' && (
            <div className="animate-fade-in flex flex-col h-full gap-4">

              {/* Filter Drawer Backdrop */}
              {isFilterDrawerOpen && (
                <div
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="fixed inset-0 bg-black/40 z-30"
                />
              )}

              {/* Right Filter Drawer */}
              <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col transition-transform duration-300 ${
                isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 shrink-0">
                  <span className="font-serif text-lg font-medium text-forest">Filter Parameters</span>
                  <div className="flex items-center gap-3">
                    <button onClick={resetAllFilters} className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wider">Reset All</button>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="text-slate-400 hover:text-forest">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-5 space-y-5 scrollbar-thin">

                  {/* 1. Basics */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">1. Property Basics</div>
                    <CustomSelect label="Purpose" value={filterPurpose} onChange={setFilterPurpose} options={[
                      { label: "All Purposes", value: "all" },
                      { label: "For Rent", value: "Rent" },
                      { label: "For Sale", value: "Sale" }
                    ]} />
                    <CustomSelect label="Category" value={filterType} onChange={setFilterType} options={[
                      { label: "All Categories", value: "all" },
                      { label: "Apartment", value: "Apartment" },
                      { label: "Villa / Ind. House", value: "Villa" },
                      { label: "Penthouse Suite", value: "Penthouse" },
                      { label: "Commercial Office", value: "Office" }
                    ]} />
                    <CustomSelect label="BHK Configuration" value={filterBhk} onChange={setFilterBhk} options={[
                      { label: "Any BHK Size", value: "all" },
                      { label: "1 BHK", value: "1" },
                      { label: "2 BHK", value: "2" },
                      { label: "3 BHK", value: "3" },
                      { label: "4+ BHK", value: "4+" },
                      { label: "Commercial / NA", value: "N/A" }
                    ]} />
                    <CustomSelect label="City Locations" value={filterCity} onChange={setFilterCity} options={[
                      { label: "All Cities", value: "all" },
                      { label: "Mumbai", value: "Mumbai" },
                      { label: "Bangalore", value: "Bangalore" },
                      { label: "Delhi NCR", value: "Delhi NCR" },
                      { label: "Pune", value: "Pune" },
                      { label: "Hyderabad", value: "Hyderabad" },
                      { label: "Chennai", value: "Chennai" }
                    ]} />
                  </div>



                  {/* 2. Specifications */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">2. Specifications</div>
                    
                    <CustomSelect 
                      label="Facing Facade"
                      value={filterFacing}
                      onChange={setFilterFacing}
                      options={[
                        { label: "Any Facing", value: "all" },
                        { label: "East", value: "East" },
                        { label: "West", value: "West" },
                        { label: "North", value: "North" },
                        { label: "South", value: "South" },
                        { label: "North-East", value: "North-East" },
                        { label: "South-West", value: "South-West" }
                      ]}
                    />

                    <CustomSelect 
                      label="Furnishing Status"
                      value={filterFurnishing}
                      onChange={setFilterFurnishing}
                      options={[
                        { label: "Any Furnishing", value: "all" },
                        { label: "Fully Furnished", value: "Fully Furnished" },
                        { label: "Semi-Furnished", value: "Semi-Furnished" },
                        { label: "Unfurnished", value: "Unfurnished" }
                      ]}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <CustomSelect 
                        label="Bathrooms"
                        value={String(filterBathrooms)}
                        onChange={val => setFilterBathrooms(val === 'all' ? 'all' : parseInt(val))}
                        options={[
                          { label: "Any", value: "all" },
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4", value: "4" },
                          { label: "5+", value: "5" }
                        ]}
                      />
                      <CustomSelect 
                        label="Balconies"
                        value={String(filterBalconies)}
                        onChange={val => setFilterBalconies(val === 'all' ? 'all' : parseInt(val))}
                        options={[
                          { label: "Any", value: "all" },
                          { label: "0", value: "0" },
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4+", value: "4" }
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Min Area (sqft)</label>
                        <input 
                          type="number" 
                          value={filterMinArea} 
                          onChange={e => setFilterMinArea(e.target.value === '' ? '' : parseInt(e.target.value))} 
                          className="px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:border-forest"
                          placeholder="e.g. 800"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Max Area (sqft)</label>
                        <input 
                          type="number" 
                          value={filterMaxArea} 
                          onChange={e => setFilterMaxArea(e.target.value === '' ? '' : parseInt(e.target.value))} 
                          className="px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:border-forest"
                          placeholder="e.g. 5000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Budget Limits */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">3. Budget limits</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Min Price (₹)</label>
                        <input 
                          type="number" 
                          value={filterMinPrice} 
                          onChange={e => setFilterMinPrice(e.target.value === '' ? '' : parseInt(e.target.value))} 
                          className="px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:border-forest"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Max Price (₹)</label>
                        <input 
                          type="number" 
                          value={filterMaxPrice} 
                          onChange={e => setFilterMaxPrice(e.target.value === '' ? '' : parseInt(e.target.value))} 
                          className="px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:border-forest"
                          placeholder="50Cr"
                        />
                      </div>
                    </div>

                    <CustomSelect 
                      label="Negotiable Price"
                      value={filterNegotiable}
                      onChange={setFilterNegotiable}
                      options={[
                        { label: "Any Negotiability", value: "all" },
                        { label: "Negotiable", value: "Yes" },
                        { label: "Fixed Asking", value: "No" }
                      ]}
                    />

                    <CustomSelect 
                      label="Tenant Category"
                      value={filterPreferredTenant}
                      onChange={setFilterPreferredTenant}
                      options={[
                        { label: "Any Tenant Group", value: "all" },
                        { label: "Family", value: "Families" },
                        { label: "Bachelors", value: "Bachelors" },
                        { label: "Corporate Entity", value: "Corporate Lease" }
                      ]}
                    />
                  </div>

                  {/* 4. CRM Registry Parameters */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">4. Broker CRM Metadata</div>
                    <CustomSelect 
                      label="Assigned Agent"
                      value={filterAgent}
                      onChange={setFilterAgent}
                      options={[
                        { label: "Any Agent", value: "all" },
                        { label: "Amit Kumar (Admin)", value: "Amit Kumar" },
                        { label: "Siddharth Sharma (Broker)", value: "Siddharth Sharma" },
                        { label: "Pooja Verma (Broker)", value: "Pooja Verma" }
                      ]}
                    />
                    <CustomSelect 
                      label="Listing Registry Status"
                      value={filterStatus}
                      onChange={setFilterStatus}
                      options={[
                        { label: "Any Status", value: "all" },
                        { label: "Active Catalog", value: "Active" },
                        { label: "Under Offer", value: "Negotiation" },
                        { label: "Sold", value: "Sold" },
                        { label: "Rented", value: "Rented" },
                        { label: "Draft", value: "Draft" }
                      ]}
                    />
                  </div>

                  {/* 5. Required Amenities */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Amenities</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Air Conditioning", "Power Backup", "Modular Kitchen", "24x7 Security", "Geysers", "Wardrobes"].map(am => {
                        const active = filterSelectedAmenities.includes(am);
                        return (
                          <button
                            type="button"
                            key={am}
                            onClick={() => {
                              if (active) {
                                setFilterSelectedAmenities(prev => prev.filter(a => a !== am));
                              } else {
                                setFilterSelectedAmenities(prev => [...prev, am]);
                              }
                            }}
                            className={`px-2 py-1 border rounded text-[9px] font-semibold text-center transition-all ${
                              active ? 'bg-pastel-mint border-forest text-forest font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {am}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              {/* END Filter Drawer */}

              {/* Page Header Row */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0 mb-4">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-forest font-light">Find Property</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Browse and filter the listings database.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex bg-slate-200 p-0.5 rounded-md border border-slate-200/50 shrink-0">
                    <button onClick={() => setLayoutMode('grid')} className={`px-3 py-1.5 rounded text-xs font-semibold ${layoutMode === 'grid' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}>Grid</button>
                    <button onClick={() => setLayoutMode('list')} className={`px-3 py-1.5 rounded text-xs font-semibold ${layoutMode === 'list' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}>List</button>
                  </div>
                  <button
                    onClick={() => setIsCalcOpen(prev => !prev)}
                    className={`flex items-center gap-2 border px-4 py-2 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                      isCalcOpen
                        ? 'bg-brass border-brass text-white hover:bg-brass/90'
                        : 'bg-white border-slate-200 text-forest hover:bg-slate-50'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Rate Calculator
                  </button>
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-forest-light transition-colors shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Full-Width Results Area */}
              <div className="flex flex-col gap-4 flex-grow overflow-y-auto max-h-[75vh] pr-1">
                  
                    {/* Local Search Bar */}
                    <div className="relative w-full shrink-0">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:border-forest text-sm bg-white shadow-sm" 
                        placeholder="Type keywords (society, locality, address, crm tags, assigned agent)..." 
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                      />
                    </div>

                    {/* Rate & Price Valuer Panel */}
                    {isCalcOpen && (
                      <div className="bg-white border border-slate-200/85 rounded-xl p-6 shadow-sm mb-2 mt-2 animate-fade-in flex flex-col md:flex-row gap-6 items-stretch shrink-0">
                        <div className="flex-grow space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h3 className="font-serif text-lg font-semibold text-forest flex items-center gap-2">
                              <Calculator className="w-4 h-4 text-brass" />
                              Rate & Price Valuer
                            </h3>
                            <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200/50">
                              <button 
                                onClick={() => { setCalcMode('rate'); setCalcPrice(''); setCalcRate(''); }} 
                                className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-all ${calcMode === 'rate' ? 'bg-white text-forest shadow-sm font-bold' : 'text-slate-400'}`}
                              >
                                Calculate Rate
                              </button>
                              <button 
                                onClick={() => { setCalcMode('price'); setCalcPrice(''); setCalcRate(''); }} 
                                className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-all ${calcMode === 'price' ? 'bg-white text-forest shadow-sm font-bold' : 'text-slate-400'}`}
                              >
                                Calculate Price
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Carpet Area (sqft)</label>
                              <input 
                                type="number" 
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-slate-50/50"
                                placeholder="e.g. 1500"
                                value={calcArea}
                                onChange={e => setCalcArea(e.target.value)}
                              />
                            </div>

                            {calcMode === 'rate' ? (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Price (₹)</label>
                                <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-slate-50/50"
                                  placeholder="e.g. 35000000"
                                  value={calcPrice}
                                  onChange={e => setCalcPrice(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate per Sq. Ft. (₹/sqft)</label>
                                <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-slate-50/50"
                                  placeholder="e.g. 15000"
                                  value={calcRate}
                                  onChange={e => setCalcRate(e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {(() => {
                          const parsedCalcArea = parseFloat(calcArea) || 0;
                          const parsedCalcPrice = parseFloat(calcPrice) || 0;
                          const parsedCalcRate = parseFloat(calcRate) || 0;

                          let calculatedRateValue = 0;
                          if (calcMode === 'rate' && parsedCalcArea > 0 && parsedCalcPrice > 0) {
                            calculatedRateValue = Math.round(parsedCalcPrice / parsedCalcArea);
                          }

                          let calculatedPriceValue = 0;
                          if (calcMode === 'price' && parsedCalcArea > 0 && parsedCalcRate > 0) {
                            calculatedPriceValue = Math.round(parsedCalcRate * parsedCalcArea);
                          }

                          return (
                            <div className="w-full md:w-60 bg-pastel-bg/50 border border-slate-200/50 rounded-xl p-4 flex flex-col justify-center items-center text-center shrink-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                {calcMode === 'rate' ? 'Calculated Rate' : 'Calculated Price'}
                              </span>
                              {calcMode === 'rate' ? (
                                <div>
                                  <div className="font-serif text-2xl text-forest font-semibold mb-1">
                                    {calculatedRateValue > 0 ? `${formatCurrency(calculatedRateValue)}` : '—'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {calculatedRateValue > 0 ? `${formatPriceShort(calculatedRateValue)} per sqft` : 'Enter Area & Price'}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-serif text-2xl text-forest font-semibold mb-1">
                                    {calculatedPriceValue > 0 ? `${formatCurrency(calculatedPriceValue)}` : '—'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {calculatedPriceValue > 0 ? `${formatPriceShort(calculatedPriceValue)} valuation` : 'Enter Area & Rate'}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  {/* Results summary counter */}
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold shrink-0">
                    <span>Matched {filteredListings.length} of {visibleListings.length} premium listings</span>
                  </div>

                  {/* Empty state */}
                  {filteredListings.length === 0 && (
                    <div className="text-center py-20 bg-white border border-slate-200/80 rounded-lg">
                      <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-slate-600 text-base mb-1">No properties match your filters</h3>
                      <p className="text-xs text-slate-400">Try adjusting your budget bounds or selected parameters.</p>
                    </div>
                  )}

                  {/* Grid Mode Layout */}
                  {layoutMode === 'grid' && filteredListings.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      {filteredListings.map(p => {
                        const agentInitials = p.assignedAgent ? p.assignedAgent.split(' ').map(n=>n[0]).join('') : 'U';
                        const priceLabel = p.purpose === 'Rent' ? '/ m' : '';
                        return (
                          <div key={p.id} onClick={() => triggerListingDrawer(p.id)} className="bg-white border border-slate-200 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brass/30 transition-all flex flex-col">
                            <div className="h-28 sm:h-36 md:h-44 relative overflow-hidden shrink-0">
                              <img src={p.image} className="w-full h-full object-cover" alt="Image" />
                              <span className="absolute top-1.5 left-1.5 md:top-3 md:left-3 text-[7px] md:text-[9px] font-bold px-1 md:px-2 py-0.5 rounded text-white bg-forest uppercase tracking-wider">
                                {p.status === 'Negotiation' ? 'Offer' : p.status}
                              </span>
                              <span className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-white/95 border border-slate-200 text-forest font-bold text-[7px] md:text-[9px] px-1 md:px-2 py-0.5 rounded uppercase tracking-wider">
                                {p.type.substring(0,5)} • {p.purpose}
                              </span>
                            </div>
                            <div className="p-3 md:p-5 flex-grow flex flex-col">
                              <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5 md:mb-1">{p.locality.substring(0, 15)}, {p.city}</span>
                              <h3 className="font-serif text-xs sm:text-sm md:text-lg text-forest font-medium leading-snug mb-1.5 md:mb-3 line-clamp-2 h-8 md:h-14">
                                {p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 md:gap-4 text-[8px] sm:text-[10px] md:text-xs text-slate-400 mb-2 md:mb-4">
                                <span className="flex items-center gap-0.5"><Compass className="w-3 h-3 shrink-0" /> {p.carpetArea} sqft</span>
                                <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3 shrink-0" /> {p.facing.substring(0,5)}</span>
                                <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 shrink-0" /> {p.furnishing.split('-')[0].split(' ')[0]}</span>
                              </div>
                              <div className="font-serif text-sm sm:text-base md:text-xl text-forest font-semibold mt-auto flex justify-between items-baseline gap-1">
                                <div>
                                  {formatCurrency(p.price)} <span className="font-sans text-[8px] md:text-[10px] font-medium text-slate-400">{priceLabel}</span>
                                </div>
                                {p.carpetArea > 0 && (
                                  <span className="font-sans text-[9px] md:text-xs text-brass font-medium whitespace-nowrap">
                                    {formatCurrency(Math.round(p.price / p.carpetArea))}/sqft{p.purpose === 'Rent' && '/mo'}
                                  </span>
                                )}
                              </div>
                              <div className="border-t border-slate-100 pt-1.5 md:pt-3 mt-2 md:mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 md:w-5 h-5 rounded-full bg-pastel-sidebar flex items-center justify-center text-[7px] md:text-[9px] font-bold text-forest">{agentInitials}</span>
                                  <span className="text-[9px] md:text-xs text-slate-500 font-medium hidden sm:inline">{p.assignedAgent}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* List Mode Layout */}
                  {layoutMode === 'list' && filteredListings.length > 0 && (
                    <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Locality</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Broker</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredListings.map(p => {
                            const priceLabel = p.purpose === 'Rent' ? '/ month' : '';
                            return (
                              <tr key={p.id} onClick={() => triggerListingDrawer(p.id)} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded object-cover border border-slate-200" alt="Thumb" />
                                    <div>
                                      <span className="font-semibold text-forest text-sm">{p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}</span>
                                      <div className="text-[10px] text-slate-400">{p.address}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-500">{p.type} ({p.purpose})</td>
                                <td className="px-6 py-4 font-semibold text-slate-500">{p.locality}</td>
                                <td className="px-6 py-4">
                                  <span className="font-serif text-base text-forest font-semibold">
                                    {formatCurrency(p.price)} <span className="font-sans text-[10px] text-slate-400">{priceLabel}</span>
                                  </span>
                                  {p.carpetArea > 0 && (
                                    <div className="text-[10px] text-brass font-medium mt-0.5">
                                      {formatCurrency(Math.round(p.price / p.carpetArea))}/sqft{p.purpose === 'Rent' && '/mo'}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{p.assignedAgent}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    p.status === 'Active' ? 'bg-pastel-mint text-forest' : 
                                    p.status === 'Negotiation' ? 'bg-pastel-gold text-amber-800' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & SYSTEM CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="font-serif text-4xl text-forest font-light">System Settings</h2>
              <p className="text-slate-400 text-xs">Configure database variables and permissions templates.</p>

              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-serif text-xl font-medium text-forest mb-2">Cloud Connection Diagnostics</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Your local environment configurations are being read from the <strong>.env</strong> variables. To connect the database to your production servers, enter your credentials. If they are placeholders, the CRM will run locally using LocalStorage mock objects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pastel-bg/50 p-4 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Supabase Database Connection</span>
                    <span className={`text-xs font-semibold ${supabaseClient ? 'text-green-700' : 'text-amber-700'}`}>
                      {supabaseClient ? '🟢 ONLINE (Syncing Cloud database)' : '🟡 OFFLINE (Using LocalStorage mock database)'}
                    </span>
                  </div>
                  <div className="bg-pastel-bg/50 p-4 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">ImageKit CDN Upload Stream</span>
                    <span className={`text-xs font-semibold ${imagekitClient ? 'text-green-700' : 'text-amber-700'}`}>
                      {imagekitClient ? '🟢 ONLINE (Media Sync enabled)' : '🟡 OFFLINE (Using Local Base64 buffer)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-serif text-xl font-medium text-forest mb-4">Synex Realty - Team Permissions Grid</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Can Onboard Properties</th>
                        <th className="px-6 py-3">Can See Owner Details</th>
                        <th className="px-6 py-3">Can Edit Settings</th>
                        <th className="px-6 py-3">Can Delete Records</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b border-slate-100">
                        <td className="px-6 py-4 font-bold text-forest">Administrator</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-6 py-4 font-bold text-forest">Broker / Agent</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes (Own Assigned)</td>
                        <td className="px-6 py-4 text-red-600 font-medium">❌ No</td>
                        <td className="px-6 py-4 text-red-600 font-medium">❌ No</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-400">Support / Viewer</td>
                        <td className="px-6 py-4 text-red-600 font-medium">❌ No</td>
                        <td className="px-6 py-4 text-green-700 font-medium">✔ Yes (Read Only)</td>
                        <td className="px-6 py-4 text-red-600 font-medium">❌ No</td>
                        <td className="px-6 py-4 text-red-600 font-medium">❌ No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CRM PORTAL */}
          {activeTab === 'crm' && (
            <div className="animate-fade-in flex flex-col h-full gap-6">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0 mb-4">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-forest font-light">CRM Portal</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Manage team property allocations and track client showings registry.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex bg-slate-200 p-0.5 rounded-md border border-slate-200/50 shrink-0">
                    <button 
                      onClick={() => setCrmSubTab('allocation')} 
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${crmSubTab === 'allocation' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                    >
                      Team Allocations
                    </button>
                    <button 
                      onClick={() => setCrmSubTab('showings')} 
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${crmSubTab === 'showings' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                    >
                      Showings Logs
                    </button>
                    <button 
                      onClick={() => setCrmSubTab('matcher')} 
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${crmSubTab === 'matcher' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                    >
                      Smart Matcher
                    </button>
                    <button 
                      onClick={() => setCrmSubTab('offers')} 
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${crmSubTab === 'offers' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                    >
                      Active Offers
                    </button>
                  </div>
                  {crmSubTab === 'showings' && (
                    <button
                      onClick={() => {
                        setIsLogShowingOpen(true);
                        setShowingClientName('');
                        setShowingClientPhone('');
                        setShowingClientEmail('');
                        setShowingFeedback('');
                        if (visibleListings.length > 0) {
                          setShowingListingId(visibleListings[0].id);
                        } else {
                          setShowingListingId('');
                        }
                      }}
                      className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-forest-light transition-colors shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Log Site Showing
                    </button>
                  )}
                  {crmSubTab === 'offers' && (
                    <button
                      onClick={() => {
                        setIsLogOfferOpen(true);
                        setOfferClientName('');
                        setOfferClientPhone('');
                        setOfferPrice('');
                        setOfferCounterPrice('');
                        setOfferTokenAmount('');
                        setOfferNotes('');
                        setOfferStage('Offer Received');
                        if (visibleListings.length > 0) {
                          setTargetOfferListingId(visibleListings[0].id);
                        } else {
                          setTargetOfferListingId('');
                        }
                      }}
                      className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-forest-light transition-colors shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Log / Update Offer
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tab 1: Team Allocation view */}
              {crmSubTab === 'allocation' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto max-h-[75vh]">
                  {['Amit Kumar', 'Siddharth Sharma', 'Pooja Verma'].map(agentName => {
                    const agentProperties = visibleListings.filter(p => p.assignedAgent === agentName);
                    const agentInitials = agentName.split(' ').map(n=>n[0]).join('');
                    
                    return (
                      <div key={agentName} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[400px]">
                        {/* Agent Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4 shrink-0">
                          <span className="w-10 h-10 rounded-full bg-pastel-sidebar flex items-center justify-center text-xs font-bold text-forest border border-slate-200">
                            {agentInitials}
                          </span>
                          <div>
                            <h4 className="font-serif text-base font-semibold text-forest">{agentName}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {agentProperties.length} Properties Handled
                            </span>
                          </div>
                        </div>

                        {/* Agent Properties List */}
                        <div className="flex-grow overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                          {agentProperties.length === 0 ? (
                            <div className="text-center py-10 text-xs text-slate-400">No properties assigned yet.</div>
                          ) : (
                            agentProperties.map(p => (
                              <div 
                                key={p.id} 
                                onClick={() => triggerListingDrawer(p.id)}
                                className="border border-slate-100 hover:border-brass/35 bg-pastel-bg/25 hover:bg-white rounded-lg p-3 cursor-pointer shadow-sm hover:shadow transition-all flex gap-3 items-center"
                              >
                                <img src={p.image} className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0" alt="Thumb" />
                                <div className="min-w-0 flex-grow">
                                  <h5 className="font-semibold text-forest text-xs truncate">
                                    {p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}
                                  </h5>
                                  <div className="text-[10px] text-slate-400 truncate mb-1">{p.locality}, {p.city}</div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="font-serif text-[11px] font-bold text-forest">
                                      {formatPriceShort(p.price)}{p.purpose === 'Rent' && ' /mo'}
                                    </span>
                                    {activeRole === 'admin' ? (
                                      <select
                                        value={p.assignedAgent}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => {
                                          e.stopPropagation();
                                          handleReassignAgent(p.id, e.target.value);
                                        }}
                                        className="text-[9px] border border-slate-200 rounded px-1.5 py-0.5 bg-white text-forest font-semibold focus:border-forest"
                                      >
                                        <option value="Amit Kumar">Amit Kumar</option>
                                        <option value="Siddharth Sharma">Siddharth Sharma</option>
                                        <option value="Pooja Verma">Pooja Verma</option>
                                      </select>
                                    ) : (
                                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${
                                        p.status === 'Active' ? 'bg-pastel-mint text-forest' : 
                                        p.status === 'Negotiation' ? 'bg-pastel-gold text-amber-800' : 'bg-slate-200 text-slate-600'
                                      }`}>
                                        {p.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab 2: Client Showings Registry */}
              {crmSubTab === 'showings' && (
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex-grow flex flex-col max-h-[75vh]">
                  <div className="overflow-x-auto flex-grow scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-6 py-4">Client & Contact Details</th>
                          <th className="px-6 py-4">Property Shown</th>
                          <th className="px-6 py-4">Date & Broker</th>
                          <th className="px-6 py-4">Feedback & Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showings.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-20 text-sm text-slate-400">
                              No site visits logged yet. Use "Log Site Showing" to record client visits.
                            </td>
                          </tr>
                        ) : (
                          showings.map(s => {
                            const matchedListing = listings.find(l => l.id === s.listingId);
                            return (
                              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-forest text-sm">{s.clientName}</span>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                      <Phone className="w-3 h-3 text-slate-400" /> {s.clientPhone}
                                    </div>
                                    <span className="text-[10px] text-slate-400">{s.clientEmail}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {matchedListing ? (
                                    <div 
                                      onClick={() => triggerListingDrawer(matchedListing.id)}
                                      className="flex items-center gap-3 cursor-pointer group"
                                    >
                                      <img src={matchedListing.image} className="w-10 h-10 rounded object-cover border border-slate-200" alt="" />
                                      <div>
                                        <span className="font-semibold text-forest text-xs group-hover:text-brass transition-colors block">
                                          {matchedListing.bhk === 'N/A' ? '' : matchedListing.bhk + ' BHK '}{matchedListing.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">{matchedListing.society}, {matchedListing.locality}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-medium text-xs">{s.propertyName}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                                      <Calendar className="w-3 h-3 text-slate-400" /> {s.showingDate}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Assigned Broker: {s.agentName}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1.5 max-w-sm">
                                    <div>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        s.status === 'Offer Received' ? 'bg-pastel-mint text-green-800' :
                                        s.status === 'Interested' ? 'bg-pastel-blue text-blue-800' :
                                        s.status === 'Follow-up' ? 'bg-pastel-gold text-amber-800' :
                                        'bg-pastel-peach text-red-800'
                                      }`}>
                                        {s.status}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 italic font-normal leading-normal">"{s.feedback}"</p>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Log Showing Inline Modal */}
              {isLogShowingOpen && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsLogShowingOpen(false)}>
                  <div className="bg-white border border-slate-200 shadow-2xl rounded-xl w-[480px] max-w-[90%] flex flex-col p-6 animate-scale-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
                      <h3 className="font-serif text-xl font-semibold text-forest flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-brass" /> Log Client Site Showing
                      </h3>
                      <button onClick={() => setIsLogShowingOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const targetProperty = listings.find(l => l.id === showingListingId);
                      const newShowing: Showing = {
                        id: `show-${Date.now()}`,
                        listingId: showingListingId,
                        propertyName: targetProperty ? `${targetProperty.bhk === 'N/A' ? '' : targetProperty.bhk + ' BHK '}${targetProperty.type} in ${targetProperty.society}` : 'Unknown Property',
                        clientName: showingClientName,
                        clientPhone: showingClientPhone,
                        clientEmail: showingClientEmail,
                        showingDate: showingDate,
                        agentName: showingAgent,
                        status: showingStatus,
                        feedback: showingFeedback
                      };

                      if (supabaseClient) {
                        try {
                          await supabaseClient.from('client_showings').insert([{
                            listing_id: newShowing.listingId,
                            property_name: newShowing.propertyName,
                            client_name: newShowing.clientName,
                            client_phone: newShowing.clientPhone,
                            client_email: newShowing.clientEmail,
                            showing_date: newShowing.showingDate,
                            agent_name: newShowing.agentName,
                            status: newShowing.status,
                            feedback: newShowing.feedback
                          }]);
                        } catch (err) {
                          console.warn("Supabase showings insert error:", err);
                        }
                      }

                      const updated = [newShowing, ...showings];
                      setShowings(updated);
                      localStorage.setItem('synex_showings', JSON.stringify(updated));
                      setIsLogShowingOpen(false);
                    }} className="space-y-4 text-xs">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Property</label>
                          <select 
                            value={showingListingId} 
                            onChange={e => setShowingListingId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            required
                          >
                            {visibleListings.map(l => (
                              <option key={l.id} value={l.id}>
                                {l.bhk === 'N/A' ? '' : l.bhk + ' BHK '}{l.type} - {l.society} ({l.locality})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. Ramesh Patel"
                            value={showingClientName}
                            onChange={e => setShowingClientName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Phone</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. +91 98200 98200"
                            value={showingClientPhone}
                            onChange={e => setShowingClientPhone(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Email</label>
                          <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. client@gmail.com"
                            value={showingClientEmail}
                            onChange={e => setShowingClientEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Showing Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            value={showingDate}
                            onChange={e => setShowingDate(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Showing Broker</label>
                          <select 
                            value={showingAgent} 
                            onChange={e => setShowingAgent(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            required
                          >
                            <option value="Amit Kumar">Amit Kumar</option>
                            <option value="Siddharth Sharma">Siddharth Sharma</option>
                            <option value="Pooja Verma">Pooja Verma</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Showing Feedback Status</label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['Interested', 'Offer Received', 'Follow-up', 'Not Interested'] as Showing['status'][]).map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setShowingStatus(status)}
                                className={`py-1.5 border rounded text-[9px] font-bold text-center transition-all ${
                                  showingStatus === status 
                                    ? 'bg-forest border-forest text-white' 
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Feedback / Comments</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-16 resize-none"
                            placeholder="e.g. Liked the location, requested details on layout configurations..."
                            value={showingFeedback}
                            onChange={e => setShowingFeedback(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-4 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => setIsLogShowingOpen(false)}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-forest hover:bg-forest-light text-white font-semibold text-xs py-2 px-5 rounded-lg transition-colors"
                        >
                          Log Visit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Smart Matcher */}
              {crmSubTab === 'matcher' && (
                <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-y-auto max-h-[75vh]">
                  {/* Left: Buyer Requirements Form */}
                  <div className="w-full lg:w-80 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm shrink-0">
                    <h4 className="font-serif text-lg font-semibold text-forest mb-1 flex items-center gap-2">
                      <Target className="w-4 h-4 text-brass" /> Client Requirements
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-4">Set buyer search criteria to compute match affinity scores across active inventory.</p>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Transaction Purpose</label>
                        <select 
                          value={matcherPurpose} 
                          onChange={e => setMatcherPurpose(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                        >
                          <option value="all">Any (Rent or Sale)</option>
                          <option value="Sale">Buy / Purchase</option>
                          <option value="Rent">Lease / Rent</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Property Type</label>
                        <select 
                          value={matcherType} 
                          onChange={e => setMatcherType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                        >
                          <option value="all">All Property Types</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Office">Office Space</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Max Budget Target (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 45000000"
                          value={matcherBudget} 
                          onChange={e => setMatcherBudget(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Preferred Locality / City</label>
                        <select 
                          value={matcherLocality} 
                          onChange={e => setMatcherLocality(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                        >
                          <option value="all">All Locations</option>
                          {Array.from(new Set(visibleListings.map(l => l.locality))).map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">BHK Configuration</label>
                        <select 
                          value={matcherBhk} 
                          onChange={e => setMatcherBhk(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                        >
                          <option value="all">Any BHK Configuration</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="4+ BHK">4+ BHK / Villa</option>
                        </select>
                      </div>

                      <button 
                        onClick={() => {
                          setMatcherPurpose('all');
                          setMatcherType('all');
                          setMatcherBudget('');
                          setMatcherLocality('all');
                          setMatcherBhk('all');
                        }}
                        className="w-full mt-2 py-1.5 text-center text-[10px] font-bold uppercase text-slate-400 hover:text-forest transition-colors"
                      >
                        Reset Matcher Form
                      </button>
                    </div>
                  </div>

                  {/* Right: Matched Properties List */}
                  <div className="flex-grow bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-forest flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brass" /> Matched Properties Ranked
                        </h4>
                        <span className="text-[10px] text-slate-400">Inventory sorted by compatibility score against criteria.</span>
                      </div>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                      {[...visibleListings]
                        .map(p => ({
                          property: p,
                          score: calculateMatchScore(p, {
                            purpose: matcherPurpose,
                            type: matcherType,
                            maxBudget: matcherBudget,
                            locality: matcherLocality,
                            bhk: matcherBhk
                          })
                        }))
                        .sort((a, b) => b.score - a.score)
                        .map(({ property: p, score }) => (
                          <div 
                            key={p.id}
                            onClick={() => triggerListingDrawer(p.id)}
                            className="border border-slate-100 hover:border-brass/40 rounded-xl p-4 bg-pastel-bg/20 hover:bg-white transition-all cursor-pointer shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <img src={p.image} className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" alt="Thumb" />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-forest text-sm">{p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} in {p.society}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    score >= 80 ? 'bg-pastel-mint text-green-900' :
                                    score >= 50 ? 'bg-pastel-gold text-amber-900' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {score}% Match
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400">{p.locality}, {p.city} • {p.carpetArea} sqft</div>
                                <div className="text-xs font-serif font-bold text-forest mt-1">{formatPriceShort(p.price)}{p.purpose === 'Rent' && ' /mo'}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <button className="flex items-center gap-1 text-xs font-semibold text-forest hover:text-brass transition-colors">
                                View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Active Offers & Deal Funnel */}
              {crmSubTab === 'offers' && (
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex-grow flex flex-col max-h-[75vh]">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-forest">Active Price Negotiations & Offers</h4>
                      <p className="text-slate-400 text-xs">Track buyer offers, owner counter-offers, token deposits, and deal closure status.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsLogOfferOpen(true);
                        setOfferClientName('');
                        setOfferClientPhone('');
                        setOfferPrice('');
                        setOfferCounterPrice('');
                        setOfferTokenAmount('');
                        setOfferNotes('');
                        setOfferStage('Offer Received');
                        if (visibleListings.length > 0) {
                          setTargetOfferListingId(visibleListings[0].id);
                        } else {
                          setTargetOfferListingId('');
                        }
                      }}
                      className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-forest-light transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Log / Update Offer
                    </button>
                  </div>

                  <div className="overflow-x-auto flex-grow scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-6 py-4">Property Details</th>
                          <th className="px-6 py-4">Client & Contact</th>
                          <th className="px-6 py-4 text-right">Asking Price</th>
                          <th className="px-6 py-4 text-right">Offered / Counter Price</th>
                          <th className="px-6 py-4 text-right">Token Amount</th>
                          <th className="px-6 py-4">Deal Stage & Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-20 text-sm text-slate-400">
                              No active price offers recorded. Click "Log / Update Offer" to add one.
                            </td>
                          </tr>
                        ) : (
                          offers.map(o => {
                            const matchedListing = listings.find(l => l.id === o.listingId);
                            return (
                              <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  {matchedListing ? (
                                    <div 
                                      onClick={() => triggerListingDrawer(matchedListing.id)}
                                      className="flex items-center gap-3 cursor-pointer group"
                                    >
                                      <img src={matchedListing.image} className="w-10 h-10 rounded object-cover border border-slate-200" alt="" />
                                      <div>
                                        <span className="font-semibold text-forest text-xs group-hover:text-brass transition-colors block">
                                          {matchedListing.bhk === 'N/A' ? '' : matchedListing.bhk + ' BHK '}{matchedListing.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">{matchedListing.society}, {matchedListing.locality}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-medium text-xs">{o.propertyName}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-forest">{o.clientName}</span>
                                    <span className="text-[10px] text-slate-400">{o.clientPhone}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right font-serif font-bold text-slate-600">
                                  {matchedListing ? formatPriceShort(matchedListing.price) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex flex-col items-end gap-0.5 font-serif font-bold">
                                    <span className="text-forest text-sm">{formatPriceShort(o.offeredPrice)}</span>
                                    {o.counterPrice && (
                                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1 rounded">Counter: {formatPriceShort(o.counterPrice)}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right font-serif font-bold text-green-700">
                                  {o.tokenAmount ? formatPriceShort(o.tokenAmount) : '—'}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1 max-w-xs">
                                    <div>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        o.stage === 'Token Received' ? 'bg-pastel-mint text-green-900' :
                                        o.stage === 'Deal Closed' ? 'bg-forest text-white' :
                                        o.stage === 'Counter Offer' ? 'bg-pastel-gold text-amber-900' :
                                        'bg-pastel-blue text-blue-900'
                                      }`}>
                                        {o.stage}
                                      </span>
                                    </div>
                                    {o.notes && <p className="text-[10px] text-slate-400 italic line-clamp-2">{o.notes}</p>}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Log Offer Inline Modal */}
              {isLogOfferOpen && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsLogOfferOpen(false)}>
                  <div className="bg-white border border-slate-200 shadow-2xl rounded-xl w-[480px] max-w-[90%] flex flex-col p-6 animate-scale-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
                      <h3 className="font-serif text-xl font-semibold text-forest flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-brass" /> Log / Update Deal Offer
                      </h3>
                      <button onClick={() => setIsLogOfferOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const targetProperty = listings.find(l => l.id === targetOfferListingId);
                      const newOffer: Offer = {
                        id: `offer-${Date.now()}`,
                        listingId: targetOfferListingId,
                        propertyName: targetProperty ? `${targetProperty.bhk === 'N/A' ? '' : targetProperty.bhk + ' BHK '}${targetProperty.type} in ${targetProperty.society}` : 'Unknown Property',
                        clientName: offerClientName,
                        clientPhone: offerClientPhone,
                        offeredPrice: Number(offerPrice) || 0,
                        counterPrice: offerCounterPrice ? Number(offerCounterPrice) : undefined,
                        tokenAmount: offerTokenAmount ? Number(offerTokenAmount) : undefined,
                        stage: offerStage,
                        updatedAt: new Date().toISOString().split('T')[0],
                        notes: offerNotes
                      };

                      if (supabaseClient) {
                        try {
                          await supabaseClient.from('property_offers').insert([{
                            listing_id: newOffer.listingId,
                            property_name: newOffer.propertyName,
                            client_name: newOffer.clientName,
                            client_phone: newOffer.clientPhone,
                            offered_price: newOffer.offeredPrice,
                            counter_price: newOffer.counterPrice,
                            token_amount: newOffer.tokenAmount,
                            stage: newOffer.stage,
                            notes: newOffer.notes,
                            updated_at: newOffer.updatedAt
                          }]);
                        } catch (err) {
                          console.warn("Supabase offers insert error:", err);
                        }
                      }

                      const filtered = offers.filter(o => o.listingId !== targetOfferListingId);
                      const updated = [newOffer, ...filtered];
                      setOffers(updated);
                      localStorage.setItem('synex_offers', JSON.stringify(updated));
                      setIsLogOfferOpen(false);
                    }} className="space-y-4 text-xs">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Property</label>
                          <select 
                            value={targetOfferListingId} 
                            onChange={e => setTargetOfferListingId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            required
                          >
                            {visibleListings.map(l => (
                              <option key={l.id} value={l.id}>
                                {l.bhk === 'N/A' ? '' : l.bhk + ' BHK '}{l.type} - {l.society} (Asking: {formatPriceShort(l.price)})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. Rajesh Mehta"
                            value={offerClientName}
                            onChange={e => setOfferClientName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Phone</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. +91 98200 98200"
                            value={offerClientPhone}
                            onChange={e => setOfferClientPhone(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Offer Price (₹)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. 42000000"
                            value={offerPrice}
                            onChange={e => setOfferPrice(e.target.value ? Number(e.target.value) : '')}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Owner Counter Offer (₹)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. 43500000 (Optional)"
                            value={offerCounterPrice}
                            onChange={e => setOfferCounterPrice(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Token / Booking Deposit (₹)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-9"
                            placeholder="e.g. 500000 (Earnest deposit received)"
                            value={offerTokenAmount}
                            onChange={e => setOfferTokenAmount(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deal Stage</label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['Offer Received', 'Counter Offer', 'Token Received', 'Deal Closed'] as Offer['stage'][]).map(stage => (
                              <button
                                key={stage}
                                type="button"
                                onClick={() => setOfferStage(stage)}
                                className={`py-1.5 border rounded text-[9px] font-bold text-center transition-all ${
                                  offerStage === stage 
                                    ? 'bg-forest border-forest text-white' 
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                {stage}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offer Notes & Negotiation Comments</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-16 resize-none"
                            placeholder="e.g. Buyer proposed quick 30-day closing in exchange for 5% discount..."
                            value={offerNotes}
                            onChange={e => setOfferNotes(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-4 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => setIsLogOfferOpen(false)}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-forest hover:bg-forest-light text-white font-semibold text-xs py-2 px-5 rounded-lg transition-colors"
                        >
                          Save Offer Record
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ----------------------------------------------------
         MODAL WIZARD: MULTI-STEP FORM (INR Inputs)
         ---------------------------------------------------- */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-slate-800/40 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50">
          <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-xl w-full sm:w-[900px] sm:max-w-[95%] h-[92dvh] sm:h-[600px] flex flex-col sm:flex-row overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Steps Sidebar Indicator — hidden on mobile */}
            <div className="hidden sm:flex w-64 bg-pastel-sidebar border-r border-slate-200/80 p-8 flex-col justify-between shrink-0">
              <div>
                <h2 className="font-serif text-2xl text-forest font-semibold mb-6">Onboard Listing</h2>
                <ul className="relative space-y-5">
                  <div className="absolute left-[15px] top-[10px] w-px h-[85%] bg-slate-200 z-0"></div>
                  
                  {[
                    { step: 1, title: "Basics & Type", desc: "Class and category" },
                    { step: 2, title: "Configuration", desc: "Rooms, facing, floor" },
                    { step: 3, title: "Financials", desc: "Price & deposit" },
                    { step: 4, title: "Media Upload", desc: "Select visual mockup" },
                    { step: 5, title: "Marketing Copy", desc: "AI description editor" },
                    { step: 6, title: "Broker CRM", desc: "Owner & status" }
                  ].map(s => (
                    <li key={s.step} className="flex items-center gap-3 relative z-10">
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                        wizardStep === s.step ? 'bg-forest border-forest text-white' : 
                        wizardStep > s.step ? 'bg-pastel-mint border-forest text-forest' : 
                        'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {s.step}
                      </span>
                      <div>
                        <div className={`text-xs font-semibold leading-tight ${wizardStep === s.step ? 'text-forest' : 'text-slate-500'}`}>{s.title}</div>
                        <span className="text-[10px] text-slate-400 leading-none">{s.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form viewport */}
            <div className="flex-grow flex flex-col p-5 sm:p-8 overflow-hidden">
              {/* Header row */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 shrink-0">
                <span className="font-serif text-base sm:text-xl font-medium text-forest">
                  {editingListingId ? 'Edit Listing' : 'Step ' + wizardStep + ' of 6'}
                </span>
                <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              {/* Mobile-only step dots */}
              <div className="flex sm:hidden justify-center gap-2 mb-4 shrink-0">
                {[1,2,3,4,5,6].map(s => (
                  <span key={s} className={`w-2 h-2 rounded-full transition-all ${wizardStep === s ? 'bg-forest w-5' : wizardStep > s ? 'bg-forest/40' : 'bg-slate-200'}`} />
                ))}
              </div>


              <div className="flex-grow flex flex-col overflow-y-auto pr-1">
                {/* STEP 1: BASICS & CLASS */}
                {wizardStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listing Purpose</label>
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                          <button 
                            type="button" 
                            onClick={() => { setWPurpose('Rent'); }}
                            className={`flex-1 py-1.5 rounded text-xs font-semibold ${wPurpose === 'Rent' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                          >
                            For Rent
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { setWPurpose('Sale'); }}
                            className={`flex-1 py-1.5 rounded text-xs font-semibold ${wPurpose === 'Sale' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                          >
                            For Sale
                          </button>
                        </div>
                      </div>

                      <CustomSelect 
                        label="Property Category"
                        value={wType}
                        onChange={val => {
                          const v = val as any;
                          setWType(v);
                          if (v === 'Office') setWBhk('N/A');
                          else if (wBhk === 'N/A') setWBhk('2');
                        }}
                        options={[
                          { label: "Apartment", value: "Apartment" },
                          { label: "Villa / Ind. House", value: "Villa" },
                          { label: "Penthouse Suite", value: "Penthouse" },
                          { label: "Commercial Office", value: "Office" }
                        ]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Society / Complex Name</label>
                      <input 
                        type="text" 
                        value={wSociety} 
                        onChange={e => setWSociety(e.target.value)} 
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white"
                        placeholder="e.g. Prestige Heights, DLF Phase 5" 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Locality / Sector</label>
                        <input 
                          type="text" 
                          value={wLocality} 
                          onChange={e => setWLocality(e.target.value)} 
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white"
                          placeholder="e.g. Sector 54, Indiranagar" 
                          required 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                        <select 
                          value={wCity} 
                          onChange={e => setWCity(e.target.value)} 
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white"
                          required
                        >
                          <option value="">Select City</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complete Landmark & Address</label>
                      <input 
                        type="text" 
                        value={wAddress} 
                        onChange={e => setWAddress(e.target.value)} 
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white"
                        placeholder="e.g. Flat 802, Block C, near primary gate" 
                        required 
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: CONFIGURATION */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-3 gap-3">
                      <CustomSelect 
                        label="BHK Size"
                        value={wBhk}
                        onChange={setWBhk}
                        options={[
                          { label: "1 BHK", value: "1" },
                          { label: "2 BHK", value: "2" },
                          { label: "3 BHK", value: "3" },
                          { label: "4+ BHK", value: "4+" },
                          { label: "Not Applicable", value: "N/A" }
                        ]}
                      />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bathrooms</label>
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button 
                              type="button" 
                              key={num} 
                              onClick={() => setWBathrooms(num)}
                              className={`flex-1 py-1 rounded text-xs font-semibold ${wBathrooms === num ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balconies</label>
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                          {[0, 1, 2, 3, 4].map(num => (
                            <button 
                              type="button" 
                              key={num} 
                              onClick={() => setWBalconies(num)}
                              className={`flex-1 py-1 rounded text-xs font-semibold ${wBalconies === num ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carpet Area (sqft)</label>
                        <input type="number" value={wCarpetArea} onChange={e => setWCarpetArea(parseInt(e.target.value)||0)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white font-semibold text-forest" required />
                        <div className="flex flex-wrap gap-1 mt-1">
                          <button type="button" onClick={() => setWCarpetArea(prev => prev + 100)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-medium">+100</button>
                          <button type="button" onClick={() => setWCarpetArea(prev => prev + 500)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-medium">+500</button>
                          <button type="button" onClick={() => setWCarpetArea(0)} className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[9px] font-medium">Clear</button>
                        </div>
                      </div>
                      <CustomSelect 
                        label="Floor Selection"
                        value={String(wFloorNum)}
                        onChange={handleFloorNumChange}
                        options={[
                          { label: "Ground Floor", value: "0" },
                          ...Array.from({ length: 100 }, (_, i) => i + 1).map(f => ({
                            label: `${f}th Floor`,
                            value: String(f)
                          }))
                        ]}
                      />
                      <CustomSelect 
                        label="Total Floors"
                        value={String(wTotalFloors)}
                        onChange={handleTotalFloorsChange}
                        options={Array.from({ length: 100 }, (_, i) => i + 1).map(tf => ({
                          label: `of ${tf} Floors`,
                          value: String(tf)
                        }))}
                      />
                      <CustomSelect 
                        label="Facing Direction"
                        value={wFacing}
                        onChange={setWFacing}
                        options={[
                          { label: "East", value: "East" },
                          { label: "West", value: "West" },
                          { label: "North", value: "North" },
                          { label: "South", value: "South" },
                          { label: "North-East (Vastu)", value: "North-East" },
                          { label: "South-West", value: "South-West" }
                        ]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Furnishing Status</label>
                      <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                        {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map(item => (
                          <button 
                            key={item}
                            type="button" 
                            onClick={() => setWFurnishing(item)}
                            className={`flex-1 py-1.5 rounded text-xs font-semibold ${wFurnishing === item ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Amenities</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["Air Conditioning", "Wardrobes", "Geysers", "Modular Kitchen", "Sofa Set", "Refrigerator", "Power Backup", "24x7 Security"].map(am => (
                          <label key={am} className={`flex items-center justify-center p-2 border rounded-md cursor-pointer text-[10px] font-medium transition-all ${
                            wAmenities.includes(am) ? 'border-forest bg-pastel-mint text-forest' : 'border-slate-200 bg-white text-slate-500'
                          }`}>
                            <input type="checkbox" className="hidden" checked={wAmenities.includes(am)} onChange={() => toggleAmenity(am)} />
                            {am}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: FINANCIAL DETAILS (INR) */}
                {wizardStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {wPurpose === 'Rent' ? 'Expected Rent (₹ / month)' : 'Expected Sale Price (₹)'}
                        </label>
                        <input type="number" value={wPrice} onChange={e => setWPrice(parseInt(e.target.value)||0)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white font-semibold text-forest" required />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {wPurpose === 'Rent' ? (
                            <>
                              <button type="button" onClick={() => setWPrice(prev => prev + 10000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+10k</button>
                              <button type="button" onClick={() => setWPrice(prev => prev + 50000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+50k</button>
                              <button type="button" onClick={() => setWPrice(prev => prev + 100000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+1 Lakh</button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => setWPrice(prev => prev + 1000000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+10 Lakhs</button>
                              <button type="button" onClick={() => setWPrice(prev => prev + 5000000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+50 Lakhs</button>
                              <button type="button" onClick={() => setWPrice(prev => prev + 10000000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+1 Crore</button>
                            </>
                          )}
                          <button type="button" onClick={() => setWPrice(0)} className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[9px] font-semibold">Clear</button>
                        </div>
                      </div>
                      {wPurpose === 'Rent' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Deposit (₹)</label>
                          <input type="number" value={wDeposit} onChange={e => setWDeposit(parseInt(e.target.value)||0)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white font-semibold text-forest" />
                          <div className="flex flex-wrap gap-1 mt-1">
                            <button type="button" onClick={() => setWDeposit(prev => prev + 50000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+50k</button>
                            <button type="button" onClick={() => setWDeposit(prev => prev + 100000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+1 Lakh</button>
                            <button type="button" onClick={() => setWDeposit(0)} className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[9px] font-semibold">Clear</button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Maintenance (₹)</label>
                        <input type="number" value={wMaintenance} onChange={e => setWMaintenance(parseInt(e.target.value)||0)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white font-semibold text-forest" />
                        <div className="flex flex-wrap gap-1 mt-1">
                          <button type="button" onClick={() => setWMaintenance(prev => prev + 1000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+1k</button>
                          <button type="button" onClick={() => setWMaintenance(prev => prev + 5000)} className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[9px] font-semibold">+5k</button>
                          <button type="button" onClick={() => setWMaintenance(0)} className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[9px] font-semibold">Clear</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Negotiability</label>
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                          <button 
                            type="button" 
                            onClick={() => setWNegotiable('Yes')}
                            className={`flex-1 py-1.5 rounded text-xs font-semibold ${wNegotiable === 'Yes' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                          >
                            Negotiable
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setWNegotiable('No')}
                            className={`flex-1 py-1.5 rounded text-xs font-semibold ${wNegotiable === 'No' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
                          >
                            Fixed Price
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available From</label>
                        <input type="date" value={wAvailableDate} onChange={e => setWAvailableDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white" />
                      </div>
                      {wPurpose === 'Rent' ? (
                        <CustomSelect 
                          label="Tenant Preference (For Rentals)"
                          value={wPreferredTenant}
                          onChange={setWPreferredTenant}
                          options={[
                            { label: "No Preference", value: "Anyone" },
                            { label: "Families Only", value: "Families" },
                            { label: "Bachelors Only", value: "Bachelors" },
                            { label: "Corporate Lease", value: "Corporate Lease" }
                          ]}
                        />
                      ) : (
                        <div className="flex flex-col gap-1 relative w-full opacity-50 pointer-events-none">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tenant Preference (For Rentals)</label>
                          <div className="px-3 py-2 border border-slate-200 rounded bg-slate-50 text-xs font-semibold text-slate-400">
                            Not Applicable (Sale)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: MEDIA UPLOAD */}
                {wizardStep === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Upload Listing Photos</label>
                        <div 
                          onClick={() => document.getElementById('wizard-file-input')?.click()} 
                          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-5 text-center cursor-pointer hover:border-forest hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1.5"
                        >
                          <Cloud className="w-7 h-7 text-slate-400" />
                          <div className="text-xs font-semibold text-forest">Click to upload photos</div>
                          <div className="text-[9px] text-slate-400">Multi-select enabled. Syncs to ImageKit.</div>
                          <input type="file" id="wizard-file-input" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Upload Walkthrough Video</label>
                        <div 
                          onClick={() => document.getElementById('wizard-video-input')?.click()} 
                          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-5 text-center cursor-pointer hover:border-forest hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1.5"
                        >
                          <Cloud className="w-7 h-7 text-slate-400" />
                          <div className="text-xs font-semibold text-forest">Click to upload Video</div>
                          <div className="text-[9px] text-slate-400">Walkthrough file. Syncs to ImageKit.</div>
                          <input type="file" id="wizard-video-input" className="hidden" accept="video/*" onChange={handleImageUpload} />
                        </div>
                      </div>
                    </div>

                    {uploadStatus && (
                      <div className="bg-pastel-mint border border-forest/15 px-3 py-2 rounded text-xs font-semibold text-forest text-center animate-pulse">
                        {uploadStatus}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Current Uploaded Photos ({wPhotos.length})</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {wPhotos.map((url, idx) => (
                          <div key={idx} className="relative w-20 h-16 border border-slate-200 rounded overflow-hidden shrink-0 group">
                            <img src={url} className="w-full h-full object-cover" alt="" />
                            <button 
                              type="button" 
                              onClick={() => {
                                const list = wPhotos.filter((_, i) => i !== idx);
                                setWPhotos(list);
                                if (list.length > 0) setWImageSrc(list[0]);
                              }} 
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {wVideo && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Uploaded Walkthrough Video</label>
                        <div className="flex items-center gap-3 bg-pastel-bg border border-slate-200 p-2.5 rounded-lg">
                          <video src={wVideo} className="w-16 h-12 rounded object-cover bg-black" />
                          <div className="flex-grow min-w-0">
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Video walk-in</span>
                            <span className="text-xs font-medium text-forest truncate block">{wVideo}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setWVideo('')} 
                            className="text-red-600 hover:text-red-700 text-xs font-semibold mr-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Or Select Cover Template</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'apartment', src: '/assets/apartment.png', name: 'Apartment' },
                          { id: 'villa', src: '/assets/villa.png', name: 'Villa' },
                          { id: 'office', src: '/assets/office.png', name: 'Office' },
                          { id: 'penthouse', src: '/assets/penthouse.png', name: 'Penthouse' }
                        ].map(item => (
                          <div 
                            key={item.id}
                            onClick={() => {
                              setWPhotos([item.src]);
                              setWImageSrc(item.src);
                              setUploadStatus('');
                            }}
                            className={`relative h-11 rounded overflow-hidden cursor-pointer border transition-all ${
                              wImageSrc === item.src ? 'border-forest scale-[1.02]' : 'border-slate-200 hover:border-forest/50'
                            }`}
                          >
                            <img src={item.src} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[8px] font-bold uppercase tracking-wider">{item.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: MARKETING COPY */}
                {wizardStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-[340px] animate-fade-in">
                    <div className="space-y-4 overflow-y-auto pr-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Select Highlights Tags</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Vastu Compliant', 'Near Metro Station', 'Zero Brokerage', 'Newly Renovated', 'No Common Walls', 'Spacious Balconies', 'High Rental Yield', 'Gated Community', 'Top Floor View', 'Close to IT Park'].map(tag => (
                          <button 
                            key={tag}
                            type="button"
                            onClick={() => toggleMarketingTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
                              selectedTags.includes(tag) ? 'bg-forest border-forest text-white' : 'bg-pastel-bg/85 border-slate-200 text-slate-500'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Listing Highlights</label>
                        <input type="text" value={wHighlights} onChange={e => setWHighlights(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white" placeholder="e.g. Near Market, Modular Cabinetry" />
                      </div>
                    </div>

                    <div className="bg-pastel-sidebar/50 border border-slate-200 rounded-lg p-5 flex flex-col">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Cloud className="w-4 h-4 text-forest" /> AI Marketing Generator
                        </span>
                        <div className="flex gap-1">
                          {(['luxury', 'professional', 'speed'] as ToneType[]).map(tone => (
                            <button 
                              key={tone}
                              type="button" 
                              onClick={() => setAiTone(tone)}
                              className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
                                aiTone === tone ? 'bg-forest text-white' : 'bg-white text-slate-400 border border-slate-200'
                              }`}
                            >
                              {tone === 'speed' ? 'Rushed' : tone === 'professional' ? 'Pitch' : 'Luxury'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea 
                        value={wAiDescription} 
                        onChange={e => setWAiDescription(e.target.value)}
                        className="flex-grow bg-transparent border-none text-xs text-forest leading-relaxed resize-none focus:outline-none" 
                        placeholder="Composing details..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 6: BROKER CRM METADATA */}
                {wizardStep === 6 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-pastel-peach/50 border border-amber-200/50 p-4 rounded-lg text-[11px] text-amber-800 font-semibold leading-relaxed">
                      ⚠ BROKER REGISTRY SHIELD: The following information holds sensitive client metadata. They are strictly confidential and will be visible only to authorized brokers.
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Name</label>
                        <input type="text" value={wOwnerName} onChange={e => setWOwnerName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white" required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Contact (Phone)</label>
                        <input type="text" value={wOwnerPhone} onChange={e => setWOwnerPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white" required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Email</label>
                        <input type="email" value={wOwnerEmail} onChange={e => setWOwnerEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <CustomSelect 
                        label="Assigned Agent"
                        value={wAgent}
                        onChange={setWAgent}
                        options={[
                          { label: "Amit Kumar (Admin)", value: "Amit Kumar" },
                          { label: "Siddharth Sharma (Broker)", value: "Siddharth Sharma" },
                          { label: "Pooja Verma (Broker)", value: "Pooja Verma" }
                        ]}
                      />

                      <CustomSelect 
                        label="Listing Status"
                        value={wStatus}
                        onChange={val => setWStatus(val as any)}
                        options={[
                          { label: "Active Catalog", value: "Active" },
                          { label: "Under Offer / Negotiation", value: "Negotiation" },
                          { label: "Sold", value: "Sold" },
                          { label: "Rented", value: "Rented" },
                          { label: "Draft (Internal Only)", value: "Draft" }
                        ]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidential Broker Notes / Follow-ups</label>
                      <textarea value={wBrokerNotes} onChange={e => setWBrokerNotes(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-forest text-xs bg-white h-20 resize-none" placeholder="e.g. Keys are with security gate 2. NRI profiles preferred." />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4 shrink-0 gap-3">
                <button 
                  type="button" 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 transition-colors ${wizardStep === 1 ? 'invisible' : 'visible'}`}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="flex-1 sm:flex-none bg-forest hover:bg-forest-light text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors"
                >
                  {wizardStep === 6 ? 'Submit Listing' : 'Next →'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
         DRAWER OVERLAY: DETAILS PANEL (INR Rendering)
         ---------------------------------------------------- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-800/20 backdrop-blur-[1px] flex justify-end z-40" onClick={() => setIsDrawerOpen(false)}>
          <div className="w-[500px] max-w-[95%] h-full bg-white border-l border-slate-200/80 shadow-2xl flex flex-col animate-slide-in" onClick={e => e.stopPropagation()}>
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-serif text-2xl font-medium text-forest">Property Detail Sheet</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {/* Drawer Body content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {(() => {
                const p = listings.find(l => l.id === viewingListingId);
                if (!p) return <div>Property details not found.</div>;
                const priceLabel = p.purpose === 'Rent' ? '/ month' : '';
                return (
                  <>
                    {/* Media Gallery (Photos) */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Property Gallery</div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {(p.media?.filter(m => m.type === 'Photo').map(m => m.url) || [p.image]).map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            className="w-44 h-32 object-cover rounded-lg border border-slate-200 shrink-0 shadow-sm" 
                            alt={`Photo ${index + 1}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Walkthrough Video Player */}
                    {(p.media?.find(m => m.type === 'Video')?.url || p.id === 'prop-1' || p.id === 'prop-2' || p.id === 'prop-3') && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Walkthrough Video Walk-in</div>
                        <video 
                          src={p.media?.find(m => m.type === 'Video')?.url || 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-entrance-with-modern-lighting-42416-large.mp4'} 
                          controls 
                          className="w-full h-48 rounded-lg object-cover bg-black border border-slate-200 shadow-sm"
                        />
                      </div>
                    )}
                    
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">{p.locality}, {p.city}</span>
                      <h2 className="font-serif text-3xl text-forest font-light leading-snug">{p.bhk === 'N/A' ? '' : p.bhk + ' BHK '}{p.type} at {p.society}</h2>
                      <span className="text-xs text-slate-400 block mt-1">{p.address}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Specifications</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Category</span><span className="font-semibold text-forest">{p.type} (For {p.purpose})</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Carpet Area</span><span className="font-semibold text-forest">{p.carpetArea} sqft</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Floor Layout</span><span className="font-semibold text-forest">{p.floor}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Facing Facade</span><span className="font-semibold text-forest">{p.facing}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Rooms</span><span className="font-semibold text-forest">{p.bhk} BHK • {p.bathrooms} Bath</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Furnishing</span><span className="font-semibold text-forest">{p.furnishing}</span></div>
                        <div className="flex flex-col col-span-2"><span className="text-[9px] text-slate-400 uppercase">Amenities Included</span><span className="text-slate-500 mt-0.5">{p.amenities?.join(' • ') || 'None'}</span></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Financial Parameters</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Asking Price</span><span className="font-serif text-lg font-bold text-forest">{formatCurrency(p.price)} {priceLabel}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Rate per Sq. Ft.</span><span className="font-semibold text-brass">{p.carpetArea > 0 ? formatCurrency(Math.round(p.price / p.carpetArea)) : 'N/A'}/sqft{p.purpose === 'Rent' && ' /mo'}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Security Deposit</span><span className="font-semibold text-forest">{p.purpose === 'Rent' ? formatCurrency(p.deposit) : 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Maintenance Fee</span><span className="font-semibold text-forest">{formatCurrency(p.maintenance)} /mo</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Price Negotiation</span><span className="font-semibold text-forest">{p.negotiable}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Available Date</span><span className="font-semibold text-forest">{p.availableDate}</span></div>
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Tenant Preference</span><span className="font-semibold text-forest">{p.purpose === 'Rent' ? p.preferredTenant : 'N/A'}</span></div>
                      </div>
                    </div>

                    {/* Active Deal & Offer Status */}
                    {(() => {
                      const currentOffer = offers.find(o => o.listingId === p.id);
                      return (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Offer & Negotiation Ledger</span>
                            <button
                              onClick={() => {
                                setTargetOfferListingId(p.id);
                                if (currentOffer) {
                                  setOfferClientName(currentOffer.clientName);
                                  setOfferClientPhone(currentOffer.clientPhone);
                                  setOfferPrice(currentOffer.offeredPrice);
                                  setOfferCounterPrice(currentOffer.counterPrice || '');
                                  setOfferTokenAmount(currentOffer.tokenAmount || '');
                                  setOfferStage(currentOffer.stage);
                                  setOfferNotes(currentOffer.notes || '');
                                } else {
                                  setOfferClientName('');
                                  setOfferClientPhone('');
                                  setOfferPrice('');
                                  setOfferCounterPrice('');
                                  setOfferTokenAmount('');
                                  setOfferNotes('');
                                  setOfferStage('Offer Received');
                                }
                                setIsLogOfferOpen(true);
                              }}
                              className="text-[10px] font-bold text-forest hover:text-brass flex items-center gap-1 uppercase tracking-wider"
                            >
                              <PlusCircle className="w-3 h-3" /> {currentOffer ? 'Update Offer' : 'Log Offer'}
                            </button>
                          </div>

                          {currentOffer ? (
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">Client: <strong>{currentOffer.clientName}</strong> ({currentOffer.clientPhone})</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  currentOffer.stage === 'Token Received' ? 'bg-pastel-mint text-green-900' :
                                  currentOffer.stage === 'Deal Closed' ? 'bg-forest text-white' :
                                  currentOffer.stage === 'Counter Offer' ? 'bg-pastel-gold text-amber-900' :
                                  'bg-pastel-blue text-blue-900'
                                }`}>
                                  {currentOffer.stage}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-slate-200">
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase">Client Offered</span>
                                  <span className="font-serif font-bold text-forest text-sm">{formatPriceShort(currentOffer.offeredPrice)}</span>
                                </div>
                                {currentOffer.counterPrice && (
                                  <div>
                                    <span className="text-[9px] text-amber-800 block uppercase">Owner Counter</span>
                                    <span className="font-serif font-bold text-amber-900 text-sm">{formatPriceShort(currentOffer.counterPrice)}</span>
                                  </div>
                                )}
                                {currentOffer.tokenAmount && (
                                  <div className="col-span-2 border-t border-slate-100 pt-1 mt-1">
                                    <span className="text-[9px] text-green-800 block uppercase">Earnest Token Paid</span>
                                    <span className="font-serif font-bold text-green-700">{formatPriceShort(currentOffer.tokenAmount)}</span>
                                  </div>
                                )}
                              </div>
                              {currentOffer.notes && <p className="text-[10px] text-slate-500 italic">"{currentOffer.notes}"</p>}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic">No active price offer logged for this listing yet.</div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Matched Prospective Clients (Auto-Match Engine) */}
                    {(() => {
                      const matchedClients = showings.map(s => ({
                        showing: s,
                        score: calculateMatchScore(p, {
                          purpose: p.purpose,
                          type: p.type,
                          maxBudget: p.price * 1.1,
                          locality: p.locality,
                          bhk: p.bhk
                        })
                      })).sort((a, b) => b.score - a.score);

                      return (
                        <div className="space-y-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 flex justify-between items-center">
                            <span>Matched Client Leads</span>
                            <span className="text-forest font-bold">{matchedClients.length} Interested Clients</span>
                          </div>
                          <div className="space-y-2">
                            {matchedClients.map(({ showing: s, score }) => (
                              <div key={s.id} className="p-2.5 bg-pastel-bg/30 border border-slate-200/60 rounded-lg flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-semibold text-forest block">{s.clientName}</span>
                                  <span className="text-[10px] text-slate-400">{s.clientPhone} • {s.status}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  score >= 80 ? 'bg-pastel-mint text-green-900' : 'bg-pastel-gold text-amber-900'
                                }`}>
                                  {score}% Match
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Marketing Highlight Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {p.marketingTags?.map(tag => (
                          <span key={tag} className="bg-pastel-mint text-forest px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">AI Generated Copy</div>
                      <div className="bg-pastel-sidebar/50 p-4 border border-slate-200/50 rounded-lg text-xs leading-relaxed text-forest">
                        {p.aiDescription || 'No description composed.'}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(p.aiDescription || '');
                          alert("Marketing copy copied to clipboard!");
                        }}
                        className="bg-pastel-sidebar border border-slate-200/80 px-4 py-2 rounded text-xs font-semibold hover:bg-slate-100 transition-all uppercase tracking-wider"
                      >
                        Copy Description
                      </button>
                    </div>

                    <div className="space-y-3 bg-pastel-bg/50 p-5 rounded-lg border border-slate-200/80">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/50 pb-1">Confidential Broker Register</div>
                      
                      {activeRole === 'consultant' ? (
                        <div className="bg-pastel-mint/35 p-3 rounded text-[10px] text-forest font-semibold mb-2">
                          Consultant Mode: Read-only access to assigned property registry.
                        </div>
                      ) : null}

                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Owner Name</span><span className="font-semibold text-forest">{p.ownerName}</span></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase">Owner Phone</span>
                          <span className="font-semibold text-forest">{p.ownerPhone}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="text-[9px] text-slate-400 uppercase">Owner Email</span>
                          <span className="font-medium text-forest">{p.ownerEmail || 'Not registered'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="flex flex-col"><span className="text-[9px] text-slate-400 uppercase">Assigned Broker</span><span className="font-semibold text-forest">{p.assignedAgent}</span></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase">Listing Status</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold w-max uppercase ${
                            p.status === 'Active' ? 'bg-pastel-mint text-forest' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col text-xs">
                        <span className="text-[9px] text-slate-400 uppercase mb-1">Confidential Follow-up Notes</span>
                        <div className="bg-white p-3 rounded border border-slate-100 text-forest text-xs italic leading-relaxed border-l-4 border-l-brass">
                          {p.internalNotes || 'No notes added.'}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Drawer Footer controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-500 hover:bg-slate-50">Close</button>
              {activeRole === 'admin' && (
                <>
                  <button 
                    onClick={() => handleDelete(viewingListingId!)}
                    className="bg-pastel-red text-red-800 border border-red-200/50 px-4 py-2 rounded text-xs font-semibold hover:bg-red-200/50 transition-colors"
                  >
                    Delete Listing
                  </button>
                  <button 
                    onClick={() => handleEditClick(viewingListingId!)}
                    className="bg-forest hover:bg-forest-light text-white font-semibold text-xs py-2 px-4 rounded-md transition-colors"
                  >
                    Edit Listing
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );

  function triggerListingDrawer(id: string) {
    setViewingListingId(id);
    setIsDrawerOpen(true);
  }

  // Restricts tab routing to only main tabs
  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setIsDrawerOpen(false);
    setIsMobileSidebarOpen(false);
  }
}
