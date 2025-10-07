import React from 'react';
import ReactDOM from 'react-dom';

interface CoachMarkProps {
    targetRect: DOMRect;
    title: string;
    content: string;
    isActive: boolean;
    isLast: boolean;
    onNext: () => void;
    onDismiss: () => void;
}

const CoachMark: React.FC<CoachMarkProps> = ({ targetRect, title, content, isActive, isLast, onNext, onDismiss }) => {
    if (!isActive || !targetRect || targetRect.width === 0) {
        return null;
    }

    const positionStyles = {
        top: `${targetRect.top - 10}px`,
        left: `${targetRect.left + targetRect.width / 2}px`,
        transform: 'translateX(-50%) translateY(-100%)',
    };

    return ReactDOM.createPortal(
        <div 
            className="fixed z-[101] w-72 p-4 bg-[#2a2f34] border border-orange-500 rounded-xl shadow-2xl text-white animate-fade-in"
            style={positionStyles}
            onClick={e => e.stopPropagation()}
        >
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2a2f34] border-b border-r border-orange-500 transform rotate-45"></div>
            <div 
                className="absolute top-0 left-0 w-full h-full rounded-xl ring-4 ring-orange-500/50 animate-pulse"
                style={{
                    clipPath: `evenodd(
                        polygon(-100vmax -100vmax, 200vmax -100vmax, 200vmax 200vmax, -100vmax 200vmax),
                        polygon(${targetRect.left}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.bottom}px, ${targetRect.left}px ${targetRect.bottom}px)
                    )`
                }}
            />
            
            <h4 className="font-bold text-orange-400">{title}</h4>
            <p className="text-sm text-gray-300 mt-2">{content}</p>
            <div className="flex justify-end items-center mt-4 gap-4">
                <button onClick={onDismiss} className="text-xs text-gray-400 hover:text-white">ข้าม</button>
                <button 
                    onClick={onNext}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-sm"
                >
                    {isLast ? 'เสร็จสิ้น' : 'ต่อไป'}
                </button>
            </div>
            <style>{`
                @keyframes fadeInAnimation {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeInAnimation 0.3s ease-in-out;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default CoachMark;
