import RabbitMQConnection from '../base/connection.js';

class WorkQueueConsumer {
    constructor(consumerId) {
        this.connection = new RabbitMQConnection();
        this.queueName = 'work_queue';
        this.consumerId = consumerId;
    }

    async processTask(message) {
        const data = JSON.parse(message.content.toString());
        
        console.log(`🔄 Consumer ${this.consumerId} processing: ${data.task}`);
        
        // Simulate work (random processing time)
        const processingTime = Math.random() * 3000 + 1000; // 1-4 seconds
        await new Promise(resolve => setTimeout(resolve, processingTime));
        
        console.log(`✅ Consumer ${this.consumerId} completed: ${data.task}`);
    }

    async start() {
        try {
            const channel = await this.connection.connect();
            
            await channel.assertQueue(this.queueName, { durable: true });
            
            // Fair dispatch - only send one message at a time
            channel.prefetch(1);
            
            console.log(`👂 Consumer ${this.consumerId} waiting for tasks...`);
            
            channel.consume(this.queueName, async (message) => {
                if (message) {
                    await this.processTask(message);
                    channel.ack(message);
                }
            });
            
        } catch (error) {
            console.error('❌ Consumer error:', error.message);
        }
    }
}

// Usage - run multiple instances of this file to see round-robin
const consumerId = process.argv[2] || 'C1';
const consumer = new WorkQueueConsumer(consumerId);
consumer.start();

process.on('SIGINT', async () => {
    console.log(`\n🛑 Consumer ${consumerId} shutting down...`);
    await consumer.connection.close();
    process.exit(0);
});