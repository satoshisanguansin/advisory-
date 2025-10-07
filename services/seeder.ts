import { getReport, saveReport, getPoll, savePoll } from './firebaseService';
import { seededReports } from '../data/seededReports';

let hasSeedingBeenChecked = false;

export const seedInitialReports = async () => {
    if (hasSeedingBeenChecked) return;
    hasSeedingBeenChecked = true;

    try {
        await Promise.all(seededReports.map(async (seedItem) => {
            const reportToSave = { ...seedItem.report, id: seedItem.id };

            const reportExists = await getReport(seedItem.id);
            if (!reportExists) {
                await saveReport(reportToSave);
            }

            const pollExists = await getPoll(seedItem.id);
            if (!pollExists) {
                await savePoll({ id: seedItem.id, votes: {} });
            }
        }));
    } catch (error) {
        console.error("Seeding process failed, but application will continue.", error);
        // Fail silently to ensure the app still loads
        // even if IndexedDB access is problematic (e.g., in private browsing).
    }
};
