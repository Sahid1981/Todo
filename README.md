# Todo App

A full-stack Todo application built with React (Vite) on the frontend and Node.js/Express on the backend, backed by PostgreSQL. Users must sign up and sign in before they can create or delete tasks; authentication uses JWTs.

## Tech stack

**Frontend**
- React 19 + Vite
- React Router (routing, protected routes)
- Axios (HTTP requests)
- React Context (shared user/session state)

**Backend**
- Node.js + Express 5
- PostgreSQL (via `pg`)
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- Mocha + Chai (testing)

## Project structure

```
todo/
├── src/                      # Frontend
│   ├── components/
│   │   ├── Row.jsx           # Single task row
│   │   └── UserCheck.jsx     # Protected-route guard
│   ├── context/
│   │   ├── UserContext.js
│   │   ├── UserProvider.jsx  # Holds user state, signUp/signIn
│   │   └── useUser.js        # Convenience hook
│   ├── screens/
│   │   ├── Authentication.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx                # Todo screen (list, add, delete)
│   └── main.jsx                # Router setup
│
└── server/                    # Backend
    ├── controllers/
    │   ├── TaskController.js
    │   └── UserController.js
    ├── models/
    │   ├── Task.js
    │   └── User.js
    ├── routes/
    │   ├── todoRouter.js
    │   └── userRouter.js
    ├── helper/
    │   ├── db.js               # PostgreSQL pool
    │   ├── auth.js             # JWT auth middleware
    │   ├── apiError.js         # ApiError(message, status)
    │   └── test.js             # Test-db helpers
    ├── db.sql                  # Schema + seed data
    ├── index.js                # Express app, error middleware
    └── index.test.js           # Mocha/Chai tests
```

## Prerequisites

- Node.js (current LTS)
- PostgreSQL

## Setup

### 1. Database

Create two PostgreSQL databases (development and test), then run `server/db.sql` against each to create the `task` and `account` tables and seed data.

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo
DB_PASSWORD=your_password
DB_PORT=5432
TEST_DB_NAME=test_todo
JWT_SECRET_KEY=some_long_random_value
```

Run the server:

```bash
npm run dev          # development mode, auto-restarts on change
npm run start:test   # test mode, single run against TEST_DB_NAME
```

Run the test suite (server must be running in test mode):

```bash
npm test
```

### 3. Frontend

```bash
npm install
```

Create `.env` in the project root:

```
VITE_API_URL=http://localhost:3001
```

Run the dev server:

```bash
npm run dev
```

By default the app runs at [http://localhost:5173](http://localhost:5173).

## Authentication flow

- `POST /users/signup` — creates an account (email + bcrypt-hashed password).
- `POST /users/signin` — verifies credentials and returns `{ id, email, token }`.
- The token is stored in `sessionStorage` and sent as `Authorization: Bearer <token>` on protected requests.
- Routes under `/` are wrapped in a `UserCheck` guard that redirects to `/signin` if no valid session exists.
- Creating and deleting tasks require a valid token (enforced by `auth` middleware on the backend); reading tasks is public.

## API endpoints

| Method | Path                | Auth required | Description               |
|--------|---------------------|:--------------:|---------------------------|
| GET    | `/tasks`             | No             | List all tasks            |
| POST   | `/tasks`             | Yes            | Create a task              |
| DELETE | `/tasks/:id`         | Yes            | Delete a task              |
| POST   | `/users/signup`      | No             | Register a new account     |
| POST   | `/users/signin`      | No             | Sign in, returns a JWT      |

Errors are returned as:

```json
{ "error": { "message": "...", "status": 400 } }
```

## Available scripts

**Frontend** (project root)
- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

**Backend** (`server/`)
- `npm run dev` — start with nodemon (development)
- `npm run start:test` — start once in test mode
- `npm test` — run the Mocha/Chai test suite
