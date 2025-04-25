
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "@/hooks/use-toast";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firmName: z
    .string()
    .min(3, "Firm name must be at least 3 characters")
    .max(30, "Firm name must be at most 30 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Firm name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
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
      // In a real app, this would send data to an API
      console.log("Sign up data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      });
      
      // Redirect to back office
      window.location.href = `/${data.firmName}/back`;
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
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
                        Example: lawscheduling.com/law-firm-name. The name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
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
