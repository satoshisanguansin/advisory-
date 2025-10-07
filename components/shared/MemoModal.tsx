import React, { useState } from 'react';

interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
}

const MemoModal: React.FC<MemoModalProps> = ({ isOpen, onClose, title, content }) => {
  const [copyStatus, setCopyStatus] = useState('Copy to Clipboard');
  
  if (!isOpen) return null;

  const handleCopy = () => {
    const fullText = `${title}\n\n${content.join('\n\n')}`;
    navigator.clipboard.writeText(fullText).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy to Clipboard'), 2000);
    }, () => {
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus('Copy to Clipboard'), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#212529] rounded-xl shadow-2xl p-6 w-full max-w-3xl border border-red-500/30" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-white mb-4">{title}</h4>
            <button onClick={onClose} className="text-gray-500 hover:text-white" aria-label="Close Memo">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4 text-gray-300 leading-relaxed">
           {content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="flex justify-end pt-4 mt-2">
          <button onClick={handleCopy} className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
            <span>{copyStatus}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoModal;
