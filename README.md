# 🌟 UCE Trade Platform

**A Modern Marketplace for the Universidad Central del Ecuador (UCE) Community**

---

## 📖 Overview

UCE Trade is a full-stack web platform designed to empower students and administrators at Universidad Central del Ecuador to create, manage, and promote entrepreneurial ventures. The system provides a seamless experience for buying, selling, and managing services, with robust admin tools, real-time notifications, and secure payments.

---

## 🏗️ Architecture

This project is organized as a monorepo with two main components:

- **uce-trade-frontend/** — Modern React SPA (Vite, Material UI, Zustand, Stripe, Firebase, Supabase)
- **uce-trade-backend/** — Secure RESTful API (Spring Boot, PostgreSQL, Redis, Stripe, Algolia, Firebase)

Both components are containerized for easy deployment and can be orchestrated with Docker Compose.

---

## ✨ Key Features

- 🛒 **Marketplace:** Browse, search, and filter student ventures by category, price, and popularity
- 🔐 **Authentication:** Secure login/registration with JWT, Google OAuth, and role-based access
- 🎓 **Student Dashboard:** Manage ventures, view sales, and performance KPIs
- 🛠️ **Admin Panel:** User and venture management, analytics, and reporting
- 💳 **Payments:** Stripe integration for secure online payments and invoice downloads
- 🔔 **Real-Time Notifications:** WebSocket for instant updates on sales and system events
- 👤 **Profile Management:** Edit user profiles, including faculty selection and bio
- 📱 **Responsive Design:** Fully responsive UI for desktop and mobile
- 📚 **API Documentation:** OpenAPI/Swagger UI for backend exploration

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 19, Vite, Material UI (MUI)
- 🧠 Zustand (state), React Query (data fetching)
- 📝 React Hook Form, Zod (validation)
- 🔑 Firebase, Google OAuth
- 💸 Stripe
- ☁️ Supabase (file storage)

### Backend
- ☕ Java 21, Spring Boot 4
- 🐘 PostgreSQL, 🧊 Redis
- 🔑 JWT, Firebase
- 💸 Stripe
- 🔍 Algolia (search)
- 📄 OpenPDF (PDF generation)
- ✉️ Spring Mail (SMTP)
- 📖 Springdoc OpenAPI

---

## 📁 Project Structure

```
UCE Trade - Web Programming/
├── uce-trade-frontend/   # Frontend SPA (React, Vite)
├── uce-trade-backend/    # Backend API (Spring Boot)
├── docker-compose.yml    # Multi-service orchestration
└── README.md             # Global project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- Maven 3.8+
- PostgreSQL
- Redis

### 1. Clone the Repository
```bash
git clone <repo-url>
cd UCE\ Trade\ -\ Web\ Programming
```

### 2. Environment Configuration
- Configure environment variables for both frontend and backend (see their respective READMEs for details)
- Set up PostgreSQL and Redis instances

### 3. Run with Docker Compose (Recommended)
```bash
docker-compose up --build
```
This will build and start both the frontend and backend, along with any required services.

### 4. Manual Local Development
- Start backend: see `uce-trade-backend/demo/README.md`
- Start frontend: see `uce-trade-frontend/README.md`

---

## 🌐 Deployment

- Both frontend and backend are containerized (see Dockerfile in each folder)
- Use `docker-compose` for local or cloud deployment
- Nginx is used for serving the frontend in production

---

## 🧩 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or support, please contact the project maintainer.
