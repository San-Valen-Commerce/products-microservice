## Description

Backend for the [e-commerce-app](https://github.com/Diegovalen47/e-commerce-app) client project. This project is a REST API built with NestJS and drizzle ORM. It also comes with a docker-compose file with a postgres and pgadmin to manage the storage locally.

## Installation

```bash
$ pnpm install // install dependencies
$ pnpm drizzle-kit generate // generate migrations/creation SQL files
$ cd db
$ docker-compose up -d // start postgres and pgadmin
$ pnpm tsx db/scripts/migrate.ts // Apply migrations/creations in the database
$ cd ..

```
## Run environment

```bash
$ docker-compose up -d // firts cd db, execute this command to start postgres and pgadmin and the cd ..
$ pnpm drizzle-kit studio // start drizzle studio
$ pnpm run start:dev // start the server
```
pgadmin: http://localhost:5050/
drizzle studio: https://local.drizzle.studio/
api docs: http://localhost:port/api

## Run migrations when changes are made to the model

```bash
$ pnpm drizzle-kit generate // generate migrations/creation SQL files
$ pnpm tsx db/scripts/migrate.ts // Apply migrations/creations in the database
```




## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
