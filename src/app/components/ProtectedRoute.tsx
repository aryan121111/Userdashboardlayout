import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
