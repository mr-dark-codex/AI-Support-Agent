import producer from './producer.js';
import { config } from 'dotenv';
import cron from 'node-cron';

config();

const tasks = [
    { id: 1, type: 'email', recipient: 'user@example.com', subject: 'Welcome' },
    { id: 2, type: 'notification', userId: 123, message: 'New update available' },
    { id: 3, type: 'report', reportId: 456, format: 'pdf' }
];

async function runProducer() {
    try {
        await producer.start();
        
        for (const task of tasks) {
            await producer.sendMessage(task);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('\nAll messages sent. Press Ctrl+C to exit.');
    } catch (error) {
        console.error('Producer error:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await producer.stop();
    process.exit(0);
});

// Set up a cron job to run the producer every 30 seconds
cron.schedule('*/30 * * * * *', () => {
    console.log('Running producer at', new Date().toLocaleTimeString());
    runProducer();
});

console.log('Cron scheduler started. Producer will run every 30 seconds.');
console.log('Press Ctrl+C to exit.');
