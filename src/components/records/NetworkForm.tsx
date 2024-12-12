import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';

interface NetworkFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<NetworkFormData>;
  isEdit?: boolean;
}

export interface NetworkFormData {
  code: string;
  name: string;
  description: string;
  centerSedeId?: number;
}

interface Center {
  id: number;
  code: string;
  name: string;
}

export function NetworkForm({ onClose, onSuccess, initialData, isEdit }: NetworkFormProps) {
  const [formData, setFormData] = useState<NetworkFormData>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    centerSedeId: initialData?.centerSedeId
  });
  const [centers, setCenters] = useState<Center[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

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
      setError('Error al cargar los centros');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'centerSedeId' ? 
      e.target.value ? parseInt(e.target.value) : undefined : 
      e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (isEdit && initialData?.id) {
        await axios.put(
          `${SERVER_CONFIG.BASE_URL}/api/networks/${initialData.id}`,
          formData,
          config
        );
      } else {
        await axios.post(`${SERVER_CONFIG.BASE_URL}/api/networks`, formData, config);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Red' : 'Nueva Red'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Centro Sede
              </label>
              <select
                name="centerSedeId"
                value={formData.centerSedeId || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar centro sede</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : isEdit ? 'Actualizar' : 'Crear Red'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}