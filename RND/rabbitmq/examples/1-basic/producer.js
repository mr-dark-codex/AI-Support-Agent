import RabbitMQConnection from "../base/connection.js";
import cron from "node-cron";

class BasicProducer {
  constructor() {
    this.connection = new RabbitMQConnection();
    this.queueName = "basic_queue";
  }

  async sendMessage(message) {
    try {
      const channel = await this.connection.connect();

      // Declare queue (create if doesn't exist)
      await channel.assertQueue(this.queueName, { durable: true });

      // Send message
      const messageBuffer = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(this.queueName, messageBuffer, { persistent: true });

      console.log(`📤 Sent: ${JSON.stringify(message)}`);

      // Wait for message to be written to queue
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.connection.close();

    //   await this.connection.close();
    } catch (error) {
      console.error("❌ Producer error:", error.message);
    }
  }
}

// Usage
const producer = new BasicProducer();

async function run() {
  await producer.sendMessage({
    id: 1,
    text: "Hello from Basic Producer!",
    timestamp: new Date().toISOString(),
  });
}

// Schedule to run every 30 seconds
cron.schedule("*/30 * * * * *", () => {
  console.log("Running producer at", new Date().toLocaleTimeString());
  run();
});

// run();
