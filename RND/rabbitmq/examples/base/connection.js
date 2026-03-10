import amqp from 'amqplib';

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            console.log('✅ Connected to RabbitMQ');
            return this.channel;
        } catch (error) {
            console.error('❌ Failed to connect:', error.message);
            throw error;
        }
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log('🔌 Connection closed');
        }
    }
}

export default RabbitMQConnection;