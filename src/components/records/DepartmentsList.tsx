import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { DepartmentForm } from './DepartmentForm';

interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  familyId?: number;
  familyName?: string;
}

interface DepartmentsListProps {
  onError?: (message: string) => void;
}

export function DepartmentsList({ onError }: DepartmentsListProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (err) {
      onError?.('Error al cargar los departamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDepartments();
    } catch (err) {
      onError?.('Error al eliminar el departamento');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando departamentos...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {departments.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay departamentos registrados
            </li>
          ) : (
            departments.map((department) => (
              <li key={department.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-500">{department.code}</p>
                    {department.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {department.description}
                      </p>
                    )}
                    {department.familyName && (
                      <p className="mt-1 text-sm text-blue-600">
                        Familia: {department.familyName}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingDepartment(department);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
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
        <DepartmentForm
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          onSuccess={fetchDepartments}
          initialData={editingDepartment || undefined}
          isEdit={!!editingDepartment}
        />
      )}
    </div>
  );
}