import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import ZaptBadge from '../shared/components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:date" element={<Journal />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ZaptBadge />
    </div>
  );
}