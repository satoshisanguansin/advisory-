
import React from 'react';

interface LanguageToggleProps {
  language: 'English' | 'Thai';
  setLanguage: (language: 'English' | 'Thai') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  const selectedClass = 'text-white bg-[#F58220]';
  const notSelectedClass = 'text-gray-300 bg-gray-700/50';

  return (
    <div className="flex items-center space-x-2">
       <span className="text-sm font-medium text-gray-300">ภาษาของรายงาน:</span>
       <div className="p-1 bg-[#212529] rounded-lg flex space-x-1">
            <button
                onClick={() => setLanguage('English')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${language === 'English' ? selectedClass : notSelectedClass}`}
            >
                English
            </button>
            <button
                onClick={() => setLanguage('Thai')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${language === 'Thai' ? selectedClass : notSelectedClass}`}
            >
                ไทย
            </button>
        </div>
    </div>
  );
};

export default LanguageToggle;