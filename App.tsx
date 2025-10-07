import React, { useState, useEffect } from 'react';
import PolicyAdvisorPage from './components/PolicyAdvisorPage';
import ReportViewer from './components/ReportViewer';
import type { IntelligenceBriefingReport } from './types';
import { seedInitialReports } from './services/seeder';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import useCoachMarks from './hooks/useCoachMarks';

const App: React.FC = () => {
  const [currentReport, setCurrentReport] = useState<{ report: IntelligenceBriefingReport; topicId: string; } | null>(null);
  const { user, isLoggedIn } = useAuth();
  
  const { coachMarks, isCoachMarksActive, startCoachMarks, dismissCoachMarks } = useCoachMarks([
    { elementId: 'sidebar-main', title: 'แถบนำทางหลัก', content: 'เข้าถึงเครื่องมือและส่วนข่าวกรองทั้งหมดได้จากที่นี่ สลับระหว่างกลุ่มต่างๆ เพื่อดูตัวเลือกของคุณ' },
    { elementId: 'workstation-hub', title: 'ศูนย์กลางเครื่องมือ', content: 'เลือกเครื่องมือเฉพาะทางจากที่นี่เพื่อเริ่มงานใหม่ เช่น การสร้างบทสรุป, เปรียบเทียบร่างกฎหมาย, หรือสร้างเนื้อหาสื่อสาร' },
    { elementId: 'header-user-menu', title: 'เมนูผู้ใช้', content: 'ดูข้อมูลผู้ใช้ของคุณและออกจากระบบได้ที่นี่' },
  ]);

  useEffect(() => {
    // This runs once on app load to ensure the DB has the initial data.
    seedInitialReports();
  }, []);

  const handleSelectReport = (report: IntelligenceBriefingReport, topicId: string) => {
    setCurrentReport({ report, topicId });
  };

  const handleCloseReport = () => {
    setCurrentReport(null);
  };

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="bg-[#212529] text-gray-200 min-h-screen font-['Kanit']">
      {currentReport ? (
        <ReportViewer
          report={currentReport.report}
          topicId={currentReport.topicId}
          onBack={handleCloseReport}
          onShowCoachMarks={startCoachMarks}
        />
      ) : (
        <main>
          <PolicyAdvisorPage onSelectReport={handleSelectReport} onShowCoachMarks={startCoachMarks} />
        </main>
      )}
      
      {/* Coach marks overlay */}
      {isCoachMarksActive && coachMarks.length > 0 && (
          <div className="fixed inset-0 bg-black/70 z-[100]" onClick={dismissCoachMarks}>
              {coachMarks.map((mark, index) => (
                  <div key={index}>{mark}</div>
              ))}
          </div>
      )}
    </div>
  );
};

export default App;