# RabbitMQ Demo - Production Style

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start RabbitMQ (Docker):
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

3. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

## Usage

### Run Consumer (Terminal 1):
```bash
npm run consumer
```

### Run Producer (Terminal 2):
```bash
npm run producer
```

## Architecture

- **config/**: Configuration files
- **services/**: RabbitMQ connection service
- **utils/**: Logger utility
- **producer.js**: Message producer
- **consumer.js**: Message consumer
- **demo.*.js**: Demo scripts

## Features

- Connection management with error handling
- Durable queues for message persistence
- Message acknowledgment
- Prefetch for load balancing
- Graceful shutdown
- Structured logging
