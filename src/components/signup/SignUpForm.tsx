
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { SignUpFormValues, signUpSchema } from "@/validations/signupSchema";
import { checkFirmExists, createLawFirm } from "@/services/signupService";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpForm = () => {
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

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      const firmExists = await checkFirmExists(data.firmName);
      
      if (firmExists) {
        throw new Error("This firm name is already taken. Please choose a different one.");
      }
      
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
      
      await createLawFirm(data.firmName, data.firmName, authData.user.id);
      
      toast({
        title: "Account created!",
        description: "You've successfully signed up. You can now log in.",
      });
      
      sonnerToast.success("Account created successfully!");
      
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
  );
};
