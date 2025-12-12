# Production Setup

This document explains how to deploy the backend in production.
Just like in development, you must run database migrations **before** bringing the backend up normally.

---

## 📝 0. Configure Environment Variables

Before doing anything else, rename the `.env.example` files in `./config/dev/` to `.env`:
```sh
mv ./config/production/backend-db.ecopath.prod.env.example ./config/production/backend-db.ecopath.prod.env
mv ./config/production/backend.ecopath.prod.env.example ./config/production/backend.ecopath.prod.env
```

## 🏗️ 1. Build the Production Backend Docker Image

Build the backend image using the production Dockerfile:

```sh
docker build -f ./config/production/Dockerfile -t ecopath-backend . --no-cache
```

## ⚙️ 2. Start the Production Database Container

Before running any migrations, you need the Postgres container running in the background:

```sh
docker compose -f ./config/production/docker-compose.yml up -d backend-db.prod
```

## 📦 3. Run Database Migrations (required)

Migrations must be applied **before starting the production backend**.

```sh
docker compose -f ./config/production/docker-compose.yml run --rm backend.prod deno task migrate
```

This:

- Launches a temporary backend container  
- Waits until Postgres is reachable
- Applies all migration files  
- Saves applied migrations in the `_migrations` table
- Stops and removes the temporary container

You must run this **once for every new** production deployment that introduces new migration files.

---

## 🌱 4. Seed Production Data

If you want seed data in production:

```sh
docker compose -f ./config/production/docker-compose.yml run --rm backend.prod deno task seed
```

## 🚀 5. Start the Full Development Environment

Once migrations are applied, start all services:

```sh
docker compose -f ./config/production/docker-compose.yml up -d
```

This will launch:

- The production Postgres container  
- The production backend API  

---

## 🔄 Re-running Migrate or Resetting Production Data

If you add new SQL migrations:

```sh
docker compose -f ./config/production/docker-compose.yml run --rm backend.prod deno task migrate
```

If you need to completely reset the production database (⚠️ destructive):

```sh
docker compose -f ./config/production/docker-compose.yml down -v
```

Then repeat all setup steps starting from the top.