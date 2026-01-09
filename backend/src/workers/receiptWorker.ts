/**
 * Receipt Worker - Processes receipt generation jobs
 */

import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { generateReceipt, markReceiptGenerated } from '../services/receiptService.js';

interface ReceiptJobData {
  deliveryId: string;
}

export const receiptWorker = new Worker<ReceiptJobData>(
  'receipt-generation',
  async (job: Job<ReceiptJobData>) => {
    const { deliveryId } = job.data;
    
    console.log(`📄 [ReceiptWorker] Generating receipt for delivery ${deliveryId}`);
    
    try {
      // Generate the receipt data
      const receiptData = await generateReceipt(deliveryId);
      
      // Mark as generated in database
      await markReceiptGenerated(deliveryId);
      
      console.log(`✅ [ReceiptWorker] Receipt ${receiptData.receiptNumber} generated`);
      
      // In a real app, you might:
      // - Save the PDF to storage
      // - Send email to customer
      // - Store in receipts table
      
      return {
        success: true,
        receiptNumber: receiptData.receiptNumber,
        deliveryId,
      };
    } catch (error) {
      console.error(`❌ [ReceiptWorker] Failed to generate receipt:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 3, // Process up to 3 receipts concurrently
  }
);

// Event listeners
receiptWorker.on('completed', (job) => {
  console.log(`✅ [ReceiptWorker] Job ${job.id} completed`);
});

receiptWorker.on('failed', (job, err) => {
  console.error(`❌ [ReceiptWorker] Job ${job?.id} failed:`, err.message);
});

export default receiptWorker;
