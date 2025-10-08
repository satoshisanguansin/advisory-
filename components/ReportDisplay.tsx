import React, { useState } from 'react';
import type { ForensicBudgetAnalysisReport, ForensicFindingItem } from '../types';
import ExportButton from './ExportButton';
import { generateMarkdownForForensicBudgetAnalysis } from '../utils/exportUtils';
import LoadingSpinner from './icons/LoadingSpinner';

const FindingCard: React.FC<{ item: ForensicFindingItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(true);

    const overpaymentValue = parseFloat(item.avgPercentOverFMV);
    const riskColor = overpaymentValue > 50 ? 'border-red-500/50' : overpaymentValue > 20 ? 'border-yellow-500/50' : 'border-green-500/50';

    return (
        <div className={`bg-zinc-800/50 rounded-xl overflow-hidden border-2 ${riskColor}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="text-left">
                    <h4 className="text-lg font-bold text-white flex items-center gap-3">
                       <span className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-700 font-black text-orange-400 text-lg">{item.priorityRank}</span>
                       <span>{item.itemCategory}</span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{item.standardSpecification}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-6 space-y-5 border-t border-zinc-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-zinc-900/70 p-3 rounded-lg">
                             <div className="text-xs text-gray-400">ราคาตลาด (FMV)</div>
                             <div className="text-xl font-bold text-white">{item.fmvBenchmarkPerUnit.toLocaleString()}</div>
                        </div>
                         <div className="bg-zinc-900/70 p-3 rounded-lg">
                             <div className="text-xs text-gray-400">% จ่ายเกิน FMV</div>
                             <div className={`text-xl font-bold ${overpaymentValue > 20 ? 'text-red-400' : 'text-yellow-400'}`}>{item.avgPercentOverFMV}%</div>
                        </div>
                         <div className="bg-zinc-900/70 p-3 rounded-lg">
                             <div className="text-xs text-gray-400">ส่วนต่างเฉลี่ย/หน่วย</div>
                             <div className="text-xl font-bold text-white">{item.avgOverpaymentPerUnit}</div>
                        </div>
                         <div className="bg-zinc-900/70 p-3 rounded-lg">
                             <div className="text-xs text-gray-400">จ่ายเกิน (ตัวอย่าง)</div>
                             <div className="text-xl font-bold text-orange-400">{item.totalSampleOverpayment.toLocaleString()}</div>
                        </div>
                    </div>
                     <div className="text-sm space-y-2">
                        {item.keyDistrictsInvolved?.length > 0 && (
                            <div>
                                <strong className="text-gray-300">เขตที่เกี่ยวข้อง:</strong>
                                <ul className="list-disc list-outside pl-5 text-gray-400 mt-1">
                                    {item.keyDistrictsInvolved.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            </div>
                        )}
                        <p><strong className="text-gray-300">หมายเหตุ:</strong> {item.notesFromBudgetDoc}</p>
                        <p><strong className="text-gray-300">อ้างอิงราคา:</strong> <a href={item.marketReferenceSource} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Link</a></p>
                     </div>
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                        <h5 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            คำถามสังหาร (Killer Question)
                        </h5>
                        <p className="text-red-200/90 text-sm italic">{item.killerQuestion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ForensicBudgetAnalysisDisplay: React.FC<{ report: ForensicBudgetAnalysisReport; onClear: () => void; }> = ({ report, onClear }) => {
  const handleExport = () => {
    const markdown = generateMarkdownForForensicBudgetAnalysis(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.reportTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h3 className="text-3xl font-bold text-white">{report.reportTitle}</h3>
            <p className="text-sm text-gray-400">จัดทำเมื่อ: {report.reportDate} | เพื่อ: {report.preparedFor}</p>
        </div>
        <div className="flex items-center space-x-2">
            <ExportButton onExport={handleExport} />
            <button onClick={onClear} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-xs font-semibold transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.128-4.902A8.967 8.967 0 0120 9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.128 4.902A8.967 8.967 0 014 15" />
                </svg>
                <span>วิเคราะห์ใหม่</span>
            </button>
        </div>
      </div>

      <div className="bg-[#2a2f34] rounded-xl shadow-lg p-6 sm:p-8 border border-zinc-700">
        <h4 className="text-xl font-bold text-[#F58220]">{report.executiveSummary.title}</h4>
        <p className="text-base leading-relaxed text-gray-300 mt-2">{report.executiveSummary.overallFinding}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-zinc-800 p-3 rounded-lg"><strong className="text-gray-200 block">ตัวอย่างการสิ้นเปลือง:</strong> {report.executiveSummary.quantifiedWasteExample}</div>
            <div className="bg-zinc-800 p-3 rounded-lg"><strong className="text-gray-200 block">อัตราปัญหาเชิงระบบ:</strong> {report.executiveSummary.systemicIssueRate}</div>
            <div className="bg-zinc-800 p-3 rounded-lg"><strong className="text-gray-200 block">ประหยัดได้ต่อปี:</strong> {report.executiveSummary.potentialAnnualSavings}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">{report.findingsComparisonTable.title}</h4>
        {(report.findingsComparisonTable.items || []).sort((a, b) => a.priorityRank - b.priorityRank).map((item) => (
            <FindingCard key={item.priorityRank} item={item} />
        ))}
      </div>

      <div className="bg-[#2a2f34] rounded-xl shadow-lg p-6 sm:p-8 border border-zinc-700">
        <h4 className="text-xl font-bold text-[#F58220]">{report.callToAction.title}</h4>
        <p className="text-base text-gray-300 mt-2"><strong>เป้าหมายของเรา:</strong> {report.callToAction.ourGoal}</p>
        <ul className="list-disc list-outside pl-5 mt-3 space-y-1 text-gray-300">
            {report.callToAction.keyDemands.map((demand, i) => <li key={i}>{demand}</li>)}
        </ul>
      </div>

       <div className="text-xs text-gray-500 italic text-center px-4">
            {report.disclaimer}
        </div>
    </div>
  );
};

export default ForensicBudgetAnalysisDisplay;