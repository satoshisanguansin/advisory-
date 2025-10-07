import React, { useState } from 'react';
import type { Workstation } from '../PolicyAdvisorPage';
import Logo from '../Logo';

interface SidebarProps {
    activeWorkstation: Workstation;
    setActiveWorkstation: (workstation: Workstation) => void;
}

type Group = 'intelligence' | 'tools';
type WorkstationInfo = { id: Workstation; title: string; group: Group; icon: React.ReactElement; };

const workstations: WorkstationInfo[] = [
    { id: 'dashboard', title: 'ห้องสถานการณ์', group: 'intelligence', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'library', title: 'ห้องสมุด', group: 'intelligence', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg> },
    { id: 'briefing', title: 'สร้างบทสรุป', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2-2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> },
    { id: 'petition', title: 'ยื่นคำร้อง', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { id: 'comms', title: 'สื่อสาร', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.356a1.76 1.76 0 013.417-.592zM11 5.882V5.882a1.76 1.76 0 012.724 1.543l-1.372 4.018a1.76 1.76 0 01-3.417-.592z" /></svg> },
    { id: 'comparison', title: 'เปรียบเทียบ', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H7zM7 9a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H7zM7 14a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H7zm5-9.5a.5.5 0 01.5.5v10a.5.5 0 01-1 0v-10a.5.5 0 01.5-.5z" clipRule="evenodd" /></svg> },
    { id: 'intel', title: 'ข่าวกรองไซเบอร์', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.527-3.417 6.012 6.012 0 013.417-1.527 6.012 6.012 0 013.417 1.527 6.012 6.012 0 011.527 3.417 6.012 6.012 0 01-1.527 3.417 6.012 6.012 0 01-3.417 1.527 6.012 6.012 0 01-3.417-1.527 6.012 6.012 0 01-1.527-3.417z" clipRule="evenodd" /></svg> },
    { id: 'forensic', title: 'วิเคราะห์งบประมาณ', group: 'tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H5zM5 11a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zM7 7a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H7zM9 11a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3-4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1h-1zM9 7a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H9zm3 4a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm3-4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1h-1z" clipRule="evenodd" /></svg> },
];

const GroupHeader: React.FC<{ title: string; id: string; isOpen: boolean; onToggle: () => void; }> = ({ title, id, isOpen, onToggle }) => (
    <button id={id} onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-zinc-700/50 rounded-lg">
        <span>{title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
);

const NavItem: React.FC<{ info: WorkstationInfo; isActive: boolean; onClick: () => void; }> = ({ info, isActive, onClick }) => (
    <li>
        <button
            id={`nav-${info.id}`}
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-colors duration-150
            ${isActive
                ? 'bg-[#F58220] text-white shadow-md'
                : 'text-gray-300 hover:bg-zinc-700/50 hover:text-white'
            }`}
        >
            {React.cloneElement(info.icon as React.ReactElement<any>, { className: 'h-5 w-5 flex-shrink-0' })}
            <span className="flex-1 truncate">{info.title}</span>
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeWorkstation, setActiveWorkstation }) => {
    const [openGroups, setOpenGroups] = useState<Record<Group, boolean>>({ intelligence: true, tools: true });

    const toggleGroup = (group: Group) => {
        setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    return (
        <aside id="sidebar-main" className="relative w-64 lg:w-72 h-screen bg-[#2a2f34] border-r border-white/10 flex-shrink-0 flex flex-col">
            <div className="flex items-center justify-center h-16 border-b border-white/10 flex-shrink-0">
                <Logo showText={false} className="h-9 w-9" />
                <span className="text-xl font-bold text-white tracking-wider ml-3">Workstation</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <GroupHeader id="sidebar-group-intelligence" title="ข่าวกรอง" isOpen={openGroups.intelligence} onToggle={() => toggleGroup('intelligence')} />
                    {openGroups.intelligence && (
                        <ul className="mt-2 space-y-1">
                            {workstations.filter(w => w.group === 'intelligence').map(w => (
                                <NavItem key={w.id} info={w} isActive={activeWorkstation === w.id} onClick={() => setActiveWorkstation(w.id)} />
                            ))}
                        </ul>
                    )}
                </div>
                 <div>
                    <GroupHeader id="sidebar-group-tools" title="เครื่องมือ" isOpen={openGroups.tools} onToggle={() => toggleGroup('tools')} />
                     {openGroups.tools && (
                        <ul className="mt-2 space-y-1">
                            {workstations.filter(w => w.group === 'tools').map(w => (
                                <NavItem key={w.id} info={w} isActive={activeWorkstation === w.id} onClick={() => setActiveWorkstation(w.id)} />
                            ))}
                        </ul>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;