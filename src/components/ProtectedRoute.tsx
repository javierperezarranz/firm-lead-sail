
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { checkUserHasAccess } from '@/utils/api/auth';
import { useToast } from "@/hooks/use-toast";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const { firmId } = useParams<{ firmId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    async function checkAccess() {
      try {
        if (!user || !firmId) {
          toast({
            title: "Authentication required",
            description: "You need to log in first",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        const hasAccess = await checkUserHasAccess(user.id, firmId);
        
        if (hasAccess) {
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
        console.error('Authorization error:', error);
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
    
    checkAccess();
  }, [navigate, firmId, user, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return authorized ? children : null;
}
