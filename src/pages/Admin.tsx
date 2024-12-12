import React, { useState } from 'react';
import { Key, UserPlus, Settings } from 'lucide-react';
import { TabButton } from '../components/records/TabButton';
import { RegistrationCodesList } from '../components/admin/RegistrationCodesList';
import { ErrorMessage } from '../components/shared/ErrorMessage';

const tabs = [
  { id: 'registration-codes', name: 'Códigos de Registro', icon: UserPlus },
  { id: 'settings', name: 'Configuración', icon: Settings }
];

export function Admin() {
  const [activeTab, setActiveTab] = useState('registration-codes');
  const [error, setError] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Administración</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de configuraciones y códigos de registro
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                name={tab.name}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>

        <ErrorMessage message={error} />

        <div className="p-6">
          {activeTab === 'registration-codes' && (
            <RegistrationCodesList onError={setError} />
          )}
          {activeTab === 'settings' && (
            <div className="text-center text-gray-500 py-8">
              Configuración del sistema - Próximamente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}