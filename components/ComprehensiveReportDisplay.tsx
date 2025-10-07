import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { IntelligenceBriefingReport, WebSource, PolicyCredibilityScore, EnhancedStakeholder, InternalStrategy, SocialMediaSentiment, EnhancedPartyDraftComparison, AntiMonopolyAnalysis, UserContribution, DiscussionComment } from '../types';
import ExportButton from './ExportButton';
import { 
    generateMarkdownForIntelligenceBriefing, 
    generateMarkdownForCredibilityScore,
    generateMarkdownForInternalStrategy,
    generateMarkdownForStakeholders,
    generateMarkdownForMethodology,
} from '../utils/exportUtils';
import LoadingSpinner from './icons/LoadingSpinner';
import NetworkGraph from './shared/NetworkGraph';
import StancePolling from './StancePolling';
import { FurtherInvestigation } from './shared/FurtherInvestigation';
import * as db from '../services/firebaseService';
import UserContributions from './shared/UserContributions';
import { useAuth } from '../contexts/AuthContext';
import SaveToDriveButton from './shared/SaveToDriveButton';
import DiscussionThread from './shared/DiscussionThread';


const Card: React.FC<{ 
    title: React.ReactNode; 
    children: React.ReactNode; 
    className?: string;
    isCollapsible?: boolean;
    defaultClosed?: boolean;
    onExport?: () => void;
    id?: string;
}> = ({ id, title, children, className, isCollapsible = false, defaultClosed = false, onExport }) => {
  const [isOpen, setIsOpen] = useState(!isCollapsible || !defaultClosed);

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(onExport) {
      onExport();
    }
  };

  const CardHeader = () => (
    <div className="p-4 sm:p-6 border-b border-zinc-700/50">
        <div 
            className={`flex items-center justify-between ${isCollapsible ? 'cursor-pointer' : ''}`}
            onClick={isCollapsible ? () => setIsOpen(!isOpen) : undefined}
        >
            <h3 className="text-lg font-bold text-[#F58220] flex items-center gap-3">{title}</h3>
            <div className="flex items-center gap-2">
              {onExport && (
                 <button onClick={handleExport} className="text-gray-400 hover:text-white transition-colors" aria-label="Export this section">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                 </button>
              )}
              {isCollapsible && (
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
              )}
            </div>
        </div>
      </div>
  );

  return (
    <div id={id} className={`bg-[#2a2f34] rounded-xl shadow-lg overflow-hidden border border-zinc-700/50 scroll-mt-20 ${className}`}>
      <CardHeader />
      {isOpen && <div className="p-4 sm:p-6 space-y-4 text-gray-300 bg-black/10">{children}</div>}
    </div>
  );
};

