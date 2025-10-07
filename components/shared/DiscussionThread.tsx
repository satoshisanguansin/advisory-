import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { DiscussionComment } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';

interface DiscussionThreadProps {
    comments: DiscussionComment[];
    onPostComment: (content: string) => Promise<void>;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({ comments, onPostComment }) => {
    const { user, isLoggedIn, signIn } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isLoggedIn) return;

        setIsPosting(true);
        try {
            await onPostComment(newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-[#2a2f34] rounded-xl shadow-lg p-4 sm:p-6 border border-zinc-700/50">
            <h3 className="text-lg font-bold text-[#F58220] mb-4">อภิปราย (Discussion)</h3>
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
                                {comment.author.substring(0, 2)}
                            </div>
                            <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">{comment.author}</p>
                                    <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">ยังไม่มีการอภิปราย เริ่มต้นการสนทนาได้เลย</p>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-700/50">
                {isLoggedIn && user ? (
                    <form onSubmit={handleSubmit} className="flex items-start space-x-3">
                        <img src={user.imageUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="เพิ่มความคิดเห็น..."
                                rows={2}
                                className="w-full bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isPosting || !newComment.trim()}
                                className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isPosting ? <LoadingSpinner className="w-5 h-5" /> : 'ส่ง'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-400 mb-3 text-sm">กรุณาเข้าสู่ระบบเพื่อเข้าร่วมการอภิปราย</p>
                        <button onClick={signIn} className="px-4 py-2 bg-[#F58220] hover:bg-orange-500 text-white font-bold rounded-lg transition-colors">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionThread;