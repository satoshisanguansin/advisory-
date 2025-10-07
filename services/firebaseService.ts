import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { IntelligenceBriefingReport, PollData, Stance, IntelReport, Feedback, DiscussionComment, UserContribution } from '../types';

const DB_NAME = 'peoples-party-db';
const DB_VERSION = 4; // Incremented version for schema change
const REPORTS_STORE = 'reports';
const DOSSIERS_STORE = 'dossiers';
const POLLS_STORE = 'polls';
const FEEDBACK_STORE = 'feedback';

interface PeoplesPartyDB extends DBSchema {
  [REPORTS_STORE]: {
    key: string;
    value: IntelligenceBriefingReport;
  };
  [DOSSIERS_STORE]: {
    key: string;
    value: IntelReport;
  };
  [POLLS_STORE]: {
    key: string;
    value: PollData;
  };
  [FEEDBACK_STORE]: {
    key: string;
    value: Feedback;
  }
}

let dbPromise: Promise<IDBPDatabase<PeoplesPartyDB>>;

const getDb = (): Promise<IDBPDatabase<PeoplesPartyDB>> => {
    if (!dbPromise) {
        dbPromise = openDB<PeoplesPartyDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (!db.objectStoreNames.contains(REPORTS_STORE)) {
                    db.createObjectStore(REPORTS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(DOSSIERS_STORE)) {
                    db.createObjectStore(DOSSIERS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(POLLS_STORE)) {
                    db.createObjectStore(POLLS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(FEEDBACK_STORE)) {
                    db.createObjectStore(FEEDBACK_STORE, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

// --- Listener implementation for real-time UI updates on the same client ---
type PollListener = (data: PollData) => void;
const pollListeners = new Map<string, Set<PollListener>>();

const notifyPollListeners = (pollId: string, data: PollData) => {
    pollListeners.get(pollId)?.forEach(listener => listener(data));
};

type ReportListener = (data: IntelligenceBriefingReport | null) => void;
const reportListeners = new Map<string, Set<ReportListener>>();

const notifyReportListeners = (reportId: string, data: IntelligenceBriefingReport) => {
    reportListeners.get(reportId)?.forEach(listener => listener(data));
};


// --- Service Functions ---

export const getReport = async (reportId: string): Promise<IntelligenceBriefingReport | null> => {
    const db = await getDb();
    const report = await db.get(REPORTS_STORE, reportId);
    return report || null;
};

export const getAllReports = async (): Promise<IntelligenceBriefingReport[]> => {
    const db = await getDb();
    return db.getAll(REPORTS_STORE);
};

export const saveReport = async (report: IntelligenceBriefingReport): Promise<void> => {
    const db = await getDb();
    await db.put(REPORTS_STORE, report);
    if(report.id) notifyReportListeners(report.id, report);
};

export const listenToReport = (reportId: string, onUpdate: ReportListener): () => void => {
    if (!reportListeners.has(reportId)) {
        reportListeners.set(reportId, new Set());
    }
    reportListeners.get(reportId)!.add(onUpdate);

    getReport(reportId).then(reportData => {
        onUpdate(reportData);
    });

    return () => {
        const listeners = reportListeners.get(reportId);
        if (listeners) {
            listeners.delete(onUpdate);
            if (listeners.size === 0) {
                reportListeners.delete(reportId);
            }
        }
    };
};

export const addUserContribution = async (reportId: string, contribution: Omit<UserContribution, 'id' | 'timestamp'>): Promise<IntelligenceBriefingReport> => {
    const db = await getDb();
    const report = await db.get(REPORTS_STORE, reportId);
    if (!report) throw new Error('Report not found');
    
    const newContribution: UserContribution = { 
        ...contribution, 
        id: `contrib_${Date.now()}`, 
        timestamp: new Date().toISOString() 
    };
    
    report.userContributions = [...(report.userContributions || []), newContribution];
    await saveReport(report);
    return report;
};

export const getDossier = async (dossierId: string): Promise<IntelReport | null> => {
    const db = await getDb();
    const dossier = await db.get(DOSSIERS_STORE, dossierId);
    return dossier || null;
};

export const saveDossier = async (dossier: IntelReport): Promise<void> => {
    const db = await getDb();
    await db.put(DOSSIERS_STORE, dossier);
};

export const getPoll = async (pollId: string): Promise<PollData | null> => {
    const db = await getDb();
    const poll = await db.get(POLLS_STORE, pollId);
    return poll || null;
}

export const savePoll = async (poll: PollData): Promise<void> => {
    const db = await getDb();
    await db.put(POLLS_STORE, poll);
    notifyPollListeners(poll.id, poll);
};

export const listenToPoll = (pollId: string, onUpdate: PollListener): () => void => {
    if (!pollListeners.has(pollId)) {
        pollListeners.set(pollId, new Set());
    }
    pollListeners.get(pollId)!.add(onUpdate);

    getPoll(pollId).then(pollData => {
        if (pollData) {
            onUpdate(pollData);
        } else {
            const newPollData: PollData = { id: pollId, votes: {} };
            savePoll(newPollData).then(() => onUpdate(newPollData));
        }
    });

    return () => {
        const listeners = pollListeners.get(pollId);
        if (listeners) {
            listeners.delete(onUpdate);
            if (listeners.size === 0) {
                pollListeners.delete(pollId);
            }
        }
    };
};

export const castVote = async (pollId: string, userId: string, stance: Stance): Promise<void> => {
    const db = await getDb();
    const poll = await db.get(POLLS_STORE, pollId) || { id: pollId, votes: {} };
    poll.votes[userId] = stance;
    await savePoll(poll);
};

export const saveFeedback = async (feedback: Feedback): Promise<void> => {
    const db = await getDb();
    await db.put(FEEDBACK_STORE, feedback);
};

export const addCommentToReport = async (reportId: string, comment: DiscussionComment): Promise<IntelligenceBriefingReport> => {
    const db = await getDb();
    const report = await db.get(REPORTS_STORE, reportId);
    if (!report) throw new Error('Report not found');
    
    report.discussion = [...(report.discussion || []), comment];
    await saveReport(report);
    return report;
};

export const addCommentToDossier = async (dossierId: string, comment: DiscussionComment): Promise<IntelReport> => {
    const db = await getDb();
    const dossier = await db.get(DOSSIERS_STORE, dossierId);
    if (!dossier) throw new Error('Dossier not found');

    dossier.discussion = [...(dossier.discussion || []), comment];
    await saveDossier(dossier);
    return dossier;
};