
import React from 'react';

const ExportButton: React.FC<{ onExport: () => void }> = ({ onExport }) => {
  return (
    <button
      onClick={onExport}
      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-colors"
      aria-label="Export report"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>ส่งออก</span>
    </button>
  );
};

export default ExportButton;