import React, { useState, useCallback } from 'react';
import type { DraftComparisonReport } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';
import { generateDraftComparison } from '../../services/geminiService';
import DraftComparisonDisplay from '../DraftComparisonDisplay';

const ComparisonWorkstation: React.FC = () => {
    const [draftA, setDraftA] = useState('');
    const [draftB, setDraftB] = useState('');
    const [comparisonTopic, setComparisonTopic] = useState('');
    const [report, setReport] = useState<DraftComparisonReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (content: string) => void) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setter(e.target.result);
                setError(null);
            }
        };
        reader.onerror = () => {
            setError(`อ่านไฟล์ล้มเหลว: ${file.name}`);
            event.target.value = '';
        }
        reader.readAsText(file);
    };

    const handleCompareClick = useCallback(async () => {
        if (!draftA.trim() || !draftB.trim() || !comparisonTopic.trim()) {
            setError("กรุณาแนบร่างกฎหมายทั้งสองฉบับและระบุหัวข้อเพื่อเปรียบเทียบ");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReport(null);
        setStatus('กำลังเริ่มต้นการเปรียบเทียบ...');

        try {
            const onStatusUpdateCallback = (status: string) => setStatus(status);
            const reportData = await generateDraftComparison(draftA, draftB, comparisonTopic, onStatusUpdateCallback);
            setReport(reportData);
        } catch (e) {
            setError(e instanceof Error ? `เกิดข้อผิดพลาด: ${e.message}` : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการเปรียบเทียบ");
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    }, [draftA, draftB, comparisonTopic]);

    if (report) {
        return <DraftComparisonDisplay report={report} onClear={() => setReport(null)} />;
    }

    return (
        <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-bold text-white mb-1">เปรียบเทียบร่างกฎหมายเชิงกลยุทธ์</h2>
            <p className="text-gray-400 mb-6">แนบร่างกฎหมายสองฉบับเพื่อสร้างการเปรียบเทียบเชิงลึก AI จะวิเคราะห์เนื้อหาทีละมาตรา และชี้ให้เห็นถึงความได้เปรียบเชิงกลยุทธ์</p>

            <div className="mb-4">
                <label htmlFor="comparison-topic" className="block text-sm font-medium text-gray-300 mb-1">หัวข้อเปรียบเทียบ</label>
                <input type="text" id="comparison-topic" value={comparisonTopic} onChange={e => setComparisonTopic(e.target.value)} disabled={isLoading} className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50" placeholder="เช่น การปฏิรูป พ.ร.บ. การกระจายเสียง"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="draft-a-upload" className="block text-sm font-medium text-gray-300 mb-1">ร่างของพรรคประชาชน</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setDraftA)} className="hidden" id="draft-a-upload" accept=".txt,.md,.html" />
                    <label htmlFor="draft-a-upload" className="text-xs font-semibold text-gray-400 hover:text-white cursor-pointer underline mb-2 inline-block">อัปโหลดไฟล์</label>
                    <textarea rows={10} value={draftA} onChange={e => setDraftA(e.target.value)} disabled={isLoading} className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50" placeholder="วางเนื้อหาฉบับเต็มของร่างกฎหมายของพรรคที่นี่..."/>
                </div>
                <div>
                    <label htmlFor="draft-b-upload" className="block text-sm font-medium text-gray-300 mb-1">ร่างของฝ่ายตรงข้าม</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setDraftB)} className="hidden" id="draft-b-upload" accept=".txt,.md,.html" />
                    <label htmlFor="draft-b-upload" className="text-xs font-semibold text-gray-400 hover:text-white cursor-pointer underline mb-2 inline-block">อัปโหลดไฟล์</label>
                    <textarea rows={10} value={draftB} onChange={e => setDraftB(e.target.value)} disabled={isLoading} className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50" placeholder="วางเนื้อหาฉบับเต็มของร่างกฎหมายคู่แข่งที่นี่..."/>
                </div>
            </div>
            
            <div className="mt-6">
                <button onClick={handleCompareClick} disabled={isLoading || !draftA.trim() || !draftB.trim() || !comparisonTopic.trim()} className="w-full h-14 flex justify-center items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2f34] focus-visible:ring-white">
                    {isLoading ? <LoadingSpinner /> : null}
                    <span>{isLoading ? status || 'กำลังเปรียบเทียบ...' : "เปรียบเทียบร่าง"}</span>
                </button>
            </div>
            {error && <p className="text-red-400 font-semibold text-sm mt-4 text-center">{error}</p>}
        </div>
    );
};

export default ComparisonWorkstation;