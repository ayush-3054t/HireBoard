import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { token, role, loading } = useAuth();
  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
