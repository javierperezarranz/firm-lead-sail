
import { supabase } from "@/integrations/supabase/client";
import { 
  FormData, 
  Lead, 
  LawFirm,
  IntakeResponse,
  State,
  County,
  AreaOfLaw,
  FirmMailSetting,
  LeadWithResponses
} from "@/types";

// Helper function to find a law firm by slug
export const getLawFirmBySlug = async (slug: string): Promise<LawFirm | null> => {
  console.log(`Fetching law firm with slug: ${slug}`);
  
  try {
    const { data, error } = await supabase
      .from('law_firms')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching law firm:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error fetching law firm:', error);
    return null;
  }
};

// Get leads for a specific law firm
export const getLeads = async (firmSlug: string): Promise<Lead[]> => {
  console.log(`Fetching leads for ${firmSlug}`);
  
  try {
    const firm = await getLawFirmBySlug(firmSlug);
    if (!firm) {
      console.error(`Law firm not found with slug: ${firmSlug}`);
      return [];
    }
    
    console.log(`Found firm with ID: ${firm.id}, fetching leads`);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('law_firm_id', firm.id);
    
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} leads`);
    
    return data.map(lead => ({
      id: lead.id,
      lawFirmId: lead.law_firm_id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      submittedAt: lead.submitted_at
    }));
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
};

// Get leads with their intake responses
export const getLeadsWithResponses = async (firmSlug: string): Promise<LeadWithResponses[]> => {
  const leads = await getLeads(firmSlug);
  
  const leadResponses = await Promise.all(leads.map(async (lead) => {
    const { data, error } = await supabase
      .from('intake_responses')
      .select('*')
      .eq('lead_id', lead.id);
    
    if (error) {
      console.error(`Error fetching responses for lead ${lead.id}:`, error);
      return { ...lead, responses: [] };
    }
    
    const responses = data.map(response => ({
      id: response.id,
      leadId: response.lead_id,
      questionKey: response.question_key,
      answer: response.answer
    }));
    
    return { ...lead, responses };
  }));
  
  return leadResponses;
};

// Submit a new lead
export const submitLead = async (data: FormData, firmSlug: string): Promise<Lead | null> => {
  console.log(`Submitting lead for ${firmSlug}:`, data);
  
  // Find the law firm
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return null;
  
  // Create a new lead
  const { data: newLead, error } = await supabase
    .from('leads')
    .insert([{
      law_firm_id: firm.id,
      name: data.name,
      email: data.email,
      phone: data.phone
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }
  
  return {
    id: newLead.id,
    lawFirmId: newLead.law_firm_id,
    name: newLead.name,
    email: newLead.email,
    phone: newLead.phone || '',
    submittedAt: newLead.submitted_at
  };
};

// Get all states
export const getStates = async (): Promise<State[]> => {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching states:', error);
    return [];
  }
  
  return data.map(state => ({
    id: state.id,
    name: state.name
  }));
};

// Get counties for a specific state
export const getCountiesForState = async (stateId: number): Promise<County[]> => {
  const { data, error } = await supabase
    .from('counties')
    .select('*')
    .eq('state_id', stateId)
    .order('name');
  
  if (error) {
    console.error('Error fetching counties:', error);
    return [];
  }
  
  return data.map(county => ({
    id: county.id,
    stateId: county.state_id,
    name: county.name
  }));
};

// Get all areas of law
export const getAreasOfLaw = async (): Promise<AreaOfLaw[]> => {
  const { data, error } = await supabase
    .from('areas_of_law')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching areas of law:', error);
    return [];
  }
  
  return data.map(area => ({
    id: area.id,
    name: area.name
  }));
};

// Get mail settings for a firm
export const getFirmMailSettings = async (firmSlug: string): Promise<FirmMailSetting[]> => {
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return [];
  
  const { data, error } = await supabase
    .from('firm_mail_settings')
    .select(`
      *,
      states:state_id(name),
      counties:county_id(name)
    `)
    .eq('firm_id', firm.id);
  
  if (error) {
    console.error('Error fetching mail settings:', error);
    return [];
  }
  
  return data.map(setting => ({
    id: setting.id,
    firmId: setting.firm_id,
    stateId: setting.state_id,
    countyId: setting.county_id,
    createdAt: setting.created_at,
    stateName: setting.states.name,
    countyName: setting.counties.name
  }));
};

// Add a new mail setting for a firm
export const addFirmMailSetting = async (
  firmSlug: string,
  stateId: number,
  countyId: number,
  areaIds: number[]
): Promise<FirmMailSetting | null> => {
  const firm = await getLawFirmBySlug(firmSlug);
  if (!firm) return null;
  
  // Check if this setting already exists
  const { data: existingSettings } = await supabase
    .from('firm_mail_settings')
    .select('*')
    .eq('firm_id', firm.id)
    .eq('state_id', stateId)
    .eq('county_id', countyId)
    .single();
  
  if (existingSettings) return null;
  
  // Create a new setting
  const { data: newSetting, error } = await supabase
    .from('firm_mail_settings')
    .insert([{
      firm_id: firm.id,
      state_id: stateId,
      county_id: countyId
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating mail setting:', error);
    return null;
  }
  
  // Add the areas of law
  if (areaIds.length > 0) {
    const areaEntries = areaIds.map(areaId => ({
      mail_setting_id: newSetting.id,
      area_of_law_id: areaId
    }));
    
    const { error: areasError } = await supabase
      .from('firm_mail_laws')
      .insert(areaEntries);
    
    if (areasError) {
      console.error('Error adding areas of law:', areasError);
    }
  }
  
  return {
    id: newSetting.id,
    firmId: newSetting.firm_id,
    stateId: newSetting.state_id,
    countyId: newSetting.county_id,
    createdAt: newSetting.created_at
  };
};

// Get areas of law for a specific mail setting
export const getAreasForMailSetting = async (mailSettingId: number): Promise<AreaOfLaw[]> => {
  const { data, error } = await supabase
    .from('firm_mail_laws')
    .select(`
      area_of_law_id,
      areas_of_law:area_of_law_id(*)
    `)
    .eq('mail_setting_id', mailSettingId);
  
  if (error) {
    console.error('Error fetching areas for mail setting:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.areas_of_law.id,
    name: item.areas_of_law.name
  }));
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

// Connect a user to a law firm after signup
export const connectUserToLawFirm = async (userId: string, lawFirmSlug: string): Promise<boolean> => {
  const firm = await getLawFirmBySlug(lawFirmSlug);
  if (!firm) return false;
  
  const { error } = await supabase
    .from('law_firm_users')
    .insert({
      user_id: userId,
      law_firm_id: firm.id
    });
  
  if (error) {
    console.error('Error connecting user to law firm:', error);
    return false;
  }
  
  return true;
};
