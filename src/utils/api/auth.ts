import { supabase } from '@/integrations/supabase/client';

export async function loginUser(email: string, password: string) {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
    
    // Try to check if user is a lawyer
    try {
      // We're using null here because we just want to check if the user is a lawyer for any firm
      const { data: isLawyer } = await supabase.rpc('is_lawyer_for_firm', {
        firm_uuid: null
      });
      
      if (isLawyer) {
        // User is a lawyer, get their firm details
        const { data: lawyerData } = await supabase
          .from('lawyers')
          .select('firm_id')
          .eq('lawyer_id', signInData.user.id)
          .single();
          
        if (lawyerData) {
          // Get firm slug
          const { data: firmData } = await supabase
            .from('firms')
            .select('slug')
            .eq('firm_id', lawyerData.firm_id)
            .single();
            
          if (firmData) {
            return { 
              user: signInData.user, 
              firmSlug: firmData.slug,
              isAdmin: false
            };
          }
        }
      }
    } catch (lawyerCheckError) {
      console.error("Error checking lawyer status:", lawyerCheckError);
    }
    
    // If user is not a lawyer, check if they're an admin
    try {
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (isAdmin) {
        // User is an admin
        return { 
          user: signInData.user,
          isAdmin: true
        };
      }
    } catch (adminCheckError) {
      console.error("Error checking admin status:", adminCheckError);
    }
    
    // Not a lawyer or admin
    throw new Error('User not associated with any law firm or admin role');
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function checkUserHasAccess(userId: string, firmSlug: string): Promise<boolean> {
  try {
    // Get the firm ID from the slug
    const { data: firmId } = await supabase.rpc('get_firm_id_from_slug', {
      slug_param: firmSlug
    });
      
    if (!firmId) return false;
    
    // Check if user is an admin
    const { data: isAdmin } = await supabase.rpc('is_admin');
      
    if (isAdmin) {
      return true; // User is an admin, allow access
    }
    
    // Check if user is a lawyer for this firm
    const { data: isLawyer } = await supabase.rpc('is_lawyer_for_firm', {
      firm_uuid: firmId
    });
    
    return !!isLawyer; // Convert to boolean
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
    const { error: procedureError } = await supabase.rpc('create_firm_and_lawyer', {
      user_id: signUpData.user.id,
      firm_name: firmName,
      firm_slug: firmSlug,
      firm_email: email
    });
    
    if (procedureError) throw procedureError;
    
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
    const { data } = await supabase.rpc('is_admin');
    return !!data; // Convert to boolean
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}
