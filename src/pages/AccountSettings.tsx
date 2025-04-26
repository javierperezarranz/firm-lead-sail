
import React, { useState, useEffect } from 'react';
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
import { Plus, X } from 'lucide-react';
import { 
  getStates, 
  getCountiesForState, 
  getAreasOfLaw, 
  getFirmMailAreasOfLaw,
  addFirmMailSetting
} from '@/utils/api';
import { State, County, AreaOfLaw } from '@/types';

const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  formTitle: z.string().optional(),
  formDescription: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AreaSelectionUI {
  stateId: number;
  stateName: string;
  countyId: number;
  countyName: string;
  areas: number[]; // Area of law IDs
  areaNames: string[]; // Area of law names (for display)
}

const AccountSettings = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const [states, setStates] = useState<State[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [areasOfLaw, setAreasOfLaw] = useState<AreaOfLaw[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedCountyId, setSelectedCountyId] = useState<string>('');
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [areaSelections, setAreaSelections] = useState<AreaSelectionUI[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Load states, counties, and areas of law
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load states, areas of law, and existing mail settings
        const [statesData, areasData, mailAreaSettings] = await Promise.all([
          getStates(),
          getAreasOfLaw(),
          getFirmMailAreasOfLaw(firmId || '')
        ]);
        
        setStates(statesData);
        setAreasOfLaw(areasData);
        
        // Convert the mail area settings to the UI format
        const selections: AreaSelectionUI[] = mailAreaSettings.map(({ setting, areas }) => ({
          stateId: setting.stateId,
          stateName: setting.stateName || '',
          countyId: setting.countyId,
          countyName: setting.countyName || '',
          areas: areas.map(area => area.id),
          areaNames: areas.map(area => area.name)
        }));
        
        setAreaSelections(selections);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load settings data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (firmId) {
      loadData();
    }
  }, [firmId]);

  // Load counties when state changes
  useEffect(() => {
    const loadCounties = async () => {
      if (selectedStateId) {
        try {
          const countiesData = await getCountiesForState(parseInt(selectedStateId));
          setCounties(countiesData);
          setSelectedCountyId(''); // Reset county selection
        } catch (error) {
          console.error("Error loading counties:", error);
        }
      } else {
        setCounties([]);
      }
    };
    
    loadCounties();
  }, [selectedStateId]);

  const addAreaSelection = async () => {
    if (!selectedStateId || !selectedCountyId || selectedAreaIds.length === 0 || !firmId) {
      toast({
        title: "Incomplete selection",
        description: "Please select a state, county, and at least one area of law",
        variant: "destructive",
      });
      return;
    }

    const stateId = parseInt(selectedStateId);
    const countyId = parseInt(selectedCountyId);
    const areaIds = selectedAreaIds.map(id => parseInt(id));
    
    // Check if this state/county combination already exists
    const existingIndex = areaSelections.findIndex(
      item => item.stateId === stateId && item.countyId === countyId
    );
    
    if (existingIndex >= 0) {
      toast({
        title: "Area already added",
        description: `${states.find(s => s.id === stateId)?.name}, ${counties.find(c => c.id === countyId)?.name} is already in your selections`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call API to add new mail setting
      await addFirmMailSetting(
        firmId,
        stateId,
        countyId,
        areaIds
      );
      
      // Add to UI
      const stateName = states.find(s => s.id === stateId)?.name || '';
      const countyName = counties.find(c => c.id === countyId)?.name || '';
      const areaNames = areasOfLaw
        .filter(area => areaIds.includes(area.id))
        .map(area => area.name);
      
      setAreaSelections([
        ...areaSelections,
        {
          stateId,
          stateName,
          countyId,
          countyName,
          areas: areaIds,
          areaNames
        }
      ]);

      // Reset selections
      setSelectedCountyId('');
      setSelectedAreaIds([]);
      
      toast({
        title: "Area added",
        description: `Added ${stateName}, ${countyName} to your target areas`,
      });
    } catch (error) {
      console.error("Error adding area selection:", error);
      toast({
        title: "Error",
        description: "Failed to add area selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAreaSelection = (index: number) => {
    // In a real app, this would call an API to remove the area
    setAreaSelections(areaSelections.filter((_, i) => i !== index));
    
    toast({
      title: "Area removed",
      description: "The selected area has been removed from your target areas",
    });
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
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-12 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-12 bg-muted animate-pulse rounded-md"></div>
                </div>
                <div className="h-24 bg-muted animate-pulse rounded-md"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-medium">Add Areas for Direct Mail</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Select
                      value={selectedStateId}
                      onValueChange={setSelectedStateId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem
                            key={state.id}
                            value={state.id.toString()}
                          >
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">County</label>
                    <Select
                      value={selectedCountyId}
                      onValueChange={setSelectedCountyId}
                      disabled={!selectedStateId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a county" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county) => (
                          <SelectItem key={county.id} value={county.id.toString()}>
                            {county.name}
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
                            id={`area-${area.id}`}
                            checked={selectedAreaIds.includes(area.id.toString())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAreaIds([...selectedAreaIds, area.id.toString()]);
                              } else {
                                setSelectedAreaIds(selectedAreaIds.filter((id) => id !== area.id.toString()));
                              }
                            }}
                          />
                          <label
                            htmlFor={`area-${area.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {area.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={addAreaSelection}
                  disabled={!selectedStateId || !selectedCountyId || selectedAreaIds.length === 0 || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Area
                </Button>
              </div>
            )}

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
                        {selection.areaNames.map((areaName, i) => (
                          <div 
                            key={i} 
                            className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded"
                          >
                            {areaName}
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
