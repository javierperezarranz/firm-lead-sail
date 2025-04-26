
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from 'sonner';

// Modified schema to add firmer validation
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firmName: z
    .string()
    .min(3, "Firm name must be at least 3 characters")
    .max(30, "Firm name must be at most 30 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Firm name may only contain lowercase alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firmName: "",
    },
  });

  const checkFirmExists = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('law_firms')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return !!data; // Return true if firm exists, false otherwise
    } catch (error) {
      console.error("Error checking firm existence:", error);
      return false;
    }
  };

  const createLawFirm = async (name: string, slug: string, userId: string) => {
    try {
      // Create the law firm
      const { data: firmData, error: firmError } = await supabase
        .from('law_firms')
        .insert([
          { name, slug }
        ])
        .select('id')
        .single();
      
      if (firmError) {
        console.error("Error creating law firm:", firmError);
        throw new Error("Failed to create law firm. Please try again.");
      }
      
      console.log("Law firm created successfully:", firmData.id);
      
      // Connect user to the law firm
      const { error: connectionError } = await supabase
        .from('law_firm_users')
        .insert([
          { user_id: userId, law_firm_id: firmData.id }
        ]);
      
      if (connectionError) {
        console.error("Error connecting user to law firm:", connectionError);
        throw new Error("Failed to connect user to law firm. Please try again.");
      }
      
      // Create account settings for the law firm with the user's email
      const { error: settingsError } = await supabase
        .from('account_settings')
        .insert([
          { 
            email: form.getValues('email'), 
            law_firm_id: firmData.id,
            password_hash: 'placeholder' // This would typically be handled securely
          }
        ]);
      
      if (settingsError) {
        console.error("Error creating account settings:", settingsError);
        // Continue anyway, not critical
      }
      
      return firmData.id;
    } catch (error) {
      console.error("Error creating law firm:", error);
      throw error;
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      // First check if firm name is already taken
      const firmExists = await checkFirmExists(data.firmName);
      
      if (firmExists) {
        throw new Error("This firm name is already taken. Please choose a different one.");
      }
      
      // Register the user with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      if (!authData.user) {
        throw new Error("Failed to create user account. Please try again.");
      }

      console.log("User created successfully:", authData.user.id);
      
      // Create the law firm and related data
      await createLawFirm(data.firmName, data.firmName, authData.user.id);
      
      toast({
        title: "Account created!",
        description: "You've successfully signed up. You can now log in.",
      });
      
      sonnerToast.success("Account created successfully!");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 500);
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      if (error.message.includes('already registered')) {
        toast({
          title: "Email already in use",
          description: "This email is already registered. Please log in or use a different email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">LS</span>
            </div>
            <span className="font-medium text-lg tracking-tight">LawScheduling</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to start growing your law practice
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Create a password" 
                          type="password" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique law firm name</FormLabel>
                      <div className="flex items-center">
                        <div className="bg-muted px-3 py-2 rounded-l-md text-sm text-muted-foreground border border-r-0 border-input">
                          lawscheduling.com/
                        </div>
                        <FormControl>
                          <Input
                            className="rounded-l-none"
                            placeholder="your-firm-name"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: lawscheduling.com/law-firm-name. The name may only contain lowercase alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Sign up"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
