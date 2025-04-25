
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  lawFirmId: string;
  createdAt: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
}

export interface LawFirm {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AreaOfLaw {
  id: string;
  label: string;
}

export interface AreaSelection {
  state: string;
  stateName: string;
  county: string;
  countyName: string;
  areas: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firmName: string;
}
