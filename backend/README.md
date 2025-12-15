# Task Management Backend

This is the backend for a full-featured Task Management application. Built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, **Mongoose**, and **Socket.io**, it provides authentication, task management, and real-time updates.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)  
- [API Endpoints](#api-endpoints)  
- [Architecture & Design Decisions](#architecture--design-decisions)  
- [Real-Time Functionality](#real-time-functionality)  
- [Trade-offs & Assumptions](#trade-offs--assumptions)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd backend
```

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file in the root:

PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1d

4. Run the backend locally
npm run dev


This will start the server with hot reload (using ts-node-dev) on http://localhost:5000.

API Endpoints

All endpoints are prefixed with /api.

Auth
Method	Endpoint	Body	Description
POST	/auth/register	{ name, email, password }	Register a new user
POST	/auth/login	{ email, password }	Login and get JWT token
GET	/auth/me	Authorization: Bearer <token>	Get current user profile
Tasks
Method	Endpoint	Body	Description
POST	/tasks	{ title, description, dueDate, priority?, status?, assignedToId }	Create a new task
GET	/tasks	Authorization: Bearer <token>	Get all tasks for the current user
GET	/tasks/:id	Authorization: Bearer <token>	Get task by ID
PUT	/tasks/:id	{ title?, description?, dueDate?, priority?, status?, assignedToId? }	Update a task
DELETE	/tasks/:id	Authorization: Bearer <token>	Delete a task
Architecture & Design Decisions

Backend: Node.js + Express + TypeScript for strong typing and maintainability.

Database: MongoDB chosen for flexible schema and fast prototyping with Mongoose.

Service Layer: Controllers delegate business logic to services, which interact with repositories. This separation makes the code testable and maintainable.

Authentication: JWT-based authentication stored in HttpOnly cookies. Passwords hashed using bcrypt.

Validation: Zod used for DTO validation (request body validation).

Error Handling: Standardized responses with proper HTTP status codes.

Real-Time Functionality

Integrated Socket.io for real-time updates:

Task Updates: When a task is updated, all connected clients viewing the dashboard receive the update instantly.

Task Assignment Notifications: When a user is assigned a task, they receive an in-app notification immediately.

Socket.io is initialized in the server and injected into the service layer when creating/updating tasks.

Trade-offs & Assumptions

MongoDB chosen for development speed and flexibility, even though relational DBs could enforce strict user-task relationships.

Simplified notification system: currently in-memory Socket.io; persistent notifications in DB can be added later.

Authorization: Only task creator or assignee can update; only creator can delete tasks.

Optional fields in tasks defaulted (priority → Low, status → To Do).

Running Tests
npm run test


Unit tests cover AuthService and TaskService logic.

Jest + ts-jest used for TypeScript testing.

Notes

Ensure MongoDB is running locally or use a cloud instance (MongoDB Atlas).

This backend is ready for deployment on Render/Railway with environment variables configured.

For frontend integration, use React + SWR/React Query to fetch and mutate task data.