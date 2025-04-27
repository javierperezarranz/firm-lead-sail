// Core Types
export interface LawFirm {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  lawFirmId: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
}

export interface IntakeResponse {
  id: string;
  leadId: string;
  questionKey: string;
  answer: string;
}

export interface AccountSettings {
  id: string;
  lawFirmId: string;
  email: string;
  passwordHash: string;
  profileImage: string | null;
  updatedAt: string;
}

// Direct Mail Related Types
export interface State {
  id: string;
  name: string;
}

export interface County {
  id: string;
  stateId: string;
  name: string;
}

export interface AreaOfLaw {
  id: string;
  name: string;
}

export interface FirmMailSetting {
  id: string;
  firmId: string;
  stateId: string;
  countyId: string;
  createdAt: string;
  stateName?: string;
  countyName?: string;
}

export interface FirmMailLaw {
  id: string;
  mailSettingId: string;
  areaOfLawId: string;
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
