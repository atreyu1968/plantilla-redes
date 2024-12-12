import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  id: string;
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ id, name, icon: Icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap py-3 px-6 border-b-2 font-medium text-sm flex items-center
        ${isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
    >
      <Icon className={`h-5 w-5 mr-2 ${
        isActive ? 'text-blue-500' : 'text-gray-400'
      }`} />
      {name}
    </button>
  );
}