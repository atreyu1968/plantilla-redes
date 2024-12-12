import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { CourseForm } from './CourseForm';

interface Course {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
  periods?: Period[];
}

interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

interface CoursesListProps {
  onError?: (message: string) => void;
}

export function CoursesList({ onError }: CoursesListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      onError?.('Error al cargar los cursos académicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (err) {
      onError?.('Error al eliminar el curso');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando cursos académicos...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {courses.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay cursos académicos registrados
            </li>
          ) : (
            courses.map((course) => (
              <li key={course.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(course.start_date).toLocaleDateString()} - 
                      {new Date(course.end_date).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.active ? 'Activo' : 'Inactivo'}
                    </span>
                    {course.periods && course.periods.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500">Períodos:</p>
                        <ul className="mt-1 space-y-1">
                          {course.periods.map((period) => (
                            <li key={period.id} className="text-xs text-gray-600">
                              {period.name}: {new Date(period.start_date).toLocaleDateString()} - 
                              {new Date(period.end_date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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
        <CourseForm
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSuccess={fetchCourses}
          initialData={editingCourse || undefined}
          isEdit={!!editingCourse}
        />
      )}
    </div>
  );
}