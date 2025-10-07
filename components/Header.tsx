import React from 'react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './icons/LoadingSpinner';

interface HeaderProps {
    onShowCoachMarks: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowCoachMarks }) => {
    const { user, signOut } = useAuth();
    
    return (
        <header className="sticky top-0 z-40 bg-[#212529]/80 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Logo className="h-9 w-9" />
                        <h1 className="text-xl font-semibold text-white tracking-wider hidden sm:block">
                            พรรคประชาชน <span className="text-[#F58220]">AI</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={onShowCoachMarks} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="แสดงคำแนะนำ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        {user && (
                            <>
                                <div className="hidden sm:flex items-center space-x-3 pl-2">
                                    <img src={user.imageUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-300">{user.name}</span>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-600/50 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    ออกจากระบบ
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
