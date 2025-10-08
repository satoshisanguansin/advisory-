import React, { useState } from 'react';
// FIX: Changed the named import to a default import as 'FurtherInvestigation' is a default export.
import FurtherInvestigation from './FurtherInvestigation';
import FeedbackControl from './FeedbackControl';
import type { UserContribution } from '../../types';

interface CardProps {
    title: React.ReactNode; 
    children: React.ReactNode; 
    className?: string;
    isCollapsible?: boolean;
    defaultClosed?: boolean;
    onExport?: () => void;
    investigationContext?: any;
    investigationTitle?: string;
    onNewContribution?: (contribution: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void;
    feedbackContext?: { reportTopic: string, sectionTitle: string, data: any };
    contributionHistory?: UserContribution[];
    onEditContribution?: () => void;
    headerActions?: React.ReactNode;
    id?: string;
    isContentClickable?: boolean;
}

const Card: React.FC<CardProps> = (props) => {
  const { 
    title, children, className, isCollapsible = false, defaultClosed = false, 
    onExport, investigationContext, investigationTitle, onNewContribution, 
    feedbackContext, contributionHistory, onEditContribution, headerActions, id,
    isContentClickable
  } = props;

  const [isOpen, setIsOpen] = useState(!isCollapsible || !defaultClosed);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const latestContribution = contributionHistory && contributionHistory.length > 0
    ? contributionHistory[contributionHistory.length - 1]
    : null;

  const olderContributions = contributionHistory && contributionHistory.length > 1
    ? contributionHistory.slice(0, -1).reverse() // show newest of the old first
    : [];

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExport) {
      onExport();
    }
  };

  const CardHeader = () => (
    <div className="p-6 border-b border-zinc-700/50">
      <div 
        className={`flex items-center justify-between ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={isCollapsible ? () => setIsOpen(!isOpen) : undefined}
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-bold text-[#F58220] flex items-center gap-3">{title}</h3>
        <div className="flex items-center gap-2">
          {headerActions}
          {onExport && (
            <button onClick={handleExport} className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full" aria-label="Export this section">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
          {isCollapsible && (
            <button className="p-2 text-gray-400 focus:outline-none" aria-label={isOpen ? "Collapse section" : "Expand section"}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id={id} className={`bg-[#2a2f34] rounded-xl shadow-lg overflow-hidden border border-zinc-700/50 scroll-mt-20 ${className}`}>
      <CardHeader />
      {isOpen && (
        <>
          <div 
            className={`p-6 text-gray-300 bg-black/10 ${isContentClickable && onEditContribution ? 'cursor-pointer hover:bg-zinc-800/20 transition-colors' : ''}`}
            onClick={isContentClickable && onEditContribution ? onEditContribution : undefined}
          >
            {children}
          </div>
          {(investigationContext || feedbackContext || onEditContribution) && (
            <div className="p-6 border-t border-zinc-700/50 bg-black/10 flex flex-col gap-6">
              {latestContribution && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-yellow-300 text-sm">เนื้อหาเพิ่มเติมจากทีม</h5>
                      {olderContributions.length > 0 && (
                        <button 
                          onClick={() => setIsHistoryVisible(!isHistoryVisible)} 
                          className="text-xs text-yellow-400 hover:underline focus:outline-none"
                        >
                          {isHistoryVisible ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
                        </button>
                      )}
                  </div>
                  <pre className="text-sm text-yellow-200/90 whitespace-pre-wrap font-sans">{latestContribution.content}</pre>
                  <p className="text-right text-xs text-yellow-500/80 mt-2">
                    แก้ไขโดย {latestContribution.authorName} เมื่อ {new Date(latestContribution.timestamp).toLocaleString()}
                  </p>
                  {isHistoryVisible && olderContributions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-yellow-500/20 space-y-3">
                      {olderContributions.map((c, i) => (
                        <div key={i} className="opacity-70">
                          <pre className="text-sm text-yellow-200/90 whitespace-pre-wrap font-sans">{c.content}</pre>
                          <p className="text-right text-xs text-yellow-500/80 mt-2">
                            แก้ไขโดย {c.authorName} เมื่อ {new Date(c.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center gap-6 flex-wrap">
                {investigationContext && investigationTitle && onNewContribution ? (
                  <FurtherInvestigation sectionContext={investigationContext} sectionTitle={investigationTitle} onNewContribution={onNewContribution} report={null} />
                ) : <div />}
                
                <div className="flex items-center gap-4">
                  {onEditContribution && (
                    <button onClick={onEditContribution} className="flex items-center gap-2 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                      <span>{latestContribution ? 'แก้ไข' : 'เพิ่ม'}</span>
                    </button>
                  )}
                  {feedbackContext && (
                    <FeedbackControl
                      reportTopic={feedbackContext.reportTopic}
                      sectionTitle={feedbackContext.sectionTitle}
                      contextData={feedbackContext.data}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card;