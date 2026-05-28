# MERN Task Manager

A full-stack task management application built with the MERN stack. It supports user authentication, personal task management, filtering, search, pagination, dark mode, and a demo admin dashboard.

## Overview

MERN Task Manager is designed as a practical CRUD application for organizing tasks. Users can sign up, log in, create tasks, update progress, set priorities and due dates, search through their tasks, and manage task status from a React dashboard. The backend provides a protected Express API with MongoDB persistence and JWT-based authentication.

## Tech Stack

- MongoDB with Mongoose
- Express.js
- React 18 with Vite
- Node.js
- JWT authentication
- Axios
- Docker Compose

## Features

- User signup and login
- JWT-protected API routes
- Create, read, update, and delete tasks
- Task status tracking: `todo`, `in-progress`, and `completed`
- Task priority levels: `low`, `medium`, and `high`
- Optional task descriptions and due dates
- Search tasks by text
- Filter tasks by status
- Paginated task list
- Dashboard task statistics
- Dark mode support
- Protected frontend routes
- Demo admin dashboard
- Admin task visibility and delete capability
- Centralized API error handling
- Docker setup for client, server, and MongoDB

## Demo Logins

Regular users can sign up from the app.

For the demo admin dashboard, use:

```text
Email: admin@demo.com
Password: admin123
```

Admin dashboard:

```text
http://localhost:5173/admin
```

The demo admin is hardcoded for presentation only.

## Environment Setup

Create env files from the examples:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

For PowerShell:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Update `server/.env` with your MongoDB connection string and JWT secret.

## Local Setup

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Start MongoDB locally, then run the apps in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## Docker

```bash
docker compose up --build
```

The compose file uses `server/.env` and starts MongoDB, the Express server, and the Vite client.

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Admin

- `GET /api/admin/tasks`
- `DELETE /api/admin/tasks/:id`

## Project Structure

```text
mern-task-manager/
  client/   React + Vite frontend
  server/   Express + MongoDB backend
  docker-compose.yml
  README.md
```

## Future Implementation

- Add TypeScript across the client and server
- Add form validation with clearer field-level messages
- Add automated tests for API routes and React components
- Add task labels or categories
- Add task sorting by due date, priority, and creation date
- Add password reset and email verification
- Add refresh tokens for stronger authentication flow
- Improve analytics on the dashboard with charts and task trends
# mern-task-manager
