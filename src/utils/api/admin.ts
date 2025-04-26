
import { supabase } from '@/integrations/supabase/client';

export async function createAdminUser(email: string, password: string) {
  try {
    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .maybeSingle();
      
    if (checkError) throw checkError;
      
    if (existingUser) {
      return { success: true, message: 'Admin user already exists' };
    }
    
    // Create admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (signUpError) throw signUpError;
    
    if (!signUpData.user) {
      throw new Error('Failed to create admin user');
    }
    
    // Create admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: signUpData.user.id,
        role: 'admin'
      });
      
    if (roleError) throw roleError;
    
    return { 
      success: true, 
      message: 'Admin user created successfully',
    };
  } catch (error) {
    console.error("Admin creation error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create admin user'
    };
  }
}

export async function getAllLawFirms() {
  try {
    const { data, error } = await supabase
      .from('law_firms')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(firm => ({
      id: firm.id,
      name: firm.name,
      slug: firm.slug,
      createdAt: firm.created_at
    }));
  } catch (error) {
    console.error("Error fetching law firms:", error);
    return [];
  }
}
