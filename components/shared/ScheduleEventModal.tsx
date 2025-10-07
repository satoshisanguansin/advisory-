import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as googleCalendarService from '../../services/googleCalendarService';
import * as geminiService from '../../services/geminiService';
import LoadingSpinner from '../icons/LoadingSpinner';
import ToastNotification from './ToastNotification';

interface ScheduleEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    textToParse: string;
    reportTopic: string;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ isOpen, onClose, textToParse, reportTopic }) => {
    const { isLoggedIn, signIn, accessToken, isGapiLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [eventDetails, setEventDetails] = useState<{ title: string, description: string, location: string, suggestedDateTime: string } | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string; link?: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (isOpen && textToParse) {
            setIsLoading(true);
            setError(null);
            geminiService.extractEventDetails(textToParse, reportTopic)
                .then(details => {
                    setEventDetails(details);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError("Failed to extract event details from text.");
                    setIsLoading(false);
                });
        }
    }, [isOpen, textToParse, reportTopic]);
    
    if (!isOpen) return null;

    const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!accessToken || !eventDetails) {
            setError("Authentication token not available. Please sign in again.");
             if (!isLoggedIn) signIn();
            return;
        };

        const formData = new FormData(e.currentTarget);
        const { title, description, location, date, time } = Object.fromEntries(formData.entries());
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

        setIsSubmitting(true);
        setError(null);
        try {
            const event = await googleCalendarService.createCalendarEvent(
                title as string, description as string,
                startDateTime.toISOString(), endDateTime.toISOString(),
                location as string, accessToken
            );
            setToast({ id: Date.now(), message: 'Event created successfully!', link: event.htmlLink, type: 'success' });
            onClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(`Error creating event: ${errorMessage}. A real Google account sign-in is required for this feature.`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const defaultDate = eventDetails ? new Date(eventDetails.suggestedDateTime).toISOString().split('T')[0] : '';
    const defaultTime = eventDetails ? new Date(eventDetails.suggestedDateTime).toTimeString().substring(0, 5) : '';

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-[#2a2f34] rounded-xl shadow-2xl p-6 w-full max-w-lg border border-zinc-700" onClick={e => e.stopPropagation()}>
                    <h4 className="text-xl font-bold text-white mb-4">Schedule Meeting</h4>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <LoadingSpinner className="w-8 h-8"/>
                            <p className="mt-2 text-gray-400">AI is suggesting event details...</p>
                        </div>
                    ) : !eventDetails ? (
                         <p className="text-red-400">{error || "Could not load event details."}</p>
                    ) : (
                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-300">Title</label>
                                <input name="title" type="text" defaultValue={eventDetails.title} required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300">Description</label>
                                <textarea name="description" rows={4} defaultValue={eventDetails.description} className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-300">Date</label>
                                    <input name="date" type="date" defaultValue={defaultDate} required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-300">Time</label>
                                    <input name="time" type="time" defaultValue={defaultTime} required className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300">Location</label>
                                <input name="location" type="text" defaultValue={eventDetails.location} className="w-full mt-1 bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200"/>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg font-semibold">Cancel</button>
                                <button type="submit" disabled={isSubmitting || isGapiLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center">
                                    {isSubmitting ? <LoadingSpinner className="w-5 h-5" /> : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {toast && <ToastNotification key={toast.id} {...toast} onDismiss={() => setToast(null)} />}
        </>
    );
};

export default ScheduleEventModal;