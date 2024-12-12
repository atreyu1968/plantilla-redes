import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { NetworkForm } from './NetworkForm';

interface NetworksListProps {
  onError?: (message: string) => void;
}

interface Network {
  id: number;
  code: string;
  name: string;
  description: string;
  center_sede_name: string;
  status: string;
}

export function NetworksList({ onError }: NetworksListProps) {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<Network | null>(null);

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
      onError?.('Error al cargar las redes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta red?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/networks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNetworks();
    } catch (err) {
      onError?.('Error al eliminar la red');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando redes...</div>;
  }

  return (
    <div className="space-y-4">
      {networks.map((network) => (
          <div
            key={network.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{network.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{network.code}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingNetwork(network);
                    setShowForm(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(network.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Centro Sede</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {network.center_sede_name || 'No asignado'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Centros Asociados</h4>
                <p className="mt-1 text-sm text-gray-900">
                  Sin centros asociados
                </p>
              </div>
            </div>
          </div>
      ))}
      
      {networks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No hay redes registradas</p>
        </div>
      )}

      {showForm && (
        <NetworkForm
          onClose={() => {
            setShowForm(false);
            setEditingNetwork(null);
          }}
          onSuccess={fetchNetworks}
          initialData={editingNetwork || undefined}
          isEdit={!!editingNetwork}
        />
      )}
    </div>
  );
}