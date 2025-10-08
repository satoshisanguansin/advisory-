import React, { useState, useCallback, Suspense } from 'react';
import type { IntelReport } from '../../types';
import * as backendService from '../../services/backendService';
import LoadingSpinner from '../icons/LoadingSpinner';

const IntelReportDisplay = React.lazy(() => import('../IntelReportDisplay'));

const IntelWorkstation: React.FC = () => {
    const [personName, setPersonName] = useState('');
    const [report, setReport] = useState<IntelReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = useCallback(async () => {
        if (!personName.trim()) {
            setError("กรุณาป้อนชื่อเพื่อสร้างแฟ้มข้อมูล");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReport(null);
        setStatus('กำลังรวบรวมแฟ้มข้อมูล OSINT...');

        try {
            const onStatusUpdateCallback = (status: string) => setStatus(status);
            const reportData = await backendService.generateIntelReport(personName, onStatusUpdateCallback);
            setReport(reportData);
        } catch (e) {
            setError(e instanceof Error ? `เกิดข้อผิดพลาด: ${e.message}` : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการสร้างแฟ้มข้อมูล");
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    }, [personName]);

    if (isLoading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <LoadingSpinner className="w-12 h-12 text-cyan-400" />
                <h3 className="mt-4 text-xl font-bold text-white">{status || 'กำลังสร้างแฟ้มข้อมูล...'}</h3>
                <p className="mt-1 text-gray-400">AI กำลังสแกนข่าวกรองจากแหล่งข้อมูลเปิด...</p>
            </div>
        );
    }
    
    if (report) {
        return (
            <Suspense fallback={<LoadingSpinner className="w-10 h-10 text-cyan-400 mx-auto" />}>
                <IntelReportDisplay report={report} onClear={() => { setReport(null); setPersonName(''); }} />
            </Suspense>
        );
    }

    return (
        <div className="flex flex-col justify-center flex-grow">
            <h2 className="text-3xl font-bold text-white mb-2">แฟ้มข้อมูลข่าวกรองไซเบอร์</h2>
            <p className="text-base text-gray-400 mb-8">ป้อนชื่อเต็มของบุคคลที่น่าสนใจเพื่อสร้างแฟ้มข้อมูลข่าวกรองจากแหล่งข้อมูลเปิด (OSINT)</p>

            <div className="mb-4">
                <label htmlFor="intel-person-name" className="block text-sm font-medium text-gray-300 mb-1">บุคคลที่สนใจ</label>
                <input 
                    type="text" 
                    id="intel-person-name" 
                    value={personName} 
                    onChange={e => setPersonName(e.target.value)} 
                    disabled={isLoading} 
                    className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow disabled:opacity-50" 
                    placeholder="เช่น ประยุทธ์ จันทร์โอชา"
                />
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={handleGenerateReport} 
                    disabled={isLoading || !personName.trim()} 
                    className="w-full h-14 flex justify-center items-center space-x-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2f34] focus-visible:ring-white"
                >
                    {isLoading && <LoadingSpinner />}
                    <span>{isLoading ? status || 'กำลังสร้าง...' : "สร้างแฟ้มข้อมูล"}</span>
                </button>
            </div>
            {error && <p className="text-red-400 font-semibold text-sm mt-4 text-center">{error}</p>}
        </div>
    );
};

export default IntelWorkstation;