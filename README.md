# 🏦 Banking Ledger System

A production-grade **Banking & Ledger Management System** built with **Node.js**, **Express**, **MongoDB**, and **Next.js 14**. Features complete transaction processing with ACID compliance, JWT authentication, and a modern fintech dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Backend (Node.js + Express + MongoDB)
- ✅ **User Authentication** - JWT-based auth with HTTP-only cookies
- ✅ **Account Management** - Multi-currency account support (INR, USD, EUR)
- ✅ **Transaction Processing** - 10-step ACID-compliant transaction flow
- ✅ **Double-Entry Ledger** - Complete audit trail with debit/credit entries
- ✅ **Idempotency** - Prevent duplicate transactions with unique keys
- ✅ **Email Notifications** - Gmail OAuth2 integration for transaction alerts
- ✅ **Token Blacklisting** - Secure logout with token invalidation
- ✅ **Balance Tracking** - Real-time balance calculation from ledger

### Frontend (Next.js 14 + TypeScript + Tailwind CSS)
- ✅ **Modern Dashboard** - Responsive fintech UI with dark sidebar
- ✅ **Account Overview** - View all accounts with real-time balances
- ✅ **Money Transfers** - Secure transfers with form validation
- ✅ **Profile Management** - User information and logout
- ✅ **Toast Notifications** - Real-time feedback with Sonner
- ✅ **Form Validation** - Zod + React Hook Form integration
- ✅ **State Management** - Zustand for global state
- ✅ **Route Protection** - Middleware-based authentication

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **Nodemailer** | Email service |
| **Google APIs** | OAuth2 for Gmail |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **Zustand** | State management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Sonner** | Toast notifications |

---

## 📁 Project Structure

```
Banking/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── account.controller.js # Account management
│   │   └── transaction.controller.js # Transaction processing
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── account.model.js      # Account schema
│   │   ├── transaction.model.js  # Transaction schema
│   │   ├── ledger.model.js       # Ledger entry schema
│   │   └── blacklist.model.js    # Token blacklist schema
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── account.routes.js     # Account endpoints
│   │   └── transaction.routes.js # Transaction endpoints
│   ├── services/
│   │   └── email.service.js      # Email sending logic
│   └── app.js                    # Express app setup
├── banking-frontend/             # Next.js frontend
│   ├── app/
│   │   ├── (auth)/               # Auth pages
│   │   └── (dashboard)/          # Dashboard pages
│   ├── components/               # React components
│   ├── lib/                      # Utilities & API
│   ├── store/                    # Zustand stores
│   └── types/                    # TypeScript types
├── server.js                     # Server entry point
├── .env.example                  # Environment template
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** 6.0+ running
- **Gmail account** (for email notifications)
- **Git** installed

### Clone Repository
```bash
git clone https://github.com/raziquehasan/Banking-Ledger.git
cd Banking-Ledger
```

### Install Backend Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd banking-frontend
npm install
cd ..
```

---

## 🔐 Environment Setup

### 1. Create Backend `.env` File
```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and add your values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/banking

# Server
PORT=3000

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Email Service (Gmail OAuth2)
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

### 3. Gmail OAuth2 Setup

**Get OAuth2 Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Gmail API**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add redirect URI: `https://developers.google.com/oauthplayground`
6. Copy **Client ID** and **Client Secret**

**Generate Refresh Token:**

1. Go to [OAuth Playground](https://developers.google.com/oauthplayground)
2. Click settings (⚙️) → Use your own OAuth credentials
3. Enter your Client ID and Client Secret
4. Select scope: `https://mail.google.com/`
5. Authorize APIs
6. Exchange authorization code for tokens
7. Copy **Refresh Token**

### 4. Frontend Environment
```bash
cd banking-frontend
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api" > .env.local
```

---

## ▶️ Running the Application

### Start Backend Server
```bash
# Development mode with auto-reload
npx nodemon server.js

# OR production mode
node server.js
```

**Backend runs on:** `http://localhost:3000`

### Start Frontend Server
```bash
cd banking-frontend
npm run dev
```

**Frontend runs on:** `http://localhost:3001`

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /auth/logout
Cookie: token=<jwt_token>
```

### Account Endpoints

#### Get All Accounts
```http
GET /accounts
Cookie: token=<jwt_token>
```

#### Create Account
```http
POST /accounts
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "currency": "INR"
}
```

#### Get Account Balance
```http
GET /accounts/balance/:accountId
Cookie: token=<jwt_token>
```

### Transaction Endpoints

#### Create Transaction
```http
POST /transactions
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "fromAccount": "account_id_1",
  "toAccount": "account_id_2",
  "amount": 1000,
  "idempotencyKey": "unique-uuid-here"
}
```

---

## 🔒 Security Features

### ✅ Implemented Security Measures

1. **Password Hashing** - Bcrypt with salt rounds
2. **JWT Authentication** - HTTP-only cookies
3. **Token Blacklisting** - Invalidate tokens on logout
4. **CORS Protection** - Configured for frontend origin
5. **Input Validation** - Zod schemas on frontend
6. **Idempotency Keys** - Prevent duplicate transactions
7. **Environment Variables** - Sensitive data in `.env`
8. **No Secrets in Code** - `.gitignore` excludes `.env`

### ⚠️ Important Security Notes

- **Never commit `.env` file** to Git
- **Use strong JWT_SECRET** (min 32 characters)
- **Enable HTTPS** in production
- **Use MongoDB authentication** in production
- **Rotate refresh tokens** periodically

---

## 🧪 Testing

### Manual Testing with Postman

1. **Register a user** → Get JWT cookie
2. **Create 2 accounts** → Note account IDs
3. **Transfer money** → Check balances
4. **View ledger** → Verify debit/credit entries
5. **Logout** → Token should be blacklisted

### Test Credentials
```
Email: test@example.com
Password: test123
```

---

## 🌐 Deployment

### Backend (Node.js)

**Recommended Platforms:**
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://heroku.com/)

**Environment Variables:**
- Set all `.env` variables in platform dashboard
- Update `MONGODB_URI` to production database
- Set `NODE_ENV=production`

### Frontend (Next.js)

**Recommended Platforms:**
- [Vercel](https://vercel.com/) (Recommended)
- [Netlify](https://netlify.com/)

**Environment Variables:**
- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api`

### Database (MongoDB)

**Recommended:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Razique Hasan**

- GitHub: [@raziquehasan](https://github.com/raziquehasan)
- Repository: [Banking-Ledger](https://github.com/raziquehasan/Banking-Ledger)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database
- Vercel for deployment platform
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/raziquehasan/Banking-Ledger/issues)
- Email: hasanrazique@gmail.com

---

**⭐ If you found this project helpful, please give it a star!**

---

**Built with ❤️ using Node.js, Express, MongoDB, and Next.js 14**
