# WE-MEET - Real-time Social Media Web Application

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![Socket.IO](https://img.shields.io/badge/Socket.IO-RealTime-lightgrey)

We-Meet is a real-time social media web application that brings people together through posts, chat, and instant notifications.  
It combines the features of a modern social platform with live communication tools, powered by **Socket.IO**, **Express.js**, **MongoDB**, and **React (Vite)**.

---

## Features
- 🔐 User authentication (signup, login, password reset)  
- 👤 User profiles with posts and details  
- 📰 Feed with posts and comments  
- 💬 Real-time chat with text and audio messages (via Socket.IO)  
- 🖼 Media upload (images, audio) with Multer  
- 🔔 Notifications system  
- 📱 Responsive UI built with React + MUI  

---

## Tech Stack

### Frontend (Vite + React)
- ⚛️ React 19, React Router DOM  
- 🎨 Material UI (MUI), Styled Components  
- ⚡ Axios, Socket.IO Client  

### Backend (Express + MongoDB)
- 🚀 Express.js, Mongoose  
- 📦 Multer (file uploads)  
- 🛡 Helmet & CORS (security)  
- 📜 Morgan (logging)  

### Real-time Communication
- 🔌 Socket.IO  

---

## Project Structure

```bash
We-Meet/
├── api/              # Backend (Express + MongoDB)
│   ├── index.js      # Server entry point
│   ├── routes/       # API routes (auth, users, posts, messages, etc.)
│   └── Models/       # Mongoose models
│
├── frontend/         # Frontend (React + Vite)
│   ├── App.jsx       # Main app with routes
│   ├── Components/   # UI components 
│   └── context/      # AuthContext for user state
│
├── socket/           # WebSocket 
│   └── index.js      # Socket.IO server
│
└── README.md         # Documentation



**⚙️ Setup & Installation :**

1. **Clone the repository:**

	git clone https://github.com/parikz45/We-Meet.git
	cd We-Meet
2. **Backend Setup (API):**
	cd api
	npm install

	Create a .env file in api/ with:
		PORT=5000
		Mongo_Url=your_mongodb_connection_string

	Run backend:
		npm run dev   # for development
		npm start     # for production


3. **Frontend Setup:**

	cd frontend
	npm install

	Run frontend:
		npm run dev
	By default, frontend runs on http://localhost:5173.

4. Socket Server Setup

	cd socket
	npm install
	npm start

## Screenshots

| Home Feed | Post Creation | Profile Page |
|-----------|---------------|---------------|
| ![Home Feed](frontend/src/assets/images/home-feed.png) | ![Post Creation](frontend/srcassets/images/post-creation.png) | ![Profile Page](frontend/srcassets/images/profile-page.png) |

| Notifications | Chat | Settings |
|---------------|------|----------|
| ![Notifications](assets/images/notifications.png) | ![Chat](assets/images/chat.png) | ![Settings](assets/images/settings.png) |

> **Note:** Save your screenshots in the `assets/images` folder with the above file names.


🔌 **API Endpoints :**

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/auth/register`    | Register a new user      |
| POST   | `/api/auth/login`       | User login               |
| GET    | `/api/users/:id`        | Get user details         |
| PUT    | `/api/users/:id`        | Update user details      |
| POST   | `/api/posts`            | Create a post            |
| GET    | `/api/posts/:id`        | Get post details         |
| POST   | `/api/conversations`    | Start a new conversation |
| GET    | `/api/messages/:convId` | Get messages in chat     |
| POST   | `/api/upload`           | Upload an image          |
| POST   | `/api/messages/audio`   | Upload & send audio msg  |

⚡ **Real-time Events (Socket.IO) :**

- addUser(userId) → Adds user to active users list
- getUsers → Broadcasts active users
- sendMessage(message) → Send message to a receiver
- getMessage → Receive message in real time
- disconnect → Removes user from active list

🚀 **Deployment :**

- Frontend: Vercel / Netlify
- Backend: Sevalla or AWS EC2
- Socket Server: Can run on same backend or a separate Node server

🤝 **Contributing :**

1. Fork the repo.
2. Create your feature branch (git checkout -b feature/new-feature).
3. Commit changes (git commit -m 'Add new feature').
4. Push to branch (git push origin feature/new-feature).
5. Create a Pull Request

📜 **License **

This project is licensed under the MIT License.
