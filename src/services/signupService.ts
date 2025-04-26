
import { supabase } from '@/integrations/supabase/client';
import { SignUpFormValues } from '@/validations/signupSchema';

export const checkFirmExists = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('law_firms')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking firm existence:", error);
    return false;
  }
};

export const createLawFirm = async (name: string, slug: string, userId: string) => {
  try {
    const { data: firmData, error: firmError } = await supabase
      .from('law_firms')
      .insert([
        { name, slug }
      ])
      .select('id')
      .single();
    
    if (firmError) {
      console.error("Error creating law firm:", firmError);
      throw new Error("Failed to create law firm. Please try again.");
    }
    
    console.log("Law firm created successfully:", firmData.id);
    
    const { error: connectionError } = await supabase
      .from('law_firm_users')
      .insert([
        { user_id: userId, law_firm_id: firmData.id }
      ]);
    
    if (connectionError) {
      console.error("Error connecting user to law firm:", connectionError);
      throw new Error("Failed to connect user to law firm. Please try again.");
    }
    
    const { error: settingsError } = await supabase
      .from('account_settings')
      .insert([
        { 
          email: name, 
          law_firm_id: firmData.id,
          password_hash: 'placeholder'
        }
      ]);
    
    if (settingsError) {
      console.error("Error creating account settings:", settingsError);
    }
    
    return firmData.id;
  } catch (error) {
    console.error("Error creating law firm:", error);
    throw error;
  }
};