const AntiMonopolyAnalysisDisplay: React.FC<{ analysis: AntiMonopolyAnalysis; onNewContribution: (finding: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void; }> = ({ analysis, onNewContribution }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'mechanisms' | 'impact'>('overview');

    const TabButton: React.FC<{ tabId: 'overview' | 'mechanisms' | 'impact'; label: string; }> = ({ tabId, label }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                role="tab"
                aria-selected={isActive}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${isActive ? 'bg-red-900/20 text-red-200 border-b-2 border-red-300' : 'text-red-300/60 hover:text-red-200'}`}
            >
                {label}
            </button>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-red-200 mb-2 text-base">รายงานเปิดโปง</h4>
                            <div className="space-y-3">
                                {analysis.shameReport.map((item, i) => (
                                    <blockquote key={i} className="border-l-4 border-red-400 pl-4 py-2 text-red-100 bg-red-500/10 rounded-r-lg shadow-md">
                                        <p className="font-semibold italic text-base">{item}</p>
                                    </blockquote>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-200 mb-3 text-base">ผลประโยชน์ทับซ้อนที่ระบุได้</h4>
                            <ul className="list-none space-y-4">
                                {analysis.conflictsOfInterest.map((item, i) => (
                                    <li key={i} className="text-sm text-red-200/90 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center w-1/3">
                                                <div className="p-2 bg-zinc-700 rounded-full inline-block">👤</div>
                                                <p className="font-bold text-white mt-1 truncate">{item.person}</p>
                                                <p className="text-xs truncate">({item.role})</p>
                                            </div>
                                            <div className="flex-1 text-center">
                                                <p className="text-xs text-red-300/80 font-semibold truncate">{item.relationshipToBeneficiary}</p>
                                                <div className="w-full h-px bg-zinc-600 my-1 relative">
                                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 bg-red-400 h-3 w-3 rounded-full border-2 border-zinc-800"></div>
                                                </div>
                                                <p className="text-xs">เอื้อประโยชน์ให้</p>
                                            </div>
                                            <div className="text-center w-1/3">
                                                <div className="p-2 bg-zinc-700 rounded-full inline-block">🏢</div>
                                                <p className="font-bold text-white mt-1 truncate">{item.beneficiaryCompany}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 pt-3 border-t border-zinc-700 text-xs"><strong>บทวิเคราะห์:</strong> {item.analysisOfConflict}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'mechanisms':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-bold text-red-200">อุปสรรคในการเข้าสู่ตลาด</h4>
                            <ul className="list-none space-y-2 text-sm">
                                {analysis.barriersToEntry.map((item, i) => (
                                    <li key={i} className="p-2 bg-red-800/20 rounded-md"><strong className="text-white">ข้อกฎหมาย <code>{item.clause}</code>:</strong> {item.analysis}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-red-200">กลยุทธ์การแสวงหาผลประโยชน์</h4>
                            <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-red-200/90">
                                {analysis.exploitationTactics.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                             <h4 className="font-bold text-red-200">การถ่วงเวลาด้านกฎระเบียบ</h4>
                             <ul className="list-none space-y-2 text-sm mt-2">
                                {analysis.regulatoryDelayAnalysis.map((item, i) => (
                                    <li key={i} className="p-2 bg-red-800/20 rounded-md">
                                        <strong className="text-white">{item.tactic} ({item.duration}):</strong> {item.economicLoss}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'impact':
                return (
                     <div className="space-y-6">
                         <div>
                            <h4 className="font-bold text-red-200">ผู้ที่ตกเป็นเหยื่อของนโยบายนี้</h4>
                            <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-red-200/90 mt-2">
                                {analysis.victimsOfPolicy.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-200">ความสัมพันธ์ของผลกระทบทางเศรษฐกิจ</h4>
                            <ul className="list-none space-y-2 text-sm mt-2">
                                {analysis.economicImpactCorrelation.map((item, i) => (
                                    <li key={i} className="p-2 bg-red-800/20 rounded-md">
                                        <strong className="text-white">{item.topic}:</strong> {item.analysis}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="anti-monopoly" className="bg-red-900/20 border border-red-500/50 rounded-xl shadow-lg overflow-hidden scroll-mt-20">
            <div className="p-4 sm:p-6 border-b border-red-500/30">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-red-300 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        วิเคราะห์การต่อต้านการผูกขาดและการทุจริต
                    </h3>
                </div>
            </div>
            <div className="bg-red-900/10">
                <div className="border-b border-red-500/20 px-4 sm:px-6">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                        <TabButton tabId="overview" label="ภาพรวม" />
                        <TabButton tabId="mechanisms" label="กลไกการผูกขาด" />
                        <TabButton tabId="impact" label="ผลกระทบ" />
                    </nav>
                </div>
                <div className="p-4 sm:p-6">
                    {renderContent()}
                </div>
                 <div className="p-4 sm:p-6 border-t border-red-500/20">
                     <FurtherInvestigation 
                        sectionTitle="การต่อต้านการผูกขาดและการทุจริต"
                        sectionContext={analysis}
                        onNewContribution={onNewContribution}
                    />
                </div>
            </div>
        </div>
    );
};


const SourcesDisplay: React.FC<{ sources: WebSource[] }> = ({ sources }) => (
    <Card id="sources" title="บันทึกการตรวจสอบ: แหล่งข้อมูล" isCollapsible defaultClosed>
        <ul className="space-y-3">
            {(sources || []).map((source, index) => (
            <li key={index} className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                <a 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 group"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#F58220]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div>
                    <p className="font-semibold text-white group-hover:text-orange-300 truncate" title={source.title}>
                    {source.title || 'แหล่งข้อมูลไม่มีชื่อ'}
                    </p>
                    <p className="text-sm text-gray-400 truncate" title={source.uri}>{source.uri}</p>
                </div>
                </a>
            </li>
            ))}
        </ul>
    </Card>
);

const CredibilityScoreDisplay: React.FC<{ score: PolicyCredibilityScore; onNewContribution: (finding: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void; }> = ({ score, onNewContribution }) => {
    const color = score.overallScore > 75 ? 'text-green-400' : score.overallScore > 50 ? 'text-yellow-400' : 'text-red-400';
    
    const handleExport = () => {
        const markdown = generateMarkdownForCredibilityScore(score);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'policy-credibility-score.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card id="credibility-score" title="คะแนนความน่าเชื่อถือของนโยบาย" onExport={handleExport}>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4a5568" strokeWidth="3" />
                        <path className={`transition-all duration-500 ${color}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score.overallScore}, 100`} strokeLinecap="round" transform="rotate(90 18 18)" />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${color}`}>{score.overallScore}</div>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {score.components.map(c => (
                        <div key={c.name} className="bg-zinc-800 p-3 rounded-lg">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-semibold text-white">{c.name}</h4>
                                <span className="font-bold text-lg">{c.score}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{c.rationale}</p>
                        </div>
                    ))}
                </div>
            </div>
            <FurtherInvestigation 
                sectionTitle="คะแนนความน่าเชื่อถือของนโยบาย"
                sectionContext={score}
                onNewContribution={onNewContribution}
            />
        </Card>
    );
};

