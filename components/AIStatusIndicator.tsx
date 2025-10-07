

import React, { useState, useEffect } from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import type { GenerationTask } from '../types';

interface AIStatusIndicatorProps {
  task: GenerationTask | null;
}

const subStatusMessages = [
    "Deploying AI agents...",
    "Scanning public web for sentiment...",
    "Analyzing stakeholder positions...",
    "Cross-referencing legislative precedents...",
    "Simulating OSINT reports...",
    "Synthesizing strategic recommendations...",
    "Applying CHATRI strategic framework...",
    "Finalizing intelligence briefing...",
];

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ task }) => {
  const [subStatusIndex, setSubStatusIndex] = useState(0);

  useEffect(() => {
    if (task?.status === 'running') {
        const interval = setInterval(() => {
            setSubStatusIndex(prevIndex => (prevIndex + 1) % subStatusMessages.length);
        }, 2500); // Change message every 2.5 seconds
        return () => clearInterval(interval);
    }
  }, [task?.status]);

  const statusMessage = task?.statusMessage || 'Initializing analysis...';
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <LoadingSpinner className="w-12 h-12 text-[#F58220]" />
      <h3 className="mt-4 text-xl font-bold text-white">{statusMessage}</h3>
      <p className="mt-1 text-gray-400 h-10 flex items-center transition-opacity duration-500">
        {task?.status === 'running' ? subStatusMessages[subStatusIndex] : 'Your AI partner is working on the request. This may take a moment.'}
      </p>

      {task && (
        <div className="mt-6 w-full max-w-md bg-[#212529] rounded-lg text-left p-4 border border-gray-700">
           <h4 className="text-sm font-semibold text-[#F58220] mb-2">Task Status</h4>
           <p className="font-mono text-xs text-gray-400">
                <strong>ID:</strong> {task.id} <br/>
                <strong>Status:</strong> <span className="font-bold text-yellow-300">{task.status.toUpperCase()}</span>
           </p>
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;