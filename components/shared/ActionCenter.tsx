import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as googleCalendarService from '../../services/googleCalendarService';
import * as googleDriveService from '../../services/googleDriveService';
import { generateHtmlForIntelligenceBriefing } from '../../utils/exportUtils';
import type { IntelligenceBriefingReport } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';
import ToastNotification from './ToastNotification';
import * as geminiService from '../../services/geminiService';
import * as db from '../../services/firebaseService';

interface ActionCenterProps {
    report: IntelligenceBriefingReport;
    setReport: React.Dispatch<React.SetStateAction<IntelligenceBriefingReport>>;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ report, setReport }) => {
    const { isLoggedIn, signIn, accessToken } = useAuth();
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isSavingToDrive, setIsSavingToDrive] = useState(false);
    const [toast, setToast] = useState<{ id: number; message: string; link?: string; type: 'success' | 'error' } | null>(null);
    const [isSearchingDeeper, setIsSearchingDeeper] = useState(false);

    const handleScheduleClick = () => {
        if (!isLoggedIn) {
            signIn();
        } else {
            setIsCalendarModalOpen(true);
        }
    };

    const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!accessToken) return;
        
        const formData = new FormData(e.currentTarget);
        const { title, description, location, date, time } = Object.fromEntries(formData.entries());
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

        try {
            const event = await googleCalendarService.createCalendarEvent(
                title as string, description as string,
                startDateTime.toISOString(), endDateTime.toISOString(),
                location as string, accessToken
            );
            setToast({ id: Date.now(), message: 'Event created successfully!', link: event.htmlLink, type: 'success' });
        } catch (error) {
            setToast({ id: Date.now(), message: `Error creating event: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
        } finally {
            setIsCalendarModalOpen(false);
        }
    };

    const handleSaveToDrive = async () => {
        if (!isLoggedIn) {
            signIn();
            return;
        }
        if (!accessToken) {
            setToast({ id: Date.now(), message: 'Authentication token not available.', type: 'error' });
            return;
        }
        setIsSavingToDrive(true);
        try {
            const htmlContent = generateHtmlForIntelligenceBriefing(report);
            const file = await googleDriveService.saveReportToDrive(report.topic, htmlContent, accessToken);
            setToast({ id: Date.now(), message: 'Report saved to Google Drive!', link: file.webViewLink, type: 'success' });
        } catch (error) {
            setToast({ id: Date.now(), message: `Error saving to Drive: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
        } finally {
            setIsSavingToDrive(false);
        }
    };

    const handleDeeperSearch = async () => {
        if (!isLoggedIn) {
            signIn();
            return;
        }
        setIsSearchingDeeper(true);
        setToast(null);

        try {
            const { analysis, sources } = await geminiService.generateDeeperAnalysis(report.topic, report.executiveSummary);

            const newSourcesText = sources.length > 0
                ? `\n\n**แหล่งข้อมูลใหม่:**\n${sources.map(s => `- [${s.title || s.uri}](${s.uri})`).join('\n')}`
                : '';
            
            const newFindingContent = `${analysis}${newSourcesText}`;
            
            const newFinding = {
                title: `ผลการค้นหาเชิงลึก - ${new Date().toLocaleString()}`,
                content: newFindingContent,
            };

            const updatedReport: IntelligenceBriefingReport = {
                ...report,
                appendix: [...(report.appendix || []), newFinding],
                sources: [...(report.sources || []), ...sources.filter(newSource => !(report.sources || []).some(existingSource => existingSource.uri === newSource.uri))],
            };
            
            setReport(updatedReport);
            if (updatedReport.id) {
                await db.saveReport(updatedReport);
            }

            setToast({ id: Date.now(), message: 'การค้นหาเชิงลึกเสร็จสมบูรณ์ เพิ่มข้อมูลลงในภาคผนวกแล้ว', type: 'success' });

        } catch (error) {
            setToast({ id: Date.now(), message: `เกิดข้อผิดพลาดระหว่างการค้นหาเชิงลึก: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
        } finally {
            setIsSearchingDeeper(false);
        }
    };
    
    return (
        <div className="bg-[#2a2f34] rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-zinc-700/50">
            <h3 className="text-lg font-bold text-[#F58220] mb-4">Action Center</h3>
            <div className="flex flex-wrap gap-4">
                <button onClick={handleScheduleClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    <span>Schedule Strategy Meeting</span>
                </button>
                <button onClick={handleSaveToDrive} disabled={isSavingToDrive} className="flex items-center space-x-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50">
                    {isSavingToDrive ? <LoadingSpinner className="w-5 h-5"/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 8a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1 0-1h10a.5.5 0 0 1 .5.5zM.5 4a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 0 1h-14a.5.5 0 0 1-.5-.5zM.5 12a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 0 1h-14a.5.5 0 0 1-.5-.5z"/></svg>}
                    <span>Save to Google Docs</span>
                </button>
                <button onClick={handleDeeperSearch} disabled={isSearchingDeeper} className="flex items-center space-x-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50">
                    {isSearchingDeeper ? <LoadingSpinner className="w-5 h-5"/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>}
                    <span>ค้นหาเชิงลึก</span>
                </button>
            </div>

            {isCalendarModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsCalendarModalOpen(false)}>
                    <div className="bg-[#2a2f34] rounded-xl shadow-2xl p-6 w-full max-w-lg border border-zinc-700" onClick={e => e.stopPropagation()}>
                        <h4 className="text-xl font-bold text-white mb-4">Schedule Meeting</h4>
                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-300">Title</label>
                                <input name="title" type="text" defaultValue={`Strategy Meeting: ${report.topic}`} required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300">Description</label>
                                <textarea name="description" rows={4} defaultValue={report.executiveSummary} className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-300">Date</label>
                                    <input name="date" type="date" required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-300">Time</label>
                                    <input name="time" type="time" required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsCalendarModalOpen(false)} className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg font-semibold">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {toast && <ToastNotification key={toast.id} {...toast} onDismiss={() => setToast(null)} />}
        </div>
    );
};

export default ActionCenter;