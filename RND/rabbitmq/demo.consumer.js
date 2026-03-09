import consumer from './consumer.js';
import { config } from 'dotenv';


config();

async function runConsumer() {
    try {
        await consumer.start();
        console.log('Consumer started. Press Ctrl+C to exit.');
    } catch (error) {
        console.error('Consumer error:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await consumer.stop();
    process.exit(0);
});

// Schedule the consumer to run every minute


runConsumer();
