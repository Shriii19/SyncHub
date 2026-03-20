# SyncHub Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**Real-time Chat Application Backend API**

</div>

---

## 📖 About The Project

SyncHub Backend is a robust Node.js/Express server that powers a real-time chat application. It provides RESTful APIs for user authentication, message management, and WebSocket connections for instant messaging capabilities using Socket.io.

### ✨ Key Features

- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- 💬 **Real-time Messaging** - Instant message delivery using Socket.io
- 🚪 **Room Management** - Support for multiple chat rooms
- 📝 **Message History** - Persistent message storage in MongoDB
- 🔄 **RESTful APIs** - Well-structured API endpoints for all operations
- 🌐 **CORS Enabled** - Cross-origin resource sharing support
- 📊 **MongoDB Integration** - Efficient data persistence with Mongoose ODM

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling |
| **Socket.io** | Real-time bidirectional communication |
| **JWT** | JSON Web Token for authentication |
| **Bcrypt.js** | Password hashing |
| **dotenv** | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shriii19/synchub-backend.git
   cd synchub-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**
   
   Development mode (with nodemon):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── models/
│   ├── User.js              # User schema
│   ├── Room.js              # Chat room schema
│   └── Message.js           # Message schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── messageRoutes.js     # Message routes
├── server.js                # Main application entry point
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (not in repo)
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages/:roomId` | Get room messages | Yes |
| POST | `/api/messages` | Send a message | Yes |

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | User connects to socket |
| `joinRoom` | Client → Server | User joins a chat room |
| `sendMessage` | Client → Server | User sends a message |
| `receiveMessage` | Server → Client | Broadcast message to room |
| `disconnect` | Client → Server | User disconnects |

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/synchub` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected routes with middleware
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variable security

---

## 🚀 Future Scope

### Phase 1: Enhanced Features
- 🔔 **Push Notifications** - Real-time browser notifications for new messages
- 📎 **File Sharing** - Support for image, video, and document uploads
- 🎤 **Voice Messages** - Audio message recording and playback
- 👥 **User Profiles** - Extended profile information and avatars
- 🔍 **Message Search** - Full-text search across conversations

### Phase 2: Advanced Functionality
- 📹 **Video Calls** - WebRTC integration for video/audio calls
- 🤖 **Bot Integration** - Automated responses and chatbots
- 🔐 **End-to-End Encryption** - Enhanced message security
- 📊 **Analytics Dashboard** - User activity and message statistics
- 🌍 **Multi-language Support** - Internationalization

### Phase 3: Scalability
- 🔄 **Redis Integration** - Caching and session management
- 📈 **Load Balancing** - Horizontal scaling support
- 🐳 **Docker Deployment** - Containerization
- ☁️ **Cloud Storage** - AWS S3 or similar for media files
- 📧 **Email Notifications** - Email alerts for important events

### Phase 4: Enterprise Features
- 👔 **Admin Panel** - User and content management
- 📝 **Audit Logs** - Comprehensive activity logging
- 🔑 **OAuth Integration** - Social login (Google, Facebook, GitHub)
- 💼 **Team Workspaces** - Organization-based chat rooms
- 📱 **Mobile API** - Optimized endpoints for mobile apps

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📧 Contact

Project Link: [https://github.com/Shriii19/synchub-backend](https://github.com/Shriii19/synchub-backend)

Frontend Repository: [https://github.com/Shriii19/synchub-frontend](https://github.com/Shriii19/synchub-frontend)

---

<div align="center">

Made with ❤️ by the SyncHub Team

</div>
