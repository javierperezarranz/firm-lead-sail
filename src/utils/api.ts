
import { FormData, Lead } from "@/types";

// This is a mock API for demonstration purposes
// In a real application, this would be replaced with actual API calls to your backend

// In-memory storage as a mock database
const leadsDatabase: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    lawFirmId: "lawfirm1",
    createdAt: "2023-06-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-987-6543",
    lawFirmId: "lawfirm1",
    createdAt: "2023-06-16T14:45:00Z"
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-567-8901",
    lawFirmId: "lawfirm2",
    createdAt: "2023-06-17T09:15:00Z"
  }
];

// Get leads for a specific law firm
export const getLeads = async (lawFirmId: string): Promise<Lead[]> => {
  console.log(`Fetching leads for ${lawFirmId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter leads for the specified law firm
  return leadsDatabase.filter(lead => lead.lawFirmId === lawFirmId);
};

// Submit a new lead
export const submitLead = async (data: FormData, lawFirmId: string): Promise<Lead> => {
  console.log(`Submitting lead for ${lawFirmId}:`, data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new lead
  const newLead: Lead = {
    id: leadsDatabase.length + 1,
    ...data,
    lawFirmId,
    createdAt: new Date().toISOString()
  };
  
  // Add to our mock database
  leadsDatabase.push(newLead);
  
  return newLead;
};
