import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader2, BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react';
import { SERVER_CONFIG } from '../config';

interface Resource {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id: number;
  created_at: string;
}

const categoryIcons = {
  document: FileText,
  video: Video,
  link: LinkIcon,
  other: BookOpen,
};

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/resources`);
      setResources(response.data);
    } catch (err) {
      setError('Error al cargar los recursos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Recursos</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Recurso
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recursos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando un nuevo recurso.
            </p>
          </div>
        ) : (
          resources.map((resource) => {
            const Icon = categoryIcons[resource.category as keyof typeof categoryIcons] || BookOpen;
            return (
              <div
                key={resource.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {resource.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm text-gray-500">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}