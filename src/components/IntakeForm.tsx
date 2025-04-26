
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormData } from '@/types';
import { submitLead } from '@/utils/api/leads';

interface IntakeFormProps {
  lawFirmId: string;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ lawFirmId }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log(`Submitting lead for firm: ${lawFirmId}`, formData);
      
      const result = await submitLead(formData, lawFirmId);
      
      if (!result) {
        throw new Error("Failed to submit lead");
      }
      
      // Show success message
      toast({
        title: "Success",
        description: "Your information has been submitted successfully."
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border animate-reveal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full transition-all bg-primary hover:bg-primary/90 py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Information"}
        </Button>
      </form>
    </div>
  );
};

export default IntakeForm;
