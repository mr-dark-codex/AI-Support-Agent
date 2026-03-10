import RabbitMQConnection from '../base/connection.js';

class PublishSubscribeProducer {
    constructor() {
        this.connection = new RabbitMQConnection();
        this.exchangeName = 'notifications';
    }

    async publishMessage(message) {
        try {
            const channel = await this.connection.connect();
            
            // Declare exchange (fanout = broadcast to all queues)
            await channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            
            const messageBuffer = Buffer.from(JSON.stringify(message));
            
            // Publish to exchange (not directly to queue)
            channel.publish(this.exchangeName, '', messageBuffer);
            
            console.log(`📢 Published: ${JSON.stringify(message)}`);
            
            await this.connection.close();
        } catch (error) {
            console.error('❌ Publisher error:', error.message);
        }
    }
}

// Usage
const publisher = new PublishSubscribeProducer();

async function sendNotifications() {
    await publisher.publishMessage({
        type: 'system_alert',
        message: 'Server maintenance in 10 minutes',
        timestamp: new Date().toISOString()
    });
    
    setTimeout(async () => {
        await publisher.publishMessage({
            type: 'user_notification',
            message: 'New feature released!',
            timestamp: new Date().toISOString()
        });
    }, 2000);
}

sendNotifications();