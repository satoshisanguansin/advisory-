import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as firebaseService from '../services/firebaseService';
import type { Stance, PollData, StanceOption } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';

const stanceOptions: StanceOption[] = [
    { id: 'strong-support', label: 'สนับสนุนอย่างยิ่ง', color: 'bg-green-600', icon: <>✅</> },
    { id: 'support', label: 'สนับสนุน', color: 'bg-green-500', icon: <>👍</> },
    { id: 'neutral', label: 'เป็นกลาง', color: 'bg-gray-500', icon: <>🤔</> },
    { id: 'oppose', label: 'คัดค้าน', color: 'bg-red-500', icon: <>👎</> },
    { id: 'strong-oppose', label: 'คัดค้านอย่างยิ่ง', color: 'bg-red-600', icon: <>❌</> },
];

const StancePolling: React.FC<{ topicId: string }> = ({ topicId }) => {
    const { user, isLoggedIn, signIn } = useAuth();
    const [pollData, setPollData] = useState<PollData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const userVote = useMemo(() => pollData?.votes[user?.id || ''] || null, [pollData, user]);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = firebaseService.listenToPoll(topicId, (data) => {
            setPollData(data);
            setIsLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [topicId]);

    const handleVote = (stance: Stance) => {
        if (!isLoggedIn || !user) {
            signIn();
            return;
        }
        firebaseService.castVote(topicId, user.id, stance);
    };

    const { results, totalVotes } = useMemo(() => {
        if (!pollData) return { results: [], totalVotes: 0 };

        const votesArray = Object.values(pollData.votes);
        const total = votesArray.length;
        if (total === 0) return { results: [], totalVotes: 0 };

        const voteCounts = stanceOptions.reduce((acc, option) => {
            acc[option.id] = 0;
            return acc;
        }, {} as { [key in Stance]: number });

        votesArray.forEach(vote => {
            // FIX: Add a type guard to ensure `vote` is a valid key for `voteCounts`.
            // This is necessary because Object.values on an indexed object can return `unknown[]`.
            if (typeof vote === 'string' && vote in voteCounts) {
                voteCounts[vote as Stance]++;
            }
        });
        
        const calculatedResults = stanceOptions.map(option => ({
            ...option,
            count: voteCounts[option.id],
            percentage: total > 0 ? (voteCounts[option.id] / total) * 100 : 0,
        }));

        return { results: calculatedResults, totalVotes: total };
    }, [pollData]);


    if (isLoading) {
        return (
            <div className="bg-[#2a2f34] rounded-xl shadow-lg p-4 sm:p-6 flex items-center justify-center min-h-[150px]">
                <LoadingSpinner className="w-8 h-8 text-[#F58220]" />
            </div>
        );
    }

    return (
        <div className="bg-[#2a2f34] rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-[#F58220]">จุดยืนพรรค (Party Stance)</h3>
                <span className="text-sm font-semibold text-gray-400">{totalVotes} votes</span>
            </div>

            {totalVotes > 0 && (
                <div className="w-full bg-zinc-700 rounded-full h-6 flex overflow-hidden mb-4">
                    {results.filter(r => r.percentage > 0).map(result => (
                        <div
                            key={result.id}
                            className={`${result.color} h-6 flex items-center justify-center text-xs font-bold text-white transition-all duration-300`}
                            style={{ width: `${result.percentage}%` }}
                            title={`${result.label}: ${result.count} votes (${result.percentage.toFixed(1)}%)`}
                        >
                           {result.percentage > 10 ? `${result.percentage.toFixed(0)}%` : ''}
                        </div>
                    ))}
                </div>
            )}
            
            {!isLoggedIn ? (
                <div className="text-center bg-zinc-800/50 p-4 rounded-lg">
                    <p className="text-gray-300 mb-3">กรุณาเข้าสู่ระบบเพื่อลงคะแนนและดูรายละเอียดจุดยืนของพรรค</p>
                    <button onClick={signIn} className="px-4 py-2 bg-[#F58220] hover:bg-orange-500 text-white font-bold rounded-lg transition-colors">
                        เข้าสู่ระบบ
                    </button>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-3">
                    {stanceOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 border-2
                                ${userVote === option.id 
                                    ? 'border-orange-400 bg-orange-500/20 shadow-lg' 
                                    : 'border-transparent bg-zinc-800 hover:bg-zinc-700'}`
                                }
                        >
                            <span className="text-2xl mb-1">{option.icon}</span>
                            <span className="text-sm font-semibold text-white">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StancePolling;