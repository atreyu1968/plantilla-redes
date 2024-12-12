import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { ODSForm } from './ODSForm';

interface ODS {
  id: number;
  code: string;
  name: string;
  description: string;
}

interface ODSListProps {
  onError?: (message: string) => void;
}

export function ODSList({ onError }: ODSListProps) {
  const [odsList, setODSList] = useState<ODS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingODS, setEditingODS] = useState<ODS | null>(null);

  const fetchODS = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/ods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setODSList(response.data);
    } catch (err) {
      onError?.('Error al cargar los ODS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchODS();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este ODS?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/ods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchODS();
    } catch (err) {
      onError?.('Error al eliminar el ODS');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando ODS...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {odsList.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay ODS registrados
            </li>
          ) : (
            odsList.map((ods) => (
              <li key={ods.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {ods.name}
                      </h3>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {ods.code}
                      </span>
                    </div>
                    {ods.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {ods.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingODS(ods);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ods.id)}
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
        <ODSForm
          onClose={() => {
            setShowForm(false);
            setEditingODS(null);
          }}
          onSuccess={fetchODS}
          initialData={editingODS || undefined}
          isEdit={!!editingODS}
        />
      )}
    </div>
  );
}