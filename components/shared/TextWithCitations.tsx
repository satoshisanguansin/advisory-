import React from 'react';
import type { WebSource } from '../../types';

interface TextWithCitationsProps {
  text: string | undefined | null;
  sources: WebSource[];
  className?: string;
}

const TextWithCitations: React.FC<TextWithCitationsProps> = ({ text, sources, className = "text-base leading-relaxed text-gray-300" }) => {
  if (!text) return null;

  // Regex to split the text by citation markers like [1], [12], etc.
  const parts = text.split(/(\[\d+\])/g);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        const match = part.match(/\[(\d+)\]/);
        if (match) {
          const numberStr = match[1];
          const sourceIndex = parseInt(numberStr, 10) - 1;
          if (sources && sources[sourceIndex]) {
            const source = sources[sourceIndex];
            return (
              <sup key={index} className="mx-0.5 font-bold">
                <a 
                  href={`#source-${sourceIndex + 1}`} 
                  title={source.title}
                  className="text-orange-400 hover:text-orange-300 hover:underline"
                  aria-label={`Reference ${numberStr}: ${source.title}`}
                >
                  [{numberStr}]
                </a>
              </sup>
            );
          }
        }
        // Return the text part, which could be an empty string from the split
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </div>
  );
};

export default TextWithCitations;
