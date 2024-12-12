import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../stores/auth';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Bienvenido, {user?.firstName || user?.username}
              </h1>
              <p className="text-gray-600 mt-2">
                Panel de control de la Red de Emprendimiento FP
              </p>
            </div>
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}