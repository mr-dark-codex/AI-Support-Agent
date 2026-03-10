# RabbitMQ Examples - Beginner Friendly

## Prerequisites
```bash
# Install RabbitMQ locally or use Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Install dependencies
npm install amqplib
```

## 1. Basic Pattern (One-to-One)

**Terminal 1 - Start Consumer:**
```bash
node examples/1-basic/consumer.js
```

**Terminal 2 - Send Message:**
```bash
node examples/1-basic/producer.js
```

**What happens:** Producer sends one message, consumer receives it.

---

## 2. Work Queue (Round Robin Distribution)

**Terminal 1 - Start Consumer 1:**
```bash
node examples/2-work-queue/consumer.js C1
```

**Terminal 2 - Start Consumer 2:**
```bash
node examples/2-work-queue/consumer.js C2
```

**Terminal 3 - Send Tasks:**
```bash
node examples/2-work-queue/producer.js
```

**What happens:** Tasks are distributed evenly between consumers (C1 gets task 1, C2 gets task 2, etc.)

---

## 3. Publish/Subscribe (Broadcast)

**Terminal 1 - Email Service:**
```bash
node examples/3-publish-subscribe/consumer.js EmailService
```

**Terminal 2 - SMS Service:**
```bash
node examples/3-publish-subscribe/consumer.js SMSService
```

**Terminal 3 - Push Service:**
```bash
node examples/3-publish-subscribe/consumer.js PushService
```

**Terminal 4 - Send Notification:**
```bash
node examples/3-publish-subscribe/producer.js
```

**What happens:** All services receive the same notification and process it differently.

---

## Key Differences

| Pattern | Use Case | Message Distribution |
|---------|----------|---------------------|
| Basic | Simple messaging | 1 producer → 1 consumer |
| Work Queue | Load balancing | Multiple producers → Multiple consumers (round robin) |
| Pub/Sub | Broadcasting | 1 producer → All consumers (same message) |

## Real-World Examples

- **Basic:** User registration → Send welcome email
- **Work Queue:** Multiple image uploads → Multiple image processors
- **Pub/Sub:** System alert → Email + SMS + Push notifications