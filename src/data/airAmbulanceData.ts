// Air Ambulance Lead Types and Dummy Data

export type EmergencyLevel = "Critical" | "High" | "Planned";
export type LeadSource = "Call" | "Website" | "Hospital" | "Partner";
export type InsuranceStatus = "Verified" | "Pending" | "Not Covered";
export type LeadStatus = 
  | "New Lead" 
  | "Medical Review" 
  | "Aircraft Feasibility" 
  | "Quote Generated" 
  | "Shared with Client" 
  | "Assigned to Operator" 
  | "Mission Active" 
  | "Completed" 
  | "Closed";
export type OperatorResponseStatus = "Pending" | "Accepted" | "Rejected";
export type AircraftType = "Fixed Wing" | "Helicopter";
export type AvailabilityStatus = "Available" | "On Mission" | "Maintenance" | "Standby";

export interface MedicalRequirements {
  icu: boolean;
  ventilator: boolean;
  doctorOnboard: boolean;
  nurseOnboard: boolean;
}

export interface StatusLog {
  status: LeadStatus;
  timestamp: string;
  adminUser: string;
  notes?: string;
}

export interface AirAmbulanceLead {
  id: string;
  source: LeadSource;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactPhone: string;
  contactEmail: string;
  emergencyLevel: EmergencyLevel;
  patientCondition: string;
  conditionCategory: string;
  sourceHospital: string;
  sourceCity: string;
  destinationHospital: string;
  destinationCity: string;
  insuranceProvider: string;
  insurancePlan: string;
  insuranceStatus: InsuranceStatus;
  medicalRequirements: MedicalRequirements;
  status: LeadStatus;
  statusHistory: StatusLog[];
  assignedOperator?: string;
  assignedAircraft?: string;
  quotedPrice?: number;
  operatorResponse?: OperatorResponseStatus;
  createdAt: string;
  documents: string[];
}

export interface AirAmbulanceAircraft {
  id: string;
  type: AircraftType;
  name: string;
  registration: string;
  image: string;
  medicalConfig: MedicalRequirements;
  baseLocation: string;
  baseAirport: string;
  range: number; // km
  speed: number; // km/h
  availability: AvailabilityStatus;
  operatorId: string;
  operatorName: string;
  complianceStatus: "Valid" | "Expiring" | "Expired";
  lastMission?: string;
  coordinates: { lat: number; lng: number };
}

export interface AirAmbulanceOperator {
  id: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  coveredRegions: string[];
  aircraftCount: number;
  aircraftIds: string[];
  pricingBase: number;
  slaRating: number;
  totalMissions: number;
  successRate: number;
  responseTime: string;
  status: "Active" | "Inactive";
}

export interface PricingBreakdown {
  baseCost: number;
  positioningCost: number;
  medicalCrewCost: number;
  landingParking: number;
  asrMargin: number;
  emergencySurcharge: number;
  insuranceDiscount: number;
  gst: number;
  total: number;
}

