import React from 'react';
import { Activity, Users, FolderKanban, Calendar } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Registros Maestros', value: '0', icon: FolderKanban, color: 'blue' },
    { name: 'Acciones Registradas', value: '0', icon: Activity, color: 'green' },
    { name: 'Participantes', value: '0', icon: Users, color: 'purple' },
  ];

  return (
    <div>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${item.color}-100`}>
                  <Icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {item.name}
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {item.value}
                </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              Calendario de Reuniones
            </div>
          </h2>
          {/* Calendar component will go here */}
          <div className="text-gray-500">No hay reuniones programadas</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="text-gray-500">No hay actividad reciente para mostrar</div>
        </div>
      </div>
    </div>
  );
}