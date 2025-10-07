import React, { useState, useEffect, useRef } from 'react';

interface Section {
  id: string;
  title: string;
}

interface ReportTOCProps {
  sections: Section[];
}

const ReportTOC: React.FC<ReportTOCProps> = ({ sections }) => {
    const [activeSection, setActiveSection] = useState<string>('');
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // More performant than onScroll listener
        observer.current = new IntersectionObserver((entries) => {
            const intersectingEntries = entries.filter(e => e.isIntersecting);
            if (intersectingEntries.length > 0) {
                 // Prioritize the entry that is most visible or the first one in the viewport
                 const topEntry = intersectingEntries.reduce((prev, current) => {
                    return (prev.boundingClientRect.top < current.boundingClientRect.top) ? prev : current;
                 });
                 setActiveSection(topEntry.target.id);
            }
        }, { 
            rootMargin: '0px 0px -80% 0px', // Trigger when element's top enters top 20% of viewport
            threshold: 0 
        });

        const elements = sections.map(sec => document.getElementById(sec.id)).filter((el): el is HTMLElement => el !== null);
        elements.forEach(el => observer.current?.observe(el));

        return () => {
            elements.forEach(el => observer.current?.unobserve(el));
        };
    }, [sections]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Manually set for instant feedback before observer catches up
            setActiveSection(id);
        }
    };
    
    return (
        <aside className="hidden xl:block w-56 flex-shrink-0">
            <nav className="sticky top-24">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">On this page</h4>
                <ul className="space-y-2">
                    {sections.map(section => (
                        <li key={section.id}>
                            <a 
                                href={`#${section.id}`} 
                                onClick={(e) => handleLinkClick(e, section.id)}
                                className={`block text-sm font-medium transition-colors duration-200 border-l-2 py-1 px-3 ${
                                    activeSection === section.id 
                                    ? 'text-orange-400 border-orange-400' 
                                    : 'text-gray-400 hover:text-white border-transparent hover:border-gray-500'
                                }`}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default ReportTOC;
