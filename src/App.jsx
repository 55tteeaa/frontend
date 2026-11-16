import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomeCatalog from './pages/HomeCatalog';
import ResourceBooking from './pages/ResourceBooking';
import MyBookings from './pages/MyBookings';
import AdminRequests from './pages/AdminRequests';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('campus-theme');
    return ['dark', 'pink', 'neon'].includes(savedTheme) ? savedTheme : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('campus-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Se inițializează Campus Cercetare...
      </div>
    );
  }

  return (
    <Layout theme={theme} onThemeChange={setTheme}>
      <Routes>
        <Route path="/" element={<HomeCatalog />} />
        <Route path="/resursa/:id" element={<ResourceBooking />} />
        <Route path="/rezervarile-mele" element={<MyBookings />} />
        <Route
          path="/setari"
          element={
            <div className="max-w-xl bg-white p-6 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Setări cont</h2>
              <p className="text-sm text-slate-500 mt-2">Nume: {user?.name}</p>
              <p className="text-sm text-slate-500">E-mail instituțional: {user?.email}</p>
              <p className="text-sm text-slate-500">Departament: {user?.department}</p>
            </div>
          }
        />
        <Route path="/admin/cereri" element={<AdminRequests mode="PENDING" />} />
        <Route path="/admin/istoric" element={<AdminRequests mode="HISTORY" />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}