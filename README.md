WE-MEET

We-Meet is a real-time social media web application that brings people together through posts, chat, and instant notifications. It combines the features of 
a modern social platform with live communication tools, allowing users to:

- Create and share posts with text, images, and audio.
- Connect with friends through personal profiles and activity feeds.
- Chat in real time with support for both text and voice messages (powered by Socket.IO).
- Receive instant notifications for messages, posts, and interactions.
- Enjoy a responsive and intuitive interface built with React (Vite) + Material UI.

The backend is powered by Express.js and MongoDB for secure, scalable data management, while Socket.IO enables seamless real-time communication.

✨ **Features** :

- 🔐 User authentication (signup, login, password reset)
- 👤 User profiles with posts and details
- 💬 Real-time chat with text and audio messages (via Socket.IO)
- 🖼 Media upload (images, audio) with Multer
- 📰 Feed with posts and comments
- 🔔 Notifications system
- 📱 Responsive UI built with React + MUI 

🛠 **Tech Stack :**

**Frontend (Vite + React)**

- React 19, React Router DOM
- MUI (Material UI)
- Styled Components
- Socket.IO Client
- Axios

**Backend (Express + MongoDB)**

-Express.js, Mongoose
-Multer (file uploads)
-Helmet & CORS (security)
-Morgan (logging)

**Real-time Communication**

Socket.IO

**📂 Project Structure**:

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
