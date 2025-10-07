import React, { useState, useEffect } from 'react';
import * as db from '../../services/firebaseService';
import type { IntelligenceBriefingReport } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';

interface LibraryWorkstationProps {
  onSelectReport: (report: IntelligenceBriefingReport, topicId: string) => void;
}

const LibraryWorkstation: React.FC<LibraryWorkstationProps> = ({ onSelectReport }) => {
  const [reports, setReports] = useState<IntelligenceBriefingReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const allReports = await db.getAllReports();
        setReports(allReports);
      } catch (error) {
        console.error("Failed to fetch reports from the library:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();

    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSaveSearch = () => {
    if (searchTerm.trim() && !savedSearches.includes(searchTerm.trim())) {
      const newSearches = [...savedSearches, searchTerm.trim()];
      setSavedSearches(newSearches);
      localStorage.setItem('savedSearches', JSON.stringify(newSearches));
    }
  };

  const handleRemoveSearch = (searchToRemove: string) => {
    const newSearches = savedSearches.filter(s => s !== searchToRemove);
    setSavedSearches(newSearches);
    localStorage.setItem('savedSearches', JSON.stringify(newSearches));
  };

  const filteredReports = reports.filter(report => {
    if (!searchTerm.trim()) return true;
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    const inTopic = report.topic.toLowerCase().includes(lowerCaseSearch);
    const inSummary = report.executiveSummary.toLowerCase().includes(lowerCaseSearch);
    const inStakeholders = (report.stakeholderAnalysis || []).some(stakeholder =>
      stakeholder.name.toLowerCase().includes(lowerCaseSearch)
    );

    return inTopic || inSummary || inStakeholders;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">ห้องสมุดข่าวกรอง</h2>
      <p className="text-gray-400 mb-6">ค้นหาและเข้าถึงรายงานข่าวกรองทั้งหมดที่สร้างขึ้นก่อนหน้านี้</p>

      <div className="mb-4">
        <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามหัวข้อ, เนื้อหา, หรือผู้มีส่วนได้ส่วนเสีย..."
              className="w-full bg-[#212529] border border-gray-600 rounded-xl p-4 pr-12 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F58220] transition-shadow"
              list="report-topics"
            />
             <datalist id="report-topics">
                {reports.map(report => <option key={report.id} value={report.topic} />)}
            </datalist>
            <button
                onClick={handleSaveSearch}
                disabled={!searchTerm.trim() || savedSearches.includes(searchTerm.trim())}
                className="absolute right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save this search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3.125L5 16V4z" />
                </svg>
            </button>
        </div>
         {savedSearches.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
                {savedSearches.map(search => (
                    <div key={search} className="flex items-center bg-zinc-700 rounded-full">
                        <button onClick={() => setSearchTerm(search)} className="px-3 py-1 text-xs font-semibold text-gray-200 hover:text-white">
                            {search}
                        </button>
                        <button onClick={() => handleRemoveSearch(search)} className="pr-2 text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      <p className="text-sm text-gray-500 font-semibold mb-4 text-right">
        {filteredReports.length} ผลลัพธ์
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner className="w-10 h-10 text-[#F58220]" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <div
                key={report.id}
                className="bg-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-zinc-700 hover:border-orange-500 transition-colors"
              >
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-white truncate" title={report.topic}>{report.topic}</h3>
                  <p className="text-sm text-gray-400 mt-1 truncate">{report.executiveSummary}</p>
                </div>
                <button
                  onClick={() => onSelectReport(report, report.id || report.topic)}
                  className="flex-shrink-0 w-full sm:w-auto flex justify-center items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  <span>ดูบทสรุป</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>{searchTerm ? 'ไม่พบรายงานที่ตรงกับการค้นหาของคุณ' : 'ยังไม่มีรายงานในห้องสมุด'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryWorkstation;