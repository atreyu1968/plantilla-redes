import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { NetworkObjectiveForm } from './NetworkObjectiveForm';

interface NetworkObjective {
  id: number;
  code: string;
  name: string;
  description: string;
  priority: string;
  networkId?: number;
  networkName?: string;
}

interface NetworkObjectivesListProps {
  onError?: (message: string) => void;
}

export function NetworkObjectivesList({ onError }: NetworkObjectivesListProps) {
  const [objectives, setObjectives] = useState<NetworkObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState<NetworkObjective | null>(null);

  const fetchObjectives = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/objectives?type=Red`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjectives(response.data);
    } catch (err) {
      onError?.('Error al cargar los objetivos de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este objetivo?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/objectives/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchObjectives();
    } catch (err) {
      onError?.('Error al eliminar el objetivo');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando objetivos de red...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {objectives.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay objetivos de red registrados
            </li>
          ) : (
            objectives.map((objective) => (
              <li key={objective.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {objective.name}
                      </h3>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        objective.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                        objective.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {objective.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{objective.code}</p>
                    {objective.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {objective.description}
                      </p>
                    )}
                    {objective.networkName && (
                      <p className="mt-1 text-sm text-blue-600">
                        Red: {objective.networkName}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingObjective(objective);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(objective.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showForm && (
        <NetworkObjectiveForm
          onClose={() => {
            setShowForm(false);
            setEditingObjective(null);
          }}
          onSuccess={fetchObjectives}
          initialData={editingObjective || undefined}
          isEdit={!!editingObjective}
        />
      )}
    </div>
  );
}