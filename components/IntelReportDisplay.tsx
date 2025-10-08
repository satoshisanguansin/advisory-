import React, { useState, useCallback } from 'react';
import type { IntelReport, MethodologyReport, DiscussionComment } from '../types';
import * as db from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import ExportButton from './ExportButton';
import { generateMarkdownForIntelReport, generateMarkdownForMethodology } from '../utils/exportUtils';
import NetworkGraph from './shared/NetworkGraph';
// FIX: Changed the named import to a default import as 'FurtherInvestigation' is a default export.
import FurtherInvestigation from './shared/FurtherInvestigation';
import Card from './shared/Card';
import DiscussionThread from './shared/DiscussionThread';

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' | 'Critical' }> = ({ level }) => {
    const styles = {
        Low: 'bg-blue-500/20 text-blue-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        High: 'bg-orange-500/20 text-orange-300',
        Critical: 'bg-red-500/20 text-red-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[level]}`}>{level.toUpperCase()}</span>;
};

const MethodologyDisplay: React.FC<{ methodology: MethodologyReport }> = ({ methodology }) => {
    const handleExport = () => {
        const markdown = generateMarkdownForMethodology(methodology);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytical-methodology.md`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>ระเบียบวิธีวิเคราะห์ของ AI</span>
                </div>
            }
            isCollapsible={true}
            defaultClosed={true}
            onExport={handleExport}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                    <h4 className="font-bold text-white mb-2">ระดับความเชื่อมั่น: <span className="text-cyan-400">{methodology.confidenceLevel.score}/100</span></h4>
                    <p className="text-xs italic text-gray-400 mb-4">{methodology.confidenceLevel.rationale}</p>
                    
                    <h4 className="font-bold text-white mb-2">กรอบการวิเคราะห์ที่ใช้</h4>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-gray-300">
                        {methodology.analyticalFrameworks.map((framework, i) => <li key={i}>{framework}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-2">แหล่งข้อมูลและการให้น้ำหนัก</h4>
                    <ul className="list-none space-y-2">
                        {methodology.informationSources.map((source, i) => (
                            <li key={i}>
                                <p className="font-semibold">{source.sourceType}</p>
                                <p className="text-xs text-gray-400">{source.weightingRationale}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

interface IntelReportDisplayProps {
    report: IntelReport;
    onClear: () => void;
}

const IntelReportDisplay: React.FC<IntelReportDisplayProps> = ({ report: initialReport, onClear }) => {
  const [report, setReport] = useState(initialReport);
  const { user } = useAuth();
  
  const handleExport = () => {
    const markdown = generateMarkdownForIntelReport(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intel-report-${report.profile.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePostComment = useCallback(async (content: string) => {
    if (!report.id || !user) return;
    const newComment: DiscussionComment = {
      id: `comment_${Date.now()}`,
      author: user.name,
      timestamp: new Date().toISOString(),
      content,
    };
    const updatedDossier = await db.addCommentToDossier(report.id, newComment);
    setReport(updatedDossier);
  }, [report, user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h2 className="text-3xl font-bold text-white">แฟ้มข้อมูลข่าวกรองไซเบอร์: <span className="text-cyan-400">{report.profile.name}</span></h2>
        <div className="flex items-center space-x-2">
            <ExportButton onExport={handleExport} />
            <button onClick={onClear} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.128-4.902A8.967 8.967 0 0120 9" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.128 4.902A8.967 8.967 0 014 15" />
                </svg>
                <span>สร้างแฟ้มข้อมูลใหม่</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card title="บทสรุปสำหรับผู้บริหาร">
                <p>{report.executiveSummary}</p>
            </Card>
            <Card title="การประเมินความเสี่ยง">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-gray-200">ระดับ:</span>
                    <RiskBadge level={report.riskAssessment.level} />
                </div>
                <p>{report.riskAssessment.justification}</p>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card title="ข้อมูลบุคคล">
                <div className="space-y-4 text-sm">
                    {report.profile.titles?.length > 0 && (
                        <div>
                            <strong className="block font-semibold text-gray-200">ตำแหน่ง:</strong>
                            <ul className="list-disc list-outside pl-5 mt-1 text-gray-300 space-y-1">
                                {report.profile.titles.map((title, i) => <li key={i}>{title}</li>)}
                            </ul>
                        </div>
                    )}
                    {report.profile.aliases?.length > 0 && (
                        <div>
                            <strong className="block font-semibold text-gray-200">ชื่ออื่น:</strong>
                            <ul className="list-disc list-outside pl-5 mt-1 text-gray-300 space-y-1">
                                {report.profile.aliases.map((alias, i) => <li key={i}>{alias}</li>)}
                            </ul>
                        </div>
                    )}
                    {report.profile.associatedCompanies?.length > 0 && (
                        <div>
                            <strong className="block font-semibold text-gray-200">บริษัทที่เกี่ยวข้อง:</strong>
                            <ul className="list-disc list-outside pl-5 mt-1 text-gray-300 space-y-1">
                                {report.profile.associatedCompanies.map((company, i) => <li key={i}>{company}</li>)}
                            </ul>
                        </div>
                    )}
                    {report.profile.knownLocations?.length > 0 && (
                        <div>
                            <strong className="block font-semibold text-gray-200">สถานที่ที่รู้จัก:</strong>
                            <ul className="list-disc list-outside pl-5 mt-1 text-gray-300 space-y-1">
                                {report.profile.knownLocations.map((location, i) => <li key={i}>{location}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </Card>
            <Card title="สัญญาณความเสี่ยง">
                <ul className="list-disc list-outside pl-4 space-y-1 text-red-300/90">
                    {(report.riskFlags || []).map((flag, i) => <li key={i}>{flag}</li>)}
                </ul>
            </Card>
        </div>
      </div>

       <Card title="แผนผังเครือข่าย">
           <NetworkGraph graphData={report.networkGraph} />
        </Card>
        <DiscussionThread comments={report.discussion || []} onPostComment={handlePostComment} />
    </div>
  );
};

export default IntelReportDisplay;