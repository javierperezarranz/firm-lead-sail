
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { getLawFirmBySlug } from '@/utils/api-supabase';

const AccountSettings = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAccountSettings = async () => {
      if (!firmId) return;
      
      try {
        setIsLoading(true);
        
        // First, get the firm ID from the slug
        const firm = await getLawFirmBySlug(firmId);
        
        if (!firm) {
          toast({
            title: "Error",
            description: "Law firm not found",
            variant: "destructive",
          });
          return;
        }
        
        // Now fetch the account settings using the firm ID
        const { data, error } = await supabase
          .from('account_settings')
          .select('email')
          .eq('law_firm_id', firm.id)
          .single();
        
        if (error) {
          console.error("Error fetching account settings:", error);
          // If no account settings found, use the current user's email
          if (user) {
            setEmail(user.email || '');
          }
          return;
        }
        
        setEmail(data.email);
      } catch (error) {
        console.error("Error in account settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountSettings();
  }, [firmId, user, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firmId) return;
    
    try {
      const firm = await getLawFirmBySlug(firmId);
      
      if (!firm) {
        toast({
          title: "Error",
          description: "Law firm not found",
          variant: "destructive",
        });
        return;
      }
      
      // Update the account settings with the new email
      const { error } = await supabase
        .from('account_settings')
        .update({ email })
        .eq('law_firm_id', firm.id);
      
      if (error) {
        console.error("Error updating account settings:", error);
        toast({
          title: "Error",
          description: "Failed to update email settings",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error updating account settings:", error);
      toast({
        title: "Error",
        description: "Failed to update account settings",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Update your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLoading ? "Loading..." : "Your email address"}
                  disabled={isLoading}
                  className="max-w-md"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                Update Email
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
