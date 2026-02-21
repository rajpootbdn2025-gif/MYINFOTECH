
import { 
  Fingerprint, CreditCard, Globe, Landmark, Plane, 
  FileText, ShieldCheck, Zap, Smartphone, Briefcase,
  Users, Home, Truck, GraduationCap, ReceiptIndianRupee,
  FilePenLine, FileCheck, FileBadge, UserCheck, Building2,
  Scale, CarFront, HeartPulse, HardDriveDownload, Banknote,
  Stamp, Printer, FileType, Search, MapPin, ClipboardCheck,
  Stethoscope, TrainFront, ShieldPlus, Ticket, UserSearch,
  Sprout, ScanLine
} from 'lucide-react';
import React from 'react';

export enum ServiceCategory {
  G2C = 'Government to Citizen',
  B2C = 'Business to Citizen',
  PRINT = 'Print Services'
}

export type UploadType = 'Aadhaar' | 'Photo' | 'Signature' | 'PAN' | 'Self-Declaration' | 'Bank Passbook' | 'Income Certificate' | 'Ration Card';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  translateToHindi?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: ServiceCategory;
  description: string;
  fee: number;
  isRedirect?: boolean;
  redirectUrl?: string;
  formFields?: FormField[];
  requiredUploads?: UploadType[];
}

