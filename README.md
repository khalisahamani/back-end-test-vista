# Back-End Test (Vista)

REST API for managing companies and their services.
Built with Node.js, TypeScript, Express, Prisma and MySQL.

## Prerequisites
- Node.js (LTS)
- MySQL running locally (XAMPP works)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file by copying the example:
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` if your MySQL user, password or port is different.
3. Start MySQL, then create the database and tables:
   ```bash
   npx prisma migrate dev --name init
   ```

## Run
- Development (auto-restart): `npm run dev`
- Production:
  ```bash
  npm run build
  npm start
  ```

The server runs on http://localhost:3000.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /companies | Create a company |
| GET | /companies | List companies with their services |
| POST | /services | Create a service under a company |
| GET | /services/:id | Get a service by ID |

### Example bodies
Create company:
```json
{ "name": "Acme", "registrationNumber": "REG123" }
```
Create service:
```json
{ "companyId": 1, "name": "Web Design", "description": "Landing pages", "price": 500 }
```

### Status codes
- `200` OK, `201` Created
- `400` validation error
- `404` company or service not found
- `409` registration number already exists
- `500` unexpected server error

## API documentation
Import `postman_collection.json` into Postman (Import, then select the file).

## Extras
- Request logging middleware (method, path, timestamp)
- Input validation with express-validator
- Dockerfile for the backend:
  ```bash
  docker build -t back-end-test-vista .
  docker run -p 3000:3000 -e DATABASE_URL="mysql://root:@host.docker.internal:3306/vista_test" back-end-test-vista
  ```