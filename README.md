# Blog App

A blog management application that allows users to log in, create blogs, update likes, delete blogs, and view users and their blogs.

## Technologies

- **Frontend:** React 19, Vite, React Router, Material UI, Zustand
- **Backend:** Node.js, Express 5, MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **Infrastructure:** Nginx, Docker Compose, MongoDB, Redis

## Requirements

- Node.js 20 or later
- npm
- MongoDB locally, or Docker and Docker Compose

## Local Development

Install dependencies from the project root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

Create `server/.env` with the following values and adjust them for your environment:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/bloglist
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/bloglist_test
SECRET=change-this-secret
NODE_ENV=development
```

Start the backend and frontend together:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- API: `http://localhost:3001/api`

To run them separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Running with Docker Compose

This starts the frontend, backend, MongoDB, Redis, and Nginx:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Open the following URL after the services start:

```text
http://localhost:8080
```

Stop the services with:

```bash
docker compose -f docker-compose.dev.yml down
```

MongoDB data is stored in a volume named `mongo_data`. To remove the data as well:

```bash
docker compose -f docker-compose.dev.yml down -v
```

> Note: `docker-compose.yml` and `docker-compose.dev.yml` currently use the same configuration.

## Project Commands

Run these commands from the project root:

```bash
npm run dev       # Start the frontend and backend in development mode
npm start         # Start the backend only
npm run build     # Install dependencies and build the frontend
npm test          # Run frontend and backend tests
npm run lint      # Lint the codebase
```

Component-specific test commands:

```bash
npm test --prefix client
npm test --prefix server
npm run test:coverage --prefix client
```

## API

All of the following paths are prefixed with `/api`:

| Method   | Path         | Description                            |
| -------- | ------------ | -------------------------------------- |
| `GET`    | `/blogs`     | Get all blogs                          |
| `POST`   | `/blogs`     | Create a blog; requires a Bearer token |
| `PUT`    | `/blogs/:id` | Update the number of likes             |
| `DELETE` | `/blogs/:id` | Delete a blog; requires a Bearer token |
| `GET`    | `/users`     | Get all users                          |
| `POST`   | `/users`     | Create a user                          |
| `DELETE` | `/users/:id` | Delete a user                          |
| `POST`   | `/login`     | Log in and issue a JWT                 |

Authentication header format:

```text
Authorization: Bearer <token>
```

Example user creation request:

```json
{
  "userName": "jane",
  "name": "Jane Doe",
  "password": "password"
}
```

Example blog creation request:

```json
{
  "title": "My first blog",
  "author": "Jane Doe",
  "url": "https://example.com/blog",
  "likes": 0
}
```

## Project Structure

```text
client/              React application and frontend tests
server/              Express server, models, and controllers
  controllers/       Blog, user, and login routes
  models/             MongoDB models
  tests/              Backend tests
nginx*.conf          Frontend and API proxy configuration
docker-compose*.yml  Local service configuration
```

## Security Notes

- Do not commit the real `SECRET` value to Git.
- Do not use the default MongoDB passwords in production.
- Configure production environment variables before deploying the application.
