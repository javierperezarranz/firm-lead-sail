
import { supabase } from '@/integrations/supabase/client';

export async function loginUser(email: string, password: string) {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
    
    // Try to get lawyer record first using RPC function
    const { data: isLawyer, error: lawyerError } = await supabase.rpc('is_lawyer_for_firm', {
      firm_uuid: null // Just checking if user is a lawyer for any firm
    });
      
    // If user is not a lawyer, check if they're an admin
    if (lawyerError || !isLawyer) {
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
      
      if (!adminError && isAdmin) {
        // User is an admin, redirect to admin page
        return { 
          user: signInData.user,
          isAdmin: true
        };
      }
      
      if (!isLawyer) {
        // Not a lawyer or admin
        throw new Error('User not associated with any law firm or admin role');
      }
    }
    
    // Get the law firm slug for redirection
    const { data: firmData, error: firmError } = await supabase
      .from('firms')
      .select('slug')
      .eq('firm_id', signInData.user.id)
      .single();
      
    if (firmError) {
      console.error("Error fetching firm:", firmError);
      throw new Error('Could not find associated law firm');
    }
    
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
    // Get the firm ID from the slug using RPC function
    const { data: firmId, error: firmError } = await supabase.rpc('get_firm_id_from_slug', {
      slug_param: firmSlug
    });
      
    if (firmError || !firmId) return false;
    
    // Check if user is an admin using RPC function
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
      
    if (!adminError && isAdmin) {
      return true; // User is an admin, allow access
    }
    
    // Check if user is a lawyer for this firm using RPC function
    const { data: isLawyer, error: lawyerError } = await supabase.rpc('is_lawyer_for_firm', {
      firm_uuid: firmId
    });
    
    return !lawyerError && isLawyer;
  } catch (error) {
    console.error("Access check error:", error);
    return false;
  }
}

export async function signupUserWithLawFirm(email: string, password: string, firmName: string, firmSlug: string) {
  try {
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
    const { data, error } = await supabase.rpc('is_admin');
    return !error && !!data;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}
