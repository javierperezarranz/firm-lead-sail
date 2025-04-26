
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';
import { getLawFirmBySlug } from '@/utils/api';

const BackOffice = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // In a real app, we would check if the firm exists here
  React.useEffect(() => {
    const checkFirmExists = async () => {
      if (!firmId) {
        toast({
          title: "Error",
          description: "Law firm not found",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        const firm = await getLawFirmBySlug(firmId);
        if (!firm) {
          toast({
            title: "Error",
            description: `Law firm '${firmId}' not found`,
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error checking firm:", error);
        toast({
          title: "Error",
          description: "Could not verify law firm",
          variant: "destructive",
        });
      }
    };

    checkFirmExists();
  }, [firmId, toast, navigate]);

  if (!firmId) {
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
