# Blog App

A full-stack blogging platform built with the MERN stack. Writers can publish rich-text posts with cover images and tags, readers can like, save and discuss them in threaded comments, and everyone can follow their favourite creators. Authentication supports both email/password (with email verification) and Google sign-in.

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

**Authentication**
- Sign up and sign in with email and password (passwords hashed with bcrypt)
- Email verification link sent through Nodemailer
- Google sign-in via Firebase
- Stateless JWT authentication with protected routes on both client and server

**Blogging**
- Rich-text editor (Tiptap) with a required cover image
- Tags (up to 10 per post) with tag-based browsing
- Save posts as drafts and publish later from your profile
- Edit and delete your own posts; cover images are managed on Cloudinary

**Engagement**
- Like, dislike and save posts
- Threaded (nested) comments with edit, delete and comment likes
- Follow and unfollow creators
- Per-user privacy settings for showing liked and saved blogs

**Discovery**
- Full-text style search across titles and descriptions
- Infinite scroll powered by server-side pagination
- Profile pages with tabs for published, draft, saved and liked blogs

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite 7, React Router 7, Redux Toolkit, Tailwind CSS 4, Tiptap, Axios, React Hot Toast |
| **Backend** | Node.js, Express 5, Mongoose 8, JSON Web Tokens, bcrypt, Multer |
| **Database** | MongoDB |
| **Services** | Cloudinary (image storage), Firebase Auth and Admin SDK (Google sign-in), Nodemailer (transactional email) |
| **Hosting** | Vercel (frontend) |

---

## Project Structure

```
.
├── backend/
│   ├── config/            # DB, Cloudinary and environment configuration
│   ├── controllers/       # Blog, comment and user business logic
│   ├── middlewares/       # JWT verification
│   ├── models/            # Mongoose schemas: User, Blog, Comment
│   ├── routes/            # Express routers
│   ├── utils/             # Token helpers, Multer, Cloudinary upload, mailer
│   └── server.js          # App entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, HomePage, Comment, Setting, route guards
    │   ├── hooks/         # usePagination (infinite scroll)
    │   ├── pages/         # AuthForm, AddBlog, BlogPage, ProfilePage, ...
    │   └── utils/         # Redux store and slices, Firebase setup
    ├── vercel.json        # SPA rewrite rules
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account
- A [Firebase](https://firebase.google.com/) project with Google sign-in enabled
- An SMTP account for sending verification emails

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in the values (see below)
npm run dev              # starts the API with nodemon
```

The API runs on the port you set in `PORT`.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

Then start the dev server:

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DB_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
FRONTEND_URL=http://localhost:5173

JWT_SECRET=<a-long-random-string>

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_HOST=
EMAIL_PORT=465
EMAIL_USER=
EMAIL_PASS=

# Firebase Admin SDK (from your service account JSON)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSAL_DOMAIN=googleapis.com
```

### Frontend (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the API, including the `/api/v1` prefix |

> **Never commit `.env` files.** Both `.gitignore` files already exclude them.

---

## API Reference

All endpoints are prefixed with `/api/v1`. Routes marked 🔒 require an `Authorization: Bearer <token>` header.

### Auth and Users

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/signup` | Register a new user and send a verification email |
| POST | `/signin` | Log in with email and password |
| POST | `/google-auth` | Sign in or sign up with Google |
| GET | `/verify-email/:verificationToken` | Verify an email address |
| GET | `/users` | List users |
| GET | `/users/:username` | Get a public profile |
| PATCH | `/users/:id` | Update profile (supports `profilepic` upload) |
| DELETE | `/users/:id` | Delete a user |
| PATCH | `/follow-creator/:id` 🔒 | Follow or unfollow a creator |
| GET | `/settings/blog-visibility` 🔒 | Get liked/saved visibility settings |
| PATCH | `/settings/blog-visibility` 🔒 | Update liked/saved visibility settings |

### Blogs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/blogs` 🔒 | Create a blog (multipart form with `image`) |
| GET | `/blogs?page=1&limit=10` | Paginated list of published blogs |
| GET | `/blogs/:blogId` | Get a single blog |
| PATCH | `/blogs/:id` 🔒 | Update a blog (owner only) |
| DELETE | `/blogs/:id` 🔒 | Delete a blog (owner only) |
| GET | `/search-blog?search=<q>&tag=<tag>&page=1&limit=10` | Search by keyword or tag |
| POST | `/blogs/like/:id` 🔒 | Like or unlike a blog |
| POST | `/blogs/:id/dislike` 🔒 | Dislike or remove dislike |
| PATCH | `/save-blog/:id` 🔒 | Save or unsave a blog |

### Comments

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/blogs/:blogId/comment` 🔒 | Add a comment |
| GET | `/blogs/:blogId/comments` | List comments for a blog |
| GET | `/blogs/:blogId/comments/count` | Get the comment count |
| POST | `/comment/:parentCommentId/:blogId` 🔒 | Reply to a comment |
| PATCH | `/blogs/edit-comment/:id` 🔒 | Edit a comment |
| DELETE | `/blogs/comment/:id` 🔒 | Delete a comment |
| POST | `/comments/:commentId/like` 🔒 | Like or unlike a comment |

---

## Data Models

```
User     name, username*, email*, password, profilepic, bio, isVerify, googleAuth,
         followers[], following[], blogs[], saveBlogs[], likeBlogs[],
         showLikedBlogs, showSavedBlogs

Blog     title, description, content (rich-text JSON), blogId*, creator → User,
         image, imageId, tags[], draft, likes[], totalSaves[], comments[],
         commentsCount

Comment  blogId → Blog, user → User, comment, likes[],
         parentComment → Comment, replies[] → Comment
```

`*` = unique

---

## Deployment

**Frontend (Vercel).** Import the `frontend` directory as a project, set `VITE_BACKEND_URL` in the project settings, and deploy. `vercel.json` rewrites all routes to `index.html` so client-side routing works on refresh.

**Backend.** Deploy the `backend` directory to any Node host (Render, Railway, Fly.io, a VPS, etc.). Set every variable from the table above, and make sure `FRONTEND_URL` matches your deployed frontend origin so CORS allows it.

---

## Roadmap

- [ ] Automated tests (Jest and Supertest for the API, Vitest for the UI)
- [ ] Rate limiting and request validation on the API
- [ ] Notifications for new followers, likes and replies
- [ ] Reading time and view counts
- [ ] Dark mode

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

Distributed under the ISC License. See `LICENSE` for details.

---

## Author

**Anirban**

Built as a full-stack portfolio project. Feedback and suggestions are appreciated.