const StrategicCommunicationsDisplay: React.FC<{ strategy: InternalStrategy; onNewContribution: (finding: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void; }> = ({ strategy, onNewContribution }) => {
    const [activeTab, setActiveTab] = useState(strategy.talkingPoints[0]?.audience || 'Press');

    const handleExport = () => {
        const markdown = generateMarkdownForInternalStrategy(strategy);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'internal-strategy-brief.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card id="strategic-comms" title="การสื่อสารเชิงกลยุทธ์" onExport={handleExport}>
            {strategy.strategicNarrativeAngles && strategy.strategicNarrativeAngles.length > 0 && (
                <div className="mb-4 bg-zinc-800/50 p-4 rounded-lg">
                    <h4 className="font-bold text-white mb-3">มุมมองการเล่าเรื่องเชิงกลยุทธ์</h4>
                    <div className="space-y-3">
                        {strategy.strategicNarrativeAngles.map((angle, i) => (
                            <div key={i}>
                                <p className="font-semibold text-orange-300">{angle.angle}</p>
                                <p className="text-xs text-orange-400/80 mt-1">เหตุผล: {angle.rationale}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-white mb-3">ประเด็นการสื่อสารสำหรับแต่ละกลุ่มเป้าหมาย</h4>
                    <div className="flex space-x-1 border-b border-zinc-700 mb-4">
                        {strategy.talkingPoints.map(tp => (
                            <button key={tp.audience} onClick={() => setActiveTab(tp.audience)} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tp.audience ? 'bg-[#F58220] text-white' : 'bg-transparent text-gray-400 hover:bg-zinc-700'}`}>
                                {tp.audience}
                            </button>
                        ))}
                    </div>
                    <div>
                        {strategy.talkingPoints.find(tp => tp.audience === activeTab)?.points.map((p, i) => (
                             <div key={i} className="mb-3 p-3 bg-zinc-800/50 rounded-lg">
                                <p className="font-semibold text-orange-300">{p.point}</p>
                                <p className="text-xs text-orange-400/80 mt-1">เหตุผล: {p.rationale}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <h4 className="font-bold text-white mb-3">การเตรียมการโต้แย้ง</h4>
                    <div className="space-y-4">
                        {strategy.rebuttals.map((r, i) => (
                            <div key={i}>
                                <p className="text-sm text-red-300/80">หากฝ่ายนั้นพูดว่า: <span className="italic">"{r.opposingArgument}"</span></p>
                                <p className="text-sm text-green-300/90 font-semibold mt-1">เราจะตอบว่า: "{r.suggestedRebuttal}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <FurtherInvestigation 
                sectionTitle="การสื่อสารเชิงกลยุทธ์"
                sectionContext={strategy}
                onNewContribution={onNewContribution}
            />
        </Card>
    )
}

const SocialMediaSentimentDisplay: React.FC<{ sentiment: SocialMediaSentiment }> = ({ sentiment }) => {
    const sentimentData = [
        { label: 'สนับสนุน', value: sentiment.proPercent, color: 'bg-green-500' },
        { label: 'คัดค้าน', value: sentiment.antiPercent, color: 'bg-red-500' },
        { label: 'เป็นกลาง', value: sentiment.neutralPercent, color: 'bg-gray-500' },
    ];
    return (
        <Card id="public-debate" title="ภาพรวมการถกเถียงสาธารณะ" isCollapsible>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h4 className="font-bold text-white mb-3">ความรู้สึกของสาธารณชนจำลอง ({sentiment.hashtag})</h4>
                     <div className="space-y-2">
                        {sentimentData.map(item => (
                            <div key={item.label} className="flex items-center">
                                <span className="text-sm font-medium text-gray-300 w-20">{item.label}</span>
                                <div className="w-full bg-gray-700 rounded-full h-6">
                                    <div className={`${item.color} h-6 rounded-full text-xs font-medium text-white text-center p-0.5 leading-none`} style={{ width: `${item.value}%`}}>
                                        {item.value > 10 ? `${item.value.toFixed(1)}%` : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                     <h4 className="font-bold text-white mt-6 mb-3">ข้อกังวลที่ถูกอ้างถึงมากที่สุด</h4>
                     <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-400">
                        {sentiment.commonConcerns.map((concern, i) => <li key={i}>{concern}</li>)}
                     </ul>
                </div>
                <div>
                     <h4 className="font-bold text-white mb-3">กลุ่มข้อโต้แย้งหลัก</h4>
                     <div className="space-y-4">
                        {sentiment.argumentClusters && sentiment.argumentClusters.map((cluster, i) => (
                            <div key={i} className="bg-zinc-800/50 p-3 rounded-lg">
                                <h5 className="font-semibold text-white">{cluster.theme}</h5>
                                <p className="text-sm text-gray-400 italic my-1">{cluster.summary}</p>
                                {cluster.representativeQuotes.map((quote, qi) => (
                                    <blockquote key={qi} className="border-l-2 border-orange-400/50 pl-2 text-xs text-orange-200/70 mt-1">
                                        "{quote}"
                                    </blockquote>
                                ))}
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </Card>
    );
};


const StakeholderAnalysisDisplay: React.FC<{stakeholders: EnhancedStakeholder[]; onNewContribution: (finding: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void;}> = ({ stakeholders, onNewContribution }) => {
    const handleExport = () => {
        const markdown = generateMarkdownForStakeholders(stakeholders);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stakeholder-analysis.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card id="stakeholders" title="แฟ้มข้อมูลผู้มีส่วนได้ส่วนเสีย" isCollapsible defaultClosed onExport={handleExport}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(stakeholders || []).map((s, i) => (
                <div key={i} className="p-4 bg-zinc-800 rounded-lg flex flex-col shadow-md">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-white">{s.name}</h4>
                             <p className="text-xs text-gray-400">(ประเภท: {s.category} / อิทธิพล: {s.influenceLevel})</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full self-start ${s.stance === 'Pro' ? 'bg-green-500/20 text-green-300' : s.stance === 'Con' ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}`}>{s.stance}</span>
                    </div>
                    <p className="mt-2 text-sm flex-grow text-gray-300">{s.summary}</p>
                    
                    {s.politicalConnections && s.politicalConnections.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-700/50">
                            <h5 className="text-sm font-semibold text-gray-400 mb-2">ความเชื่อมโยงทางการเมือง</h5>
                            <ul className="text-xs text-gray-500 space-y-1">
                                {s.politicalConnections.map(pc => (
                                    <li key={pc.person}><strong>{pc.person}:</strong> {pc.connection} ({pc.source})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
            </div>
             <FurtherInvestigation 
                sectionTitle="แฟ้มข้อมูลผู้มีส่วนได้ส่วนเสีย"
                sectionContext={stakeholders}
                onNewContribution={onNewContribution}
            />
        </Card>
    )
}

const PartyComparisonDisplay: React.FC<{comparison: EnhancedPartyDraftComparison[]}> = ({comparison}) => {
    return (
        <Card id="party-comparison" title="การเปรียบเทียบร่างของพรรค" isCollapsible defaultClosed>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-zinc-800">
                        <tr>
                            <th scope="col" className="px-4 py-3">พรรค</th>
                            <th scope="col" className="px-4 py-3">จุดยืน</th>
                            <th scope="col" className="px-4 py-3">การวางตำแหน่งความเสี่ยง</th>
                            <th scope="col" className="px-4 py-3">ข้อกฎหมายที่น่าสังเกต</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(comparison || []).map((p, i) => (
                             <tr key={i} className={`border-b border-zinc-800 ${p.party.includes("People's Party") ? 'bg-orange-500/10' : 'bg-zinc-900/50'}`}>
                                <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">{p.party}</th>
                                <td className="px-4 py-4">{p.position}</td>
                                <td className="px-4 py-4">{p.riskPositioning}</td>
                                <td className="px-4 py-4">{p.notableClause}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const calculateReadingTime = (report: IntelligenceBriefingReport): number => {
    let allText = '';
    const WPM = 225;

    const extractStrings = (obj: any) => {
        if (typeof obj === 'string') {
            allText += obj + ' ';
        } else if (Array.isArray(obj)) {
            obj.forEach(extractStrings);
        } else if (typeof obj === 'object' && obj !== null) {
            Object.values(obj).forEach(extractStrings);
        }
    };

    extractStrings(report);
    const wordCount = allText.split(/\s+/).filter(Boolean).length;
    if (wordCount === 0) return 0;

    return Math.ceil(wordCount / WPM);
};

interface IntelligenceBriefingDisplayProps {
    report: IntelligenceBriefingReport;
    topicId: string;
    isStandaloneView?: boolean;
}

const ComprehensiveReportDisplay: React.FC<IntelligenceBriefingDisplayProps> = ({ report: initialReport, topicId, isStandaloneView = false }) => {
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState<IntelligenceBriefingReport | null>(initialReport);
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sections = useMemo(() => {
    if (!currentReport) return [];
    return [
      { id: 'executive-summary', title: 'บทสรุปสำหรับผู้บริหาร' },
      { id: 'polling', title: 'โพลล์จุดยืนของพรรค' },
      { id: 'collaboration', title: 'บันทึกการทำงานร่วมกัน' },
      { id: 'discussion', title: 'อภิปราย' },
      ...(currentReport.antiMonopolyAnalysis ? [{ id: 'anti-monopoly', title: 'วิเคราะห์การต่อต้านการผูกขาด' }] : []),
      { id: 'credibility-score', title: 'คะแนนความน่าเชื่อถือ' },
      { id: 'strategic-positioning', title: 'จุดยืนและกรอบการนำเสนอ' },
      { id: 'strategic-comms', title: 'การสื่อสารเชิงกลยุทธ์' },
      { id: 'public-debate', title: 'ภาพรวมการถกเถียงสาธารณะ' },
      { id: 'party-comparison', title: 'การเปรียบเทียบร่างของพรรค' },
      { id: 'stakeholders', title: 'แฟ้มข้อมูลผู้มีส่วนได้ส่วนเสีย' },
      { id: 'stakeholder-network', title: 'แผนที่เครือข่าย' },
      { id: 'argument-graph', title: 'กราฟโครงสร้างข้อโต้แย้ง' },
      { id: 'risk-impact', title: 'การวิเคราะห์ความเสี่ยง' },
      { id: 'simulated-intel', title: 'ภาคผนวกข่าวกรองจำลอง' },
      ...(currentReport.aiAssumptions && currentReport.aiAssumptions.length > 0 ? [{ id: 'ai-assumptions', title: 'ข้อสมมติฐานของ AI' }] : []),
      ...(currentReport.sources && currentReport.sources.length > 0 ? [{ id: 'sources', title: 'แหล่งข้อมูล' }] : []),
    ];
  }, [currentReport]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px', threshold: 0 }
    );

    // FIX: Iterate over keys to ensure TypeScript can correctly infer the type of the ref,
    // preventing an "Argument of type 'unknown' is not assignable to parameter of type 'Element'" error
    // that can occur with Object.values in some TS configurations.
    const currentRefs = sectionRefs.current;
    Object.keys(currentRefs).forEach((key) => {
      const ref = currentRefs[key];
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      const currentRefsOnCleanup = sectionRefs.current;
      Object.keys(currentRefsOnCleanup).forEach((key) => {
        const ref = currentRefsOnCleanup[key];
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [sections]);

  useEffect(() => {
    if (!topicId) return;
    const unsubscribe = db.listenToReport(topicId, (updatedReport) => {
      if(updatedReport) setCurrentReport(updatedReport);
    });
    return () => unsubscribe();
  }, [topicId]);

  const handleNewContribution = useCallback(async (contributionData: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => {
    if (!currentReport?.id || !user) return;
    
    const fullContributionData = {
        ...contributionData,
        authorId: user.id,
        authorName: user.name,
    };
    
    await db.addUserContribution(currentReport.id, fullContributionData);
  }, [currentReport, user]);

  const handlePostComment = useCallback(async (content: string) => {
    if (!currentReport?.id || !user) return;
    const newComment: DiscussionComment = {
        id: `comment_${Date.now()}`,
        author: user.name,
        timestamp: new Date().toISOString(),
        content,
    };
    await db.addCommentToReport(currentReport.id, newComment);
  }, [currentReport, user]);


  const readingTime = useMemo(() => currentReport ? calculateReadingTime(currentReport) : 0, [currentReport]);

  const getReadingTimeStyle = (time: number) => {
    if (time <= 10) return { bgColor: 'bg-green-500/20', textColor: 'text-green-300' };
    if (time <= 20) return { bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-300' };
    return { bgColor: 'bg-red-500/20', textColor: 'text-red-300' };
  };

  const readingTimeStyle = getReadingTimeStyle(readingTime);


  const handleExport = () => {
    if (!currentReport) return;
    const markdown = generateMarkdownForIntelligenceBriefing(currentReport);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence-briefing-${currentReport.topic.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const containerClass = isStandaloneView ? "" : "mt-8";

  if (!currentReport) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner className="w-12 h-12 text-[#F58220]" />
            <p className="mt-4 text-gray-400">กำลังโหลดข้อมูลรายงาน...</p>
        </div>
    );
  }

  const ReportSidebar = () => (
    <nav className="lg:w-64 lg:sticky top-24 self-start bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 hidden lg:block">
        <h4 className="font-bold text-white mb-3">สารบัญ</h4>
        <ul className="space-y-2">
            {sections.map(section => (
                <li key={section.id}>
                    <a href={`#${section.id}`} className={`block text-sm font-semibold p-2 rounded-md border-l-4 ${activeSection === section.id ? 'bg-[#F58220]/20 text-orange-300 border-[#F58220]' : 'text-gray-400 hover:text-white hover:bg-zinc-700/50 border-transparent'}`}>
                        {section.title}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
  );

  return (
    <div className={`flex flex-col lg:flex-row gap-8 ${containerClass}`}>
        <ReportSidebar />
        <div className="flex-1 space-y-6">
            <div id="executive-summary" ref={el => { if(el) sectionRefs.current['executive-summary'] = el; }} className="bg-[#2a2f34] rounded-xl shadow-lg p-6 scroll-mt-20">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-white">สรุปข่าวกรอง: <span className="text-[#F58220]">{currentReport.topic}</span></h2>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        {readingTime > 0 && (
                            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${readingTimeStyle.bgColor} ${readingTimeStyle.textColor}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>อ่านประมาณ {readingTime} นาที</span>
                            </div>
                        )}
                        <ExportButton onExport={handleExport} />
                        <SaveToDriveButton report={currentReport} />
                    </div>
                </div>
                <p className="text-base leading-relaxed text-gray-300">{currentReport.executiveSummary}</p>
                 <FurtherInvestigation 
                    sectionTitle="บทสรุปสำหรับผู้บริหาร"
                    sectionContext={{ executiveSummary: currentReport.executiveSummary, topic: currentReport.topic }}
                    onNewContribution={handleNewContribution}
                    report={currentReport}
                />
            </div>
            
            <div id="polling" ref={el => { if(el) sectionRefs.current['polling'] = el; }}>
              <StancePolling topicId={topicId} />
            </div>
            
            <div id="collaboration" ref={el => { if(el) sectionRefs.current['collaboration'] = el; }}>
              <UserContributions report={currentReport} onNewContribution={handleNewContribution} />
            </div>
            
            <div id="discussion" ref={el => { if(el) sectionRefs.current['discussion'] = el; }}>
              <DiscussionThread 
                comments={currentReport.discussion || []}
                onPostComment={handlePostComment}
              />
            </div>

            {currentReport.antiMonopolyAnalysis && (
              <div ref={el => { if(el) sectionRefs.current['anti-monopoly'] = el; }}>
                <AntiMonopolyAnalysisDisplay analysis={currentReport.antiMonopolyAnalysis} onNewContribution={handleNewContribution} />
              </div>
            )}
            <div ref={el => { if(el) sectionRefs.current['credibility-score'] = el; }}>
              <CredibilityScoreDisplay score={currentReport.policyCredibilityScore} onNewContribution={handleNewContribution} />
            </div>

            <Card id="strategic-positioning" title="จุดยืนและกรอบการนำเสนอที่แนะนำ">
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30 mb-4">
                    <h4 className="font-bold text-white text-lg">กรอบการนำเสนอใหม่: <span className="italic">"{currentReport.recommendedPositioning.positioningReframe.title}"</span></h4>
                    <p className="text-sm text-orange-300/80 mt-1">เหตุผล: {currentReport.recommendedPositioning.positioningReframe.rationale}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white">จุดยืนที่แนะนำ: <span className="text-orange-300">{currentReport.recommendedPositioning.stance}</span></h4>
                    <h5 className="font-semibold text-white mt-3 mb-2">เหตุผลสนับสนุน:</h5>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-gray-300">
                        {currentReport.recommendedPositioning.justification.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </Card>

            <div ref={el => { if(el) sectionRefs.current['strategic-comms'] = el; }}>
              <StrategicCommunicationsDisplay strategy={currentReport.internalStrategy} onNewContribution={handleNewContribution} />
            </div>
            <div ref={el => { if(el) sectionRefs.current['public-debate'] = el; }}>
              <SocialMediaSentimentDisplay sentiment={currentReport.socialMediaSentiment} />
            </div>
            <div ref={el => { if(el) sectionRefs.current['party-comparison'] = el; }}>
              <PartyComparisonDisplay comparison={currentReport.partyDraftComparison} />
            </div>
            
            <div ref={el => { if(el) sectionRefs.current['stakeholders'] = el; }}>
              <StakeholderAnalysisDisplay stakeholders={currentReport.stakeholderAnalysis} onNewContribution={handleNewContribution} />
            </div>

            <Card id="stakeholder-network" title="แผนที่เครือข่ายผู้มีส่วนได้ส่วนเสีย" isCollapsible defaultClosed>
                <NetworkGraph graphData={currentReport.stakeholderNetworkGraph} />
            </Card>
            
            <Card id="argument-graph" title="กราฟโครงสร้างข้อโต้แย้ง" isCollapsible defaultClosed>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-900/20 p-4 rounded-lg">
                        <h4 className="font-bold text-green-300 mb-3">ข้อโต้แย้งฝ่ายสนับสนุน</h4>
                        {(currentReport.substrateArgumentGraph?.pro || []).map((arg, i) => (
                            <div key={i} className="mb-4">
                                <h5 className="font-semibold text-white">{arg.title}</h5>
                                <ul className="list-none mt-2 space-y-3">
                                    {arg.claims.map((claim, j) => (
                                        <li key={j} className="border-l-2 border-green-500/50 pl-3">
                                            <p className="font-semibold text-white">{claim.claim}</p>
                                            <p className="text-gray-400 mt-0.5">{claim.detail}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="bg-red-900/20 p-4 rounded-lg">
                        <h4 className="font-bold text-red-300 mb-3">ข้อโต้แย้งฝ่ายคัดค้าน</h4>
                        {(currentReport.substrateArgumentGraph?.con || []).map((arg, i) => (
                            <div key={i} className="mb-4">
                                <h5 className="font-semibold text-white">{arg.title}</h5>
                                <ul className="list-none mt-2 space-y-3">
                                    {arg.claims.map((claim, j) => (
                                         <li key={j} className="border-l-2 border-red-500/50 pl-3">
                                            <p className="font-semibold text-white">{claim.claim}</p>
                                            <p className="text-gray-400 mt-0.5">{claim.detail}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card id="risk-impact" title="การวิเคราะห์ความเสี่ยงและผลกระทบ" isCollapsible defaultClosed>
                <div>
                    <h4 className="font-semibold text-white">สาธารณสุข</h4>
                    <p className="text-sm text-gray-400">{currentReport.riskImpactAnalysis.publicHealth}</p>
                </div>
                <div className="mt-3">
                    <h4 className="font-semibold text-white">เศรษฐกิจ</h4>
                    <p className="text-sm text-gray-400">{currentReport.riskImpactAnalysis.economic}</p>
                </div>
                <div className="mt-3">
                    <h4 className="font-semibold text-white">ความสมานฉันท์ทางสังคม</h4>
                    <p className="text-sm text-gray-400">{currentReport.riskImpactAnalysis.socialCohesion}</p>
                </div>
            </Card>

            <Card id="simulated-intel" title="ภาคผนวกข่าวกรองจำลอง" isCollapsible defaultClosed>
                <div>
                    <h4 className="font-semibold text-white">รายงาน OSINT จำลอง</h4>
                    <p className="text-sm text-gray-400 italic mt-1">{currentReport.simulatedOsintReport}</p>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-white">รายงานจาก Crawler ติดตามรัฐสภาจำลอง</h4>
                    <p className="text-sm text-gray-400 italic mt-1">{currentReport.simulatedCrawlerReport}</p>
                </div>
            </Card>

            {currentReport.aiAssumptions && currentReport.aiAssumptions.length > 0 && (
                <div ref={el => { if(el) sectionRefs.current['ai-assumptions'] = el; }}>
                  <Card id="ai-assumptions" title="ข้อสมมติฐานของ AI" isCollapsible defaultClosed>
                      <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-400">
                          {currentReport.aiAssumptions.map((assumption, i) => (
                              <li key={i}>{assumption}</li>
                          ))}
                      </ul>
                  </Card>
                </div>
            )}
            
            {currentReport.sources && currentReport.sources.length > 0 && (
              <div ref={el => { if(el) sectionRefs.current['sources'] = el; }}>
                <SourcesDisplay sources={currentReport.sources} />
              </div>
            )}
        </div>
    </div>
  );
};

export default ComprehensiveReportDisplay;