# Backend Foundation - Milestone 1

This project sets up the foundational backend architecture separated from the frontend, preparing for future authentication and CRUD functionalities. It leverages **Express** as the web server, **Prisma** as the ORM to interact with **PostgreSQL**, and provides robust logging, error handling, and request validation.

## Tools & Packages Used

*   **TypeScript**: Provides static typing for improved code quality, fewer runtime errors, and better editor support.
*   **Express**: Fast, unopinionated, minimalist web framework for Node.js, used to build the REST API.
*   **Prisma & @prisma/client**: Next-generation Node.js and TypeScript ORM. It provides a type-safe database client and declarative schema for PostgreSQL.
*   **PostgreSQL**: (via Prisma) A powerful, open-source object-relational database system known for reliability and data integrity.
*   **Zod**: TypeScript-first schema declaration and validation library. It is used in the `validationHandler` to validate incoming requests.
*   **Pino & pino-pretty**: Extremely fast Node.js logger. Pino provides structured JSON logging, and `pino-pretty` formats it nicely for local development.
*   **dotenv**: Loads environment variables from a `.env` file into `process.env`.
*   **ESLint & Prettier**: Enforces consistent code style and catches common JavaScript/TypeScript errors.

## Folder Structure

```
backend/
├── .env
├── .env.example
├── .prettierrc
├── eslint.config.js
├── package.json
├── prisma
│   └── schema.prisma
├── server.ts
└── src
    ├── app.ts                  # Express application instance
    ├── config
    │   └── env.ts              # Type-safe environment variables
    ├── middlewares
    │   ├── auth.middleware.ts  # JWT Authentication middleware
    │   ├── role.middleware.ts  # Role-based authorization middleware
    │   ├── errorHandler.ts     # Global error handling
    │   └── validationHandler.ts# Zod validation middleware
    ├── modules
    │   ├── auth
    │   │   ├── auth.controller.ts # Route handlers
    │   │   ├── auth.routes.ts     # Express router
    │   │   ├── auth.service.ts    # Business logic
    │   │   ├── auth.validation.ts # Zod schemas
    │   │   └── auth.test.ts       # Vitest unit tests
    │   ├── billboards
    │   │   ├── billboard.controller.ts # Route handlers for Billboards
    │   │   ├── billboard.routes.ts     # Express router for Public and Admin APIs
    │   │   ├── billboard.service.ts    # Business logic for search/filtering/CRUD
    │   │   ├── billboard.validation.ts # Zod validation schemas
    │   │   ├── billboard.repository.ts # Repository Pattern abstraction
    │   │   └── billboard.test.ts       # Vitest unit tests
    │   ├── upload
    │   │   ├── storage.provider.ts    # Abstract Storage Providers (Local, S3, R2)
    │   │   ├── upload.controller.ts   # Route handlers for Uploads
    │   │   ├── upload.routes.ts       # Express router for Upload endpoints
    │   │   ├── upload.service.ts      # Image compression (sharp), validation, renaming
    │   │   └── upload.test.ts         # Vitest unit tests for Uploads
    │   ├── settings
    │   │   ├── setting.repository.ts  # Repository Pattern for Settings DB abstraction
    │   │   ├── setting.controller.ts  # Route handlers for settings configuration
    │   │   ├── setting.routes.ts      # Express router for Public and Admin Settings APIs
    │   │   ├── setting.service.ts     # Business logic, configuration groups, and system defaults
    │   │   ├── setting.validation.ts  # Zod validation schemas for Settings update payloads
    │   │   └── setting.test.ts        # Vitest unit & integration tests
    │   ├── blog
    │   │   ├── blog.controller.ts # Route handlers for Blog
    │   │   ├── blog.routes.ts     # Express router for Categories, Tags, Posts
    │   │   ├── blog.validation.ts # Zod validation schemas
    │   │   ├── category.repository.ts
    │   │   ├── category.service.ts
    │   │   ├── tag.repository.ts
    │   │   ├── tag.service.ts
    │   │   ├── post.repository.ts
    │   │   └── post.service.ts
    │   └── users
    │       └── user.repository.ts # Database abstraction
    ├── routes
    │   └── health.ts           # Health check endpoint
    └── utils
        ├── jwt.util.ts         # Token generation/verification
        ├── logger.ts           # Pino logger configuration
        └── prisma.ts           # Prisma client singleton
    ├── uploads/                # Directory where uploaded thumbnails and galleries are stored
```

## Database Design & Migrations
We updated the Prisma schema (`backend/prisma/schema.prisma`) to include `Role` enum and authentication fields in the `User` model, the Blog CMS schema (`Category`, `Tag`, and `Post`), and the primary **Billboard CMS** schema (`Billboard` with geolocations, dimensions, pricing, and scheduling fields).

To generate and apply the migrations to your PostgreSQL database, run:
```bash
npx prisma migrate dev --name init_all_modules
```

## How to Run

1.  Navigate to the `backend` folder: `cd backend`
2.  Copy `.env.example` to `.env` and configure `DATABASE_URL` and `JWT_SECRET`.
3.  Install dependencies: `npm install`
4.  Run migrations: `npx prisma db push` or `npx prisma migrate dev`
5.  Run the application in development mode: `npm run dev`
6.  Run tests: `npm run test`

## Swagger API Documentation
A fully interactive Swagger Documentation UI is available at:
`http://localhost:3000/api-docs`

## Next Steps
This milestone adds the complete **Settings Module** featuring structured, group-partitioned CMS configurations, default system-wide fallbacks, and multi-field administrative override APIs. It comprehensively covers:
- **Website Identity & Assets**: Site name, description, customizable site logo, and favicon properties.
- **SEO configuration**: Default meta titles, meta descriptions, and site keywords.
- **Analytics Integrations**: Google Analytics tracking ID and Google Tag Manager container ID.
- **Contact & Communications**: Office contact email, phone, and direct WhatsApp call URL.
- **Social Media links**: Facebook, Instagram, and Twitter (X) URLs.
- **Physical Coordinates & maps**: Office address details and interactive embed iframe configuration.
- **Footer Configurations**: Dynamically managed copyright strings and disclaimer texts.
- **General System toggles**: System maintenance mode switch.

All unit, validation, and integration test suites compile and run successfully with 100% green builds. No further modules are requested.

