
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveFeedback } from '../../services/firebaseService';
import type { Feedback } from '../../types';
import LoadingSpinner from '../icons/LoadingSpinner';

interface FeedbackControlProps {
  reportTopic: string;
  sectionTitle: string;
  contextData: any;
}

const FeedbackControl: React.FC<FeedbackControlProps> = ({ reportTopic, sectionTitle, contextData }) => {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState<'good' | 'bad' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (rating: 'good' | 'bad') => {
    setSelectedRating(rating);
    // Submit immediately on click.
    setIsSubmitting(true);

    const feedback: Feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: user?.id,
      rating: rating,
      comment: comment || undefined,
      context: {
        reportTopic,
        sectionTitle,
        content: contextData,
      },
    };

    try {
      await saveFeedback(feedback);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to save feedback", error);
      // Optionally show an error state
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>ขอบคุณสำหรับความคิดเห็น!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-400">เนื้อหานี้มีประโยชน์หรือไม่?</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleSubmit('good')}
          disabled={isSubmitting}
          className={`p-1.5 rounded-full transition-colors ${selectedRating === 'good' ? 'bg-green-500/30' : 'hover:bg-zinc-700'}`}
          aria-label="Good response"
        >
          {isSubmitting && selectedRating === 'good' ? <LoadingSpinner className="w-4 h-4 text-green-400" /> :
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.226l-1.396-4.188A1 1 0 0012.382 11H9V6.5a1.5 1.5 0 00-3 0v3.833z" />
          </svg>}
        </button>
        <button
          onClick={() => handleSubmit('bad')}
          disabled={isSubmitting}
          className={`p-1.5 rounded-full transition-colors ${selectedRating === 'bad' ? 'bg-red-500/30' : 'hover:bg-zinc-700'}`}
          aria-label="Bad response"
        >
          {isSubmitting && selectedRating === 'bad' ? <LoadingSpinner className="w-4 h-4 text-red-400" /> :
          <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.242a1 1 0 00-.97 1.226l1.396 4.188A1 1 0 007.618 9H11v4.5a1.5 1.5 0 003 0V9.667z" />
          </svg>}
        </button>
      </div>
    </div>
  );
};

export default FeedbackControl;
