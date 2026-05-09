import { worker as scrapeWorker } from './src/lib/workers/scrapeWorker';
import { emailWorker } from './src/lib/workers/emailWorker';

console.log('BullMQ Workers started (Scraper + Email)...');

process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await scrapeWorker.close();
  await emailWorker.close();
  process.exit(0);
});