const APPLICANT_CORE: FormField[] = [
  { id: 'fullName', label: 'Applicant Name', type: 'text', required: true, placeholder: 'As per Aadhaar', translateToHindi: true },
  { id: 'guardianName', label: "Father/Husband's Name", type: 'text', required: true, translateToHindi: true },
  { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
  { id: 'mobile', label: 'Mobile Number', type: 'text', required: true, placeholder: '10-digit number' },
];

export const SERVICES_DATA: ServiceItem[] = [
  // --- REDIRECT SERVICES (FEES 0) ---
  { 
    id: 'aadhaar-r', name: 'Aadhaar Services', icon: <Fingerprint className="w-8 h-8 text-orange-600" />, category: ServiceCategory.G2C, 
    description: 'Update, Print, Lock/Unlock', fee: 0, isRedirect: true, redirectUrl: 'https://myaadhaar.uidai.gov.in/' 
  },
  { 
    id: 'voter-r', name: 'Voter ID Card', icon: <UserCheck className="w-8 h-8 text-blue-500" />, category: ServiceCategory.G2C, 
    description: 'New Registration & Correction', fee: 0, isRedirect: true, redirectUrl: 'https://voters.eci.gov.in/' 
  },
  { 
    id: 'dl-r', name: 'Driving License', icon: <CarFront className="w-8 h-8 text-slate-700" />, category: ServiceCategory.G2C, 
    description: 'Learning & Permanent License', fee: 0, isRedirect: true, redirectUrl: 'https://parivahan.gov.in/' 
  },
  { 
    id: 'passport-r', name: 'Passport Seva', icon: <Globe className="w-8 h-8 text-indigo-600" />, category: ServiceCategory.G2C, 
    description: 'Appointment, Status, Renewal', fee: 0, isRedirect: true, redirectUrl: 'https://www.passportindia.gov.in/' 
  },
  { 
    id: 'ayushman-r', name: 'Ayushman Bharat', icon: <ShieldCheck className="w-8 h-8 text-green-600" />, category: ServiceCategory.G2C, 
    description: 'Golden Card Printing', fee: 0, isRedirect: true, redirectUrl: 'https://setu.pmjay.gov.in/' 
  },
  { 
    id: 'pmkisan-r', name: 'PM-KISAN', icon: <Landmark className="w-8 h-8 text-emerald-600" />, category: ServiceCategory.G2C, 
    description: 'e-KYC, Status Check', fee: 0, isRedirect: true, redirectUrl: 'https://pmkisan.gov.in/' 
  },
  { 
    id: 'eshram-r', name: 'e-Shram', icon: <Briefcase className="w-8 h-8 text-amber-600" />, category: ServiceCategory.G2C, 
    description: 'Card Registration & Update', fee: 0, isRedirect: true, redirectUrl: 'https://eshram.gov.in/' 
  },
  { 
    id: 'bank-r', name: 'Banking / AEPS', icon: <Banknote className="w-8 h-8 text-green-700" />, category: ServiceCategory.B2C, 
    description: 'Cash Withdrawal, Money Transfer', fee: 0, isRedirect: true, redirectUrl: 'https://www.npci.org.in/' 
  },
  { 
    id: 'gst-r', name: 'GST Services', icon: <Building2 className="w-8 h-8 text-indigo-700" />, category: ServiceCategory.B2C, 
    description: 'Registration & Monthly Filing', fee: 0, isRedirect: true, redirectUrl: 'https://www.gst.gov.in/' 
  },
  { 
    id: 'udyam-r', name: 'Udyam Registration', icon: <ClipboardCheck className="w-8 h-8 text-blue-700" />, category: ServiceCategory.B2C, 
    description: 'MSME Business Certificate', fee: 0, isRedirect: true, redirectUrl: 'https://udyamregistration.gov.in/' 
  },
  { 
    id: 'bills-r', name: 'Bill Payments', icon: <Zap className="w-8 h-8 text-yellow-500" />, category: ServiceCategory.B2C, 
    description: 'Electricity, Water, Gas', fee: 0, isRedirect: true, redirectUrl: 'https://www.bbps.org.in/' 
  },
  { 
    id: 'recharge-r', name: 'Recharge (DTH/Mobile)', icon: <Smartphone className="w-8 h-8 text-pink-500" />, category: ServiceCategory.B2C, 
    description: 'All Operators Available', fee: 0, isRedirect: true, redirectUrl: 'https://www.rechargeitnow.com/' 
  },
  { 
    id: 'travel-r', name: 'Travel Booking', icon: <TrainFront className="w-8 h-8 text-sky-600" />, category: ServiceCategory.B2C, 
    description: 'Train (IRCTC), Flight, Bus', fee: 0, isRedirect: true, redirectUrl: 'https://www.irctc.co.in/' 
  },
  { 
    id: 'insurance-r', name: 'Insurance', icon: <ShieldPlus className="w-8 h-8 text-red-600" />, category: ServiceCategory.B2C, 
    description: 'Vehicle, Health, Life', fee: 0, isRedirect: true, redirectUrl: 'https://www.policybazaar.com/' 
  },
  { 
    id: 'fastag-r', name: 'Fastag Services', icon: <Truck className="w-8 h-8 text-slate-600" />, category: ServiceCategory.B2C, 
    description: 'New Tag, Recharge', fee: 0, isRedirect: true, redirectUrl: 'https://www.npci.org.in/what-we-do/netc-fastag/product-overview' 
  },
  { 
    id: 'edu-r', name: 'Education', icon: <GraduationCap className="w-8 h-8 text-blue-800" />, category: ServiceCategory.B2C, 
    description: 'College Forms, Exam Fees', fee: 0, isRedirect: true, redirectUrl: 'https://www.upmsp.edu.in/' 
  },

  // --- INTERNAL APPLICATION SERVICES ---
  { 
    id: 'pan-new', name: 'New PAN Card', icon: <CreditCard className="w-8 h-8 text-blue-600" />, category: ServiceCategory.G2C, 
    description: 'Apply for New PAN', fee: 130, requiredUploads: ['Aadhaar', 'Photo', 'Signature'],
    formFields: [...APPLICANT_CORE, { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'] }]
  },
  { 
    id: 'pan-corr', name: 'PAN Correction', icon: <FilePenLine className="w-8 h-8 text-indigo-600" />, category: ServiceCategory.G2C, 
    description: 'Update/Correct PAN Data', fee: 130, requiredUploads: ['PAN', 'Aadhaar', 'Photo', 'Signature'],
    formFields: [...APPLICANT_CORE, { id: 'panNum', label: 'Existing PAN Number', type: 'text', required: true }]
  },
  { 
    id: 'domicile', name: 'Domicile Certificate', icon: <MapPin className="w-8 h-8 text-teal-600" />, category: ServiceCategory.G2C, 
    description: 'Niwas Praman Patra Apply', fee: 30, requiredUploads: ['Aadhaar', 'Self-Declaration', 'Photo'],
    formFields: [...APPLICANT_CORE, { id: 'tehsil', label: 'Tehsil', type: 'text', required: true }]
  },
  { 
    id: 'caste', name: 'Caste Certificate', icon: <FileBadge className="w-8 h-8 text-pink-600" />, category: ServiceCategory.G2C, 
    description: 'Jati Praman Patra Apply', fee: 30, requiredUploads: ['Aadhaar', 'Self-Declaration', 'Photo'],
    formFields: [...APPLICANT_CORE, { id: 'casteCategory', label: 'Caste Category', type: 'select', options: ['SC', 'ST', 'OBC'], required: true }]
  },

  // --- PRINT & SPECIAL SERVICES ---
  { 
    id: 'pan-2-print', name: 'PAN Card 2.0 Print', icon: <ScanLine className="w-8 h-8 text-blue-700" />, category: ServiceCategory.PRINT, 
    description: 'Ultra HD Quality New PAN 2.0 Print', fee: 50,
    formFields: [
      { id: 'panNumber', label: 'PAN Number', type: 'text', required: true, placeholder: 'ABCDE1234F' },
      { id: 'fullName', label: 'Applicant Name', type: 'text', required: true, translateToHindi: true },
      { id: 'guardianName', label: "Father's Name", type: 'text', required: true, translateToHindi: true },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'issueDate', label: 'Issue Date (Optional)', type: 'date' }
    ],
    requiredUploads: ['Photo', 'Signature']
  },
  { 
    id: 'ration-print', name: 'Ration Card Print', icon: <Printer className="w-8 h-8 text-orange-900" />, category: ServiceCategory.PRINT, 
    description: 'Official Ration Card Print', fee: 30,
    formFields: [
      { id: 'rationNumber', label: 'Ration Card Number', type: 'text', required: true },
      { id: 'headOfFamily', label: 'Head of Family Name', type: 'text', required: true, translateToHindi: true },
      { id: 'fpsNo', label: 'Fare Price Shop No', type: 'text', required: true },
      { id: 'schemeName', label: 'Scheme Name', type: 'select', options: ['PHH', 'AAY'], required: true },
      { id: 'address', label: 'Full Address', type: 'textarea', required: true, translateToHindi: true }
    ],
    requiredUploads: ['Photo']
  },
  { 
    id: 'farmer-print', name: 'Farmer Card Print', icon: <Sprout className="w-8 h-8 text-emerald-600" />, category: ServiceCategory.PRINT, 
    description: 'Kisan Registration Card Print', fee: 30,
    formFields: [
      { id: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: true },
      { id: 'fullName', label: 'Farmer Full Name', type: 'text', required: true, translateToHindi: true },
      { id: 'guardianName', label: "Father/Husband's Name", type: 'text', required: true, translateToHindi: true },
      { id: 'kisanId', label: 'Kisan Registration ID', type: 'text', required: true },
      { id: 'village', label: 'Village / Tehsil', type: 'text', required: true, translateToHindi: true }
    ],
    requiredUploads: ['Photo']
  },
  { 
    id: 'kishan-card-print', name: 'Kishan Card Print', icon: <Sprout className="w-8 h-8 text-emerald-600" />, category: ServiceCategory.PRINT, 
    description: 'Official PM-Kisan Card Printing Service (Manual)', fee: 30,
    formFields: [
      { id: 'kisanId', label: 'Farmer ID', type: 'text', required: true, placeholder: 'Kisan Registration ID' },
      { id: 'aadhaarNumber', label: 'Farmer Aadhaar Number', type: 'text', required: true, placeholder: '12-digit Aadhaar' },
      { id: 'fullName', label: 'Farmer Full Name', type: 'text', required: true, translateToHindi: true },
      { id: 'guardianName', label: "Father/Husband's Name", type: 'text', required: true, translateToHindi: true },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'address', label: 'Full Address', type: 'textarea', required: true, translateToHindi: true }
    ],
    requiredUploads: ['Photo']
  },
  { 
    id: 'kishan-card-advance', name: 'Kishan Card Advance Print', icon: <ScanLine className="w-8 h-8 text-orange-600" />, category: ServiceCategory.PRINT, 
    description: 'Instant Kishan Card via Aadhaar Fetch', fee: 50,
    formFields: [
      { id: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhaar' }
    ],
    requiredUploads: ['Aadhaar']
  }
];

export const DOWNLOAD_LINKS = [
  { title: 'Self Declaration Form (Hindi)', size: '450 KB' },
  { title: 'PAN Correction Form (CSF)', size: '1.2 MB' },
  { title: 'Aadhaar Update Form', size: '850 KB' },
  { title: 'Income Cert Declaration', size: '520 KB' },
];
