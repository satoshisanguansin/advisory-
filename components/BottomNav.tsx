import React from 'react';
import type { Workstation } from './PolicyAdvisorPage';

interface BottomNavProps {
    activeWorkstation: Workstation;
    setActiveWorkstation: (workstation: Workstation) => void;
}

type NavItemInfo = { id: Workstation; title: string; icon: React.ReactElement; };

const navItems: NavItemInfo[] = [
    { id: 'dashboard', title: 'สถานการณ์', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'library', title: 'ห้องสมุด', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg> },
    { id: 'briefing', title: 'สร้างบทสรุป', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2-2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> },
    { id: 'petition', title: 'ยื่นคำร้อง', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { id: 'intel', title: 'ข่าวกรอง', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.527-3.417 6.012 6.012 0 013.417-1.527 6.012 6.012 0 013.417 1.527 6.012 6.012 0 011.527 3.417 6.012 6.012 0 01-1.527 3.417 6.012 6.012 0 01-3.417 1.527 6.012 6.012 0 01-3.417-1.527 6.012 6.012 0 01-1.527-3.417z" clipRule="evenodd" /></svg> },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeWorkstation, setActiveWorkstation }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#2a2f34]/90 backdrop-blur-lg border-t border-white/10">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = activeWorkstation === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveWorkstation(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                                isActive ? 'text-[#F58220]' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'h-6 w-6' })}
                            <span className="text-xs font-medium mt-1">{item.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;