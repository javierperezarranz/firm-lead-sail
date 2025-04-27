import { 
  FormData, 
  Lead, 
  LawFirm,
  IntakeResponse,
  AccountSettings,
  State,
  County,
  AreaOfLaw,
  FirmMailSetting,
  FirmMailLaw,
  LeadWithResponses,
  MockLawFirmWithDetails,
  SignupFormData
} from "@/types";

// Helper function to initialize data from localStorage or default values
const initializeData = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper function to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Mock database based on the new schema
// These are initialized from localStorage if available, otherwise use defaults

// Law Firms table
const lawFirms: LawFirm[] = initializeData('lawFirms', [
  {
    id: '1',
    name: "Law Firm 1",
    slug: "lawfirm1",
    createdAt: "2023-06-10T14:00:00Z"
  },
  {
    id: '2',
    name: "Law Firm 2",
    slug: "lawfirm2",
    createdAt: "2023-06-12T10:00:00Z"
  }
]);

// Leads table
const leads: Lead[] = initializeData('leads', [
  {
    id: '1',
    lawFirmId: '1',
    name: "LawFirm1 Client1",
    email: "client1@lf1.com",
    phone: "555-1001",
    submittedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: '2',
    lawFirmId: '1',
    name: "LawFirm1 Client2",
    email: "client2@lf1.com",
    phone: "555-1002",
    submittedAt: "2023-06-16T14:45:00Z"
  },
  {
    id: '3',
    lawFirmId: '2',
    name: "LawFirm2 Client1",
    email: "client1@lf2.com",
    phone: "555-2001",
    submittedAt: "2023-06-17T09:15:00Z"
  }
]);

// Intake Responses table
const intakeResponses: IntakeResponse[] = initializeData('intakeResponses', [
  {
    id: '1',
    leadId: '1',
    questionKey: "case_type",
    answer: "Family Law"
  },
  {
    id: '2',
    leadId: '1',
    questionKey: "budget",
    answer: "$5,000"
  },
  {
    id: '3',
    leadId: '2',
    questionKey: "case_type",
    answer: "Criminal Defense"
  },
  {
    id: '4',
    leadId: '3',
    questionKey: "case_type",
    answer: "Real Estate Purchase"
  }
]);

// Account Settings table
const accountSettings: AccountSettings[] = initializeData('accountSettings', [
  {
    id: '1',
    lawFirmId: '1',
    email: "admin@lf1.com",
    passwordHash: "HASHED_PASSWORD_1",
    profileImage: null,
    updatedAt: "2023-06-10T14:00:00Z"
  },
  {
    id: '2',
    lawFirmId: '2',
    email: "admin@lf2.com",
    passwordHash: "HASHED_PASSWORD_2",
    profileImage: null,
    updatedAt: "2023-06-12T10:00:00Z"
  }
]);

// States table
const states: State[] = initializeData('states', [
  { id: '1', name: "Florida" },
  { id: '2', name: "California" },
  { id: '3', name: "New York" },
  { id: '4', name: "Texas" },
  { id: '5', name: "Illinois" },
]);

// Counties table
const counties: County[] = initializeData('counties', [
  { id: '1', stateId: '1', name: "Miami-Dade" },
  { id: '2', stateId: '1', name: "Broward" },
  { id: '3', stateId: '1', name: "Palm Beach" },
  { id: '4', stateId: '2', name: "Los Angeles" },
  { id: '5', stateId: '2', name: "San Francisco" },
  { id: '6', stateId: '2', name: "San Diego" },
  { id: '7', stateId: '3', name: "New York" },
  { id: '8', stateId: '3', name: "Kings" },
  { id: '9', stateId: '3', name: "Queens" },
  { id: '10', stateId: '4', name: "Harris" },
  { id: '11', stateId: '4', name: "Dallas" },
  { id: '12', stateId: '4', name: "Bexar" },
  { id: '13', stateId: '5', name: "Cook" },
  { id: '14', stateId: '5', name: "DuPage" },
  { id: '15', stateId: '5', name: "Lake" }
]);

// Areas of Law table
const areasOfLaw: AreaOfLaw[] = initializeData('areasOfLaw', [
  { id: '1', name: "Family" },
  { id: '2', name: "Criminal" },
  { id: '3', name: "Real Estate" },
  { id: '4', name: "Marriage" }
]);

// Firm Mail Settings table
const firmMailSettings: FirmMailSetting[] = initializeData('firmMailSettings', [
  {
    id: '1',
    firmId: '1',
    stateId: '1',
    countyId: '1',
    createdAt: "2023-06-15T10:30:00Z"
  }
]);

// Firm Mail Laws table
const firmMailLaws: FirmMailLaw[] = initializeData('firmMailLaws', [
  { id: '1', mailSettingId: '1', areaOfLawId: '1' },
  { id: '2', mailSettingId: '1', areaOfLawId: '2' }
]);

// Helper function to find a law firm by slug
export const getLawFirmBySlug = async (slug: string): Promise<LawFirm | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const firm = lawFirms.find(firm => firm.slug === slug);
  return firm || null;
};

