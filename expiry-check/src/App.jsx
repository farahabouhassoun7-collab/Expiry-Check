import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/Login/Login';
import Register       from './pages/Register/Register';
import Dashboard      from './pages/Dashboard/Dashboard';
import Products       from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import AlertsCenter   from './pages/AlertsCenter/AlertsCenter';
import Analytics      from './pages/Analytics/Analytics';
import AIInsights     from './pages/AIInsights/AIInsights';
import Settings       from './pages/Settings/Settings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Navigate to="/login" replace />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <AlertsCenter />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/ai-insights" element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
