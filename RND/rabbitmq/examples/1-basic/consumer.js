import RabbitMQConnection from '../base/connection.js';

class BasicConsumer {
    constructor() {
        this.connection = new RabbitMQConnection();
        this.queueName = 'basic_queue';
    }

    async start() {
        try {
            const channel = await this.connection.connect();
            
            // Declare queue
            await channel.assertQueue(this.queueName, { durable: true });
            
            console.log('👂 Waiting for messages...');
            
            // Consume messages
            channel.consume(this.queueName, (message) => {
                if (message) {
                    const data = JSON.parse(message.content.toString());
                    console.log(`📥 Received: ${JSON.stringify(data)}`);
                    
                    // Acknowledge message (remove from queue)
                    channel.ack(message);
                }
            });
            
        } catch (error) {
            console.error('❌ Consumer error:', error.message);
        }
    }
}

// Usage
const consumer = new BasicConsumer();
consumer.start();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await consumer.connection.close();
    process.exit(0);
});