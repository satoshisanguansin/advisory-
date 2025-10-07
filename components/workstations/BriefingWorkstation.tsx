
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { IntelligenceBriefingReport, GenerationTask } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';
import * as backendService from '../../services/backendService';
import ToastNotification from '../shared/ToastNotification';

interface BriefingWorkstationProps {
  onSelectReport: (report: IntelligenceBriefingReport, topicId: string) => void;
  initialTopic?: string | null;
  onDataConsumed: () => void;
}

const sampleTopics = [
    'สถานการณ์กัญชาในประเทศไทย',
    'ผลกระทบของกัญชาต่อเยาวชน',
    'เศรษฐกิจจากกัญชา',
    'กฎหมายควบคุมกัญชา'
];

const BriefingWorkstation: React.FC<BriefingWorkstationProps> = ({ onSelectReport, initialTopic, onDataConsumed }) => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pollIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (initialTopic) {
            setInputText(initialTopic);
            onDataConsumed(); // Consume the prop immediately
        }
    }, [initialTopic, onDataConsumed]);

    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['text/plain', 'text/markdown', 'text/html'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const isAllowed = allowedTypes.includes(file.type) || ['txt', 'md', 'html'].includes(fileExtension);

        if (!isAllowed) {
            setToast({ id: Date.now(), message: 'Unsupported file type. Please upload a .txt, .md, or .html file.', type: 'error' });
            if (fileInputRef.current) fileInputRef.current.value = ''; // Clear the input
            return;
        }

        setFileName(file.name);
        setToast(null); // Clear previous errors

        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setInputText(e.target.result);
            }
        };
        reader.onerror = () => {
            setToast({ id: Date.now(), message: `Failed to read file: ${file.name}. Please check the file and try again.`, type: 'error' });
            if (fileInputRef.current) fileInputRef.current.value = '';
            setFileName(null);
        };
        reader.readAsText(file);
    };
    
    const handleClearFile = () => {
        setInputText('');
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!inputText.trim()) {
            setToast({ id: Date.now(), message: 'Please enter a topic or upload a file to analyze.', type: 'error' });
            return;
        }
        
        if (!window.confirm('Are you sure you want to clear the data and start a new report?')) {
            return; // User cancelled the action
        }

        setIsLoading(true);
        setToast(null);

        try {
            const taskId = await backendService.startBriefingGenerationTask(inputText);
            
            pollIntervalRef.current = window.setInterval(async () => {
                const task = await backendService.getTask(taskId);
                if (task) {
                    if (task.status === 'completed' || task.status === 'failed') {
                        stopPolling();
                        setIsLoading(false);
                        if (task.status === 'completed' && task.result) {
                            onSelectReport(task.result, task.topic);
                        } else if (task.status === 'failed') {
                            setToast({ id: Date.now(), message: `Report generation failed: ${task.error || 'Unknown reason'}`, type: 'error' });
                        }
                    }
                }
            }, 2000);

        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
          setToast({ id: Date.now(), message: `Failed to start the analysis: ${errorMessage}`, type: 'error' });
          setIsLoading(false);
        }
    }, [inputText, onSelectReport, stopPolling]);

    if (isLoading) {
        // A minimal loading state as the main page handles the full indicator
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <LoadingSpinner className="w-12 h-12 text-[#F58220]" />
                <h3 className="mt-4 text-xl font-bold text-white">กำลังสร้างบทสรุป...</h3>
                <p className="mt-1 text-gray-400">AI กำลังทำงาน โปรดรอสักครู่</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center flex-grow">
            <h2 className="text-2xl font-bold text-white mb-1">สร้างบทสรุปใหม่</h2>
            <p className="text-gray-400 mb-6">ป้อนหัวข้อที่สนใจ (เช่น 'กัญชา', 'การพนัน') หรืออัปโหลดไฟล์เพื่อสร้างรายงานข่าวกรองฉบับเต็ม</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-300">ป้อนหัวข้อหรือวางเนื้อหา</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="file-upload" accept=".txt,.md,.html" aria-hidden="true" />
                  <label htmlFor="file-upload" className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>อัปโหลด</span>
                  </label>
                </div>
                
                <textarea id="text-input" rows={8} value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isLoading} className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F58220] transition-shadow disabled:opacity-50" placeholder="เช่น กฎระเบียบกัญชา" />
                
                {fileName && (
                  <div className="mt-2 flex items-center justify-between bg-zinc-800 px-3 py-2 rounded-lg text-sm">
                     <div className="flex items-center space-x-2 text-gray-300 overflow-hidden">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <span className="font-medium truncate" title={fileName}>{fileName}</span>
                     </div>
                     <button onClick={handleClearFile} className="text-gray-500 hover:text-white transition-colors flex-shrink-0 ml-2 p-1 rounded-full" aria-label="Clear file">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </button>
                  </div>
                )}
              </div>
            </div>

             <div className="mt-4">
                <p className="text-sm text-gray-400">หรือลองใช้หัวข้อตัวอย่าง:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {sampleTopics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => setInputText(topic)}
                            className="px-3 py-1.5 bg-zinc-700/50 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-full text-xs font-semibold transition-colors"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mt-6">
              <button onClick={handleAnalyzeClick} disabled={isLoading || !inputText.trim()} className="w-full h-14 flex justify-center items-center space-x-3 bg-[#F58220] hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2f34] focus-visible:ring-white">
                {isLoading && <LoadingSpinner />}
                <span>{isLoading ? 'กำลังวิเคราะห์...' : "สร้างบทสรุป"}</span>
              </button>
            </div>
            {toast && <ToastNotification key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </div>
      );
};

export default BriefingWorkstation;
