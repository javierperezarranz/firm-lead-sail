
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

export async function signupUserWithLawFirm(email: string, password: string, firmName: string) {
  try {
    // Create a slug from the firm name
    const firmSlug = firmName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    // Check if the firm slug is already taken
    const { data: existingFirm, error: firmCheckError } = await supabase
      .from('law_firms')
      .select('id')
      .eq('slug', firmSlug)
      .maybeSingle();
      
    if (firmCheckError) throw firmCheckError;
    
    if (existingFirm) {
      throw new Error('This firm name is already taken. Please choose a different one.');
    }
    
    // Start signup process
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (signUpError) throw signUpError;
    
    if (!signUpData.user) {
      throw new Error('Failed to create user account. Please try again.');
    }
    
    // Use RPC to perform operations in a transaction
    const { data: result, error: rpcError } = await supabase.rpc('create_law_firm_with_user', {
      p_user_id: signUpData.user.id,
      p_firm_name: firmName,
      p_firm_slug: firmSlug,
      p_email: email
    });
    
    if (rpcError) throw rpcError;
    
    // Add user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: signUpData.user.id,
        role: 'user'
      });
    
    if (roleError) console.error("Role creation error:", roleError);
    
    return { 
      user: signUpData.user, 
      firmSlug: firmSlug 
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    return !error && !!data;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}
