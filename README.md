# Kanban Project

This repository contains a Docker-based setup for a Python/Graphene backend and a React/Tailwind frontend with Apollo Client for GraphQL. It provides a foundation for a dynamic Kanban board with drag-and-drop functionality.

## Structure

- `docker-compose.yml` — orchestrates backend, frontend, and local DynamoDB services
- `backend/` — FastAPI/Graphene GraphQL backend with DynamoDB integration
- `frontend/` — React application with Tailwind CSS and Apollo Client
- `README.md` — this file

## Prerequisites

- Docker & Docker Compose
- Node.js & Yarn (for frontend)
- Python 3.11+ (for backend scripts)

## Local Development Workspace

1. **Clone the repo**  
   ```sh
   git clone https://github.com/esalazarlarsen/opus
   ```

2. **Create your `.env` file**  
   At the root of your folder, run:

   ```sh
   cat > .env <<EOF
   COMPOSE_PROJECT_NAME=opus
   DYNAMODB_ENDPOINT_URL=http://dynamodb-local:8000
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=local
   AWS_SECRET_ACCESS_KEY=local
   EOF
   ```

3. **Start services**  
   ```sh
   docker-compose up --build
   ```
   - Backend GraphQL API: `http://localhost:8000/graphql`
   - Frontend UI: `http://localhost:3000`
   - Local DynamoDB: endpoint at `http://localhost:8001`

## Cleanup

- To stop and remove containers:  
  ```sh
  docker-compose down
  ```
- To remove local DynamoDB data:  
  ```sh
  docker volume rm dynamodb-data
  ```
