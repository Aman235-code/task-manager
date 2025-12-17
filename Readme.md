# Collaborative Task Manager - Backend

This repository contains the backend services for the Collaborative Task Manager application. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, it provides a secure API, task management functionality, and real-time updates via **Socket.io**.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Contract](#api-contract)
- [Architecture Overview & Design Decisions](#architecture-overview--design-decisions)
- [Socket.io Integration](#socketio-integration)
- [Trade-offs & Assumptions](#trade-offs--assumptions)
- [Testing](#testing)

---

## Setup Instructions

### Prerequisites

- Node.js v20+
- npm or yarn
- MongoDB Atlas or local MongoDB instance

### Clone the repository

```bash

```

### Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install
# or
yarn install
```

## Environment Variables

### Create a .env file at the root of the backend directory:

```bash
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Running Locally

```bash
# Start in development mode with hot reload
npm run dev
# or
yarn dev
```

### The backend will be running at http://localhost:4000.

## API Contract

### Auth API ROUTES

#### Register User (POST):-

```bash
http://localhost:4000/api/v1/auth/register

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Output:-

```bash
{
  "id": "69429e1c37ccab9302abe08f",
  "name": "Test User",
  "email": "test@example.com"
}
```

#### Login User (POST) :-

```bash
http://localhost:4000/api/v1/auth/login

{
  "email": "test@example.com",
  "password": "password123"
}
```

Output:-

```bash
{
  "id": "69429e1c37ccab9302abe08f",
  "name": "Test User",
  "email": "test@example.com"
}
```

#### Logout User (POST):-

```bash
http://localhost:4000/api/v1/auth/logout
```

Output:-

```bash
{ "message": "Logged out successfully" }
```

#### Update User Name (PATCH) :-

```bash
http://localhost:4000/api/v1/users/me

{
  "name": "Test User updated"
}
```

Output:-

```bash
{
  "id": "69429e1c37ccab9302abe08f",
  "name": "Test User updated",
  "email": "test@example.com"
}
```

#### Get All Users (GET) :-

```bash
http://localhost:4000/api/v1/users/all
```

Output:-

```bash
{
  "users": [
    {
      "_id": "69429e1c37ccab9302abe08f",
      "name": "Test User updated",
      "email": "test@example.com",
      "password": "$2b$10$VhrYpoLfQKBHTeK9J/R5VOEbDVOS8kJBvATqjg5QRC.B2cE7RIKXm",
      "createdAt": "2025-12-17T12:12:12.063Z",
      "updatedAt": "2025-12-17T12:18:03.425Z",
      "__v": 0
    }
  ]
}
```

#### Get User By Id (GET) :-

```bash
http://localhost:4000/api/v1/users/69429e1c37ccab9302abe08f
```

Output:-

```bash
{
  "user": {
    "_id": "69429e1c37ccab9302abe08f",
    "name": "Test User updated",
    "email": "test@example.com",
    "password": "$2b$10$VhrYpoLfQKBHTeK9J/R5VOEbDVOS8kJBvATqjg5QRC.B2cE7RIKXm",
    "createdAt": "2025-12-17T12:12:12.063Z",
    "updatedAt": "2025-12-17T12:18:03.425Z",
    "__v": 0
  }
}
```

### Task API ROUTES

#### Create Task (POST):-

```bash
http://localhost:4000/api/v1/tasks

{
  "title": "Finish Frontend Module",
  "description": "Implement all task of Creating a web app",
  "dueDate": "2025-12-20T18:00:00.000Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "6941390a9d09adeb507d3025"
}

```

Output:-

```bash
{
  "title": "Finish Frontend Module",
  "description": "Implement all task of Creating a web app",
  "dueDate": "2025-12-20T18:00:00.000Z",
  "priority": "High",
  "status": "To Do",
  "creatorId": "69429e1c37ccab9302abe08f",
  "assignedToId": "6941390a9d09adeb507d3025",
  "_id": "6942a09c37ccab9302abe097",
  "createdAt": "2025-12-17T12:22:52.572Z",
  "updatedAt": "2025-12-17T12:22:52.572Z",
  "__v": 0
}

```

#### Get all Tasks (GET):-

```bash
http://localhost:4000/api/v1/tasks/
```

Output:-

```bash
{
  "tasks": [
    {
      "_id": "6942a09c37ccab9302abe097",
      "title": "Finish Frontend Module",
      "description": "Implement all task of Creating a web app",
      "dueDate": "2025-12-20T18:00:00.000Z",
      "priority": "High",
      "status": "To Do",
      "creatorId": "69429e1c37ccab9302abe08f",
      "assignedToId": "6941390a9d09adeb507d3025",
      "createdAt": "2025-12-17T12:22:52.572Z",
      "updatedAt": "2025-12-17T12:22:52.572Z",
      "__v": 0
    }
  ],
  "overdueTasks": []
}
```

#### Get Task by Task Id (GET):-

```bash
http://localhost:4000/api/v1/tasks/6942a09c37ccab9302abe097
```

Output:-

```bash
{
  "_id": "6942a09c37ccab9302abe097",
  "title": "Finish Frontend Module",
  "description": "Implement all task of Creating a web app",
  "dueDate": "2025-12-20T18:00:00.000Z",
  "priority": "High",
  "status": "To Do",
  "creatorId": "69429e1c37ccab9302abe08f",
  "assignedToId": "6941390a9d09adeb507d3025",
  "createdAt": "2025-12-17T12:22:52.572Z",
  "updatedAt": "2025-12-17T12:22:52.572Z",
  "__v": 0
}
```

#### Update Task (PUT):-

```bash
http://localhost:4000/api/v1/tasks/6942a09c37ccab9302abe097

{
  "status": "In Progress",
  "priority": "Urgent"
}

```

Output:-

```bash
{
  "_id": "6942a09c37ccab9302abe097",
  "title": "Finish Frontend Module",
  "description": "Implement all task of Creating a web app",
  "dueDate": "2025-12-20T18:00:00.000Z",
  "priority": "Urgent",
  "status": "In Progress",
  "creatorId": "69429e1c37ccab9302abe08f",
  "assignedToId": "6941390a9d09adeb507d3025",
  "createdAt": "2025-12-17T12:22:52.572Z",
  "updatedAt": "2025-12-17T12:26:39.308Z",
  "__v": 0
}

```

#### Delete a Task by Id (DELETE):-

```bash
http://localhost:4000/api/v1/tasks/6942a09c37ccab9302abe097
```

Output:-

```bash
{
  "message": "Task deleted",
  "task": {
    "_id": "6942a09c37ccab9302abe097",
    "title": "Finish Frontend Module",
    "description": "Implement all task of Creating a web app",
    "dueDate": "2025-12-20T18:00:00.000Z",
    "priority": "Urgent",
    "status": "In Progress",
    "creatorId": "69429e1c37ccab9302abe08f",
    "assignedToId": "6941390a9d09adeb507d3025",
    "createdAt": "2025-12-17T12:22:52.572Z",
    "updatedAt": "2025-12-17T12:26:39.308Z",
    "__v": 0
}
```

## Architecture Overview & Design Decisions

### Folder Structure

```bash
backend/
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ repositories/
│  ├─ models/
│  ├─ middlewares/
│  ├─ dtos/
│  └─ index.ts
├─ tests/
└─ package.json

```

## Key Decisions

Database Choice: MongoDB via Mongoose

Flexible schema for evolving task attributes

Easy integration with real-time features

## Authentication

JWT stored in HttpOnly cookies for secure session handling

Passwords hashed using bcrypt

## Service Layer

Controllers handle requests/responses

Services encapsulate business logic

Repositories handle direct DB access for better separation of concerns

## Input Validation

Used Zod for DTO validation (CreateTaskDto, UpdateTaskDto, RegisterDto, LoginDto)

## Socket .io Integration

Socket.io is initialized on the server and connected to the frontend clients.

Listens for events such as:

task_created

task_updated

task_deleted

Emits events to all connected clients or specific users when a task is assigned.

Ensures real-time updates for task status, priority, or assignee changes.

## Trade-offs & Assumptions

Assumed single database instance for simplicity; clustering/scaling not implemented.

Real-time notifications are in-memory; no persistent queue (like Redis) yet.

Minimal error logging; production-grade logging can be added with winston or pino.

Email notifications not implemented; could be added for external alerts.

## Testing

Jest is used for unit testing critical service logic.

Example: Task creation validation, JWT authentication, and Socket.io events.

Run tests:

```bash
npm run test
# or
yarn test
```

output

```bash
backend@1.0.0 test
> jest

PASS  src/tests/task.service.test.ts (17.128 s)
PASS  src/tests/auth.service.test.ts (17.553 s)

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        19.841 s, estimated 22 s
Ran all test suites.
```

## Future Enhancements

Add rate-limiting and security middleware

Integrate Redis for scaling Socket.io

Add user roles and permissions

Improve test coverage with integration tests

# Collaborative Task Manager - Frontend

This repository contains the frontend application for the **Collaborative Task Manager**. Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, it provides a responsive UI, state management with **React Query**, and real-time updates via **Socket.io**.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Socket.io Integration](#socketio-integration)
- [Design & Architecture](#design--architecture)
- [Trade-offs & Assumptions](#trade-offs--assumptions)
- [Future Enhancements](#future-enhancements)

---

## Setup Instructions

### Prerequisites

- Node.js v20+
- npm or yarn
- Backend server running locally or on a deployed URL

### Clone the repository

```bash

```

### Installation

```bash
# Navigate to frontend
cd task-manager-frontend

# Install dependencies
npm install
# or
yarn install
```

## Environment Variables

### Create a .env file at the root of the frontend directory:

```bash
VITE_API_BASE=http://localhost:4000
```

## Running Locally
### Start the development server

```bash
npm run dev
# or
yarn dev
```

#### The app will be available at http://localhost:5173

## Project Structure

```bash
frontend/
├─ src/
│  ├─ api/             # Axios/React Query setup
│  ├─ components/      # Reusable UI components (TaskCard, Modal, etc.)
│  ├─ context/         # AuthContext, NotificationContext
│  ├─ hooks/           # Custom hooks (useTasks, useAuth)
│  ├─ pages/           # Page components (Dashboard, Profile, Login, Register)
│  ├─ utils/           # Utility functions (date formatting, validation)
│  └─ App.tsx          # App entry point
├─ public/
├─ index.html
└─ package.json
```

## Socket.io Integration

Frontend connects to backend via Socket.io client.

Listens for events:

task_created – new task added

task_updated – task updated

task_deleted – task removed

notification – new assignment notifications

Updates React Query cache or triggers UI state changes in real time.

## Design & Architecture

React Query: Handles server state, caching, and re-fetching.

React Hook Form + Zod: Used for forms with validation.

Tailwind CSS: Fully responsive UI.

Context API: For global auth and notifications.

Component Structure: Modular and reusable components (cards, modals, forms).

## Trade-offs & Assumptions

No offline support; app requires backend connectivity.

Real-time updates rely on Socket.io in-memory events (no persistent queue yet).

Minimal client-side error logging; could be extended with Sentry or similar.

## Future Enhancements

Pagination or infinite scrolling for large task lists.

Theme support (dark/light mode).

Persistent notifications with read/unread states.

Integration with calendar or external reminders.