import { Session } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  session: Session; 
  children: React.ReactNode;
}

const ProtectedRoute = ({ session, children }: ProtectedRouteProps) => {
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>;
}

export default ProtectedRoute