// Dummy Data
export const airAmbulanceLeads: AirAmbulanceLead[] = [
  {
    id: "AAL-2024-001",
    source: "Hospital",
    patientName: "Rajesh Kumar",
    age: 58,
    gender: "Male",
    contactPhone: "+91 98765 43210",
    contactEmail: "family.kumar@gmail.com",
    emergencyLevel: "Critical",
    patientCondition: "Acute myocardial infarction requiring immediate cardiac intervention",
    conditionCategory: "Cardiac Emergency",
    sourceHospital: "District Hospital Lucknow",
    sourceCity: "Lucknow",
    destinationHospital: "AIIMS Delhi",
    destinationCity: "Delhi",
    insuranceProvider: "Star Health Insurance",
    insurancePlan: "Family Health Optima",
    insuranceStatus: "Verified",
    medicalRequirements: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    status: "Mission Active",
    statusHistory: [
      { status: "New Lead", timestamp: "2024-01-15T08:30:00Z", adminUser: "Admin_Priya" },
      { status: "Medical Review", timestamp: "2024-01-15T08:45:00Z", adminUser: "Admin_Priya", notes: "Critical condition confirmed" },
      { status: "Aircraft Feasibility", timestamp: "2024-01-15T09:00:00Z", adminUser: "Admin_Raj" },
      { status: "Quote Generated", timestamp: "2024-01-15T09:15:00Z", adminUser: "Admin_Raj" },
      { status: "Shared with Client", timestamp: "2024-01-15T09:20:00Z", adminUser: "Admin_Priya" },
      { status: "Assigned to Operator", timestamp: "2024-01-15T09:30:00Z", adminUser: "Admin_Priya" },
      { status: "Mission Active", timestamp: "2024-01-15T10:00:00Z", adminUser: "Admin_Raj", notes: "Aircraft airborne" },
    ],
    assignedOperator: "MediFly Aviation",
    assignedAircraft: "AA-AC-001",
    quotedPrice: 485000,
    operatorResponse: "Accepted",
    createdAt: "2024-01-15T08:30:00Z",
    documents: ["medical_report.pdf", "insurance_approval.pdf"],
  },
  {
    id: "AAL-2024-002",
    source: "Call",
    patientName: "Anita Sharma",
    age: 34,
    gender: "Female",
    contactPhone: "+91 87654 32109",
    contactEmail: "sharma.family@outlook.com",
    emergencyLevel: "High",
    patientCondition: "High-risk pregnancy with complications requiring specialized care",
    conditionCategory: "Obstetric Emergency",
    sourceHospital: "City Hospital Jaipur",
    sourceCity: "Jaipur",
    destinationHospital: "Fortis Hospital Gurgaon",
    destinationCity: "Gurgaon",
    insuranceProvider: "ICICI Lombard",
    insurancePlan: "Complete Health Insurance",
    insuranceStatus: "Pending",
    medicalRequirements: { icu: true, ventilator: false, doctorOnboard: true, nurseOnboard: true },
    status: "Quote Generated",
    statusHistory: [
      { status: "New Lead", timestamp: "2024-01-15T10:00:00Z", adminUser: "Admin_Raj" },
      { status: "Medical Review", timestamp: "2024-01-15T10:30:00Z", adminUser: "Admin_Priya" },
      { status: "Aircraft Feasibility", timestamp: "2024-01-15T11:00:00Z", adminUser: "Admin_Raj" },
      { status: "Quote Generated", timestamp: "2024-01-15T11:30:00Z", adminUser: "Admin_Raj" },
    ],
    quotedPrice: 320000,
    createdAt: "2024-01-15T10:00:00Z",
    documents: ["medical_report.pdf"],
  },
  {
    id: "AAL-2024-003",
    source: "Website",
    patientName: "Mohammed Ali",
    age: 72,
    gender: "Male",
    contactPhone: "+91 76543 21098",
    contactEmail: "ali.family@gmail.com",
    emergencyLevel: "Planned",
    patientCondition: "Post-operative care transfer for hip replacement surgery follow-up",
    conditionCategory: "Post-Surgical Transfer",
    sourceHospital: "Apollo Hospital Chennai",
    sourceCity: "Chennai",
    destinationHospital: "Apollo Hospital Hyderabad",
    destinationCity: "Hyderabad",
    insuranceProvider: "Max Bupa",
    insurancePlan: "GoActive Plan",
    insuranceStatus: "Verified",
    medicalRequirements: { icu: false, ventilator: false, doctorOnboard: false, nurseOnboard: true },
    status: "Shared with Client",
    statusHistory: [
      { status: "New Lead", timestamp: "2024-01-14T14:00:00Z", adminUser: "Admin_Priya" },
      { status: "Medical Review", timestamp: "2024-01-14T15:00:00Z", adminUser: "Admin_Raj" },
      { status: "Aircraft Feasibility", timestamp: "2024-01-14T16:00:00Z", adminUser: "Admin_Priya" },
      { status: "Quote Generated", timestamp: "2024-01-14T17:00:00Z", adminUser: "Admin_Raj" },
      { status: "Shared with Client", timestamp: "2024-01-14T17:30:00Z", adminUser: "Admin_Priya" },
    ],
    quotedPrice: 185000,
    createdAt: "2024-01-14T14:00:00Z",
    documents: [],
  },
  {
    id: "AAL-2024-004",
    source: "Partner",
    patientName: "Priya Patel",
    age: 28,
    gender: "Female",
    contactPhone: "+91 65432 10987",
    contactEmail: "priya.patel@email.com",
    emergencyLevel: "Critical",
    patientCondition: "Severe trauma from road accident requiring neurosurgical intervention",
    conditionCategory: "Trauma Emergency",
    sourceHospital: "Civil Hospital Ahmedabad",
    sourceCity: "Ahmedabad",
    destinationHospital: "NIMHANS Bangalore",
    destinationCity: "Bangalore",
    insuranceProvider: "Bajaj Allianz",
    insurancePlan: "Health Guard Gold",
    insuranceStatus: "Not Covered",
    medicalRequirements: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    status: "Medical Review",
    statusHistory: [
      { status: "New Lead", timestamp: "2024-01-15T12:00:00Z", adminUser: "Admin_Raj" },
      { status: "Medical Review", timestamp: "2024-01-15T12:15:00Z", adminUser: "Admin_Priya", notes: "Awaiting detailed CT scan reports" },
    ],
    createdAt: "2024-01-15T12:00:00Z",
    documents: ["accident_report.pdf"],
  },
  {
    id: "AAL-2024-005",
    source: "Hospital",
    patientName: "Suresh Reddy",
    age: 45,
    gender: "Male",
    contactPhone: "+91 54321 09876",
    contactEmail: "reddy.suresh@gmail.com",
    emergencyLevel: "High",
    patientCondition: "Acute kidney failure requiring urgent dialysis and transplant evaluation",
    conditionCategory: "Renal Emergency",
    sourceHospital: "KIMS Hospital Secunderabad",
    sourceCity: "Hyderabad",
    destinationHospital: "CMC Vellore",
    destinationCity: "Vellore",
    insuranceProvider: "HDFC Ergo",
    insurancePlan: "Optima Restore",
    insuranceStatus: "Verified",
    medicalRequirements: { icu: true, ventilator: false, doctorOnboard: true, nurseOnboard: true },
    status: "New Lead",
    statusHistory: [
      { status: "New Lead", timestamp: "2024-01-15T13:00:00Z", adminUser: "Admin_Raj" },
    ],
    createdAt: "2024-01-15T13:00:00Z",
    documents: [],
  },
];

