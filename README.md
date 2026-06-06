
# ✨ Lumina - Client Side

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

Lumina is a **Smart Project & Task Collaboration System** that helps teams manage projects, tasks, team members, and work progress with proper validation and workflow handling. This repository contains the complete **frontend application** built with Next.js 16, Tailwind CSS, and shadcn/ui.

**Live Demo:** [https://lumina7.vercel.app](https://lumina7.vercel.app)

---

## ✨ Key Features

### Core Features
- **🔐 Authentication** - Secure login/register with email and Google OAuth
- **👑 Role-Based Access** - Admin, Project Manager, and Team Member roles with granular permissions
- **📋 Project Management** - Create, update, delete, and view projects with status tracking
- **✅ Task Management** - Full CRUD with priorities (High/Medium/Low) and statuses (Todo/In Progress/Completed)
- **👥 Team Collaboration** - Add/remove members, assign tasks, member-wise task lists
- **📊 Progress Tracking** - Dashboard with KPI cards, charts, and project summaries
- **📝 Activity Log** - Track all system actions with detailed history
- **🔔 Real-time Notifications** - Stay updated with instant notifications

### Additional Features
- **💬 Comments** - Task comments with nested replies
- **📎 File Attachments** - Upload and manage task attachments
- **🔍 Search & Filters** - Advanced search with multiple filter options
- **📈 Analytics** - Platform stats, completion rates, and productivity insights
- **⚙️ Settings** - User preferences and system configuration
- **🎨 Dark/Light Mode** - Theme support with system preference detection

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **State Management** | React Hooks, Context API |
| **Data Fetching** | Server Actions, Fetch API |
| **Authentication** | Better-Auth (JWT) |
| **Forms** | React Hook Form, Zod |
| **UI Components** | Radix UI, Lucide Icons, Recharts |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── actions/           # Server actions for data mutations
├── app/               # Next.js App Router pages
│   ├── (auth)/        # Authentication routes
│   ├── (dashboard)/   # Protected dashboard routes
│   └── (public)/      # public routes
├── components/        # Reusable UI components
│   ├── layout/        # Layout components (Navbar, Footer, Sidebar)
│   ├── modules/       # Feature-specific components
│   └── ui/            # shadcn/ui base components
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
├── lib/               # Utility functions (auth client, etc.)
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- Backend server running (see [Backend Repo](https://github.com/tanvirislamakash2002/Lumina-server-side))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanvirislamakash2002/Lumina-client-side.git
   cd Lumina-client-side
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
   AUTH_URL=http://localhost:5000/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔗 Important Links

| Resource | Link |
|----------|------|
| **Frontend Repository** | [Lumina-client-side](https://github.com/tanvirislamakash2002/Lumina-client-side) |
| **Backend Repository** | [Lumina-server-side](https://github.com/tanvirislamakash2002/Lumina-server-side) |
| **Live Frontend** | [https://lumina.vercel.app](https://lumina.vercel.app) |
| **Live Backend** | [https://lumina-server.onrender.com](https://lumina-server.onrender.com) |

## 👨‍💻 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | westbrook@gmail.com | westbrook123 |
| **Project Manager** | ellis@gmail.com | ellis123 |
| **Team Member** | monroe@gmail.com | monroe123 |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🎯 Key Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with features and CTA |
| `/login` | Sign in page |
| `/register` | Create new account |

### Dashboard Pages (All Authenticated Users)
| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard with KPI cards and charts |
| `/projects` | Browse and manage projects |
| `/projects/[id]` | Project details with tasks and members |
| `/tasks` | Browse all accessible tasks |
| `/tasks/[id]` | Task details with comments and attachments |
| `/my-tasks` | Tasks assigned to current user |
| `/team` | View team members |
| `/team/[id]` | Member profile details |
| `/profile` | User profile management |
| `/settings/*` | Notification, theme, security settings |

### Admin Pages
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard with system stats |
| `/admin/analytics` | Platform analytics and insights |
| `/admin/users` | User management |
| `/admin/projects` | Project management |
| `/admin/audit` | Audit trail of all actions |
| `/admin/logs` | System logs |

## 🛡️ Role Permissions

| Action | Admin | Project Manager | Team Member |
|--------|-------|-----------------|-------------|
| Create/Edit/Delete Projects | ✅ | ✅ | ❌ |
| Create/Edit/Delete Tasks | ✅ | ✅ | ❌ (edit assigned only) |
| Assign Tasks | ✅ | ✅ | ❌ |
| Update Task Status | ✅ | ✅ | ✅ (assigned only) |
| Add/Remove Team Members | ✅ | ✅ | ❌ |
| View All Users | ✅ | ✅ | ❌ (limited to projects) |
| System Settings | ✅ | ❌ | ❌ |

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
- [Better-Auth](https://better-auth.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

**Built by Tanvir Islam Akash**
