# 🏦 Premium Banking Application

A **production-grade fintech application** built with Next.js 14, Express.js, and MongoDB. Features enterprise-level UI/UX, double-entry bookkeeping, and real-time transaction processing.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🎨 **Premium UI/UX**
- **Glassmorphic Design** - Modern dark theme with backdrop blur effects
- **Framer Motion Animations** - Smooth page transitions and micro-interactions
- **Responsive Layout** - Mobile-first design with Tailwind CSS
- **Premium Components** - Reusable Button, Input, Card, Badge, Modal components

### 💳 **Core Banking Features**
- **Multi-Currency Accounts** - Support for INR, USD, EUR, GBP, JPY, AUD, CAD
- **Real-time Transfers** - Instant money transfers between accounts
- **Transaction History** - Complete audit trail with filters and search
- **Account Ledger** - Double-entry bookkeeping with running balance
- **Email Notifications** - Automated emails for all transactions

### 🔐 **Security**
- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **Password Hashing** - bcrypt encryption for user passwords
- **CORS Protection** - Configured for secure cross-origin requests
- **Input Validation** - Zod schemas for frontend, Joi for backend
- **Idempotency Keys** - Prevent duplicate transactions

### 📊 **Enterprise Features**
- **Running Balance Column** - Shows balance after each transaction (rare in student projects!)
- **Financial Aggregation** - Real-time calculation of credits, debits, net change
- **Advanced Filters** - Type, status, date range filtering
- **Export Functionality** - CSV export for transactions and ledger
- **Pagination** - Efficient data loading with metadata

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Charts:** Recharts
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Notifications:** Sonner
- **Icons:** Lucide React

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** Joi
- **Email:** Nodemailer with OAuth2 (Gmail)
- **Dev Tools:** Nodemon

---

## 📁 Project Structure

```
Banking/
├── banking-frontend/          # Next.js Frontend
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/      # Protected dashboard pages
│   │       ├── dashboard/    # Overview with charts
│   │       ├── accounts/     # Account management
│   │       ├── transactions/ # Transfer money
│   │       ├── ledger/       # Transaction audit trail
│   │       └── profile/      # User profile
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── Topbar.tsx       # Top navigation bar
│   ├── lib/                 # Utilities and API client
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript definitions
│
└── src/                      # Express.js Backend
    ├── config/              # Database configuration
    ├── controllers/         # Route controllers
    ├── middleware/          # Auth middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── services/            # Email service
    └── app.js               # Express app setup
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email notifications (optional)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd Banking
```

### **2. Backend Setup**
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB URI and JWT secret
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_random_string
EMAIL_USER=your_gmail@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

# Start backend server
npx nodemon server.js
```

Backend will run on `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd banking-frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api" > .env.local

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📸 Screenshots

### **Login Page**
Glassmorphic design with floating animations and security badges.

### **Dashboard**
- Gradient balance card with trending indicator
- Animated Recharts line chart
- Quick stats cards
- Account overview
- Recent transactions

### **Ledger Page** ⭐ **Enterprise Feature**
- **Summary card** with total credits, debits, net change
- **Running balance column** (shows balance after each transaction)
- Advanced filters (type, sort order)
- Expandable transaction details
- Staggered animations

### **Transactions Page**
- Transfer form with live balance preview
- Confirmation modal
- Success confetti animation
- Transaction history table with status filters

### **Accounts Page**
- Glassmorphic account cards
- Real-time balance display
- Create account modal
- Hover effects

### **Profile Page**
- Gradient avatar with verified badge
- Account statistics
- Security settings section
- Logout confirmation modal

---

## 🎯 Key Highlights

### **1. Running Balance Column** 🔥
Most student projects show transaction lists. This app calculates and displays the **balance after each transaction**, demonstrating understanding of:
- Sequential transaction logic
- Double-entry bookkeeping
- Dynamic state calculations

### **2. Financial Aggregation**
Real-time calculation of:
- Total credits (green)
- Total debits (red)
- Net change (color-coded)
- Current balance

### **3. Premium UI/UX**
- Glassmorphism with backdrop blur
- Gradient backgrounds
- Framer Motion animations
- Micro-interactions
- Color-coded financial data

### **4. Production-Ready Code**
- TypeScript for type safety
- Proper error handling
- Loading states
- Empty states with CTAs
- Responsive design
- Accessibility considerations

---

## 🔧 API Endpoints

### **Authentication**
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
POST /api/auth/logout      - Logout user
GET  /api/auth/me          - Get current user
```

### **Accounts**
```
POST /api/accounts         - Create account
GET  /api/accounts         - Get all accounts
GET  /api/accounts/:id/balance - Get account balance
```

### **Transactions**
```
POST /api/transactions     - Create transaction
GET  /api/transactions     - Get transaction history (with pagination)
```

### **Ledger**
```
GET  /api/ledger/:accountId - Get ledger entries (with pagination)
```

---

## 🎨 Design System

### **Colors**
```css
Primary: Indigo 600 → Purple 600 (gradient)
Success: Emerald 500
Danger: Rose 500
Warning: Amber 500
Background: Slate 950
Cards: Slate 900/50 (glassmorphic)
```

### **Animations**
- Page transitions: Fade + slide
- Staggered lists: 50ms delay per item
- Hover effects: Scale, shadow, brightness
- Loading states: Spin, pulse

---

## 📝 Environment Variables

### **Backend (.env)**
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
CLIENT_ID=google_oauth_client_id
CLIENT_SECRET=google_oauth_client_secret
REFRESH_TOKEN=google_oauth_refresh_token
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### **Manual Testing**
1. Register a new user
2. Create multiple accounts (different currencies)
3. Transfer money between accounts
4. Check ledger for running balance
5. View dashboard charts
6. Test filters and sorting

### **API Testing**
Use Postman or Thunder Client:
- Import collection from `/docs/postman_collection.json`
- Test all endpoints
- Verify JWT authentication

---

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
cd banking-frontend
vercel deploy
```

### **Backend (Railway/Render)**
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development (MERN stack)
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Database modeling (Mongoose)
- ✅ State management (Zustand)
- ✅ Form handling and validation
- ✅ Real-time calculations
- ✅ Premium UI/UX design
- ✅ TypeScript proficiency
- ✅ Production-ready code practices

---

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

---

## 👨‍💻 Author

**Hasan Razique**
- GitHub: [@hasanrazique](https://github.com/hasanrazique)
- Email: hasanrazique@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations
- MongoDB for the database

---

**⭐ If you found this project helpful, please give it a star!**
