import React, { useState, useCallback } from 'react';
import type { CommunicationsPackage } from '../../types';
import { generateCommunicationsPackage } from '../../services/geminiService';
import LoadingSpinner from '../icons/LoadingSpinner';

const CommunicationsWorkstation: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [commsPackage, setCommsPackage] = useState<CommunicationsPackage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim() || !context.trim()) {
            setError("กรุณาป้อนหัวข้อและบริบทเพื่อสร้างเนื้อหา");
            return;
        }

        setIsLoading(true);
        setError(null);
        setCommsPackage(null);
        setStatus('กำลังปรับใช้ Campaign Agent...');

        try {
            const onStatusUpdateCallback = (status: string) => setStatus(status);
            const result = await generateCommunicationsPackage(topic, context, onStatusUpdateCallback);
            setCommsPackage(result);
        } catch (e) {
            setError(e instanceof Error ? `เกิดข้อผิดพลาด: ${e.message}` : "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการสร้างเนื้อหา");
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    }, [topic, context]);
    
    const handleClear = () => {
        setCommsPackage(null);
        setTopic('');
        setContext('');
        setError(null);
    };

    if (isLoading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <LoadingSpinner className="w-12 h-12 text-green-400" />
                <h3 className="mt-4 text-xl font-bold text-white">{status || 'กำลังสร้างสรรค์เนื้อหา...'}</h3>
                <p className="mt-1 text-gray-400">Campaign Agent กำลังร่างข้อความสำหรับสื่อสาร...</p>
            </div>
        );
    }
    
    if (commsPackage) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                     <div>
                        <h2 className="text-2xl font-bold text-white">ชุดสื่อสารสำหรับ: <span className="text-green-400">{topic}</span></h2>
                        <p className="text-gray-400">เนื้อหาที่สร้างโดย AI พร้อมสำหรับการตรวจสอบและใช้งาน</p>
                    </div>
                    <button onClick={handleClear} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.128-4.902A8.967 8.967 0 0120 9" /><path strokeLineca-p="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.128 4.902A8.967 8.967 0 014 15" />
                        </svg>
                        <span>สร้างใหม่</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">X / Twitter Thread</h3>
                        {commsPackage.twitterThread.map((item, index) => (
                            <div key={index} className="bg-zinc-800 p-3 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Tweet {index + 1}/{commsPackage.twitterThread.length}</p>
                                <textarea readOnly value={item.tweet} rows={4} className="w-full bg-transparent text-sm text-gray-200 resize-none border-0 p-0 focus:ring-0"></textarea>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-bold text-white">Facebook Post</h3>
                         <div className="bg-zinc-800 p-3 rounded-lg">
                            <textarea readOnly value={commsPackage.facebookPost} rows={8} className="w-full bg-transparent text-sm text-gray-200 resize-none border-0 p-0 focus:ring-0"></textarea>
                        </div>
                        <h3 className="font-bold text-white">Press Release Snippet</h3>
                         <div className="bg-zinc-800 p-3 rounded-lg">
                             <textarea readOnly value={commsPackage.pressReleaseSnippet} rows={4} className="w-full bg-transparent text-sm text-gray-200 resize-none border-0 p-0 focus:ring-0"></textarea>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center flex-grow">
            <h2 className="text-2xl font-bold text-white mb-1">สร้างเนื้อหาสื่อสาร</h2>
            <p className="text-gray-400 mb-6">ป้อนหัวข้อและบริบท (เช่น บทสรุปสำหรับผู้บริหารจากรายงานข่าวกรอง) เพื่อให้ Campaign Agent สร้างชุดสื่อสารสำหรับโซเชียลมีเดีย</p>
            
            <div className="space-y-4">
                 <div>
                    <label htmlFor="comms-topic" className="block text-sm font-medium text-gray-300 mb-1">หัวข้อหลัก</label>
                    <input type="text" id="comms-topic" value={topic} onChange={e => setTopic(e.target.value)} disabled={isLoading} className="w-full bg-[#212529] border border-gray-600 rounded-xl p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow disabled:opacity-50" placeholder="เช่น ร่าง พ.ร.บ. การขนส่งทางราง"/>
                </div>
                <div>
                    <label htmlFor="comms-context" className="block text-sm font-medium text-gray-300 mb-1">บริบท / บทสรุป</label>
                    <textarea 
                        id="comms-context" 
                        rows={8} 
                        value={context} 
                        onChange={(e) => setContext(e.target.value)} 
                        disabled={isLoading} 
                        className="w-full bg-[#212529] border border-gray-600 rounded-xl p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow disabled:opacity-50" 
                        placeholder="วางบทสรุปสำหรับผู้บริหารหรือประเด็นสำคัญที่นี่..."
                    />
                </div>
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !topic.trim() || !context.trim()} 
                    className="w-full h-14 flex justify-center items-center space-x-3 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2f34] focus-visible:ring-white"
                >
                    {isLoading && <LoadingSpinner />}
                    <span>{isLoading ? status || 'กำลังสร้าง...' : "สร้างชุดสื่อสาร"}</span>
                </button>
            </div>
            {error && <p className="text-red-400 font-semibold text-sm mt-4 text-center">{error}</p>}
        </div>
    );
};

export default CommunicationsWorkstation;