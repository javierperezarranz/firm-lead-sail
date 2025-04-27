
import { supabase } from "@/integrations/supabase/client";
import { State, County } from "@/types";

export const getStates = async (): Promise<State[]> => {
  throw new Error('States retrieval logic needs to be reimplemented');
};

export const getCountiesForState = async (stateId: string): Promise<County[]> => {
  throw new Error('Counties retrieval logic needs to be reimplemented');
};
