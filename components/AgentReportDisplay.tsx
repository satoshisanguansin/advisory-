
import React from 'react';
import type { LegislativeResearchReport, WebSource } from '../types';

const SourcesList: React.FC<{ sources: WebSource[] }> = ({ sources }) => (
    <div>
        <h4 className="font-semibold text-gray-100 mb-2">Cited Sources</h4>
        <ul className="space-y-3">
            {sources.map((source, index) => (
                <li key={index} className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                    <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#F58220]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div>
                            <p className="font-semibold text-white group-hover:text-orange-300 truncate" title={source.title}>
                                {source.title || 'Untitled Source'}
                            </p>
                            <p className="text-sm text-gray-400 truncate" title={source.uri}>{source.uri}</p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const AgentReportDisplay: React.FC<{ report: LegislativeResearchReport }> = ({ report }) => {
  return (
    <div className="bg-[#2a2f34] rounded-xl shadow-lg overflow-hidden border border-zinc-700">
        <div className="p-4 sm:p-6 border-b border-zinc-700/50">
            <h3 className="text-lg font-bold text-[#F58220] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm11.707 3.707a1 1 0 00-1.414-1.414L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293z" clipRule="evenodd" />
                </svg>
                Phase 1: Legislative Research Agent Report
            </h3>
            <p className="text-sm text-gray-400 mt-1">This section contains the factual summary and sources gathered by the initial AI research agent. This data forms the foundation for the strategic analysis in the main report.</p>
        </div>
        <div className="p-4 sm:p-6 space-y-6 bg-black/10">
            <div>
                <h4 className="font-semibold text-gray-100 mb-2">Factual Summary</h4>
                <p className="text-base leading-relaxed text-gray-300 whitespace-pre-wrap">{report.summary}</p>
            </div>
             {report.sources && report.sources.length > 0 && (
                <div className="pt-4 border-t border-zinc-700/50">
                    <SourcesList sources={report.sources} />
                </div>
            )}
        </div>
    </div>
  );
};

export default AgentReportDisplay;