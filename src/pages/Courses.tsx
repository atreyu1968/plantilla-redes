import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CoursesList } from '../components/records/CoursesList';
import { CourseForm } from '../components/records/CourseForm';
import { ErrorMessage } from '../components/shared/ErrorMessage';

export function Courses() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Cursos Académicos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Curso Académico
        </button>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <CoursesList onError={setError} />
        </div>
      </div>

      {showForm && (
        <CourseForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
}