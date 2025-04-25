
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";

// Mock data for US states and counties
const usStates = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
  { value: "il", label: "Illinois" },
];

// Mock county data (would be fetched based on selected state in a real app)
const countyData = {
  ca: [
    { value: "la", label: "Los Angeles" },
    { value: "sf", label: "San Francisco" },
    { value: "sd", label: "San Diego" },
  ],
  ny: [
    { value: "ny", label: "New York" },
    { value: "kings", label: "Kings" },
    { value: "queens", label: "Queens" },
  ],
  tx: [
    { value: "harris", label: "Harris" },
    { value: "dallas", label: "Dallas" },
    { value: "bexar", label: "Bexar" },
  ],
  fl: [
    { value: "miami-dade", label: "Miami-Dade" },
    { value: "broward", label: "Broward" },
    { value: "palm-beach", label: "Palm Beach" },
  ],
  il: [
    { value: "cook", label: "Cook" },
    { value: "dupage", label: "DuPage" },
    { value: "lake", label: "Lake" },
  ],
};

const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  formTitle: z.string().optional(),
  formDescription: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const areasOfLaw = [
  { id: "marriage-app", label: "Applied for marriage" },
  { id: "married", label: "Got married" },
  { id: "criminal", label: "Criminal" },
  { id: "real-estate", label: "Real estate purchase" },
];

interface AreaSelection {
  state: string;
  stateName: string;
  county: string;
  countyName: string;
  areas: string[];
}

const AccountSettings = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedCounty, setSelectedCounty] = useState<string | undefined>();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaSelections, setAreaSelections] = useState<AreaSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "example@lawfirm.com", // Pre-populated for demo
      password: "",
      confirmPassword: "",
      formTitle: "Request a consultation with our firm",
      formDescription: "Please fill out the form below and our team will contact you shortly to schedule your consultation.",
    },
  });

  const counties = selectedState ? countyData[selectedState as keyof typeof countyData] : [];

  const addAreaSelection = () => {
    if (!selectedState || !selectedCounty || selectedAreas.length === 0) {
      toast({
        title: "Incomplete selection",
        description: "Please select a state, county, and at least one area of law",
        variant: "destructive",
      });
      return;
    }

    const stateName = usStates.find(s => s.value === selectedState)?.label || "";
    const countyName = counties.find(c => c.value === selectedCounty)?.label || "";
    
    // Check if this state/county combination already exists
    const existingIndex = areaSelections.findIndex(
      item => item.state === selectedState && item.county === selectedCounty
    );
    
    if (existingIndex >= 0) {
      toast({
        title: "Area already added",
        description: `${stateName}, ${countyName} is already in your selections`,
        variant: "destructive",
      });
      return;
    }

    setAreaSelections([
      ...areaSelections,
      {
        state: selectedState,
        stateName,
        county: selectedCounty,
        countyName,
        areas: [...selectedAreas],
      },
    ]);

    // Reset selections
    setSelectedCounty(undefined);
    setSelectedAreas([]);
    
    toast({
      title: "Area added",
      description: `Added ${stateName}, ${countyName} to your target areas`,
    });
  };

  const removeAreaSelection = (index: number) => {
    setAreaSelections(areaSelections.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Validate password match if both are provided
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        form.setError("confirmPassword", { 
          type: "manual", 
          message: "Passwords do not match" 
        });
        setIsSubmitting(false);
        return;
      }

      // In a real app, this would send data to an API
      console.log("Account settings data:", data);
      console.log("Area selections:", areaSelections);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your account settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle avatar upload (mock implementation)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // Here we just create a local object URL
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    }
  };

  if (!firmId) {
    return <div>Law firm not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-card rounded-lg border border-border p-6 animate-fade-up">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {firmId?.substring(0, 2)?.toUpperCase() || "LF"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" type="button">
                    Change avatar
                  </Button>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload} 
                  />
                </label>
                <span className="text-xs text-muted-foreground mt-2">
                  Recommended: 200×200px
                </span>
              </div>
            </div>

            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Intake Form Customization */}
        <div className="bg-card rounded-lg border border-border p-6 animate-fade-up">
          <h2 className="text-xl font-semibold mb-6">Intake Form Settings</h2>
          
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="formTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This title appears at the top of your client intake form.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief description displayed below the title of your intake form.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Form Settings"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Direct Mail Settings */}
        <div className="bg-card rounded-lg border border-border p-6 animate-fade-up">
          <h2 className="text-xl font-semibold mb-6">Direct Mail Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Add Areas for Direct Mail</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem
                          key={state.value}
                          value={state.value}
                          disabled={areaSelections.some(s => s.state === state.value)}
                        >
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">County</label>
                  <Select
                    value={selectedCounty}
                    onValueChange={setSelectedCounty}
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((county) => (
                        <SelectItem key={county.value} value={county.value}>
                          {county.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Areas of Law</label>
                <div className="border border-border rounded-md p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {areasOfLaw.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={area.id}
                          checked={selectedAreas.includes(area.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAreas([...selectedAreas, area.id]);
                            } else {
                              setSelectedAreas(selectedAreas.filter((id) => id !== area.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={area.id}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {area.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                type="button" 
                onClick={addAreaSelection}
                disabled={!selectedState || !selectedCounty || selectedAreas.length === 0}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Area
              </Button>
            </div>

            {areaSelections.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-medium">Selected Areas</h3>
                
                <div className="border border-border rounded-md divide-y divide-border overflow-hidden">
                  {areaSelections.map((selection, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">
                            {selection.stateName}, {selection.countyName}
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeAreaSelection(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selection.areas.map((areaId) => (
                          <div 
                            key={areaId} 
                            className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded"
                          >
                            {areasOfLaw.find(a => a.id === areaId)?.label || areaId}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Direct Mail Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
