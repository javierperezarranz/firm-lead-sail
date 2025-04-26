
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { isUserAdmin } from '@/utils/api/auth';
import { useToast } from "@/hooks/use-toast";

export function ManageRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    async function checkAdminAccess() {
      try {
        if (!user) {
          toast({
            title: "Authentication required",
            description: "You need to log in first",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        // Check if user has admin role
        const isAdmin = await isUserAdmin(user.id);
        
        if (isAdmin) {
          setAuthorized(true);
        } else {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this area",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Admin authorization error:', error);
        toast({
          title: "Authorization error",
          description: "Could not verify your permissions",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminAccess();
  }, [navigate, user, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return authorized ? children : null;
}
