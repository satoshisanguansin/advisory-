
import React from 'react';

const Logo: React.FC<{ className?: string, showText?: boolean }> = ({ className = 'h-10 w-10', showText = false }) => {
  return (
    <div className={`flex items-center gap-4 ${showText ? '' : 'justify-center'}`}>
      <div className={`bg-[#F58220] rounded-full flex items-center justify-center p-1.5 ${className}`}>
        <svg
          className="w-full h-full text-white"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="People's Party Logo"
        >
          <path d="M10 5 C 10 5, 30 5, 30 17.5 C 30 30, 10 30, 10 35 M10 17.5 H 22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {showText && <span className="text-3xl font-bold text-white tracking-wider">พรรคประชาชน</span>}
    </div>
  );
};

export default Logo;