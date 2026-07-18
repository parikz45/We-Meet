# WE-MEET - Real-time Social Media Web Application

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![Socket.IO](https://img.shields.io/badge/Socket.IO-RealTime-lightgrey)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)

We-Meet is a real-time social media web application that brings people together through posts, chat, and instant notifications.  
It combines the features of a modern social platform with live communication tools, powered by **Socket.IO**, **Express.js**, **MongoDB**, and **React (Vite)**.

---

## Features
- 🔐 JWT-based authentication (signup, login, password reset)  
- 👤 User profiles with posts and details  
- 📰 Feed with posts from followed users  
- 💬 Real-time chat with text and audio messages (via Socket.IO)  
- 🖼 Media upload (images, audio) to **Cloudinary** (type + size validated)  
- 🔔 Notifications system  
- 📱 Responsive UI built with React + Tailwind + MUI  

---

## Tech Stack

### Frontend (Vite + React)
- ⚛️ React 19, React Router DOM  
- 🎨 Tailwind CSS, Material UI (MUI)  
- ⚡ Axios (with a global auth interceptor), Socket.IO Client  

### Backend (Express + MongoDB)
- 🚀 Express.js, Mongoose  
- 🔑 **jsonwebtoken** (JWT auth) + **bcryptjs** (password hashing)  
- 🚦 **express-rate-limit** (brute-force protection on auth routes)  
- 📦 Multer (in-memory) + **Cloudinary** (persistent media storage)  
- 🛡 Helmet & CORS (security)  
- 📜 Morgan (logging)  

### Real-time Communication
- 🔌 Socket.IO (JWT-authenticated handshake)  

---

## 🔐 Authentication (JWT)

Authentication is **stateless** and based on JSON Web Tokens.

**Flow**
1. On `register` / `login`, the server verifies credentials (passwords are hashed with **bcrypt**) and signs a token:
   ```js
   jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
   ```
2. The response returns the user object (**password stripped**) plus the `token`.
3. The frontend stores the user (including the token) in `localStorage`. A global Axios request interceptor attaches it to every request:
   ```
   Authorization: Bearer <token>
   ```
4. A `verifyToken` middleware runs on all non-auth routes. It validates the token, attaches the decoded payload to `req.user`, and **every handler derives the acting user from `req.user.id` — never from the request body.** This prevents users from impersonating others by passing a different `userId`.
5. If a token is missing/expired/invalid, the API responds `401/403`; a response interceptor on the client clears the session and redirects to login.
6. The **Socket.IO** server authenticates the connection handshake with the same token/secret, so real-time messaging can't be spoofed.

**Design choice:** the token is sent via the `Authorization` header (localStorage), not an httpOnly cookie, because the frontend (Vercel) and backend (Render) are on **different sites** — cross-site cookies are fragile, while a Bearer header is straightforward. Trade-off: localStorage is readable by XSS, so treat XSS prevention as important.

> 📚 See [`JWT-INTERVIEW.md`](JWT-INTERVIEW.md) for a deep-dive Q&A on how JWT works and how it's applied in this project.

---

## 📂 Project Structure

```bash
We-Meet/
├── api/                  # Backend (Express + MongoDB)
│   ├── index.js          # Server entry point, middleware, uploads
│   ├── middleware/
│   │   └── verifyToken.js # JWT verification middleware
│   ├── routes/           # API routes (auth, users, posts, messages, etc.)
│   └── Models/           # Mongoose models
│
├── frontend/             # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx       # Main app with routes
│       ├── setupAxios.js # Axios interceptors (attach token, handle 401)
│       ├── Components/    # UI components
│       └── context/      # AuthContext for user state
│
├── socket/               # WebSocket server
│   └── index.js          # Socket.IO server (JWT-authenticated)
│
└── README.md             # Documentation
```

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parikz45/We-Meet.git
   cd We-Meet
   ```

2. **Backend Setup (API):**
   ```bash
   cd api
   npm install
   ```
   Create a `.env` file in `api/` (see `api/.env.example`):
   ```env
   PORT=8800
   Mongo_Url=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=a_long_random_secret
   REFRESH_TOKEN_SECRET=another_long_random_secret
   FRONTEND_URL=http://localhost:5173
   EMAIL=your_gmail_address           # only needed for password-reset emails
   EMAIL_PASS=your_gmail_app_password # only needed for password-reset emails
   # Cloudinary (media storage) — from your Cloudinary dashboard
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Run backend:
   ```bash
   npm run dev   # development (nodemon)
   npm start     # production
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs on [http://localhost:5173](http://localhost:5173).  
   Optional `frontend/.env`:
   ```env
   VITE_PUBLIC_FOLDER=https://your-backend-host/images/
   VITE_LOCAL_API=true   # dev only: route API calls to the local backend (localhost:8800)
   ```

4. **Socket Server Setup:**
   ```bash
   cd socket
   npm install
   npm start
   ```
   Create `socket/.env`:
   ```env
   ACCESS_TOKEN_SECRET=a_long_random_secret   # MUST match the API's value
   PORT=8900
   ```

> ⚠️ **Never commit `.env` files** — they contain secrets. Set the same variables in your hosting dashboards (Render / Vercel / Railway). `ACCESS_TOKEN_SECRET` must be identical on the API and the Socket server.

---

## 🔌 API Endpoints

> All routes except `/api/auth/*` require an `Authorization: Bearer <token>` header.

| Method | Endpoint                | Auth | Description              |
| ------ | ----------------------- | :--: | ------------------------ |
| POST   | `/api/auth/register`    |  ❌  | Register a new user (returns token) |
| POST   | `/api/auth/login`       |  ❌  | User login (returns token) |
| POST   | `/api/auth/forgot-password` | ❌ | Request a password-reset email |
| POST   | `/api/auth/reset-password/:token` | ❌ | Reset password |
| GET    | `/api/users?userId=`    |  ✅  | Get user details         |
| PUT    | `/api/users/:id`        |  ✅  | Update own profile (field-whitelisted) |
| PUT    | `/api/users/:id/follow` |  ✅  | Follow a user            |
| POST   | `/api/posts`            |  ✅  | Create a post            |
| PUT    | `/api/posts/:id/like`   |  ✅  | Like / unlike a post     |
| GET    | `/api/posts/timeline/:userId` | ✅ | Get timeline posts    |
| POST   | `/api/conversations`    |  ✅  | Start a new conversation |
| GET    | `/api/messages/:convId` |  ✅  | Get messages in a chat   |
| POST   | `/api/upload`           |  ✅  | Upload an image (returns Cloudinary URL) |
| POST   | `/api/messages/audio`   |  ✅  | Upload & send audio msg (stored on Cloudinary) |

---

## ⚡ Real-time Events (Socket.IO)

The client connects with the JWT in the handshake:
```js
io(SOCKET_URL, { auth: { token }, transports: ["websocket"] })
```

- Connection is rejected unless the token is valid (verified server-side).  
- `getUsers` → broadcasts active users  
- `sendMessage(message)` → send a message to a receiver (sender is taken from the token)  
- `getMessage` → receive a message in real time  
- `disconnect` → removes the user from the active list  

---

## 🖼 Media Storage (Cloudinary)

Uploaded images and audio are stored on **Cloudinary**, not the server's disk.

**Why:** hosts like Render/Railway have an **ephemeral filesystem** — anything written to local disk is wiped on every deploy/restart, so local uploads don't survive. Cloudinary gives each file a permanent CDN URL.

**Flow**
1. Multer receives the file **in memory** (no disk write).
2. The API streams the buffer to Cloudinary (`upload_stream`).
3. Cloudinary returns a permanent `secure_url`, which is stored in MongoDB.
4. The frontend's `media()` helper ([frontend/src/utils/media.js](frontend/src/utils/media.js)) renders full URLs as-is and prefixes bare filenames (committed defaults) with `VITE_PUBLIC_FOLDER`.

Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (set locally and in the Render dashboard).

---

## 🔒 Security Notes
- Passwords hashed with **bcrypt**; never returned in API responses.  
- **JWT** required on all non-auth routes; identity derived from the token, not the request body.  
- **Rate limiting** on auth endpoints (login / register / forgot-password).  
- **Upload validation**: images and audio restricted by MIME type and size; files buffered in memory and streamed to Cloudinary (no disk writes).  
- User updates are **field-whitelisted** to prevent mass-assignment (e.g. `isAdmin`).  
- Secrets live in environment variables and are excluded from version control.  

---

## 🚀 Deployment

- **Frontend:** Vercel (auto-deploys from git)  
- **Backend (API):** Render (manual deploy)  
- **Socket Server:** Railway  

> The frontend, API, and socket are coupled by the JWT. When deploying the auth changes, update them close together and ensure `ACCESS_TOKEN_SECRET` is set in each service's dashboard (identical value on API and Socket).
>
> The API also needs `Mongo_Url` and the `CLOUDINARY_*` variables set in the **Render** dashboard (the committed `.env` was removed, so dashboard env vars are the single source of truth).

---

## 🤝 Contributing

1. Fork the repo.  
2. Create your feature branch (`git checkout -b feature/new-feature`).  
3. Commit changes (`git commit -m 'Add new feature'`).  
4. Push to branch (`git push origin feature/new-feature`).  
5. Create a Pull Request.  
