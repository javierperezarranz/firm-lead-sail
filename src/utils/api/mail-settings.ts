
import { supabase } from "@/integrations/supabase/client";
import { AreaOfLaw, FirmMailSetting } from "@/types";
import { getLawFirmBySlug } from "./law-firms";

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
