
import { supabase } from "@/integrations/supabase/client";
import { State, County } from "@/types";

export const getStates = async (): Promise<State[]> => {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching states:', error);
    return [];
  }
  
  return data.map(state => ({
    id: state.id,
    name: state.name
  }));
};

export const getCountiesForState = async (stateId: number): Promise<County[]> => {
  const { data, error } = await supabase
    .from('counties')
    .select('*')
    .eq('state_id', stateId)
    .order('name');
  
  if (error) {
    console.error('Error fetching counties:', error);
    return [];
  }
  
  return data.map(county => ({
    id: county.id,
    stateId: county.state_id,
    name: county.name
  }));
};
