import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { CenterForm } from './CenterForm';

export interface Center {
  id: number;
  code: string;
  name: string;
  description: string;
  status: string;
}

interface CentersListProps {
  onAddCenter?: () => void;
  onError?: (message: string) => void;
}

export function CentersList({ onAddCenter, onError }: CentersListProps) {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);

  const fetchCenters = async () => {
    try {
      const token = localStorage.getItem('auth-storage') 
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/centers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCenters(response.data);
    } catch (err) {
      onError?.('Error al cargar los centros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este centro?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage') 
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/centers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCenters();
    } catch (err) {
      onError?.('Error al eliminar el centro');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando centros...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {centers.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay centros registrados
            </li>
          ) : (
            centers.map((center) => (
              <li key={center.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {center.name}
                    </h3>
                    <p className="text-sm text-gray-500">{center.code}</p>
                    {center.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {center.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCenter(center);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(center.id)}
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
        <CenterForm
          onClose={() => {
            setShowForm(false);
            setEditingCenter(null);
          }}
          onSuccess={fetchCenters}
          initialData={editingCenter || undefined}
          isEdit={!!editingCenter}
        />
      )}
    </div>
  );
}