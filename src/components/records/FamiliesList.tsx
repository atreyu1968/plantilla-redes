import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { FamilyForm } from './FamilyForm';

interface Family {
  id: number;
  code: string;
  name: string;
  description: string;
}

interface FamiliesListProps {
  onError?: (message: string) => void;
}

export function FamiliesList({ onError }: FamiliesListProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const fetchFamilies = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/families`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFamilies(response.data);
    } catch (err) {
      onError?.('Error al cargar las familias profesionales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta familia profesional?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/families/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFamilies();
    } catch (err) {
      onError?.('Error al eliminar la familia profesional');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando familias profesionales...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {families.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay familias profesionales registradas
            </li>
          ) : (
            families.map((family) => (
              <li key={family.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {family.name}
                    </h3>
                    <p className="text-sm text-gray-500">{family.code}</p>
                    {family.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {family.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingFamily(family);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(family.id)}
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
        <FamilyForm
          onClose={() => {
            setShowForm(false);
            setEditingFamily(null);
          }}
          onSuccess={fetchFamilies}
          initialData={editingFamily || undefined}
          isEdit={!!editingFamily}
        />
      )}
    </div>
  );
}