export const airAmbulanceAircraft: AirAmbulanceAircraft[] = [
  {
    id: "AA-AC-001",
    type: "Fixed Wing",
    name: "Beechcraft King Air 350",
    registration: "VT-ASR",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Delhi",
    baseAirport: "Indira Gandhi International Airport (DEL)",
    range: 2800,
    speed: 580,
    availability: "On Mission",
    operatorId: "OP-001",
    operatorName: "MediFly Aviation",
    complianceStatus: "Valid",
    lastMission: "2024-01-15",
    coordinates: { lat: 28.5562, lng: 77.1000 },
  },
  {
    id: "AA-AC-002",
    type: "Helicopter",
    name: "AgustaWestland AW139",
    registration: "VT-MED",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Mumbai",
    baseAirport: "Juhu Aerodrome (JUH)",
    range: 1060,
    speed: 310,
    availability: "Available",
    operatorId: "OP-002",
    operatorName: "LifeLine Air Ambulance",
    complianceStatus: "Valid",
    coordinates: { lat: 19.0989, lng: 72.8347 },
  },
  {
    id: "AA-AC-003",
    type: "Fixed Wing",
    name: "Pilatus PC-12",
    registration: "VT-PCM",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: false, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Chennai",
    baseAirport: "Chennai International Airport (MAA)",
    range: 3400,
    speed: 520,
    availability: "Available",
    operatorId: "OP-003",
    operatorName: "SkyMed India",
    complianceStatus: "Expiring",
    coordinates: { lat: 12.9941, lng: 80.1709 },
  },
  {
    id: "AA-AC-004",
    type: "Helicopter",
    name: "Bell 429",
    registration: "VT-BEL",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Bangalore",
    baseAirport: "HAL Airport (BLR)",
    range: 760,
    speed: 280,
    availability: "Maintenance",
    operatorId: "OP-003",
    operatorName: "SkyMed India",
    complianceStatus: "Valid",
    coordinates: { lat: 12.9499, lng: 77.6681 },
  },
  {
    id: "AA-AC-005",
    type: "Fixed Wing",
    name: "Learjet 45XR",
    registration: "VT-LJT",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: true, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Kolkata",
    baseAirport: "Netaji Subhas Chandra Bose International (CCU)",
    range: 3600,
    speed: 860,
    availability: "Available",
    operatorId: "OP-001",
    operatorName: "MediFly Aviation",
    complianceStatus: "Valid",
    coordinates: { lat: 22.6520, lng: 88.4463 },
  },
  {
    id: "AA-AC-006",
    type: "Helicopter",
    name: "Eurocopter EC145",
    registration: "VT-ECP",
    image: "/placeholder.svg",
    medicalConfig: { icu: true, ventilator: false, doctorOnboard: true, nurseOnboard: true },
    baseLocation: "Hyderabad",
    baseAirport: "Rajiv Gandhi International (HYD)",
    range: 680,
    speed: 250,
    availability: "Standby",
    operatorId: "OP-002",
    operatorName: "LifeLine Air Ambulance",
    complianceStatus: "Valid",
    coordinates: { lat: 17.2403, lng: 78.4294 },
  },
];

