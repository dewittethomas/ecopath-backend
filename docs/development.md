# Development Setup

This document explains how to start the backend for the first time in development.  
You must run the migration and optional seeding steps **before** bringing the backend up normally.

---
## 🏗️ 0. Build the Development Backend Docker Image

Build the backend image using the development Dockerfile:

```sh
docker build -f ./config/dev/Dockerfile -t ecopath-backend .
```

## ⚙️ 1. Start the Development Database Container

Before running any migrations, you need the Postgres container running in the background:

```sh
docker compose -f ./config/dev/docker-compose.yml up -d backend-db.dev
```

## 📦 2. Run Database Migrations (required)

Migrations must be applied **before starting the development backend**.

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task migrate
```

This:

- Launches a temporary backend container  
- Waits until Postgres is reachable 
- Applies all migration files  
- Saves applied migrations in the `_migrations` table
- Stops and removes the temporary container

You must run this **once for every new** development deployment that introduces new migration files.

---

## 🌱 3. Seed Development Data

If you want seed data in development:

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task seed
```

## 🚀 4. Start the Full Development Environment

Once migrations are applied, start all services:

```sh
docker compose -f ./config/dev/docker-compose.yml up -d
```

This starts:

- The development Postgres container
- The production backend API

---

## 🔄 Re-running Migrate or Resetting Production Data

If you add new SQL migration files, run:

```sh
docker compose -f ./config/dev/docker-compose.yml run --rm backend.dev deno task migrate
```

To reset everything and reseed, you may wipe the Docker volume:

```sh
docker compose -f ./config/dev/docker-compose.yml down -v
```

Then repeat the steps from the top.
