import { getReport, saveReport, getPoll, savePoll } from './firebaseService';
import { seededReports } from '../data/seededReports';

let hasSeedingBeenChecked = false;

export const seedInitialReports = async () => {
    if (hasSeedingBeenChecked) return;
    hasSeedingBeenChecked = true;

    console.log("Checking if initial data seeding is required...");

    try {
        await Promise.all(seededReports.map(async (seedItem) => {
            const reportExists = await getReport(seedItem.id);
            if (!reportExists) {
                console.log(`Seeding report: ${seedItem.id}`);
                const reportToSave = { ...seedItem.report, id: seedItem.id };
                await saveReport(reportToSave);
            }

            const pollExists = await getPoll(seedItem.id);
            if (!pollExists) {
                console.log(`Seeding poll: ${seedItem.id}`);
                await savePoll({ id: seedItem.id, votes: {} });
            }
        }));
        console.log("Seeding check complete.");
    } catch (error) {
        console.error("Seeding process failed, but application will continue.", error);
        // Fail silently to ensure the app still loads
        // even if database access is problematic.
    }
};
