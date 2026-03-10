import RabbitMQConnection from '../base/connection.js';

class WorkQueueProducer {
    constructor(producerId) {
        this.connection = new RabbitMQConnection();
        this.queueName = 'work_queue';
        this.producerId = producerId;
    }

    async sendTask(task) {
        try {
            const channel = await this.connection.connect();
            
            await channel.assertQueue(this.queueName, { durable: true });
            
            const message = {
                producerId: this.producerId,
                task: task,
                timestamp: new Date().toISOString()
            };
            
            const messageBuffer = Buffer.from(JSON.stringify(message));
            channel.sendToQueue(this.queueName, messageBuffer, { persistent: true });
            
            console.log(`📤 Producer ${this.producerId} sent: ${task}`);
            
            await this.connection.close();
        } catch (error) {
            console.error('❌ Producer error:', error.message);
        }
    }
}

// Simulate multiple producers
async function runMultipleProducers() {
    const producer1 = new WorkQueueProducer('P1');
    const producer2 = new WorkQueueProducer('P2');
    
    // Send tasks from different producers
    await producer1.sendTask('Process user registration');
    await producer2.sendTask('Send welcome email');
    await producer1.sendTask('Generate report');
    await producer2.sendTask('Backup database');
    await producer1.sendTask('Update analytics');
}

runMultipleProducers();