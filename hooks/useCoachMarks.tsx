import React, { useState, useCallback, useEffect } from 'react';
import CoachMark from '../components/shared/CoachMark';

interface CoachMarkInfo {
    elementId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const COACH_MARKS_KEY = 'coachMarksShown_v1';

const useCoachMarks = (marks: CoachMarkInfo[]) => {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [positions, setPositions] = useState<DOMRect[]>([]);

    const isCoachMarksActive = currentIndex !== -1;

    const updatePositions = useCallback(() => {
        const newPositions = marks.map(mark => {
            const element = document.getElementById(mark.elementId);
            return element ? element.getBoundingClientRect() : new DOMRect();
        });
        setPositions(newPositions);
    }, [marks]);
    
    const startCoachMarks = useCallback(() => {
        const alreadyShown = localStorage.getItem(COACH_MARKS_KEY);
        if (!alreadyShown) {
            updatePositions();
            setCurrentIndex(0);
        }
    }, [updatePositions]);

    const dismissCoachMarks = useCallback(() => {
        setCurrentIndex(-1);
        localStorage.setItem(COACH_MARKS_KEY, 'true');
    }, []);

    const handleNext = () => {
        if (currentIndex < marks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            dismissCoachMarks();
        }
    };

    useEffect(() => {
        if (isCoachMarksActive) {
            window.addEventListener('resize', updatePositions);
            window.addEventListener('scroll', updatePositions);
        }
        return () => {
            window.removeEventListener('resize', updatePositions);
            window.removeEventListener('scroll', updatePositions);
        };
    }, [isCoachMarksActive, updatePositions]);

    const coachMarkComponents = marks.map((mark, index) => (
        <CoachMark
            key={mark.elementId}
            targetRect={positions[index]}
            title={mark.title}
            content={mark.content}
            isActive={index === currentIndex}
            isLast={index === marks.length - 1}
            onNext={handleNext}
            onDismiss={dismissCoachMarks}
        />
    ));

    return {
        coachMarks: coachMarkComponents,
        isCoachMarksActive,
        startCoachMarks,
        dismissCoachMarks,
    };
};

export default useCoachMarks;
