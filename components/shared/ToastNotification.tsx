import React, { useEffect } from 'react';

interface ToastNotificationProps {
    message: string;
    link?: string;
    onDismiss: () => void;
    type: 'success' | 'error';
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, link, onDismiss, type }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const baseClasses = "fixed bottom-5 right-5 z-50 max-w-sm w-full rounded-xl shadow-lg text-white p-4 flex items-start space-x-3 transition-all transform animate-slide-in-up";
    const typeClasses = {
        success: "bg-green-600 border border-green-500",
        error: "bg-red-600 border border-red-500"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="flex-shrink-0 mt-0.5">
                {type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            </div>
            <div className="flex-1">
                <p className="font-semibold">{message}</p>
                {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-gray-200">View Resource</a>}
            </div>
            <button onClick={onDismiss} className="text-xl font-bold p-1 -mt-1 -mr-1">&times;</button>
            <style>{`
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-in-up {
                    animation: slideInUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ToastNotification;