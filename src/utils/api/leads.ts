
import { supabase } from "@/integrations/supabase/client";
import { FormData, Lead, LeadWithResponses } from "@/types";
import { getLawFirmBySlug } from "./law-firms";

export const getLeads = async (firmSlug: string): Promise<Lead[]> => {
  console.log(`Fetching leads for ${firmSlug}`);
  
  try {
    const firm = await getLawFirmBySlug(firmSlug);
    if (!firm) {
      console.error(`Law firm not found with slug: ${firmSlug}`);
      return [];
    }
    
    console.log(`Found firm with ID: ${firm.id}, fetching leads`);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('law_firm_id', firm.id);
    
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} leads`);
    
    return data.map(lead => ({
      id: lead.id,
      lawFirmId: lead.law_firm_id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      submittedAt: lead.submitted_at
    }));
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
};

export const getLeadsWithResponses = async (firmSlug: string): Promise<LeadWithResponses[]> => {
  const leads = await getLeads(firmSlug);
  
  const leadResponses = await Promise.all(leads.map(async (lead) => {
    const { data, error } = await supabase
      .from('intake_responses')
      .select('*')
      .eq('lead_id', lead.id);
    
    if (error) {
      console.error(`Error fetching responses for lead ${lead.id}:`, error);
      return { ...lead, responses: [] };
    }
    
    const responses = data.map(response => ({
      id: response.id,
      leadId: response.lead_id,
      questionKey: response.question_key,
      answer: response.answer
    }));
    
    return { ...lead, responses };
  }));
  
  return leadResponses;
};

export const submitLead = async (data: FormData, firmSlug: string): Promise<Lead | null> => {
  console.log(`Submitting lead for ${firmSlug}:`, data);
  
  try {
    const firm = await getLawFirmBySlug(firmSlug);
    if (!firm) {
      console.error(`Law firm not found with slug: ${firmSlug}`);
      return null;
    }
    
    console.log("Inserting lead for firm ID:", firm.id);
    
    // Create the lead with no RLS restrictions
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert({
        law_firm_id: firm.id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        submitted_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (leadError) {
      console.error('Error creating lead:', leadError);
      throw new Error(`Failed to create lead: ${leadError.message}`);
    }
    
    console.log("Lead created successfully:", newLead);
    
    // Extract any additional fields for intake responses
    const { name, email, phone, ...additionalFields } = data;
    
    // If there are additional fields, add them as intake responses
    if (Object.keys(additionalFields).length > 0) {
      console.log("Adding intake responses:", additionalFields);
      
      const intakeResponses = Object.entries(additionalFields).map(([key, value]) => ({
        lead_id: newLead.id,
        question_key: key,
        answer: String(value)
      }));
      
      const { error: responseError } = await supabase
        .from('intake_responses')
        .insert(intakeResponses);
      
      if (responseError) {
        console.error('Error creating intake responses:', responseError);
        // Continue with the lead creation even if intake responses fail
      }
    }
    
    return {
      id: newLead.id,
      lawFirmId: newLead.law_firm_id,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || '',
      submittedAt: newLead.submitted_at
    };
  } catch (error) {
    console.error('Error in submitLead:', error);
    return null;
  }
};
