import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { generateReceipt, markReceiptGenerated } from '../services/receiptService.js';
export const receiptWorker = new Worker('receipt-generation', async (job) => {
    const { deliveryId } = job.data;
    console.log(`📄 [ReceiptWorker] Generating receipt for delivery ${deliveryId}`);
    try {
        const receiptData = await generateReceipt(deliveryId);
        await markReceiptGenerated(deliveryId);
        console.log(`✅ [ReceiptWorker] Receipt ${receiptData.receiptNumber} generated`);
        return {
            success: true,
            receiptNumber: receiptData.receiptNumber,
            deliveryId,
        };
    }
    catch (error) {
        console.error(`❌ [ReceiptWorker] Failed to generate receipt:`, error);
        throw error;
    }
}, {
    connection: redisConnection,
    concurrency: 3,
});
receiptWorker.on('completed', (job) => {
    console.log(`✅ [ReceiptWorker] Job ${job.id} completed`);
});
receiptWorker.on('failed', (job, err) => {
    console.error(`❌ [ReceiptWorker] Job ${job?.id} failed:`, err.message);
});
export default receiptWorker;
