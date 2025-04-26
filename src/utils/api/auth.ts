
import { supabase } from '@/integrations/supabase/client';

export async function loginUser(email: string, password: string) {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
    
    // Get the user's associated law firm
    const { data: firmUsers, error: firmUsersError } = await supabase
      .from('law_firm_users')
      .select('law_firm_id')
      .eq('user_id', signInData.user?.id)
      .single();
      
    if (firmUsersError) throw firmUsersError;
    
    // Get the law firm slug for redirection
    const { data: firmData, error: firmError } = await supabase
      .from('law_firms')
      .select('slug')
      .eq('id', firmUsers.law_firm_id)
      .single();
      
    if (firmError) throw firmError;
    
    return { 
      user: signInData.user, 
      firmSlug: firmData.slug 
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function checkUserHasAccess(userId: string, firmSlug: string): Promise<boolean> {
  try {
    // Get the law firm ID from the slug
    const { data: firm, error: firmError } = await supabase
      .from('law_firms')
      .select('id')
      .eq('slug', firmSlug)
      .single();
      
    if (firmError || !firm) return false;
    
    // Check if user has access to this firm
    const { data: access, error: accessError } = await supabase
      .from('law_firm_users')
      .select('*')
      .eq('user_id', userId)
      .eq('law_firm_id', firm.id)
      .single();
    
    return !accessError && !!access;
  } catch (error) {
    console.error("Access check error:", error);
    return false;
  }
}
