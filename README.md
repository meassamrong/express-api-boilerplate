# Express API Boilerplate

Modern, security-focused starter kit for building Express.js APIs with JWT auth, MongoDB persistence, Redis caching, and structured logging.

![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)
![License: GPL-2.0](https://img.shields.io/badge/License-GPL--2.0-blue)

## Features
- JWT authentication with refresh token support and role-aware access control.
- MongoDB integration (Mongoose) with pagination helpers.
- Redis-ready caching layer for token/session workflows.
- Security middleware: Helmet, CORS, rate limiting, compression, and cookie/session handling.
- Centralized request logging (Winston + Morgan) and structured error handling.
- OpenAPI/Swagger documentation served directly from the app.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**: copy `.env.example` (or create `.env`) and set values for `PORT`, `ALLOWED_ORIGINS`, `SESSION_SECRET`, MongoDB/Redis connection strings, and JWT secrets.
3. **Run in development**
   ```bash
   npm run dev
   ```

## API Documentation
- Interactive docs: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Tech Stack
- **Runtime**: Node.js, Express 5
- **Data**: MongoDB (Mongoose), Redis
- **Auth**: JWT access/refresh tokens, SSO-ready session support
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting, compression
- **Docs**: Swagger UI (OpenAPI 3)
- **Logging**: Winston + daily rotate, Morgan request logging

## Scripts
- `npm run dev` – start the API with file watching.
- `npm test` – start the server entry point (useful for smoke tests).
- `npm run lint` / `npm run lint:fix` – ESLint checks and fixes.

## License
This project is licensed under the **GPL-2.0-only** license. See the `LICENSE` file for details.
