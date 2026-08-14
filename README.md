# Admin Backend — St. Mary's School

A production-ready Node.js / Express / MongoDB API powering an admin panel for managing a school website's dynamic content: management members, managing committee, staff, teaching staff, circulars, gallery, and downloads.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT stored in an HTTP-only cookie
- **File uploads:** Multer (images, PDFs, documents)
- **Image optimization:** Sharp (resizes and compresses uploaded images)
- **Security:** Helmet, CORS, express-rate-limit on the login route

## Setup

### 1. Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)

### 2. Install dependencies
```bash
cd admin-backend
npm install
```

### 3. Configure environment variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap credentials — the first successful login with these creates the admin account in the database |
| `CLIENT_URL` | Origin of your frontend, used for CORS |

### 4. Run the server
```bash
npm run dev     # nodemon, auto-restarts on changes
npm start       # plain node, for production
```

The API will be available at `http://localhost:5000`.

## Project Structure

```
admin-backend/
├── uploads/                  # Uploaded files (images, circulars, downloads)
├── src/
│   ├── config/database.js    # MongoDB connection
│   ├── models/                # Mongoose schemas
│   ├── controllers/           # Request handlers / business logic
│   ├── routes/                 # Express routers
│   ├── middleware/
│   │   ├── auth.js            # JWT verification (protect middleware)
│   │   └── upload.js          # Multer storage + Sharp compression
│   └── index.js               # App entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Authentication

- `POST /api/auth/login` — the **first** login using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` automatically creates the admin record in MongoDB. Subsequent logins check the stored (hashed) password.
- The JWT is set as an `httpOnly` cookie (`adminToken`), valid for 7 days. It's also accepted via `Authorization: Bearer <token>` if needed for non-browser clients.
- All mutating routes (`POST`, `PUT`, `DELETE`) and "all records" list routes require this cookie/token via the `protect` middleware. Public `GET` routes only return records where `isActive: true`.

## API Reference

All responses follow the shape `{ success: boolean, data?: any, message?: string }`.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Log in, sets cookie |
| POST | `/api/auth/logout` | — | Clears cookie |
| GET | `/api/auth/check` | ✅ | Returns current admin |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Resource routes
The following resources all share the same CRUD pattern:

`management`, `managing-committee`, `staff`, `teaching-staff`, `circulars`, `gallery`, `downloads`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/<resource>` | ✅ | Create (multipart/form-data for file uploads) |
| GET | `/api/<resource>` | — | List active records (public-facing) |
| GET | `/api/<resource>/all` | ✅ | List all records, including inactive (admin view) |
| GET | `/api/<resource>/:id` | — | Get one record |
| PUT | `/api/<resource>/:id` | ✅ | Update (multipart/form-data if replacing a file) |
| DELETE | `/api/<resource>/:id` | ✅ | Delete record and its associated file(s) |

Upload field names by resource:
- `management`, `managing-committee`, `staff`, `teaching-staff` → `image` (single file)
- `circulars` → `pdf` (single file)
- `gallery` → `images` (up to 4 files)
- `downloads` → `file` (single file, any of pdf/doc/docx/xls/xlsx/ppt/pptx/txt/zip/rar)

Uploaded images are automatically resized (max width 1200px) and compressed via Sharp to keep storage and bandwidth down. When a record is updated with a new file or deleted, the old file on disk is removed automatically.

## Notes for Production

- Set `NODE_ENV=production` so cookies are marked `secure` (requires HTTPS).
- Replace `JWT_SECRET` with a long, random value — never reuse the example.
- Consider moving `uploads/` to object storage (e.g. S3) for horizontal scaling; the current setup stores files on local disk.
- The MongoDB URI, admin credentials, and JWT secret should be managed via your hosting provider's secrets manager rather than a committed `.env` file.
