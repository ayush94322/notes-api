# Notes API

A production-oriented RESTful Notes API built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL**.

The project focuses on moving beyond basic CRUD and implementing real-world backend concepts such as **full-text search, soft deletion, pagination, sorting, filtering, transactions, and automated testing**.

## Features

- Create, read, update, and delete notes
- User-specific notes
- Input validation with Zod
- Soft delete and restore
- Pagination
- Sorting
- Filtering
- Full-text search
- Bulk note operations
- Database transactions
- Centralized error handling
- Unit testing with Vitest

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod
- Vitest
- Supertest

## Architecture

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Prisma ORM
  ↓
PostgreSQL
```

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/notes` | Create a note |
| GET | `/notes` | Get user's notes |
| GET | `/notes/:id` | Get a specific note |
| PATCH | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Soft delete a note |
| PATCH | `/notes/:id/restore` | Restore a deleted note |
| DELETE | `/notes/:id/permanent` | Permanently delete a note |
| GET | `/notes/stats` | Get note statistics |

### Query Parameters

`GET /notes` supports:

- `page`
- `limit`
- `search`
- `favorite`
- `archived`
- `sort`
- `order`

Example:

```http
GET /notes?page=1&limit=10&search=backend&favorite=true&sort=createdAt&order=desc
```

## Project Structure

```text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── validators/
├── middlewares/
├── errors/
├── lib/
└── app.ts

tests/
├── unit/
│   ├── validators/
│   ├── repositories/
│   └── services/
└── integration/
```

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd notes-api
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_ACCESS_SECRET="your-secret"
PORT=3000
```

### Setup Database

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

### Run the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests once:

```bash
npm run test:run
```

Current unit tests cover:

- Zod validators
- Note repository
- Note service

Integration testing with Supertest is also included in the testing setup.

## Core Concepts Practiced

- REST API design
- Layered architecture
- Repository pattern
- Service layer
- Input validation
- Soft deletion
- Pagination
- Sorting
- Filtering
- Full-text search
- Transactions
- PostgreSQL
- Prisma ORM
- Automated testing
- Error handling

## Future Improvements

- Swagger/OpenAPI documentation
- Redis caching
- Rate limiting
- Advanced search
- Docker
- CI/CD
- Logging and monitoring
- Expanded integration test coverage

## License

This project is for educational and development purposes.
