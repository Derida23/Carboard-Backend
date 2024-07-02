<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

# Carboard Application Documentation

## Overview

Carboard Vehicles Rental specializes in providing a wide range of rental vehicles, from compact cars to luxury SUVs, catering to diverse transportation needs. Our fleet includes environmentally friendly options, ensuring both comfort and sustainability. Discover seamless rental experiences with flexible terms and exceptional customer service, tailored to meet every travel requirement.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm or yarn
- PostgreSQL

## Setup

1. Clone this repository

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
$ npm install
# or
$ yarn install
```

3. Set up environment variables:
Create a .env file in the root directory and configure the DATABASE_URL for your PostgreSQL database.

```bash
PORT=
DATABASE_URL=
API_PREFIX=

JWT_SECRET=
JWT_EXPIRES_IN=

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```

4. Run migrations:

```bash
npx prisma migrate dev
```

This will apply migrations defined in your Prisma schema to your database.

5. Start the application:

```bash
$ npm run start
# or
$ yarn start
```

The application will be accessible at <http://localhost:{port}>.

## Prisma Schema

Below is a summary of the Prisma schema used in this application:

```typescript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model users {
  id           Int       @id @default(autoincrement())
  name         String
  email        String    @unique
  password     String
  address      String?
  avatar       String?
  phone_number String?
  role         String
  created_at   DateTime?  @default(now())
  updated_at   DateTime? @updatedAt
  deleted_at   DateTime?
}

model products {
  id              Int       @id @default(autoincrement())
  name            String
  description     String
  id_type         Int
  id_mark         Int
  price           Float
  seat            Int
  id_transmission Int
  id_fuel         Int
  image           String?
  created_at      DateTime?  @default(now())
  updated_at      DateTime? @updatedAt
  deleted_at      DateTime?

  type         types         @relation(fields: [id_type], references: [id])
  mark         marks         @relation(fields: [id_mark], references: [id])
  transmission transmissions @relation(fields: [id_transmission], references: [id])
  fuels        fuels         @relation(fields: [id_fuel], references: [id])
}

model types {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  products    products[]
  created_at  DateTime?   @default(now())
  updated_at  DateTime?  @updatedAt
  deleted_at  DateTime?
}

model marks {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  products    products[]
  created_at  DateTime?   @default(now())
  updated_at  DateTime?  @updatedAt
  deleted_at  DateTime?
}

model transmissions {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  products    products[]
  created_at  DateTime?   @default(now())
  updated_at  DateTime?  @updatedAt
  deleted_at  DateTime?
}

model fuels {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  products    products[]
  created_at  DateTime?   @default(now())
  updated_at  DateTime?  @updatedAt
  deleted_at  DateTime?
}

```

## Usage

### Auth

- Register : POST /register

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password",
  "role": "user"
}
```

- Login : POST /login

```json
{
  "email": "john.doe@example.com",
  "password": "password",
}
```

### Product

- Create a Product: POST /products

```json
{
  "name": "Product Name",
  "description": "Product Description",
  "id_type": 1, // unit of measurment relation
  "id_mark": 1, // unit of measurment relation
  "price": 99.99, // unit of measurment relation
  "seat": 5,
  "id_transmission": 1, // unit of measurment relation
  "id_fuel": 1, // unit of measurment relation
  "image": "http://example.com/image.jpg" //integrated with cloudinary
}

```

- Get All Products: GET /products
- Get Product by ID: GET /products/:id
- Update Product: PATCH /products/:id
- Delete Product: DELETE /products/:id

### Service

Another endpoint service you can check in /src folder and response data from /dto

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## tldr

Hi, this is only product management cardboard vehicles, next version build with relation transaction and payment, cheers up!
