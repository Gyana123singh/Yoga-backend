# 🧘 AURA Yoga & Wellness Studio - Backend API

Production-ready Express & Node.js backend API supporting both the **Admin Management Dashboard** and the **Customer Mobile Application** (iOS, Android, Flutter, React Native).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Atlas or Local)
- Firebase Project (for Mobile Google Authentication)

### 2. Setup Environment Variables
Create a `.env` file in the `backend` root folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Yoga

# JWT Secret for Mobile Session Tokens
JWT_SECRET=aura_yoga_jwt_secret_key_2026

# Firebase Admin Credentials (Choose Path OR discrete env vars)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebaseServiceAccount.json
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 📱 Customer Mobile Application API Reference

Base URL: `http://localhost:5000`

### 🔑 1. Customer Authentication (`/api/auth`)

#### `POST /api/auth/google-login`
Authenticates mobile users via Firebase Google Sign-In.
- **Request Body**:
  ```json
  {
    "idToken": "FIREBASE_ID_TOKEN_FROM_MOBILE_APP",
    "fcmToken": "optional_push_notification_token",
    "primaryGoal": "General Wellness & Mindfulness",
    "country": "United States",
    "language": "English"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "data": {
      "id": "USR-4829",
      "name": "Anaya",
      "email": "anaya@example.com",
      "avatar": "https://...",
      "planType": "Free",
      "streak": 1,
      "totalMinutes": 0
    }
  }
  ```

#### `GET /api/auth/me`
Gets current logged-in customer profile.
- **Headers**: `Authorization: Bearer <token>`

#### `PUT /api/auth/profile`
Updates customer profile (name, goal, language, FCM token).
- **Headers**: `Authorization: Bearer <token>`

#### `POST /api/auth/logout`
Logs out customer and clears FCM push notification token.
- **Headers**: `Authorization: Bearer <token>`

---

### 🏠 2. Customer Home Screen (`/api/customer/home`)

#### `GET /api/customer/home`
Main aggregated Home Feed matching mobile UI sections (Greeting, Mood & Target, Personal Session, Quick Practices, Libraries, Today Schedule, Weekly Progress, Insights).
- **Headers**: `Authorization: Bearer <token>` *(Optional)*
- **Query Params**: `?mood=Calm&target=Belly / Core strength`

#### `POST /api/customer/home/personal-session`
Generates dynamic 4-step routines based on selected mood & target area.

#### `PUT /api/customer/home/schedule/:itemId/toggle`
Toggles completion checkbox for daily schedule items (`Morning Mindful Breath`, `Core Yoga Flow`, `Sleep Journey Practice`).
- **Example**: `PUT /api/customer/home/schedule/sch-1/toggle`

#### `POST /api/customer/home/log-practice`
Logs a finished practice session, updates streak, total minutes, and weekly progress ring.
- **Request Body**:
  ```json
  {
    "practiceType": "Personal Session",
    "title": "20-Minute Belly & Calm",
    "durationMinutes": 20,
    "moodBefore": "Calm",
    "moodAfter": "Relaxed"
  }
  ```

#### `GET /api/customer/home/search?q=sleep`
Searches Asanas, Breathing library, and Practice Sequences.

---

## 🛠️ Admin Dashboard API Reference

| Section | Endpoint | Description |
| :--- | :--- | :--- |
| **Dashboard** | `GET /api/dashboard/stats` | Gets overall stats, active users, total sessions, system health |
| **User Management** | `GET /api/users` | List all users with filters & pagination |
| | `POST /api/users` | Create user |
| | `PUT /api/users/:id` | Update user |
| | `DELETE /api/users/:id` | Remove user |
| **Asana Catalog** | `GET /api/asanas` | List all yoga poses |
| | `POST /api/asanas` | Create pose |
| **Breathing Library** | `GET /api/breathing` | List breathing exercises |
| | `POST /api/breathing` | Add breathing technique |
| **Practice Sequences**| `GET /api/practices` | List practice sequences |
| | `POST /api/practices` | Create practice sequence |
| **Recommendations** | `GET /api/recommendations` | List AI recommendation rules |
| **AI Generator** | `POST /api/ai-generator/generate` | Generate AI routine |
| | `GET /api/ai-generator/coaches` | List AI coaches |
| **Subscriptions** | `GET /api/subscriptions/summary` | Subscriptions stats |
| | `GET /api/subscriptions/coupons` | List coupons |
| **Settings** | `GET /api/settings` | Get system settings |
| | `PUT /api/settings` | Update system settings |

---

## 📂 Project Architecture

```
backend/
├── config/
│   ├── db.js                 # MongoDB Mongoose Connection
│   └── firebaseAdmin.js      # Firebase Admin SDK Configuration
├── controllers/
│   ├── customerAuthController.js  # Customer Mobile Auth (Google Sign-In)
│   ├── customerHomeController.js  # Customer Mobile Home Feed & Routine logic
│   ├── userController.js          # Admin User Management
│   ├── asanaController.js         # Admin Asana Catalog
│   ├── breathingController.js     # Admin Breathing Library
│   ├── practiceController.js      # Admin Practice Sequences
│   └── ...
├── middleware/
│   └── authMiddleware.js     # Bearer Token & Firebase ID Verification Middleware
├── models/
│   ├── User.js                # User & Customer Schema
│   ├── DailySchedule.js       # Customer Daily Schedule Schema
│   ├── UserPracticeLog.js     # Customer Practice Logs Schema
│   ├── Asana.js               # Yoga Poses Schema
│   ├── Breathing.js           # Breathing Exercise Schema
│   ├── PracticeSequence.js    # Practice Sequences Schema
│   └── ...
├── routes/
│   ├── customerAuthRoutes.js  # /api/auth routes
│   ├── customerHomeRoutes.js  # /api/customer/home routes
│   └── ...
├── server.js                  # Main Express Server Entry Point
└── package.json
```
