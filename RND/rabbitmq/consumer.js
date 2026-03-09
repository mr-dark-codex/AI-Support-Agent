import rabbitmqService from './services/rabbitmq.service.js';
import { RABBITMQ_CONFIG } from './config/rabbitmq.config.js';
import { logger } from './utils/logger.js';

class Consumer {
    async processMessage(message) {
        try {
            const data = JSON.parse(message.content.toString());
            logger.info('Processing message', { data });
            
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            logger.success('Message processed', { data });
            return true;
        } catch (error) {
            logger.error('Failed to process message', error);
            return false;
        }
    }

    async start() {
        await rabbitmqService.connect();
        const channel = rabbitmqService.getChannel();
        
        channel.prefetch(RABBITMQ_CONFIG.prefetch);
        
        channel.consume(RABBITMQ_CONFIG.queue, async (message) => {
            if (message) {
                const success = await this.processMessage(message);
                if (success) {
                    channel.ack(message);
                } else {
                    channel.nack(message, false, true);
                }
            }
        });
        
        logger.info('Consumer waiting for messages');
    }

    async stop() {
        await rabbitmqService.close();
    }
}

export default new Consumer();
