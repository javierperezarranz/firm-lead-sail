
import { supabase } from "@/integrations/supabase/client";
import { LawFirm } from "@/types";

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
