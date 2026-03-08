import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard now redirects to Protocol page.
 * [ARCH-001] Dashboard was a 553-line duplicate of Protocol — unified into single page.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/protocol', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="font-display text-lg tracking-widest text-muted-foreground animate-pulse">KOR</span>
    </div>
  );
};

export default Dashboard;
