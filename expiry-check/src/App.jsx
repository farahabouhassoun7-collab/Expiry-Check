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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Navigate to="/login" replace />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/products"            element={<Products />} />
        <Route path="/products/:id"        element={<ProductDetails />} />
        <Route path="/alerts"              element={<AlertsCenter />} />
        <Route path="/analytics"           element={<Analytics />} />
        <Route path="/ai-insights"         element={<AIInsights />} />
        <Route path="/settings"            element={<Settings />} />
        {/* Fallback */}
        <Route path="*"                    element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
