# 🛠 Quotes App — Backend

This is the backend API for our Quotes App, built using Express and MongoDB.

It supports full CRUD functionality for quotes and includes user authentication using express-session.

---

## 🧪 Tech Stack

- Express.js
- MongoDB + Mongoose
- express-session
- dotenv
- cors

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/Cwan7/famous-quotes-api.git
   cd famous-quotes-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI="your_mongodb_connection_string"
   SESSION_SECRET="your_session_secret"
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The server will start on the port defined in your `.env` file (default: `3000`).

---

## 📋 API Overview

### Quotes
- `GET    /quotes`    – Get all quotes
- `POST   /quotes`    – Create a new quote
- `PUT    /quote/:id` – Edit a quote
- `DELETE /quote/:id` – Delete a quote

### Auth
- `POST /auth/login`  – Log in a user
- `POST /auth/logout` – Log out the current user
- `GET  /auth/check`  – Check user session

---

## 👥 Team

- [Conor Wantuch](https://github.com/Cwan7)
- [Zackary O'Connor](https://github.com/zackaryoconnor)
- [Christian Vieux](https://github.com/christianvieux)