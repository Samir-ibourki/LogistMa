import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
import { routeWorker } from './routeWorker.js';
import { receiptWorker } from './receiptWorker.js';

console.log('🚀 Starting LogistiMa Workers...');
console.log('📍 Route Worker: listening to "route-calculation" queue');
console.log('📄 Receipt Worker: listening to "receipt-generation" queue');
console.log('');
console.log('Workers are running. Press Ctrl+C to stop.');
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down workers...');

  await routeWorker.close();
  await receiptWorker.close();

  console.log('✅ Workers stopped gracefully');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
setInterval(() => { }, 1000);
