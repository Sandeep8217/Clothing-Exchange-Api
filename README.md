# ReWear --- Clothing Exchange Marketplace

**Give clothes a second life. Swap what you own for what you want.**

A full-stack clothing exchange platform for listing clothes, discovering
items, proposing one-to-one swaps, messaging members, and managing
exchanges.

[**Live Website**](https://rewear-frontend-we7t.onrender.com) ·
[**Backend Service**](https://rewear-backend-5z47.onrender.com)

![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white)
![Spring
Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=20232A)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
:::

------------------------------------------------------------------------

## Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Docker](#docker)
-   [API Overview](#api-overview)
-   [Deployment](#deployment)
-   [Troubleshooting](#troubleshooting)
-   [Security](#security)
-   [Contributing](#contributing)
-   [License](#license)

## Overview

ReWear is a clothing exchange marketplace designed to encourage reuse.
Members can publish clothing listings, browse available items, and
propose a **one-item-for-one-item** exchange. Once a swap is accepted,
both participants can confirm that the exchange has been completed.

The project demonstrates a full-stack application built with React,
Java, Spring Boot, MongoDB, Spring Security, JWT, WebSockets, and
Docker.

## Live Demo

  --------------------------------------------------------------------------------------------------------------------
  Component                           URL
  ----------------------------------- --------------------------------------------------------------------------------
  Frontend                            [rewear-frontend-we7t.onrender.com](https://rewear-frontend-we7t.onrender.com)

  Backend                             [rewear-backend-5z47.onrender.com](https://rewear-backend-5z47.onrender.com)
  --------------------------------------------------------------------------------------------------------------------

> The backend root URL is a service endpoint, not a user-facing
> homepage. Some routes require authentication. Render free instances
> may take time to wake after inactivity.

## Features

### Marketplace

-   Browse clothing listings and view item details.
-   View listing attributes such as title, description, category, size,
    condition, city, and estimated swap value.
-   Create and manage personal listings.
-   Display clothing photos using image URLs.

### Accounts and security

-   Registration and login.
-   JWT-based authentication for protected API requests.
-   Role-based authorization for regular users and administrators.
-   Profile details such as name, city, bio, and profile image where
    provided.

### Swap workflow

-   Request a one-to-one swap by selecting an item to request and an
    item to offer.
-   View sent and incoming requests.
-   Accept or reject incoming requests.
-   Accepted swaps reserve both items and reject conflicting pending
    requests through the normal application workflow.
-   Both participants confirm completion before an exchange is marked
    completed.

### Messaging

-   Real-time messaging infrastructure using Spring WebSocket/STOMP.
-   Frontend support for conversations and unread-message indicators.

### Administration

-   Dashboard statistics and analytics.
-   User activation/deactivation.
-   Listing moderation and deletion.
-   Activity logs for selected administrative actions.
-   Administrator endpoints protected by role-based authorization.

## Technology Stack

  Layer                     Technologies
  ------------------------- -------------------------------------------
  Frontend                  React, Vite, Tailwind CSS, React Router
  Backend                   Java 25, Spring Boot 4.1.1, Maven
  API and security          REST, Spring Security, JWT
  Database                  MongoDB Atlas, Spring Data MongoDB
  Real-time communication   Spring WebSocket, STOMP
  Packaging                 Docker, multi-stage build
  Hosting                   Render Static Site and Render Web Service
  API testing               Postman

## Architecture

``` mermaid
flowchart TD
    Browser["User's browser"]
    Frontend["React + Vite frontend<br/>Render Static Site"]
    Backend["Spring Boot REST API<br/>Docker Web Service"]
    Security["Spring Security + JWT"]
    Mongo["MongoDB Atlas"]
    WS["WebSocket / STOMP"]

    Browser --> Frontend
    Frontend -->|"HTTPS / JSON"| Backend
    Backend --> Security
    Security --> Mongo
    Frontend <-->|"Real-time messages"| WS
    WS --- Backend
```

## Repository Structure

``` text
Clothing-Exchange-Api/
├── src/main/java/com/clothingexchange/
│   ├── config/          # Security, CORS and configuration
│   ├── controller/      # REST controllers
│   ├── dto/             # Request and response objects
│   ├── model/           # MongoDB document models
│   ├── repository/      # Spring Data repositories
│   ├── security/        # JWT components
│   └── service/         # Business logic
├── src/main/resources/
│   └── application.yaml
├── frontend/
│   ├── src/api/         # API client and endpoint helpers
│   ├── src/components/  # Reusable UI components
│   ├── src/hooks/       # React hooks
│   └── src/pages/       # Application pages
├── .dockerignore
├── .gitignore
├── Dockerfile
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

-   Java JDK 25
-   Node.js and npm
-   Git
-   MongoDB Atlas account and database user
-   Postman or another HTTP client
-   Docker Desktop (optional, for container workflow)

### 1. Clone the repository

``` bash
git clone https://github.com/Sandeep8217/Clothing-Exchange-Api.git
cd Clothing-Exchange-Api
```

### 2. Configure the backend

Create a local `.env` file in the repository root. Do not commit it.

``` dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
JWT_SECRET=<your-strong-secret>
```

Replace placeholders with your own Atlas connection details and a strong
JWT secret. URL-encode special characters in the database password if
required by MongoDB connection-string syntax.

Start the backend on Windows from the repository root:

``` powershell
.\mvnw.cmd spring-boot:run
```

If the Maven Wrapper is unavailable and Maven is installed:

``` powershell
mvn spring-boot:run
```

The backend should be available at `http://localhost:8080`.

### 3. Configure and run the frontend

Create `frontend/.env` for local development:

``` dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

Then run:

``` powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Build the frontend

From `frontend/`:

``` powershell
npm run build
```

Vite writes the production build to `frontend/dist`.

## Environment Variables

  -----------------------------------------------------------------------
  Variable                Used by                 Purpose
  ----------------------- ----------------------- -----------------------
  `MONGODB_URI`           Backend                 MongoDB Atlas
                                                  connection string

  `JWT_SECRET`            Backend                 JWT signing/validation
                                                  secret

  `PORT`                  Backend host            Render-provided HTTP
                                                  port; defaults to
                                                  `8080` locally

  `VITE_API_BASE_URL`     Frontend                Backend API base URL,
                                                  including `/api`
  -----------------------------------------------------------------------

Production frontend example:

``` dotenv
VITE_API_BASE_URL=https://rewear-backend-5z47.onrender.com/api
```

Set backend secrets in Render's Environment settings. Variables prefixed
with `VITE_` are bundled into client-side code and are **not secret**.
Rebuild the frontend after changing a `VITE_` variable.

## Docker

From the repository root:

``` powershell
docker build -t rewear-backend:latest .
docker run -d --name rewear-backend -p 8081:8080 --env-file .env rewear-backend:latest
```

The API is then available at `http://localhost:8081`.

View logs:

``` powershell
docker logs --tail 100 rewear-backend
```

Stop and remove the container:

``` powershell
docker stop rewear-backend
docker rm rewear-backend
```

Do not copy `.env` into the image or commit it. `.dockerignore` excludes
local environment files from the build context.

## API Overview

The backend exposes REST endpoints under `/api`. This table summarizes
the known route groups; consult controller and DTO classes for exact
request/response schemas.

  --------------------------------------------------------------------------------------
  Route                                  Purpose                 Access
  -------------------------------------- ----------------------- -----------------------
  `/api/auth/**`                         Registration and        Public routes, subject
                                         authentication          to validation

  `/api/clothing` and supported browse   Browse clothing         Public GET routes
  routes                                 listings                

  `/api/swaps`                           Create a swap request   Authenticated

  `/api/swaps/my-requests`               View sent requests      Authenticated

  `/api/swaps/incoming`                  View incoming requests  Authenticated

  `/api/swaps/{id}/accept`               Accept a swap           Authenticated;
                                                                 ownership checked

  `/api/swaps/{id}/reject`               Reject a swap           Authenticated;
                                                                 ownership checked

  `/api/swaps/{id}/confirm-completion`   Confirm completion      Authenticated;
                                                                 participant checked

  `/api/admin/**`                        Administrative          `ADMIN` role required
                                         operations              

  `/ws` and `/ws/**`                     WebSocket handshake     Handshake permitted;
                                         routes                  messaging authorization
                                                                 still applies
  --------------------------------------------------------------------------------------

For exact request and response fields, inspect controller and DTO
classes under `src/main/java/com/clothingexchange/`.

## Deployment

The application is deployed as two Render services with MongoDB Atlas as
the database.

### Frontend --- Render Static Site

-   Root directory: `frontend`
-   Build command: `npm install && npm run build`
-   Publish directory: `dist` (relative to `frontend`)
-   Environment variable:
    `VITE_API_BASE_URL=https://rewear-backend-5z47.onrender.com/api`

### Backend --- Render Web Service

-   Runtime: Docker
-   Build context: `.`
-   Dockerfile: `./Dockerfile`
-   Required environment variables: `MONGODB_URI`, `JWT_SECRET`
-   Port: uses `PORT` when provided, otherwise `8080`

The backend CORS configuration must allow this deployed frontend origin:

``` text
https://rewear-frontend-we7t.onrender.com
```

After pushing changes, verify that the relevant Render deployment
succeeds. Render free instances may spin down after inactivity; hosting
terms and limits can change.

## Troubleshooting

  -----------------------------------------------------------------------
  Symptom                             What to check
  ----------------------------------- -----------------------------------
  Frontend says "Failed to fetch"     `VITE_API_BASE_URL`, backend
                                      status, browser Console, and
                                      backend CORS origins

  `401 Unauthorized`                  JWT presence, validity, and Bearer
                                      header

  `403 Forbidden`                     Security rules, role, ownership
                                      checks, HTTP method and URL

  MongoDB connection failure          `MONGODB_URI`, Atlas network
                                      access, database-user permissions,
                                      URL-encoding

  Render cannot find `dist`           With root directory `frontend`,
                                      publish directory should be `dist`,
                                      not `frontend/dist`

  Latest code is not live             Verify pushed commit and latest
                                      Render deployment; rebuild after
                                      `VITE_` changes

  First request is slow               A free Render service may be waking
                                      after inactivity
  -----------------------------------------------------------------------

Use browser DevTools, Postman responses, Render logs, and local terminal
output to diagnose errors before changing code.

## Security

-   Never commit `.env`, passwords, JWT secrets, access tokens, or
    private keys.
-   Rotate exposed secrets immediately. Removing a secret from the
    latest commit does not erase Git history.
-   Restrict MongoDB Atlas network access and database privileges.
-   Validate input and enforce authorization on the backend.
-   Never log passwords, JWTs, or connection strings.
-   Review token storage and session behavior before using the
    application with sensitive real-world data.

## Contributing

1.  Fork the repository.
2.  Create a branch: `git checkout -b feature/your-feature`.
3.  Make a focused change.
4.  Test the affected backend or frontend behavior.
5.  Commit with a descriptive message.
6.  Open a pull request describing the change and how it was tested.

Do not include credentials, production data, or private user information
in issues or pull requests.

## License

No license file is currently included. Until a license is added, do not
assume the project is available for reuse, redistribution, or
modification under an open-source license.
