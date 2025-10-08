import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { IntelligenceBriefingReport } from '../types';
import * as backendService from '../services/backendService';
import Header from './Header';
import Sidebar from './shared/Sidebar';
import BottomNav from './BottomNav';

// Workstations
import DashboardWorkstation from './ParliamentaryAgenda';
import BriefingWorkstation from './workstations/BriefingWorkstation';
import ComparisonWorkstation from './workstations/ComparisonWorkstation';
import IntelWorkstation from './workstations/IntelWorkstation';
import ForensicWorkstation from './workstations/ForensicWorkstation';
import CommunicationsWorkstation from './workstations/CommunicationsWorkstation';
import LibraryWorkstation from './workstations/LibraryWorkstation';
import PetitionWorkstation from './workstations/PetitionWorkstation';
import AIStatusIndicator from './AIStatusIndicator';

export type Workstation = 'dashboard' | 'library' | 'briefing' | 'comparison' | 'intel' | 'forensic' | 'comms' | 'petition';

interface PolicyAdvisorPageProps {
  onSelectReport: (report: IntelligenceBriefingReport, topicId: string) => void;
  onShowCoachMarks: () => void;
}

const PolicyAdvisorPage: React.FC<PolicyAdvisorPageProps> = ({ onSelectReport, onShowCoachMarks }) => {
  const [activeWorkstation, setActiveWorkstation] = useState<Workstation>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proactiveData, setProactiveData] = useState<{ workstation: Workstation, data: string, topic?: string } | null>(null);

  const handleAlertClick = (workstation: Workstation, data: string, topic?: string) => {
    setProactiveData({ workstation, data, topic });
    setActiveWorkstation(workstation);
  };

  const onDataConsumed = useCallback(() => {
    setProactiveData(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <AIStatusIndicator task={{ id: 'briefing-load', topic: 'Loading report...', status: 'running', statusMessage: 'กำลังโหลดบทสรุป...' }} />;
    }
    const dataForView = proactiveData?.workstation === activeWorkstation ? proactiveData : null;
    
    switch (activeWorkstation) {
        case 'dashboard':   return <DashboardWorkstation onSelectReport={onSelectReport} onAlertClick={handleAlertClick} />;
        case 'library':     return <LibraryWorkstation onSelectReport={onSelectReport} />;
        case 'briefing':    return <BriefingWorkstation onSelectReport={onSelectReport} initialTopic={dataForView?.topic} onDataConsumed={onDataConsumed} />;
        case 'comparison':  return <ComparisonWorkstation />;
        case 'intel':       return <IntelWorkstation />;
        case 'forensic':    return <ForensicWorkstation initialData={dataForView?.data} onDataConsumed={onDataConsumed} />;
        case 'comms':       return <CommunicationsWorkstation />;
        case 'petition':    return <PetitionWorkstation />;
        default:            return <DashboardWorkstation onSelectReport={onSelectReport} onAlertClick={handleAlertClick} />;
    }
  }

  return (
    <div className="flex h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar activeWorkstation={activeWorkstation} setActiveWorkstation={setActiveWorkstation} />
      </div>

      <div className="flex flex-col flex-1 min-h-screen">
        <Header onShowCoachMarks={onShowCoachMarks}/>
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 pb-24 lg:pb-10">
            {error && <div className="mb-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-xl" role="alert">{error}</div>}
            <div id="workstation-hub">
              {renderContent()}
            </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="block lg:hidden">
        <BottomNav activeWorkstation={activeWorkstation} setActiveWorkstation={setActiveWorkstation} />
      </div>
    </div>
  );
};

export default PolicyAdvisorPage;