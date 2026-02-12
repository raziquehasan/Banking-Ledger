# Banking Dashboard Frontend

A modern, production-grade fintech dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Authentication** - Cookie-based JWT authentication
- ✅ **Dashboard** - Balance overview and account summary
- ✅ **Account Management** - Create and view accounts with real-time balances
- ✅ **Transactions** - Transfer money between accounts with idempotency
- ✅ **Profile** - User information and logout
- ✅ **Modern UI** - Responsive design with dark mode support
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **State Management** - Zustand for global state
- ✅ **Form Validation** - Zod + React Hook Form
- ✅ **Toast Notifications** - Sonner for user feedback

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Notifications:** Sonner
- **Auth:** Cookie-based JWT

## 🛠️ Setup

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # .env.local already configured with:
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3001
   ```

## 📁 Project Structure

```
banking-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── accounts/page.tsx
│   │   ├── transactions/page.tsx
│   │   └── profile/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Sidebar.tsx
├── lib/
│   ├── axios.ts
│   └── api.ts
├── store/
│   ├── auth.store.ts
│   └── account.store.ts
├── types/
│   └── index.ts
└── middleware.ts
```

## 🔐 Authentication Flow

1. **Register** - Create account at `/register`
2. **Login** - Sign in at `/login`
3. **Protected Routes** - Middleware redirects unauthenticated users
4. **Logout** - Clear session from profile page

## 📱 Pages

### `/login`
- Email + password form
- Zod validation
- Toast notifications

### `/register`
- Name, email, password fields
- Auto-redirect to dashboard on success

### `/dashboard`
- Total balance across accounts
- Account cards with balances
- Quick stats

### `/accounts`
- List all accounts
- Create new account modal
- Real-time balance display
- Currency selection (INR, USD, EUR)

### `/transactions`
- Transfer money form
- From/To account selection
- Amount input
- Auto-generated UUID idempotency keys
- Success/error notifications

### `/profile`
- User information
- Logout button

## 🔒 Security

- ✅ HTTP-only cookies for JWT
- ✅ No tokens in localStorage
- ✅ Middleware route protection
- ✅ Zod input validation
- ✅ CSRF-safe cookie handling

## 🎨 UI/UX

- Modern fintech design
- Sidebar navigation
- Responsive (mobile-first)
- Loading states
- Toast notifications
- Professional typography
- Clean card layouts

## 🧪 Testing

1. **Register a new user**
2. **Create an account**
3. **Check balance** (should be 0)
4. **Transfer money** (requires 2 accounts)
5. **View profile**
6. **Logout**

## 📝 API Integration

Connects to backend at `http://localhost:3000/api`:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /accounts`
- `POST /accounts`
- `GET /accounts/balance/:id`
- `POST /transactions`

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT

---

**Built with ❤️ using Next.js 14**
