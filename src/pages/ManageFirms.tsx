
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { getLawFirmsWithDetails } from '@/utils/api';
import { MockLawFirmWithDetails } from '@/types';

const ManageFirms = () => {
  const [firms, setFirms] = useState<MockLawFirmWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load firms data
  useEffect(() => {
    const loadFirms = async () => {
      try {
        setIsLoading(true);
        const data = await getLawFirmsWithDetails();
        setFirms(data);
      } catch (error) {
        console.error('Error loading firms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFirms();
  }, []);

  // Filter firms based on search query
  const filteredFirms = firms.filter(firm => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    firm.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    firm.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
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
          
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Law Firms
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all registered law firms
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search firms..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Showing {filteredFirms.length} of {firms.length} firms
            </p>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firm Name</TableHead>
                  <TableHead>Firm ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading firms...
                    </TableCell>
                  </TableRow>
                ) : filteredFirms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No firms found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFirms.map((firm) => (
                    <TableRow key={firm.id}>
                      <TableCell className="font-medium">{firm.name}</TableCell>
                      <TableCell>{firm.slug}</TableCell>
                      <TableCell>{firm.email}</TableCell>
                      <TableCell>{formatDate(firm.lastLogin)}</TableCell>
                      <TableCell>{firm.leadsCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/${firm.slug}/back`}>
                            <Button size="sm">Access Dashboard</Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageFirms;
