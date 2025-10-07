import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as googleDriveService from '../../services/googleDriveService';
import { generateHtmlForIntelligenceBriefing } from '../../utils/exportUtils';
import type { IntelligenceBriefingReport } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';
import ToastNotification from './ToastNotification';

interface SaveToDriveButtonProps {
    report: IntelligenceBriefingReport;
}

const SaveToDriveButton: React.FC<SaveToDriveButtonProps> = ({ report }) => {
    const { isLoggedIn, signIn, accessToken, isGapiLoading } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ id: number; message: string; link?: string; type: 'success' | 'error' } | null>(null);

    const handleSaveToDrive = async () => {
        if (!isLoggedIn) {
            // NOTE: The mock sign-in will not provide a valid token for this to work.
            // In a real app, this would trigger the full OAuth flow.
            signIn();
            setToast({ id: Date.now(), message: 'Please sign in to save to Google Drive.', type: 'error' });
            return;
        }
        if (!accessToken) {
            setToast({ id: Date.now(), message: 'Authentication token not available.', type: 'error' });
            return;
        }
        setIsSaving(true);
        try {
            const htmlContent = generateHtmlForIntelligenceBriefing(report);
            const file = await googleDriveService.saveReportToDrive(`Intelligence Briefing - ${report.topic}`, htmlContent, accessToken);
            setToast({ id: Date.now(), message: 'Report saved to Google Drive!', link: file.webViewLink, type: 'success' });
        } catch (error) {
            // Catching the inevitable auth error with the mock token.
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setToast({ id: Date.now(), message: `Error saving to Drive: ${errorMessage}. A real Google account sign-in is required for this feature.`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleSaveToDrive} 
                disabled={isSaving || isGapiLoading} 
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600 text-blue-200 hover:text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save to Google Drive"
                title={isGapiLoading ? "Google services are initializing..." : "Save to Google Drive"}
            >
                {isSaving || isGapiLoading ? <LoadingSpinner className="w-4 h-4" /> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.528 5.243 10.757.472A.5.5 0 0 0 10.414 0H5.5A1.5 1.5 0 0 0 4 1.5v13A1.5 1.5 0 0 0 5.5 16h5a1.5 1.5 0 0 0 1.5-1.5V9.5h3.414a.5.5 0 0 0 .354-.854l-3.972-3.972a.5.5 0 0 0-.707 0l-3.972 3.972a.5.5 0 0 0 .353.854H9.5V14a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 3.5 14V1.5a.5.5 0 0 1 .5-.5H5v4.5A1.5 1.5 0 0 0 6.5 7h4a.5.5 0 0 1 .5.5v1.293l1.854 1.853a.5.5 0 0 0 .353.147h.586a.5.5 0 0 0 .354-.854L11.207 8H6.5A.5.5 0 0 1 6 7.5V1H5.414L10 5.586V1h.586l4.472 4.472a.5.5 0 0 1-.217.854H13.5v-1.028a.5.5 0 0 0-.146-.353L10.5 2.293V6.5a.5.5 0 0 1-.5.5h-4a1.5 1.5 0 0 0-1.5 1.5v.5h7.553a2.5 2.5 0 0 1 2.447 2.077l.586.293a.5.5 0 0 0 .56-.097L15.528 5.243z"/>
                </svg>}
                <span>Save to Drive</span>
            </button>
            {toast && <ToastNotification key={toast.id} {...toast} onDismiss={() => setToast(null)} />}
        </>
    );
};

export default SaveToDriveButton;