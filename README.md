
# 🌿 GreenSpark - Client Side

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

GreenSpark is an online community portal where members can share, discover, and fund sustainability-oriented ideas. This repository contains the complete **frontend application** built with Next.js 15, Tailwind CSS, and shadcn/ui.

**Live Demo:** [https://greenspark1.vercel.app](https://greenspark1.vercel.app)

---

## ✨ Key Features

- **🔐 Authentication** - Secure login/register with email and Google OAuth (JWT-based)
- **💡 Idea Management** - Create, edit, submit, and categorize sustainability ideas
- **💰 Paid Ideas** - Integrated Stripe payment gateway for premium content
- **👍 Voting System** - Reddit-style upvote/downvote with real-time updates
- **💬 Comments** - Nested comment threads with edit, delete, and report features
- **🔖 Bookmarks** - Save favorite ideas for later
- **👑 Admin Dashboard** - Moderate ideas, manage users, and view platform analytics
- **👤 Member Dashboard** - Manage profile, track ideas, view purchase history, and see voting activity

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **State Management** | React Hooks, Context API |
| **Data Fetching** | Server Actions, Fetch API |
| **Authentication** | Better-Auth (JWT) |
| **Payments** | Stripe.js, Stripe Elements |
| **Forms** | React Hook Form, Zod |
| **UI Components** | Radix UI, Lucide Icons |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── actions/           # Server actions for data mutations
├── app/               # Next.js App Router pages
│   ├── (auth)/        # Authentication routes
│   ├── (dashboard)/   # Protected member/admin dashboard
│   └── (public)/      # Public routes (ideas, pricing, etc.)
├── components/        # Reusable UI components
│   ├── modules/       # Feature-specific components
│   └── ui/            # shadcn/ui base components
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- Backend server running (see [Backend Repo](https://github.com/tanvirislamakash2002/GreenSpark-server-side))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanvirislamakash2002/GreenSpark-client-side.git
   cd GreenSpark-client-side
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔗 Important Links

| Resource | Link |
|----------|------|
| **Frontend Repository** | [GreenSpark-client-side](https://github.com/tanvirislamakash2002/GreenSpark-client-side) |
| **Backend Repository** | [GreenSpark-server-side](https://github.com/tanvirislamakash2002/GreenSpark-server-side) |
| **Live Frontend** | [https://greenspark1.vercel.app](https://greenspark1.vercel.app) |
| **Live Backend** | [https://greenspark-server.vercel.app](https://greenspark-server.vercel.app) |
| **Demo Video** | [Watch Demo](https://drive.google.com/drive/folders/1q7Un1fX-roWt3DLvpnVtoBb2UmqXa8Ko) |

## 👨‍💻 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | westbrook@gmail.com | westbrook123 |
| **Member** | *(Register a new account)* | *(Choose your own)* |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured ideas |
| `/ideas` | Browse all approved ideas (filter, search, paginate) |
| `/ideas/[id]` | Idea details with voting, comments, and paywall |
| `/member/profile` | Member profile and settings |
| `/member/ideas` | Manage your own ideas (CRUD) |
| `/member/payments` | Payment history |
| `/member/votes` | Track your voting activity |
| `/member/comments` | Manage your comments |
| `/admin` | Admin dashboard (analytics, user management) |
| `/admin/ideas` | Moderate all ideas |
| `/admin/users` | Manage user accounts |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [Better-Auth](https://better-auth.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Built with 💚 for a sustainable future**
"# Lumina-client-side" 
