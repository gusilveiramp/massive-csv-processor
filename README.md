# Setup Instructions

<div align="center">
  <img src="docs/demo.gif" alt="Demo" />
</div>

This monorepo contains two projects built for a scalable CSV processing system:

- [`api`](./api): Backend API built with **NestJS**, **PostgreSQL**, **Prisma**, **Redis**, and **BullMQ**.
- [`mobile`](./mobile): Mobile app built with **React Native**, using **Expo**, and **WebSocket** support for real-time progress tracking.

---

## 🚀 How to Run the Project

### 1. Backend (NestJS)

From the root folder, navigate to the `api/` project:

```bash
cd api
```

Then follow the steps in its [README.md](./api/README.md) to:

1. Install dependencies

2. Set up the `.env` file

3. Start Redis and PostgreSQL using Docker

4. Run database migrations

5. Start the server

### 2. Mobile App (React Native with Expo)

From the root folder, navigate to the `mobile/` project:

```bash
cd mobile
```

Then follow the steps in its [README.md](./mobile/README.md) to:

1. Install dependencies

2. Configure the .env file with the API base URL

3. Start the Expo development server

4. Run the app on an emulator or physical device

5. Upload a CSV file and watch the real-time processing progress

## 🎬 Quick Demo (No Audio)

Short demo of the system in action:

👉 [Watch the demo](https://youtu.be/Vbo6Bdi3QMM)

## 🎥 Full Video Walkthrough (TODO)

A step-by-step video tutorial explaining the project setup and architecture will be available soon.

## Author

Created by **Gustavo Silveira** <br/>
[LinkedIn](https://www.linkedin.com/in/gustavo-silveira-06601b57/)
