
import { supabase } from "@/integrations/supabase/client";
import { LawFirm } from "@/types";

export const getLawFirmBySlug = async (slug: string): Promise<LawFirm | null> => {
  console.log(`Fetching law firm with slug: ${slug}`);
  
  try {
    const { data: firmId, error: rpcError } = await supabase.rpc('get_firm_id_from_slug', {
      slug_param: slug
    });
    
    if (rpcError) {
      console.error('Error fetching law firm ID:', rpcError);
      return null;
    }
    
    if (!firmId) {
      console.error('No firm found with slug:', slug);
      return null;
    }
    
    const { data, error } = await supabase
      .from('firms')
      .select('*')
      .eq('firm_id', firmId)
      .single();
    
    if (error) {
      console.error('Error fetching law firm:', error);
      return null;
    }
    
    return {
      id: data.firm_id,
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
    .from('lawyers')
    .insert({
      lawyer_id: userId,
      firm_id: firm.id
    });
  
  if (error) {
    console.error('Error connecting user to law firm:', error);
    return false;
  }
  
  return true;
};
