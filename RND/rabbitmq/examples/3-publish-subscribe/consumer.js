import RabbitMQConnection from '../base/connection.js';

class PublishSubscribeConsumer {
    constructor(serviceName) {
        this.connection = new RabbitMQConnection();
        this.exchangeName = 'notifications';
        this.serviceName = serviceName;
    }

    async start() {
        try {
            const channel = await this.connection.connect();
            
            // Declare exchange
            await channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            
            // Create temporary queue for this consumer
            const queueResult = await channel.assertQueue('', { exclusive: true });
            const queueName = queueResult.queue;
            
            // Bind queue to exchange
            await channel.bindQueue(queueName, this.exchangeName, '');
            
            console.log(`👂 ${this.serviceName} waiting for notifications...`);
            
            channel.consume(queueName, (message) => {
                if (message) {
                    const data = JSON.parse(message.content.toString());
                    console.log(`📥 ${this.serviceName} received: ${data.message} at time`);
                    
                    // Simulate service-specific processing
                    this.processNotification(data);
                    
                    channel.ack(message);
                }
            });
            
        } catch (error) {
            console.error('❌ Consumer error:', error.message);
        }
    }

    processNotification(data) {
        switch (this.serviceName) {
            case 'EmailService':
                console.log(`📧 Sending email notification: ${data.message}`);
                break;
            case 'SMSService':
                console.log(`📱 Sending SMS notification: ${data.message}`);
                break;
            case 'PushService':
                console.log(`🔔 Sending push notification: ${data.message}`);
                break;
            default:
                console.log(`🔄 Processing notification: ${data.message}`);
        }
    }
}

// Usage - run multiple instances with different service names
const serviceName = process.argv[2] || 'EmailService';
const consumer = new PublishSubscribeConsumer(serviceName);
consumer.start();

process.on('SIGINT', async () => {
    console.log(`\n🛑 ${serviceName} shutting down...`);
    await consumer.connection.close();
    process.exit(0);
});