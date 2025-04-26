
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const navigate = useNavigate();
  
  // Redirect to leads page
  useEffect(() => {
    if (firmId) {
      navigate(`/${firmId}/back/leads`);
    }
  }, [firmId, navigate]);

  return null;
};

export default Dashboard;
