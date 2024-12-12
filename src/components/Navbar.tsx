import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search } from 'lucide-react';
import { useAuth } from '../stores/auth';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1e3a8a] h-16 border-b border-[#1e3a8a]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-white">Red de Emprendimiento FP</h1>
            </div>
            <div className="ml-8 flex-1 flex">
              <div className="flex-1 flex items-center">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="search"
                      className="block w-full pl-10 pr-3 py-2 border border-[#1e3a8a] rounded-md leading-5 bg-[#1e3a8a]/40 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 sm:text-sm"
                      placeholder="Buscar recursos..."
                      type="search"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-white mr-4">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-white/80 hover:text-white focus:outline-none"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}