import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network,
  FolderKanban,
  Calendar,
  Users,
  Settings,
  Key
} from 'lucide-react';
import { useAuth } from '../stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Registros Maestros', href: '/records', icon: FolderKanban },
  { name: 'Cursos Académicos', href: '/courses', icon: Calendar },
  { name: 'Usuarios', href: '/users', icon: Users }
];

const adminNavigation = [
  { name: 'Administración', href: '/admin', icon: Settings }
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gray-800">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <Icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-white"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                );
              })}
              
              {user?.role === 'admin' && (
                <>
                  <div className="pt-4 mb-2">
                    <div className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Administración
                    </div>
                  </div>
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                        }
                      >
                        <Icon
                          className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-white"
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-300">{user?.username}</p>
                <p className="text-xs font-medium text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}