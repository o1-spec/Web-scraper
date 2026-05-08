import { worker as scrapeWorker } from './src/lib/workers/scrapeWorker';
// import { worker as emailWorker } from './lib/workers/emailWorker';

console.log('BullMQ Workers started...');

process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await scrapeWorker.close();
  // await emailWorker.close();
  process.exit(0);
});
