# BlogHub
 blog platform.

## Stack

- **Backend:** Go, Fiber, GORM, PostgreSQL
- **Frontend:** React, Vite, Tailwind CSS

## Features

- Admin registration enable/disable
- Session-based auth with bcrypt
- Post CRUD with image upload
- Draft and published states
- Dark mode (default)
- Language toggle (EN/FA)
- Code blocks with copy button
- Public profile popup
- Responsive design

## Setup

### Database

```sql
CREATE USER blog_admin WITH PASSWORD 'change-this-password';
CREATE DATABASE blog_db OWNER blog_admin;
```

## Edit .env with your credentials
```
go mod tidy
go run main.go
Frontend
bash
cd frontend
npm install
npm run dev
```

Create .env in backend/:

```
DB_HOST=localhost
DB_USER=blog_admin
DB_PASSWORD=change-this-password
DB_NAME=blog_db
DB_PORT=5432
SERVER_PORT=8080
SESSION_KEY=generate-a-random-secret-key
```

Access
Frontend: http://localhost:5173
Backend: http://localhost:8080