export const RABBITMQ_CONFIG = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queue: process.env.QUEUE_NAME || 'task_queue',
    options: {
        durable: true
    },
    prefetch: 1
};
