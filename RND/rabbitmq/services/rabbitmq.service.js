import amqp from 'amqplib';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config.js';
import { logger } from '../utils/logger.js';

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(RABBITMQ_CONFIG.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(RABBITMQ_CONFIG.queue, RABBITMQ_CONFIG.options);
            
            this.connection.on('error', (err) => logger.error('Connection error', err));
            this.connection.on('close', () => logger.info('Connection closed'));
            
            logger.success('Connected to RabbitMQ');
            return this.channel;
        } catch (error) {
            logger.error('Failed to connect to RabbitMQ', error);
            throw error;
        }
    }

    async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            logger.info('RabbitMQ connection closed');
        } catch (error) {
            logger.error('Error closing connection', error);
        }
    }

    getChannel() {
        if (!this.channel) throw new Error('Channel not initialized');
        return this.channel;
    }
}

export default new RabbitMQService();
