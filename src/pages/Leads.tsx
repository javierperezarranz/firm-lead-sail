
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLeads } from '@/utils/api-supabase';
import { Lead } from '@/types';
import LeadTable from '@/components/LeadTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Leads = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Function to fetch leads
  const fetchLeads = async () => {
    if (!firmId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await getLeads(firmId);
      console.log("Fetched leads:", data);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error fetching leads",
        description: "Could not load lead data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh leads
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads();
    setTimeout(() => setIsRefreshing(false), 500); // Ensure the spinner shows for at least 500ms
  };

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [firmId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lead Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your client leads in one place
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 self-start"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <LeadTable leads={leads} isLoading={isLoading} />
    </div>
  );
};

export default Leads;
