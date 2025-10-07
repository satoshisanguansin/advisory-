import React, { useState } from 'react';
import type { DraftComparisonReport, ThematicPointComparison } from '../types';
import ExportButton from './ExportButton';
import { generateMarkdownForDraftComparison } from '../utils/exportUtils';

const ThematicPointCard: React.FC<{ point: ThematicPointComparison }> = ({ point }) => {
    const [isOpen, setIsOpen] = useState(true);

    const ppClause = point.clauseComparison.find(c => c.draftIdentifier.includes("ร่างของพรรคประชาชน"))?.clauseText || 'N/A';
    const oppClause = point.clauseComparison.find(c => c.draftIdentifier.includes("ร่างของฝ่ายตรงข้าม"))?.clauseText || 'N/A';

    return (
        <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
                <h4 className="text-lg font-bold text-white">{point.theme}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h5 className="font-semibold text-gray-300 mb-2">จุดยืนพรรคประชาชน</h5>
                            <p className="text-gray-400">{point.peoplesPartyPosition}</p>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-300 mb-2">จุดยืนฝ่ายตรงข้าม</h5>
                            <p className="text-gray-400">{point.opponentPosition}</p>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-300 mb-2">ข้อแตกต่างสำคัญ</h5>
                        <p className="text-gray-400 text-sm">{point.keyDifference}</p>
                    </div>
                     <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
                        <h5 className="font-bold text-[#F58220] mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 0013.484 0 .75.75 0 00.515-1.076C16.454 11.665 16 9.887 16 8a6 6 0 00-6-6zM8.5 16.5a1.5 1.5 0 103 0h-3z" />
                            </svg>
                            ความได้เปรียบเชิงกลยุทธ์
                        </h5>
                        <p className="text-orange-200/90 text-sm">{point.strategicAdvantage}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-300 mb-3">หลักฐานระดับมาตรา</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-900/70 p-3 rounded-lg">
                                <h6 className="text-xs font-bold text-gray-400 mb-2">ร่างของพรรคประชาชน</h6>
                                <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap break-words">{ppClause}</pre>
                            </div>
                             <div className="bg-zinc-900/70 p-3 rounded-lg">
                                <h6 className="text-xs font-bold text-gray-400 mb-2">ร่างของฝ่ายตรงข้าม</h6>
                                <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap break-words">{oppClause}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};


const DraftComparisonDisplay: React.FC<{ report: DraftComparisonReport; onClear: () => void; }> = ({ report, onClear }) => {
  const handleExport = () => {
    const markdown = generateMarkdownForDraftComparison(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draft-comparison-${report.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h3 className="text-2xl font-bold text-white">รายงานเปรียบเทียบเชิงกลยุทธ์</h3>
            <p className="text-lg text-gray-400">{report.title}</p>
        </div>
        <div className="flex items-center space-x-2">
            <ExportButton onExport={handleExport} />
            <button onClick={onClear} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.128-4.902A8.967 8.967 0 0120 9" />
                    <path stroke-linecap="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.128 4.902A8.967 8.967 0 014 15" />
                </svg>
                <span>เปรียบเทียบใหม่</span>
            </button>
        </div>
      </div>

      <div className="bg-[#2a2f34] rounded-xl shadow-lg overflow-hidden p-4 sm:p-6 border border-zinc-700">
        <h4 className="text-xl font-bold text-[#F58220]">บทสรุปสำหรับผู้บริหาร</h4>
        <p className="text-base leading-relaxed text-gray-300 mt-2">{report.executiveSummary}</p>
      </div>

      <div className="space-y-4">
        {(report.comparison || []).map((point, index) => (
            <ThematicPointCard key={index} point={point} />
        ))}
      </div>
    </div>
  );
};

export default DraftComparisonDisplay;