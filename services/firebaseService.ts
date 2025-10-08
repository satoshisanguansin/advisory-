import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { db as firestoreDb } from './firebaseConfig';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    onSnapshot,
    updateDoc,
    arrayUnion,
} from 'firebase/firestore';
import type { IntelligenceBriefingReport, PollData, Stance, IntelReport, Feedback, DiscussionComment, UserContribution } from '../types';

// --- STORE NAMES ---
const DB_NAME = 'peoples-party-db';
const DB_VERSION = 4;
const REPORTS_STORE = 'reports';
const DOSSIERS_STORE = 'dossiers';
const POLLS_STORE = 'polls';
const FEEDBACK_STORE = 'feedback';

const useFirestore = !!firestoreDb;

// --- LOCAL LISTENER IMPLEMENTATION (for IDB fallback) ---
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

// --- INDEXEDDB (IDB) IMPLEMENTATION ---
interface PeoplesPartyDB extends DBSchema {
  [REPORTS_STORE]: { key: string; value: IntelligenceBriefingReport; };
  [DOSSIERS_STORE]: { key: string; value: IntelReport; };
  [POLLS_STORE]: { key: string; value: PollData; };
  [FEEDBACK_STORE]: { key: string; value: Feedback; };
}
let idbPromise: Promise<IDBPDatabase<PeoplesPartyDB>>;
const getIdb = (): Promise<IDBPDatabase<PeoplesPartyDB>> => {
    if (!idbPromise) {
        idbPromise = openDB<PeoplesPartyDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(REPORTS_STORE)) db.createObjectStore(REPORTS_STORE, { keyPath: 'id' });
                if (!db.objectStoreNames.contains(DOSSIERS_STORE)) db.createObjectStore(DOSSIERS_STORE, { keyPath: 'id' });
                if (!db.objectStoreNames.contains(POLLS_STORE)) db.createObjectStore(POLLS_STORE, { keyPath: 'id' });
                if (!db.objectStoreNames.contains(FEEDBACK_STORE)) db.createObjectStore(FEEDBACK_STORE, { keyPath: 'id' });
            },
        });
    }
    return idbPromise;
};

// --- HYBRID SERVICE FUNCTIONS ---

export const getReport = async (reportId: string): Promise<IntelligenceBriefingReport | null> => {
    if (useFirestore) {
        const docRef = doc(firestoreDb, REPORTS_STORE, reportId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as IntelligenceBriefingReport) : null;
    } else {
        const db = await getIdb();
        return await db.get(REPORTS_STORE, reportId) || null;
    }
};

export const getAllReports = async (): Promise<IntelligenceBriefingReport[]> => {
    if (useFirestore) {
        const querySnapshot = await getDocs(collection(firestoreDb, REPORTS_STORE));
        return querySnapshot.docs.map(doc => doc.data() as IntelligenceBriefingReport);
    } else {
        const db = await getIdb();
        return db.getAll(REPORTS_STORE);
    }
};

export const saveReport = async (report: IntelligenceBriefingReport): Promise<void> => {
    if (!report.id) throw new Error("Report must have an ID to be saved.");
    if (useFirestore) {
        await setDoc(doc(firestoreDb, REPORTS_STORE, report.id), report, { merge: true });
    } else {
        const db = await getIdb();
        await db.put(REPORTS_STORE, report);
    }
    notifyReportListeners(report.id, report); // Always notify local listeners for immediate UI update
};

export const listenToReport = (reportId: string, onUpdate: ReportListener): () => void => {
    if (useFirestore) {
        return onSnapshot(doc(firestoreDb, REPORTS_STORE, reportId), (docSnap) => {
            onUpdate(docSnap.exists() ? (docSnap.data() as IntelligenceBriefingReport) : null);
        }, (error) => {
            console.error(`Firebase listener error for report ${reportId}:`, error);
            onUpdate(null);
        });
    } else {
        if (!reportListeners.has(reportId)) reportListeners.set(reportId, new Set());
        reportListeners.get(reportId)!.add(onUpdate);
        getReport(reportId).then(onUpdate); // Initial fetch
        return () => reportListeners.get(reportId)?.delete(onUpdate);
    }
};

export const getPoll = async (pollId: string): Promise<PollData | null> => {
    if (useFirestore) {
        const docSnap = await getDoc(doc(firestoreDb, POLLS_STORE, pollId));
        return docSnap.exists() ? (docSnap.data() as PollData) : null;
    } else {
        const db = await getIdb();
        return await db.get(POLLS_STORE, pollId) || null;
    }
};

