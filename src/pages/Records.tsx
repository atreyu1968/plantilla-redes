import React, { useState } from 'react';
import { Network, Building2, GraduationCap, Building, Target, Flag, Globe, Calendar } from 'lucide-react';
import { TabButton } from '../components/records/TabButton';
import { AddButton } from '../components/records/AddButton';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { CentersList } from '../components/records/CentersList';
import { NetworksList } from '../components/records/NetworksList';
import { FamiliesList } from '../components/records/FamiliesList';
import { NetworkObjectivesList } from '../components/records/NetworkObjectivesList';
import { CenterObjectivesList } from '../components/records/CenterObjectivesList';
import { DepartmentsList } from '../components/records/DepartmentsList';
import { ODSList } from '../components/records/ODSList';
import { NetworkForm } from '../components/records/NetworkForm';
import { CenterForm } from '../components/records/CenterForm';
import { FamilyForm } from '../components/records/FamilyForm';
import { DepartmentForm } from '../components/records/DepartmentForm';
import { NetworkObjectiveForm } from '../components/records/NetworkObjectiveForm';
import { CenterObjectiveForm } from '../components/records/CenterObjectiveForm';
import { ODSForm } from '../components/records/ODSForm';
import { CoursesList } from '../components/records/CoursesList';
import { CourseForm } from '../components/records/CourseForm';
import { ExcelImport } from '../components/shared/ExcelImport';
import { generateTemplate } from '../utils/excel-templates';
import axios from 'axios';
import { SERVER_CONFIG } from '../config';

const tabs = [
  { id: 'redes', name: 'Redes', icon: Network },
  { id: 'centros', name: 'Centros', icon: Building2 },
  { id: 'familias', name: 'Familias Profesionales', icon: GraduationCap },
  { id: 'departamentos', name: 'Departamentos', icon: Building },
  { id: 'objetivos-red', name: 'Objetivos de Red', icon: Target },
  { id: 'objetivos-centro', name: 'Objetivos de Centro', icon: Flag },
  { id: 'ods', name: 'ODS', icon: Globe },
];

const getAddButtonLabel = (tab: string) => {
  switch (tab) {
    case 'redes': return 'Nueva Red';
    case 'centros': return 'Nuevo Centro';
    case 'familias': return 'Nueva Familia Profesional';
    case 'departamentos': return 'Nuevo Departamento';
    case 'objetivos-red': return 'Nuevo Objetivo de Red';
    case 'objetivos-centro': return 'Nuevo Objetivo de Centro';
    case 'ods': return 'Nuevo ODS';
    default: return '';
  }
};

export function Records() {
  const [activeTab, setActiveTab] = useState('redes');
  const [showNetworkForm, setShowNetworkForm] = useState(false);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showNetworkObjectiveForm, setShowNetworkObjectiveForm] = useState(false);
  const [showCenterObjectiveForm, setShowCenterObjectiveForm] = useState(false);
  const [showODSForm, setShowODSForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [error, setError] = useState('');

  const handleFormVisibility = (tab: string, value: boolean) => {
    switch (tab) {
      case 'redes':
        setShowNetworkForm(value);
        break;
      case 'centros':
        setShowCenterForm(value);
        break;
      case 'familias':
        setShowFamilyForm(value);
        break;
      case 'departamentos':
        setShowDepartmentForm(value);
        break;
      case 'objetivos-red':
        setShowNetworkObjectiveForm(value);
        break;
      case 'objetivos-centro':
        setShowCenterObjectiveForm(value);
        break;
      case 'ods':
        setShowODSForm(value);
        break;
      case 'cursos':
        setShowCourseForm(value);
        break;
    }
  };

  const handleImport = async (type: string, data: any[]) => {
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
        : null;

      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(
        `${SERVER_CONFIG.BASE_URL}/api/imports/${type}/import`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the current list without full page reload
      switch (type) {
        case 'networks':
          setShowNetworkForm(false);
          break;
        case 'centers':
          setShowCenterForm(false);
          break;
        case 'families':
          setShowFamilyForm(false);
          break;
        case 'departments':
          setShowDepartmentForm(false);
          break;
        case 'objectives-red':
          setShowNetworkObjectiveForm(false);
          break;
        case 'objectives-centro':
          setShowCenterObjectiveForm(false);
          break;
        case 'ods':
          setShowODSForm(false);
          break;
      }
    } catch (err) {
      setError('Error al importar datos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Registros Maestros</h1>
        <div className="flex items-center space-x-4">
          <ExcelImport
            onImport={(data) => handleImport(activeTab, data)}
            templateUrl={generateTemplate(
              activeTab === 'redes' ? 'networks' :
              activeTab === 'centros' ? 'centers' :
              activeTab === 'familias' ? 'families' :
              activeTab === 'departamentos' ? 'departments' :
              activeTab === 'objetivos-red' ? 'networkObjectives' :
              activeTab === 'objetivos-centro' ? 'centerObjectives' :
              'ods'
            )}
          />
          <AddButton
            onClick={() => handleFormVisibility(activeTab, true)}
            label={getAddButtonLabel(activeTab)}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                name={tab.name}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>

        <ErrorMessage message={error} />

        <div className="p-6 bg-gray-50">
          {activeTab === 'redes' && (
            <NetworksList onError={setError} />
          )}
          {activeTab === 'centros' && (
            <CentersList 
              onAddCenter={() => setShowCenterForm(true)}
              onError={setError}
            />
          )}
          {activeTab === 'familias' && (
            <FamiliesList onError={setError} />
          )}
          {activeTab === 'departamentos' && (
            <DepartmentsList onError={setError} />
          )}
          {activeTab === 'objetivos-red' && (
            <NetworkObjectivesList onError={setError} />
          )}
          {activeTab === 'objetivos-centro' && (
            <CenterObjectivesList onError={setError} />
          )}
          {activeTab === 'ods' && (
            <ODSList onError={setError} />
          )}
          {activeTab === 'cursos' && (
            <CoursesList onError={setError} />
          )}
        </div>
      </div>
      
      {showNetworkForm && (
        <NetworkForm
          onClose={() => setShowNetworkForm(false)}
          onSuccess={() => setShowNetworkForm(false)}
        />
      )}
      
      {showCenterForm && (
        <CenterForm
          onClose={() => setShowCenterForm(false)}
          onSuccess={() => setShowCenterForm(false)}
        />
      )}
      
      {showFamilyForm && (
        <FamilyForm
          onClose={() => setShowFamilyForm(false)}
          onSuccess={() => setShowFamilyForm(false)}
        />
      )}
      
      {showDepartmentForm && (
        <DepartmentForm
          onClose={() => setShowDepartmentForm(false)}
          onSuccess={() => setShowDepartmentForm(false)}
        />
      )}
      
      {showNetworkObjectiveForm && (
        <NetworkObjectiveForm
          onClose={() => setShowNetworkObjectiveForm(false)}
          onSuccess={() => setShowNetworkObjectiveForm(false)}
        />
      )}
      
      {showCenterObjectiveForm && (
        <CenterObjectiveForm
          onClose={() => setShowCenterObjectiveForm(false)}
          onSuccess={() => setShowCenterObjectiveForm(false)}
        />
      )}
      
      {showODSForm && (
        <ODSForm
          onClose={() => setShowODSForm(false)}
          onSuccess={() => setShowODSForm(false)}
        />
      )}
      
      {showCourseForm && (
        <CourseForm
          onClose={() => setShowCourseForm(false)}
          onSuccess={() => setShowCourseForm(false)}
        />
      )}
    </div>
  );
}