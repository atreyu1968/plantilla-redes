import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
      {message}
    </div>
  );
}