export const savePoll = async (poll: PollData): Promise<void> => {
    if (useFirestore) {
        await setDoc(doc(firestoreDb, POLLS_STORE, poll.id), poll);
    } else {
        const db = await getIdb();
        await db.put(POLLS_STORE, poll);
    }
    notifyPollListeners(poll.id, poll); // Notify local
};

export const listenToPoll = (pollId: string, onUpdate: PollListener): () => void => {
    if (useFirestore) {
        return onSnapshot(doc(firestoreDb, POLLS_STORE, pollId), async (docSnap) => {
            if (docSnap.exists()) {
                onUpdate(docSnap.data() as PollData);
            } else {
                const newPoll = { id: pollId, votes: {} };
                await savePoll(newPoll); // This will also trigger the listener again
            }
        });
    } else {
        if (!pollListeners.has(pollId)) pollListeners.set(pollId, new Set());
        pollListeners.get(pollId)!.add(onUpdate);
        getPoll(pollId).then(data => {
            if (data) onUpdate(data);
            else savePoll({ id: pollId, votes: {} });
        });
        return () => pollListeners.get(pollId)?.delete(onUpdate);
    }
};

export const castVote = async (pollId: string, userId: string, stance: Stance): Promise<void> => {
    if (useFirestore) {
        await updateDoc(doc(firestoreDb, POLLS_STORE, pollId), { [`votes.${userId}`]: stance });
    } else {
        const db = await getIdb();
        const poll = await db.get(POLLS_STORE, pollId) || { id: pollId, votes: {} };
        poll.votes[userId] = stance;
        await savePoll(poll);
    }
};

const updateReportArray = async (reportId: string, field: 'userContributions' | 'discussion', item: any) => {
    if (useFirestore) {
        await updateDoc(doc(firestoreDb, REPORTS_STORE, reportId), { [field]: arrayUnion(item) });
    } else {
        const db = await getIdb();
        const report = await db.get(REPORTS_STORE, reportId);
        if (!report) throw new Error('Report not found');
        report[field] = [...(report[field] || []), item];
        await saveReport(report);
    }
    const updatedReport = await getReport(reportId);
    if(updatedReport) notifyReportListeners(reportId, updatedReport);
    return updatedReport;
};

export const addUserContribution = async (reportId: string, contribution: Omit<UserContribution, 'id' | 'timestamp'>) => {
    const newContribution: UserContribution = { ...contribution, id: `contrib_${Date.now()}`, timestamp: new Date().toISOString() };
    return updateReportArray(reportId, 'userContributions', newContribution);
};

export const addCommentToReport = async (reportId: string, comment: DiscussionComment) => {
    return updateReportArray(reportId, 'discussion', comment);
};


// --- Other services (dossier, feedback etc.) would follow the same hybrid pattern ---
export const saveDossier = async (dossier: IntelReport): Promise<void> => {
    if (useFirestore && dossier.id) await setDoc(doc(firestoreDb, DOSSIERS_STORE, dossier.id), dossier, { merge: true });
    else { const db = await getIdb(); await db.put(DOSSIERS_STORE, dossier); }
};
export const getDossier = async (dossierId: string): Promise<IntelReport | null> => {
    if (useFirestore) { const snap = await getDoc(doc(firestoreDb, DOSSIERS_STORE, dossierId)); return snap.exists() ? snap.data() as IntelReport : null; }
    else { const db = await getIdb(); return await db.get(DOSSIERS_STORE, dossierId) || null; }
};
export const saveFeedback = async (feedback: Feedback): Promise<void> => {
    if (useFirestore) await setDoc(doc(firestoreDb, FEEDBACK_STORE, feedback.id), feedback);
    else { const db = await getIdb(); await db.put(FEEDBACK_STORE, feedback); }
};
export const addCommentToDossier = async (dossierId: string, comment: DiscussionComment): Promise<IntelReport> => {
    if (useFirestore) { await updateDoc(doc(firestoreDb, DOSSIERS_STORE, dossierId), { discussion: arrayUnion(comment) }); }
    else { const db = await getIdb(); const dossier = await db.get(DOSSIERS_STORE, dossierId); if(dossier) { dossier.discussion = [...(dossier.discussion || []), comment]; await saveDossier(dossier); } }
    const updated = await getDossier(dossierId);
    if (!updated) throw new Error("Dossier not found after update");
    return updated;
};