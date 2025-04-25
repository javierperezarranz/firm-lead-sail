
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';

const BackOffice = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!firmId) {
    toast({
      title: "Error",
      description: "Law firm not found",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar firmId={firmId} />
      
      {/* Main Content */}
      <main className="flex-1 pl-0 lg:pl-64">
        <div className="min-h-screen p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BackOffice;
