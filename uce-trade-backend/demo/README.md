
# 🏢 UCE Trade Backend

**Enterprise Marketplace Platform for Universidad Central del Ecuador (UCE)**

---

## 📖 Overview

UCE Trade Backend is a robust, scalable RESTful API built with Spring Boot, designed to power the UCE Trade platform. It enables students and administrators at Universidad Central del Ecuador to manage entrepreneurial ventures, users, payments, notifications, and analytics securely and efficiently.

---

## ✨ Key Features

- 🔐 **User Authentication & Authorization:**
  - Secure login/registration with JWT and Firebase (Google OAuth)
  - Role-based access control (Student, Admin)
- 🚀 **Venture Management:**
  - CRUD operations for student ventures
  - Search and filtering (Algolia integration)
- 🛠️ **Admin Dashboard:**
  - User and venture management
  - Advanced analytics and reporting
- 💳 **Payments:**
  - Stripe integration for secure transactions
  - PDF invoice generation and email delivery
- 🔔 **Notifications:**
  - Real-time notifications via WebSocket (STOMP)
  - Email notifications for key events
- ⚡ **Caching & Performance:**
  - Redis caching for improved performance
- 📚 **API Documentation:**
  - OpenAPI/Swagger UI for easy API exploration

---

## 🛠️ Technology Stack

- ☕ **Language:** Java 21
- 🌱 **Framework:** Spring Boot 4
- 🐘 **Database:** PostgreSQL
- 🧊 **Cache:** Redis
- 🔑 **Authentication:** JWT, Firebase
- 💸 **Payments:** Stripe
- 🔍 **Search:** Algolia
- 📄 **PDF Generation:** OpenPDF
- ✉️ **Email:** Spring Mail (SMTP)
- 📖 **API Docs:** Springdoc OpenAPI

---

## 📁 Project Structure

```
demo/
├── src/
│   ├── main/
│   │   ├── java/UCE_Trade/demo/
│   │   │   ├── config/         # ⚙️ Configuration classes
│   │   │   ├── controller/     # 🌐 REST controllers (Auth, User, Venture, Admin, Payment, etc.)
│   │   │   ├── dto/            # 📦 Data Transfer Objects
│   │   │   ├── model/          # 🗃️ JPA entities
│   │   │   ├── repository/     # 🗄️ Spring Data repositories
│   │   │   ├── security/       # 🛡️ Security configuration (JWT, filters)
│   │   │   ├── service/        # 🧠 Business logic and integrations
│   │   │   └── UceTradeApplication.java # 🚪 Main entry point
│   │   └── resources/
│   │       ├── application.yml # 📝 Main configuration
│   │       └── firebase-service-account.json # 🔥 Firebase credentials
│   └── test/                  # 🧪 Unit and integration tests
├── pom.xml                    # 📦 Maven build file
└── Dockerfile                 # 🐳 (if present) for containerization
```

---

## 🚦 Getting Started

### 📋 Prerequisites

- ☕ Java 21+
- 🛠️ Maven 3.8+
- 🐘 PostgreSQL
- 🧊 Redis

### ⚙️ Setup & Run (Development)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd demo
   ```

2. **Configure the database and environment:**
   - Update `src/main/resources/application.yml` with your PostgreSQL, Redis, SMTP, and Algolia credentials.
   - Place your Firebase service account JSON in `src/main/resources/firebase-service-account.json`.
   - Set environment variables for sensitive data (e.g., `MAIL_USERNAME`, `MAIL_PASSWORD`, `APPLICATION_ID`, `ADMIN_API_KEY`).

3. **Build and run the application:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Access API documentation:**
   - Visit [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) for interactive API docs.

---

## ⚙️ Configuration

The main configuration file is `application.yml`. Key settings include:

- 🐘 **Database:** PostgreSQL connection URL, username, password
- 🧊 **Redis:** Host and port
- ✉️ **Mail:** SMTP server, credentials
- 🔍 **Algolia:** App ID, API key, index name
- 🔥 **Firebase:** Service account JSON for Google OAuth

Sensitive values should be provided via environment variables for security.

---

## 🚀 Deployment

For production, build a JAR and deploy to your preferred Java server or use Docker if a Dockerfile is provided.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or support, please contact the project maintainer.