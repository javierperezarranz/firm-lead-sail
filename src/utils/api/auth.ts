
import { supabase } from '@/integrations/supabase/client';

export async function loginUser(email: string, password: string) {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
    
    // Try to get lawyer record first
    const { data: lawyerData, error: lawyerError } = await supabase
      .from('lawyers')
      .select('firm_id')
      .eq('lawyer_id', signInData.user?.id)
      .single();
      
    // If user is not a lawyer, check if they're an admin
    if (lawyerError) {
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('admin_id')
        .eq('admin_id', signInData.user?.id)
        .single();
      
      if (!adminError && adminData) {
        // User is an admin, redirect to admin page
        return { 
          user: signInData.user,
          isAdmin: true
        };
      }
      
      // Not a lawyer or admin
      throw new Error('User not associated with any law firm or admin role');
    }
    
    // Get the law firm slug for redirection
    const { data: firmData, error: firmError } = await supabase
      .from('firms')
      .select('slug')
      .eq('firm_id', lawyerData.firm_id)
      .single();
      
    if (firmError) throw firmError;
    
    return { 
      user: signInData.user, 
      firmSlug: firmData.slug,
      isAdmin: false
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function checkUserHasAccess(userId: string, firmSlug: string): Promise<boolean> {
  try {
    // Get the firm ID from the slug
    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .select('firm_id')
      .eq('slug', firmSlug)
      .single();
      
    if (firmError || !firm) return false;
    
    // Check if user is an admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('admin_id')
      .eq('admin_id', userId)
      .single();
      
    if (!adminError && admin) {
      return true; // User is an admin, allow access
    }
    
    // Check if user is a lawyer for this firm
    const { data: lawyer, error: lawyerError } = await supabase
      .from('lawyers')
      .select('*')
      .eq('lawyer_id', userId)
      .eq('firm_id', firm.firm_id)
      .single();
    
    return !lawyerError && !!lawyer;
  } catch (error) {
    console.error("Access check error:", error);
    return false;
  }
}

export async function signupUserWithLawFirm(email: string, password: string, firmName: string, firmSlug: string) {
  try {
    // Check if the firm slug is already taken
    const { data: existingFirm, error: firmCheckError } = await supabase
      .from('firms')
      .select('firm_id')
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
    
    // Call create_firm_and_lawyer stored procedure
    const { error: rpcError } = await supabase.rpc('create_firm_and_lawyer', {
      user_id: signUpData.user.id,
      firm_name: firmName,
      firm_slug: firmSlug,
      firm_email: email
    });
    
    if (rpcError) throw rpcError;
    
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
      .from('admins')
      .select('*')
      .eq('admin_id', userId)
      .maybeSingle();
    
    return !error && !!data;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}
