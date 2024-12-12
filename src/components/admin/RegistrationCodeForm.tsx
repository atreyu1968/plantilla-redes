import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';

interface RegistrationCodeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Role {
  id: number;
  name: string;
}

interface Center {
  id: number;
  name: string;
}

interface Network {
  id: number;
  name: string;
}

export function RegistrationCodeForm({ onClose, onSuccess }: RegistrationCodeFormProps) {
  const [formData, setFormData] = useState({
    role_id: '',
    center_id: '',
    network_id: '',
    uses_allowed: 1,
    expiration_date: '',
    active: true
  });
  const [centers, setCenters] = useState<Center[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ROLES = [
    { id: '1', name: 'Administrador' },
    { id: '2', name: 'Coordinador General' },
    { id: '3', name: 'Visitante' },
    { id: '4', name: 'Coordinador de Red' },
    { id: '5', name: 'Gestor' }
  ];

  useEffect(() => {
    fetchCenters();
    fetchNetworks();
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

  const fetchNetworks = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/networks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNetworks(response.data);
    } catch (err) {
      setError('Error al cargar las redes');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
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

      await axios.post(
        `${SERVER_CONFIG.BASE_URL}/api/registration-codes`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Nuevo Código de Registro
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
                Rol
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar rol</option>
                {ROLES.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Centro (opcional)
              </label>
              <select
                name="center_id"
                value={formData.center_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar centro</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Red (opcional)
              </label>
              <select
                name="network_id"
                value={formData.network_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar red</option>
                {networks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usos permitidos
              </label>
              <input
                type="number"
                name="uses_allowed"
                value={formData.uses_allowed}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de expiración
              </label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Código activo
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Creando...' : 'Crear Código'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}