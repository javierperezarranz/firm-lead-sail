
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Lead } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading }) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-lg shadow-sm border animate-pulse p-8">
        <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full bg-card rounded-lg shadow-sm border p-12 text-center">
        <p className="text-muted-foreground">No leads available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg shadow-sm border overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead.id}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-medium">{lead.id}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>
                <a 
                  href={`mailto:${lead.email}`} 
                  className="text-primary hover:underline"
                >
                  {lead.email}
                </a>
              </TableCell>
              <TableCell>
                <a 
                  href={`tel:${lead.phone}`}
                  className="text-primary hover:underline"
                >
                  {lead.phone}
                </a>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDate(lead.submittedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
