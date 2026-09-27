# AdCampaign360

Full-stack digital advertising campaign and analytics platform. Advertisers manage their own campaigns and ads; administrators manage the platform, users, and campaign approvals.

## Stack

- React, Vite, Tailwind CSS, Axios, React Router, Recharts
- Node.js, Express, Sequelize, MySQL, JWT, bcryptjs
- Jest and Supertest API tests (SQLite in-memory test database)

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, set a strong `JWT_SECRET` and MySQL credentials, and create the `adcampaign360` database.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not on the default URL.
3. Install all packages: `npm run install:all`
4. Seed realistic sample data: `npm run seed`
5. Start both applications: `npm run dev`

The frontend runs at `http://localhost:5173`; the API defaults to port 5000. The seeded admin uses `admin@adcampaign360.com`. Set `ADMIN_PASSWORD` (use the supplied project credential) and `SEED_ADVERTISER_PASSWORD` in the backend environment before seeding; neither is committed or displayed by the UI.

## Verification

Run `npm test` for registration, duplicate protection, login/JWT, role/ownership authorization and analytics calculations. Run `npm run build` to validate the frontend production build.

## Structure

`backend/src` contains models, controllers, routes, middleware, services, seed scripts and tests. `frontend/src` contains role-protected layouts, responsive pages, components and API services.

## Data model

`User 1—N Campaign`, `Campaign 1—N Advertisement`, and `Campaign 1—N CampaignMetric`. Sequelize foreign keys and cascading cleanup enforce the relationships. Password fields are bcrypt-hashed through model hooks and excluded from API user responses.
