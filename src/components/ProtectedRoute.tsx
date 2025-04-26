
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { checkUserHasAccess } from '@/utils/api/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const { firmId } = useParams<{ firmId: string }>();
  const { user } = useAuth();
  
  useEffect(() => {
    async function checkAccess() {
      try {
        if (!user || !firmId) {
          navigate('/login');
          return;
        }
        
        const hasAccess = await checkUserHasAccess(user.id, firmId);
        
        if (hasAccess) {
          setAuthorized(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAccess();
  }, [navigate, firmId, user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return authorized ? children : null;
}
