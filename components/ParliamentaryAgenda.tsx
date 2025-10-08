import React, { useState, useEffect } from 'react';
import type { Workstation } from './PolicyAdvisorPage';
import MemoModal from './shared/MemoModal';
import { fetchNewAgendas } from '../services/parliamentService';
import LoadingSpinner from './icons/LoadingSpinner';
import { seededReports } from '../data/seededReports';
import type { IntelligenceBriefingReport } from '../types';

const sampleForensicData = `รายการ,หน่วย,จำนวน,ราคาต่อหน่วย,ราคารวม
เครื่องปรับอากาศ 18000BTU,เครื่อง,78,62000,4836000
รถกระบะบรรทุก,คัน,12,1300000,15600000`;

const AlertCard: React.FC<{
    title: string;
    description: string;
    actionText: string;
    onAction: () => void;
    icon: React.ReactNode;
}> = ({ title, description, actionText, onAction, icon }) => (
    <div className="bg-zinc-800 p-5 rounded-lg flex items-start gap-5">
        <div className="flex-shrink-0 text-orange-400 mt-1">{icon}</div>
        <div className="flex-grow">
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <button
            onClick={onAction}
            className="flex-shrink-0 self-center bg-[#F58220] hover:bg-orange-500 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
        >
            {actionText}
        </button>
    </div>
);


interface DashboardWorkstationProps {
    onSelectReport: (report: IntelligenceBriefingReport, topicId: string) => void;
    onAlertClick: (workstation: Workstation, data: string, topic?: string) => void;
}

interface NewAgenda {
    id: string;
    name: string;
    description: string;
}

