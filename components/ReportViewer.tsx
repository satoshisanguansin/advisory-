import React, { useState, Suspense } from 'react';
import type { IntelligenceBriefingReport } from '../types';
import AIStatusIndicator from './AIStatusIndicator';
import Header from './Header';
import ToastNotification from './shared/ToastNotification';

const ComprehensiveReportDisplay = React.lazy(() => import('./ComprehensiveReportDisplay'));

interface ReportViewerProps {
    report: IntelligenceBriefingReport;
    topicId: string;
    onBack: () => void;
    onShowCoachMarks: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report: initialReport, topicId, onBack, onShowCoachMarks }) => {
    const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Header onShowCoachMarks={onShowCoachMarks} />
            <div className="mt-6 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button 
                    onClick={onBack} 
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600/30 text-gray-300 hover:bg-gray-600/60 rounded-lg transition-colors duration-200 font-semibold self-start sm:self-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span>กลับไปที่เวิร์กสเตชัน</span>
                </button>
            </div>
            
             <div className="relative">
                <Suspense fallback={<AIStatusIndicator task={{id: 'loading-report', topic: initialReport.topic, status: 'running', statusMessage: 'Loading report components...'}} />}>
                    <ComprehensiveReportDisplay 
                        report={initialReport} 
                        topicId={topicId}
                        isStandaloneView={false}
                    />
                </Suspense>
            </div>
            {toast && <ToastNotification key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </div>
    );
};

export default ReportViewer;