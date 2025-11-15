# Development Setup

This document explains how to start the backend for the first time in development.  
You must run the migration and optional seeding steps **before** bringing the backend up normally.

---

## ⚙️ 1. Start the Database Container

Before running any migrations, you need the Postgres container running in the background:

```sh
docker compose -f ./config/dev/docker-compose.yml up -d backend-db.dev
```

## 📦 2. Run Database Migrations (required)

Migrations must be applied **before the backend can run**.

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task migrate
```

This:

- Starts a temporary backend container  
- Waits for Postgres to become ready  
- Applies all `.sql` migration files  
- Records applied migrations in the `_migrations` table  
- Exits cleanly

Run this step **at least once** for any fresh development environment.

---

## 🌱 3. Seed the Database (optional)

If you want development data prefilled, run:

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task seed
```

Seeding is optional but useful for local development.  
It inserts test data that helps during development and testing.

## 🚀 4. Start the Full Development Environment

Once migration (and optional seeding) is complete, start everything:

```sh
docker compose -f ./config/dev/docker-compose.yml up -d
```

This starts:

- Postgres  
- Backend API  
- Any other services defined in the dev environment

---

## 🔄 Re-running Migrate or Seed Later

If you add new SQL migration files, run:

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task migrate
```

To reset everything and reseed, you may wipe the Docker volume:

```sh
docker compose -f ./config/dev/docker-compose.yml down -v
```

Then repeat the steps from the top.