const DashboardWorkstation: React.FC<DashboardWorkstationProps> = ({ onSelectReport, onAlertClick }) => {
  const [newAgendas, setNewAgendas] = useState<NewAgenda[]>([]);
  const [isCheckingAgendas, setIsCheckingAgendas] = useState(false);
  const [agendasChecked, setAgendasChecked] = useState(false);
  
  useEffect(() => {
    const checkAgendas = async () => {
      const lastCheck = localStorage.getItem('lastAgendaCheck');
      const oneDay = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      if (!lastCheck || (now - parseInt(lastCheck, 10)) > oneDay) {
        setIsCheckingAgendas(true);
        try {
          const fetchedAgendas = await fetchNewAgendas();
          setNewAgendas(fetchedAgendas);
          localStorage.setItem('lastAgendaCheck', now.toString());
        } catch (error) {
          console.error("Failed to fetch new agendas:", error);
        } finally {
          setIsCheckingAgendas(false);
          setAgendasChecked(true);
        }
      } else {
        setAgendasChecked(true);
      }
    };
    checkAgendas();
  }, []);

  const handleSelectPreloadedReport = (topicId: string) => {
    const seededReportData = seededReports.find(sr => sr.id === topicId);
    if (seededReportData) {
        const reportWithId = { ...seededReportData.report, id: seededReportData.id };
        onSelectReport(reportWithId, topicId);
    } else {
        console.error(`Report with id ${topicId} not found in seeded reports.`);
    }
  };
  
  const pinnedReportId = 'clean-air-act';
  const pinnedReportData = seededReports.find(sr => sr.id === pinnedReportId);
  const otherReports = seededReports.filter(sr => sr.id !== pinnedReportId);

  return (
    <div>
        <h2 className="text-3xl font-bold text-white mb-2">ห้องสถานการณ์ (Situation Room)</h2>
        <p className="text-base text-gray-400 mb-8">ภาพรวมข่าวกรองล่าสุดและการแจ้งเตือนเชิงรุกจากระบบ AI</p>
        
        <div className="space-y-8">
            {isCheckingAgendas && (
                <div className="bg-zinc-800 p-4 rounded-lg flex items-center gap-4">
                    <LoadingSpinner className="w-5 h-5 text-orange-400" />
                    <p className="text-sm text-gray-400">กำลังตรวจสอบวาระใหม่จากรัฐสภา...</p>
                </div>
            )}

            {!isCheckingAgendas && agendasChecked && newAgendas.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-green-400 mb-3">วาระใหม่ที่ตรวจพบ</h3>
                    <div className="space-y-4 bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                        {newAgendas.map(agenda => (
                            <AlertCard 
                                key={agenda.id}
                                title={agenda.name}
                                description={agenda.description}
                                actionText="สร้างบทสรุป"
                                onAction={() => onAlertClick('briefing', '', agenda.name)}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {!isCheckingAgendas && agendasChecked && newAgendas.length === 0 && (
                <div className="bg-zinc-800 p-4 rounded-lg flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm text-gray-400">ไม่มีวาระใหม่จากรัฐสภาในสัปดาห์นี้ ทุกอย่างเป็นปัจจุบัน</p>
                </div>
            )}

            <div>
                <h3 className="text-lg font-bold text-white mb-3">การแจ้งเตือนล่าสุด</h3>
                <div className="space-y-4">
                    <AlertCard 
                        title="พบข้อมูลการจัดซื้อที่น่าสงสัย"
                        description="AI ตรวจพบความเป็นไปได้ของการจัดซื้อเครื่องปรับอากาศและรถกระบะในราคาที่สูงกว่าตลาดในเอกสารงบประมาณล่าสุด"
                        actionText="วิเคราะห์ทันที"
                        onAction={() => onAlertClick('forensic', sampleForensicData)}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                     <AlertCard 
                        title="ร่างกฎหมายใหม่ถูกเสนอ"
                        description="ตรวจพบการเสนอร่าง 'พ.ร.บ. การประมงพาณิชย์' ฉบับใหม่ในระบบของรัฐสภา ต้องการสร้างบทสรุปข่าวกรองหรือไม่?"
                        actionText="สร้างบทสรุป"
                        onAction={() => onAlertClick('briefing', '', 'พ.ร.บ. การประมงพาณิชย์')}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                </div>
            </div>

            <div className="mt-10">
                 <h3 className="text-lg font-bold text-white mb-3">วาระสำคัญสูงสุด</h3>
                {pinnedReportData && (
                    <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-red-500/60 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-white text-lg flex items-center">
                                    {pinnedReportData.report.topic}
                                    <span className="ml-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-300">ความสำคัญสูงสุด</span>
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">{pinnedReportData.report.executiveSummary}</p>
                            </div>
                            <button
                                onClick={() => handleSelectPreloadedReport(pinnedReportData.id)}
                                className="flex-shrink-0 w-full sm:w-auto flex justify-center items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                <span>ดูบทสรุปเต็ม</span>
                            </button>
                        </div>
                        
                        {(pinnedReportData.report.appendix || []).map(item => (
                            <div key={item.title} className="bg-black/20 p-4 rounded-lg">
                                <h4 className="font-semibold text-orange-300 mb-2">{item.title}</h4>
                                <p className="text-xs text-gray-400 whitespace-pre-wrap">{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-10">
                 <h3 className="text-lg font-bold text-white mb-3">ระเบียบวาระที่กำลังจะมาถึง</h3>
                 <p className="text-sm text-gray-500 mb-4">เลือกหัวข้อเพื่อดูบทสรุปข่าวกรองที่สร้างไว้ล่วงหน้า</p>
                 <div className="space-y-4">
                    {otherReports.map(reportItem => (
                         <div key={reportItem.id} className="bg-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-orange-500/30">
                            <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-white truncate" title={reportItem.report.topic}>{reportItem.report.topic}</h3>
                                <p className="text-sm text-gray-400 mt-1 truncate">{reportItem.report.executiveSummary}</p>
                            </div>
                            <button
                                onClick={() => handleSelectPreloadedReport(reportItem.id)}
                                className="flex-shrink-0 w-full sm:w-auto flex justify-center items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                <span>ดูบทสรุป</span>
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardWorkstation;