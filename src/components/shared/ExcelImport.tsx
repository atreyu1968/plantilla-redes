import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onImport: (data: any[]) => void;
  templateUrl: string;
}

export function ExcelImport({ onImport, templateUrl }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      onImport(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Upload className="h-5 w-5 mr-2 text-gray-500" />
        Importar Excel
      </button>
      <a
        href={templateUrl}
        download
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Descargar plantilla
      </a>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx,.xls"
        className="hidden"
      />
    </div>
  );
}