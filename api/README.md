# Massive CSV Processor – Backend API (NestJS)

This is the **backend API** built with [NestJS](https://nestjs.com/). It handles:

- CSV file upload and parsing
- Background processing using queues (BullMQ + Redis)
- Real-time progress updates via WebSocket
- PostgreSQL database (managed with Prisma ORM)
- Currency conversion using external APIs

---

## Requirements

- Node.js (recommended version: 20.x or higher)
- Docker and Docker Compose

---

## Getting Started

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd <BACKEND_PROJECT_FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy environment variables

```bash
cp .env.example .env
```

Then update the .env file as needed (e.g. local IPs, ports).

## Running the Project (with Docker)

The project comes with a <code>docker-compose.yml</code> file to run PostgreSQL and Redis locally.

### Start containers

```bash
docker-compose up -d
```

or if you are using Docker v20.10+

```bash
docker compose up -d
```

This will start:

- PostgreSQL on port <code>5432</code>
- Redis on port <code>6379</code>

You can customize the ports by editing the <code>.env</code> file.

## 4.Run database migrations

```bash
npx prisma migrate dev
```

## 5. Start the backend server

```bash
npm run start:dev
```

This will start:

- HTTP API on <code>http://localhost:3333</code>
- WebSocket server on <code>ws://localhost:3334</code>

You can customize the ports by editing the <code>.env</code> file.

> Make sure your mobile app is pointing to your machine's IP (not `localhost`), especially when testing with Expo Go.

## API Endpoints

| Method   | Endpoint         | Description                 |
| -------- | ---------------- | --------------------------- |
| `POST`   | /products/upload | Upload CSV file (multipart) |
| `GET`    | /products        | Paginated list with search  |
| `GET`    | /products/:id    | Get single product by ID    |
| `PATCH`  | /products/:id    | Update product info         |
| `DELETE` | /products/:id    | Delete product              |

## WebSocket Events

The backend emits the following WebSocket events to track CSV upload jobs:

| Event                            | Payload                             | Description                              |
| -------------------------------- | ----------------------------------- | ---------------------------------------- |
| `upload-progress:{jobId}`        | `{ "progress": number }`            | Emitted periodically during job progress |
| `upload-progress:{jobId}`        | `{ "progress": 100, "done": true }` | Emitted when the job is fully completed  |
| `upload-products:failed:{jobId}` | `{ "reason": string }`              | Emitted when the job fails               |

> Note: The same `upload-progress:{jobId}` event is used for both progress updates and completion, with the field `done: true` indicating completion.

#### Example Payloads

**Progress:**

```json
{
  "progress": 45
}
```

**Completed::**

```json
{
  "progress": 100,
  "done": true
}
```

**Failed:**

```json
{
  "reason": "Invalid CSV format"
}
```

## Running Tests

To run all unit and integration tests:

```bash
npm run test
```

## Author

Created by **Gustavo Silveira** <br/>
[LinkedIn](https://www.linkedin.com/in/gustavo-silveira-06601b57/)
