import React, { useState, useCallback, useEffect } from 'react';
import type { ForensicBudgetAnalysisReport } from '../../types';
import { generateForensicBudgetAnalysis } from '../../services/geminiService';
import ForensicBudgetAnalysisDisplay from '../ReportDisplay';
import LoadingSpinner from '../icons/LoadingSpinner';

interface ForensicWorkstationProps {
    initialData?: string | null;
    onDataConsumed: () => void;
}

const ForensicWorkstation: React.FC<ForensicWorkstationProps> = ({ initialData, onDataConsumed }) => {
    const [forensicInput, setForensicInput] = useState('');
    const [report, setReport] = useState<ForensicBudgetAnalysisReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setForensicInput(initialData);
            onDataConsumed(); // Clear the prop in parent after consuming
        }
    }, [initialData, onDataConsumed]);

    const handleGenerateReport = useCallback(async () => {
        if (!forensicInput.trim()) {
            setError("กรุณาป้อนข้อมูลหรืออัปโหลดเอกสารงบประมาณเพื่อวิเคราะห์");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReport(null);
        setStatus('กำลังปรับใช้ BriefAgent "God Mode"...');

        try {
            const onStatusUpdateCallback = (status: string) => setStatus(status);
            const reportData = await generateForensicBudgetAnalysis(forensicInput, onStatusUpdateCallback);
            setReport(reportData);
        } catch (e) {
            setError(e instanceof Error ? `เกิดข้อผิดพลาด: ${e.message}` : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการวิเคราะห์งบประมาณ");
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    }, [forensicInput]);
    
    if (isLoading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <LoadingSpinner className="w-12 h-12 text-yellow-400" />
                <h3 className="mt-4 text-xl font-bold text-white">{status || 'กำลังวิเคราะห์งบประมาณ...'}</h3>
                <p className="mt-1 text-gray-400">BriefAgent กำลังตรวจสอบข้อมูลและเทียบกับราคาตลาด...</p>
            </div>
        );
    }
    
    if (report) {
        return <ForensicBudgetAnalysisDisplay report={report} onClear={() => setReport(null)} />;
    }

    return (
        <div className="flex flex-col justify-center flex-grow">
            <h2 className="text-3xl font-bold text-white mb-2">วิเคราะห์งบประมาณเชิงลึก</h2>
            <p className="text-base text-gray-400 mb-8">อัปโหลดหรือวางข้อมูลจากเอกสารงบประมาณ, การจัดซื้อจัดจ้าง, หรือ TOR เพื่อให้ AI วิเคราะห์เชิงลึก เปรียบเทียบกับราคาตลาด (FMV) และระบุความผิดปกติ</p>
            
            <div className="mb-4">
                <label htmlFor="forensic-input" className="block text-sm font-medium text-gray-300 mb-1">ข้อมูลสำหรับวิเคราะห์</label>
                <textarea 
                    id="forensic-input" 
                    rows={12} 
                    value={forensicInput} 
                    onChange={(e) => setForensicInput(e.target.value)} 
                    disabled={isLoading} 
                    className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow disabled:opacity-50" 
                    placeholder="วางข้อมูลจากเอกสารงบประมาณที่นี่..."
                />
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={handleGenerateReport} 
                    disabled={isLoading || !forensicInput.trim()} 
                    className="w-full h-14 flex justify-center items-center space-x-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2f34] focus-visible:ring-white"
                >
                    {isLoading && <LoadingSpinner />}
                    <span>{isLoading ? status || 'กำลังวิเคราะห์...' : "วิเคราะห์"}</span>
                </button>
            </div>
            {error && <p className="text-red-400 font-semibold text-sm mt-4 text-center">{error}</p>}
        </div>
    );
};

export default ForensicWorkstation;