// Get leads for a specific law firm
export const getLeads = async (firmSlug: string): Promise<Lead[]> => {
  console.log(`Fetching leads for ${firmSlug}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return [];
  
  // Filter leads for the specified law firm
  return leads.filter(lead => lead.lawFirmId === firm.id);
};

// Get leads with their intake responses
export const getLeadsWithResponses = async (firmSlug: string): Promise<LeadWithResponses[]> => {
  const firmLeads = await getLeads(firmSlug);
  
  return firmLeads.map(lead => {
    const responses = intakeResponses.filter(response => response.leadId === lead.id);
    return { ...lead, responses };
  });
};

// Submit a new lead
export const submitLead = async (data: FormData, firmSlug: string): Promise<Lead | null> => {
  console.log(`Submitting lead for ${firmSlug}:`, data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the law firm
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return null;
  
  // Create a new lead
  const newLead: Lead = {
    id: leads.length + 1,
    lawFirmId: firm.id,
    ...data,
    submittedAt: new Date().toISOString()
  };
  
  // Add to our mock database
  leads.push(newLead);
  
  // Save updated leads to localStorage
  saveData('leads', leads);
  
  return newLead;
};

// Get all states
export const getStates = async (): Promise<State[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return states;
};

// Get counties for a specific state
export const getCountiesForState = async (stateId: number): Promise<County[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return counties.filter(county => county.stateId === stateId);
};

// Get all areas of law
export const getAreasOfLaw = async (): Promise<AreaOfLaw[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return areasOfLaw;
};

// Get mail settings for a firm
export const getFirmMailSettings = async (firmSlug: string): Promise<FirmMailSetting[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return [];
  
  const settings = firmMailSettings.filter(setting => setting.firmId === firm.id);
  
  // Enhance with state and county names for UI display
  return settings.map(setting => {
    const state = states.find(s => s.id === setting.stateId);
    const county = counties.find(c => c.id === setting.countyId);
    
    return {
      ...setting,
      stateName: state?.name,
      countyName: county?.name
    };
  });
};

// Add a new mail setting for a firm
export const addFirmMailSetting = async (
  firmSlug: string,
  stateId: number,
  countyId: number,
  areaIds: number[]
): Promise<FirmMailSetting | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return null;
  
  // Check if this setting already exists
  const existingSetting = firmMailSettings.find(
    setting => setting.firmId === firm.id && 
               setting.stateId === stateId && 
               setting.countyId === countyId
  );
  
  if (existingSetting) return null;
  
  // Create a new setting
  const newSetting: FirmMailSetting = {
    id: firmMailSettings.length + 1,
    firmId: firm.id,
    stateId,
    countyId,
    createdAt: new Date().toISOString()
  };
  
  firmMailSettings.push(newSetting);
  saveData('firmMailSettings', firmMailSettings);
  
  // Add the areas of law
  areaIds.forEach(areaId => {
    firmMailLaws.push({
      id: firmMailLaws.length + 1,
      mailSettingId: newSetting.id,
      areaOfLawId: areaId
    });
  });
  saveData('firmMailLaws', firmMailLaws);
  
  return newSetting;
};

// Get areas of law for a specific mail setting
export const getAreasForMailSetting = async (mailSettingId: number): Promise<AreaOfLaw[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mailLawIds = firmMailLaws
    .filter(ml => ml.mailSettingId === mailSettingId)
    .map(ml => ml.areaOfLawId);
    
  return areasOfLaw.filter(area => mailLawIds.includes(area.id));
};

// Get areas of law with mail settings for a firm
export const getFirmMailAreasOfLaw = async (firmSlug: string): Promise<{
  setting: FirmMailSetting,
  areas: AreaOfLaw[]
}[]> => {
  // Get all mail settings for this firm
  const settings = await getFirmMailSettings(firmSlug);
  
  // For each setting, get the areas of law
  const result = await Promise.all(
    settings.map(async (setting) => {
      const areas = await getAreasForMailSetting(setting.id);
      return { setting, areas };
    })
  );
  
  return result;
};

// Function to get all law firms for admin purposes
export const getAllLawFirms = async (): Promise<LawFirm[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return lawFirms;
};

// Function to get law firms with additional details for the management page
export const getLawFirmsWithDetails = async (): Promise<MockLawFirmWithDetails[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return lawFirms.map(firm => {
    const firmLeads = leads.filter(lead => lead.lawFirmId === firm.id);
    const account = accountSettings.find(acc => acc.lawFirmId === firm.id);
    
    return {
      ...firm,
      email: account?.email || '',
      // Mock last login date
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      leadsCount: firmLeads.length
    };
  });
};

// Mock auth functions - in a real app these would verify against the database
export const loginUser = async (email: string, password: string): Promise<{ lawFirmSlug: string } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find account with matching email
  const account = accountSettings.find(acc => acc.email === email);
  
  // In a real app, this would verify the password hash
  if (account && (password === "password" || password === account.passwordHash)) {
    const firm = lawFirms.find(firm => firm.id === account.lawFirmId);
    return firm ? { lawFirmSlug: firm.slug } : null;
  }
  
  return null;
};

export const signupUser = async (data: SignupFormData): Promise<{ lawFirmSlug: string } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Check if slug already exists
  if (lawFirms.some(firm => firm.slug === data.slug)) {
    return null;
  }
  
  // Create new firm
  const newFirm: LawFirm = {
    id: lawFirms.length + 1,
    name: data.firmName,
    slug: data.slug,
    createdAt: new Date().toISOString()
  };
  
  lawFirms.push(newFirm);
  saveData('lawFirms', lawFirms);
  
  // Create account settings
  const newAccount: AccountSettings = {
    id: accountSettings.length + 1,
    lawFirmId: newFirm.id,
    email: data.email,
    passwordHash: data.password, // In real app, would be hashed
    profileImage: null,
    updatedAt: new Date().toISOString()
  };
  
  accountSettings.push(newAccount);
  saveData('accountSettings', accountSettings);
  
  return { lawFirmSlug: newFirm.slug };
};
