import rabbitmqService from './services/rabbitmq.service.js';
import { RABBITMQ_CONFIG } from './config/rabbitmq.config.js';
import { logger } from './utils/logger.js';

class Producer {
    async sendMessage(message) {
        try {
            const channel = rabbitmqService.getChannel();
            const messageBuffer = Buffer.from(JSON.stringify(message));
            
            channel.sendToQueue(
                RABBITMQ_CONFIG.queue,
                messageBuffer,
                { persistent: true }
            );
            
            logger.success('Message sent', { message });
            return true;
        } catch (error) {
            logger.error('Failed to send message', error);
            throw error;
        }
    }

    async start() {
        await rabbitmqService.connect();
        logger.info('Producer ready');
    }

    async stop() {
        await rabbitmqService.close();
    }
}

export default new Producer();
