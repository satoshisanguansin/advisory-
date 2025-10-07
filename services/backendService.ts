

import { generateIntelligenceBriefing, generateIntelReport as geminiGenerateIntelReport } from './geminiService';
import type { IntelligenceBriefingReport, GenerationTask, IntelReport } from '../types';
import { getReport as getReportFromDb, saveReport, getDossier, saveDossier } from './firebaseService';

// This is a MOCK backend service.
// It simulates an asynchronous, server-side task queue.
// In a real application, this would be a separate server (e.g., Node.js/Express)
// with endpoints like /api/tasks/start, /api/tasks/status/{id}, etc.

const tasks = new Map<string, GenerationTask>();

function generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const getBriefingReport = async (
    topicId: string,
    topicName: string,
    onStatusUpdate?: (status: string) => void
): Promise<IntelligenceBriefingReport> => {
    // 1. Check for a cached version first
    const cachedReport = await getReportFromDb(topicId);
    if (cachedReport) {
        onStatusUpdate?.('Loaded cached report.');
        // This simple implementation assumes the cached report's language is acceptable.
        // A language change in the UI will trigger a new generation via ReportViewer.
        return cachedReport;
    }

    // 2. If not cached, generate a new one
    onStatusUpdate?.('No cached version found. Generating new report...');
    const report = await generateIntelligenceBriefing(topicName, onStatusUpdate);

    // 3. Assign ID and save to the DB
    const reportWithId = { ...report, id: topicId };
    await saveReport(reportWithId);

    return reportWithId;
};

export const startBriefingGenerationTask = async (
    topic: string
): Promise<string> => {
    const taskId = generateTaskId();
    const task: GenerationTask = {
        id: taskId,
        topic: topic,
        status: 'queued',
        statusMessage: 'Task has been queued.',
    };
    tasks.set(taskId, task);

    // Run the actual generation process in the "background" (don't await it here)
    // This immediately returns the taskId to the client.
    (async () => {
        try {
            const updateStatus = (statusMessage: string) => {
                 const currentTask = tasks.get(taskId);
                 if(currentTask) {
                    currentTask.statusMessage = statusMessage;
                    tasks.set(taskId, currentTask);
                 }
            };
            
            // Set status to running
            task.status = 'running';
            task.statusMessage = 'Task started. Initializing AI agents...';
            tasks.set(taskId, { ...task });

            const report = await generateIntelligenceBriefing(topic, updateStatus);
            
            // Assign a unique ID for DB storage
            const reportWithId = { ...report, id: topic.toLowerCase().replace(/\s+/g, '-') };
            await saveReport(reportWithId);

            // Set status to completed
            task.status = 'completed';
            task.statusMessage = 'Report generation complete.';
            task.result = reportWithId;
            tasks.set(taskId, { ...task });

        } catch (e) {
            const error = e instanceof Error ? e.message : 'An unknown error occurred.';
            task.status = 'failed';
            task.statusMessage = 'Task failed during execution.';
            task.error = error;
            tasks.set(taskId, { ...task });
        }
    })();

    return taskId;
};

export const getTask = async (taskId: string): Promise<GenerationTask | null> => {
    return tasks.get(taskId) || null;
};


export const generateIntelReport = async (
    personName: string,
    onStatusUpdate?: (status: string) => void
): Promise<IntelReport> => {
    const dossierId = personName.toLowerCase().replace(/\s+/g, '-');
    
    // 1. Check for a cached version first
    const cachedDossier = await getDossier(dossierId);
    if (cachedDossier) {
        onStatusUpdate?.('Loaded cached dossier.');
        return cachedDossier;
    }

    // 2. If not cached, generate a new one
    const report = await geminiGenerateIntelReport(personName, onStatusUpdate);
    
    // 3. Assign ID and save to the new DB store
    const reportWithId = { ...report, id: dossierId };
    await saveDossier(reportWithId);
    
    return reportWithId;
};