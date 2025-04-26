
// Core Types
export interface LawFirm {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Lead {
  id: number;
  lawFirmId: number;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
}

export interface IntakeResponse {
  id: number;
  leadId: number;
  questionKey: string;
  answer: string;
}

export interface AccountSettings {
  id: number;
  lawFirmId: number;
  email: string;
  passwordHash: string;
  profileImage: string | null;
  updatedAt: string;
}

// Direct Mail Related Types
export interface State {
  id: number;
  name: string;
}

export interface County {
  id: number;
  stateId: number;
  name: string;
}

export interface AreaOfLaw {
  id: number;
  name: string;
}

export interface FirmMailSetting {
  id: number;
  firmId: number;
  stateId: number;
  countyId: number;
  createdAt: string;
  // For UI display convenience
  stateName?: string;
  countyName?: string;
}

export interface FirmMailLaw {
  id: number;
  mailSettingId: number;
  areaOfLawId: number;
}

// Form Data Types
export interface FormData {
  name: string;
  email: string;
  phone: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firmName: string;
  slug: string;
}

// UI Types for convenience
export interface AreaSelection {
  state: string;
  stateName: string;
  county: string;
  countyName: string;
  areas: string[];
}

export interface LeadWithResponses extends Lead {
  responses?: IntakeResponse[];
}

// Mock Data Types (for display only)
export interface MockLawFirmWithDetails extends LawFirm {
  email?: string;
  lastLogin?: string;
  leadsCount?: number;
}
