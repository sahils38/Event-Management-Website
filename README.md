#  Event Management Website

 
This is a full-stack Event Management Web Application that allows users to **create, edit, delete, and join events**. The platform ensures seamless user authentication using JWT and provides a responsive frontend built with **React & TypeScript**, while the backend is powered by **Node.js, Express, and MongoDB Atlas**. 🎉

## ✨ Features

✅ **User Authentication** (JWT-based login/logout) 🔐  
✅ **Create, Edit, and Delete Events** 📅✏️❌  
✅ **Join Events & Track Attendees** 👥  
✅ **Real-time Dashboard Update** 🔄  
✅ **Secure API with Middleware Protection** 🛡️  

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), React Router, Axios, Tailwind CSS 🎨
- **Backend:** Node.js, Express.js, MongoDB Atlas 🌍
- **Authentication:** JSON Web Tokens (JWT) 🔑

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/event-management.git
cd event-management
```

### 2️⃣ Install Dependencies
#### 🔹 Backend
```sh
cd backend
npm install
```
#### 🔹 Frontend
```sh
cd frontend
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the backend root and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Application
#### Backend 🛠️
```sh
cd backend
npm start
```
#### Frontend 🎨
```sh
cd frontend
npm start
```

## 🔥 API Endpoints

### 🔹 Authentication
- **POST** `/api/auth/register` – Register a new user 👤
- **POST** `/api/auth/login` – Login and receive a JWT token 🔑

### 🔹 Event Management
- **GET** `/api/events` – Fetch all events 📅
- **POST** `/api/events` – Create an event ✏️
- **PUT** `/api/events/:id` – Edit an event 🔄
- **DELETE** `/api/events/:id` – Delete an event ❌
- **POST** `/api/events/:id/join` – Join an event 👥

### Deployment 🚀

## Backend (Render)

The backend is deployed on Render.

**Steps to Deploy Backend:**

- Connect the repository to Render.com

- **Set build command:** npm install && npm run build

- **Set start command:** node dist/server.js

- Add environment variables **(MongoDB URI, JWT Secret, etc.)**

- Deploy & get the live API URL

### Frontend (Vercel)

- The frontend is deployed on Vercel at:
👉 [Live Site](https://event-management-website-three.vercel.app/)

- **Steps to Deploy Frontend:**

- Push the frontend code to GitHub

- Connect the repository to Vercel.com

- **Set build command:** npm install && npm run build

- Set environment variables (Backend API URL)

- Deploy & get the live site URL

## 🤝 Contributing
Pull requests are welcome! If you'd like to contribute, feel free to fork the repo and submit a PR. 🚀

## 📜 License
This project is licensed under the **MIT License**.

---
## Author

Sahil Saraswat

**GitHub**: sahils38

**LinkedIn**: [Sahil Saraswat](https://www.linkedin.com/in/sahil-saraswat-67a365251/)



