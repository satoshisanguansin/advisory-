import React, { useState } from 'react';
import type { IntelligenceBriefingReport, UserContribution } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../icons/LoadingSpinner';

interface UserContributionsProps {
    report: IntelligenceBriefingReport;
    onNewContribution: (contribution: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void;
}

const UserContributions: React.FC<UserContributionsProps> = ({ report, onNewContribution }) => {
    const { user, isLoggedIn, signIn } = useAuth();
    const [content, setContent] = useState('');
    const [type, setType] = useState<'Finding' | 'Critique' | 'Suggestion'>('Finding');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sectionId, setSectionId] = useState('General');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !isLoggedIn) return;

        setIsSubmitting(true);
        try {
            onNewContribution({
                sectionId,
                type,
                content,
            });
            setContent('');
            setSectionId('General');
        } catch (error) {
            console.error("Failed to submit contribution", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#2a2f34] rounded-xl shadow-lg p-4 sm:p-6 border border-zinc-700/50">
            <h3 className="text-lg font-bold text-[#F58220] mb-4">บันทึกการทำงานร่วมกัน</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
                {(report.userContributions || []).length > 0 ? (
                    [...(report.userContributions || [])].reverse().map(c => (
                        <div key={c.id} className="p-4 bg-zinc-800 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.type === 'AI Deep Dive' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{c.type}</span>
                                    <p className="text-sm text-gray-400 mt-1">Section: <strong>{c.sectionId}</strong></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-white">{c.authorName}</p>
                                    <p className="text-xs text-gray-500">{new Date(c.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            {c.userQuestion && <p className="text-sm text-gray-400 mt-2 italic">คำถาม: "{c.userQuestion}"</p>}
                            <p className="text-sm text-gray-200 mt-2 whitespace-pre-wrap">{c.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">ยังไม่มีการบันทึกการทำงาน</p>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-700/50">
                {isLoggedIn ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="เพิ่มข้อค้นพบ, คำวิจารณ์, หรือข้อเสนอแนะ..."
                            rows={3}
                            className="w-full bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                         <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <LoadingSpinner className="w-5 h-5"/> : 'ส่งบันทึก'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-400 mb-3 text-sm">กรุณาเข้าสู่ระบบเพื่อเพิ่มบันทึก</p>
                        <button onClick={signIn} className="px-4 py-2 bg-[#F58220] hover:bg-orange-500 text-white font-bold rounded-lg">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserContributions;
