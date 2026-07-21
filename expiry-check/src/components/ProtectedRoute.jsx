import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';

/**
 * ProtectedRoute component
 * 
 * Wraps any route that requires authentication.
 * If the user is not logged in, redirects to /login.
 * If the user is logged in, renders the child component.
 */
export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}