# WarungKu - F&B E-Commerce
A modern food & beverage ordering app built with Next.js and Supabase.
## Live Demo
https://fnb-store.vercel.app
## Features
- Product listing with search and category filter
- Shopping cart with persistent state (Zustand)
- User authentication (register, login, logout)
- Checkout with order summary
- Order history for users
- Admin dashboard with order management
- Admin product management with image upload
- Role-based access (admin vs user)
## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- Zustand (cart state)
## Getting Started
`ash
npm install
npm run dev
`
## Environment Variables
`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
`
## License
MIT - free to use for personal and commercial projects.
