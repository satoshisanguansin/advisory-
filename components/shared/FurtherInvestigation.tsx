import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, UserContribution, IntelligenceBriefingReport } from '../../types';
import { streamInvestigation } from '../../services/geminiService';
import LoadingSpinner from '../icons/LoadingSpinner';
import type { Content } from '@google/genai';
import ScheduleEventModal from './ScheduleEventModal';

interface FurtherInvestigationProps {
  sectionContext: any;
  sectionTitle: string;
  onNewContribution: (contribution: Omit<UserContribution, 'id' | 'timestamp' | 'authorId' | 'authorName'>) => void;
  report?: IntelligenceBriefingReport | null;
}

const FurtherInvestigation: React.FC<FurtherInvestigationProps> = ({ sectionContext, sectionTitle, onNewContribution, report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedMessages, setAddedMessages] = useState(new Set<string>());
  const [isScheduling, setIsScheduling] = useState(false);
  const [textToSchedule, setTextToSchedule] = useState('');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    // Automatically trigger the initial investigation when the component is opened.
    if (isOpen && chatHistory.length === 0) {
      handleInitialInvestigation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleStream = async (currentHistory: ChatMessage[]) => {
    setIsGenerating(true);
    setError(null);

    const geminiContents: Content[] = currentHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    try {
        let fullResponse = '';
        const stream = streamInvestigation(geminiContents);

        for await (const chunk of stream) {
            fullResponse += chunk;
            setChatHistory([...currentHistory, { role: 'model', content: fullResponse }]);
        }
        return fullResponse;
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An error occurred during the investigation.';
        setError(errorMessage);
        setChatHistory([...currentHistory, { role: 'model', content: `Error: ${errorMessage}` }]);
        return null;
    } finally {
        setIsGenerating(false);
    }
  };

  const handleInitialInvestigation = async () => {
    const initialUserContent = `นี่คือบริบทสำหรับหัวข้อ "${sectionTitle}". กรุณาวิเคราะห์เชิงลึกตามคำสั่งของคุณโดยอัตโนมัติ\n\n\`\`\`json\n${JSON.stringify(sectionContext, null, 2)}\n\`\`\``;
    const initialUserMessage: ChatMessage = { role: 'user', content: initialUserContent, hidden: true };
    const placeholderModelMessage: ChatMessage = { role: 'model', content: '' };

    const initialHistory = [initialUserMessage, placeholderModelMessage];
    setChatHistory(initialHistory);

    const fullResponse = await handleStream([initialUserMessage]);
    if (fullResponse && onNewContribution) {
        onNewContribution({
            sectionId: sectionTitle,
            type: 'AI Deep Dive',
            content: fullResponse,
            userQuestion: `การวิเคราะห์เบื้องต้นสำหรับ: ${sectionTitle}`
        });
    }
  };


  const handleFollowUp = async () => {
    if (!question.trim() || isGenerating) return;
    
    const userMessage: ChatMessage = { role: 'user', content: question };
    const historyWithUserMessage = [...chatHistory, userMessage];
    setChatHistory([...historyWithUserMessage, { role: 'model', content: '' }]);
    setQuestion('');

    await handleStream(historyWithUserMessage);
};

 const handleAddFinding = (modelMessage: ChatMessage) => {
    if (!onNewContribution) return;
    // Find the user message that prompted this model response.
    const modelMessageIndex = chatHistory.findIndex(m => m === modelMessage);
    let userQuestion = `การติดตามผลในหัวข้อ: ${sectionTitle}`; // Default question
    if (modelMessageIndex > 0) {
        // Look backwards from the model message for the last user message
        for (let i = modelMessageIndex - 1; i >= 0; i--) {
            if (chatHistory[i].role === 'user') {
                // Use the 'hidden' flag to ignore the initial context prompt
                if (!chatHistory[i].hidden) {
                    userQuestion = chatHistory[i].content;
                }
                break;
            }
        }
    }

    onNewContribution({
        sectionId: sectionTitle,
        type: 'AI Deep Dive',
        content: modelMessage.content,
        userQuestion: userQuestion,
    });
    setAddedMessages(prev => new Set(prev).add(modelMessage.content));
};

  const handleOpenScheduler = (text: string) => {
      setTextToSchedule(text);
      setIsScheduling(true);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedMessage(text);
        setTimeout(() => {
            setCopiedMessage(null);
        }, 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };
  const handleReset = () => {
    setIsOpen(false);
    setQuestion('');
    setChatHistory([]);
    setError(null);
    setIsGenerating(false);
    setIsScheduling(false);
    setTextToSchedule('');
    setCopiedMessage(null);
  }

  if (!isOpen) {
    return (
      <div className="mt-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <span>สืบค้นเพิ่มเติม</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-black/30 rounded-lg border border-zinc-700/70">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-bold text-cyan-300 text-sm">สืบค้นเพิ่มเติม: {sectionTitle}</h5>
        <button onClick={handleReset} className="text-gray-500 hover:text-white" aria-label="Close Investigation">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

       <div ref={chatContainerRef} className="max-h-80 overflow-y-auto space-y-4 pr-2 mb-3 border-b border-zinc-800 pb-3">
            {chatHistory.filter(m => !m.hidden).map((msg, index) => {
              const isAdded = addedMessages.has(msg.content);
              const isCopied = copiedMessage === msg.content;
              const isLastMessage = index === chatHistory.filter(m => !m.hidden).length - 1;
              const showActions = msg.role === 'model' && msg.content && (!isGenerating || !isLastMessage);
              
              return (
                <div key={index}>
                    <div className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold">AI</span>}
                        <div className={`flex flex-col w-full max-w-prose leading-1.5 p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                            <div className="text-sm font-normal text-white whitespace-pre-wrap font-sans">
                                {isGenerating && isLastMessage ? (
                                    <>
                                        {msg.content}
                                        <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse ml-1" />
                                    </>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                         {msg.role === 'user' && <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold">คุณ</span>}
                    </div>
                     {showActions && (
                        <div className="flex items-center justify-start mt-1.5 ml-10 space-x-2">
                           {onNewContribution && <button
                                onClick={() => handleAddFinding(msg)}
                                disabled={isAdded}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                                    isAdded 
                                    ? 'bg-green-500/20 text-green-400 cursor-default' 
                                    : 'bg-zinc-700/50 text-gray-300 hover:bg-zinc-700'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {isAdded ? 'เพิ่มแล้ว' : 'เพิ่มในรายงาน'}
                            </button>}
                            <button
                                onClick={() => handleOpenScheduler(msg.content)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors bg-zinc-700/50 text-gray-300 hover:bg-zinc-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>บันทึกลงปฏิทิน</span>
                            </button>
                            <button
                                onClick={() => handleCopyToClipboard(msg.content)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors bg-zinc-700/50 text-gray-300 hover:bg-zinc-700"
                            >
                                {isCopied ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                    </svg>
                                )}
                                <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                            </button>
                        </div>
                    )}
                </div>
            )})}
             {isGenerating && chatHistory.length <= 1 && (
                <div className="flex justify-center items-center p-4">
                    <LoadingSpinner className="w-6 h-6" />
                    <span className="ml-3 text-gray-400">กำลังทำการวิเคราะห์เบื้องต้น...</span>
                </div>
             )}
        </div>


      <div className="flex items-center gap-2">
        <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFollowUp(); } }}
            placeholder="ถามคำถามต่อเนื่อง หรือแสดงความคิดเห็นในรายละเอียด..."
            className="w-full bg-[#212529] border border-gray-600 rounded-lg p-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow resize-none"
            rows={1}
            disabled={isGenerating}
        />
        <button aria-label="Send follow-up" onClick={handleFollowUp} disabled={isGenerating || !question.trim()} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
            </svg>
        </button>
      </div>
      {error && <p className="text-red-400 font-semibold text-sm mt-2">{error}</p>}

      <ScheduleEventModal
          isOpen={isScheduling}
          onClose={() => setIsScheduling(false)}
          textToParse={textToSchedule}
          reportTopic={report?.topic || sectionTitle}
      />
    </div>
  );
};

export default FurtherInvestigation;