export const airAmbulanceOperators: AirAmbulanceOperator[] = [
  {
    id: "OP-001",
    companyName: "MediFly Aviation",
    contactPerson: "Dr. Vikram Singh",
    contactPhone: "+91 98111 22334",
    contactEmail: "operations@medifly.in",
    coveredRegions: ["North India", "East India", "Central India"],
    aircraftCount: 2,
    aircraftIds: ["AA-AC-001", "AA-AC-005"],
    pricingBase: 45000,
    slaRating: 4.8,
    totalMissions: 342,
    successRate: 99.1,
    responseTime: "45 mins",
    status: "Active",
  },
  {
    id: "OP-002",
    companyName: "LifeLine Air Ambulance",
    contactPerson: "Capt. Arjun Mehta",
    contactPhone: "+91 98222 33445",
    contactEmail: "dispatch@lifelineair.co.in",
    coveredRegions: ["West India", "South India"],
    aircraftCount: 2,
    aircraftIds: ["AA-AC-002", "AA-AC-006"],
    pricingBase: 52000,
    slaRating: 4.6,
    totalMissions: 289,
    successRate: 98.6,
    responseTime: "30 mins",
    status: "Active",
  },
  {
    id: "OP-003",
    companyName: "SkyMed India",
    contactPerson: "Ms. Kavitha Rao",
    contactPhone: "+91 98333 44556",
    contactEmail: "control@skymed.in",
    coveredRegions: ["South India", "East India"],
    aircraftCount: 2,
    aircraftIds: ["AA-AC-003", "AA-AC-004"],
    pricingBase: 48000,
    slaRating: 4.5,
    totalMissions: 198,
    successRate: 97.9,
    responseTime: "35 mins",
    status: "Active",
  },
];

export const indianCities = [
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325 },
];

export const conditionCategories = [
  "Cardiac Emergency",
  "Trauma Emergency",
  "Neurological Emergency",
  "Obstetric Emergency",
  "Pediatric Emergency",
  "Renal Emergency",
  "Respiratory Emergency",
  "Post-Surgical Transfer",
  "Organ Transplant",
  "Burns & Critical Care",
  "Other Critical",
];

export const leadStatusFlow: LeadStatus[] = [
  "New Lead",
  "Medical Review",
  "Aircraft Feasibility",
  "Quote Generated",
  "Shared with Client",
  "Assigned to Operator",
  "Mission Active",
  "Completed",
  "Closed",
];
