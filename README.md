# Khayal Masr - خيال مصر

A personalized Arabic children's story generator built with React, Python, and Supabase. The app generates custom stories in Egyptian Arabic (Ammiya) for children, with payment integration and an admin dashboard.

## Project Structure

```
khayal_masr_project/
├── backend/                 # Python backend (API & database)
│   ├── main.py             # Core backend functions
│   ├── db.py               # SQLite database initialization
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/               # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-based modules
│   │   ├── lib/            # Utility functions
│   │   ├── api.ts          # API integration layer
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── schema.sql              # Supabase/PostgreSQL database schema
└── screenshots/            # App screenshots
```

## Tech Stack

| Layer     | Technologies                                    |
|-----------|-------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend   | Python, SQLite, NextToken API (Gemini)         |
| Database  | Supabase (PostgreSQL) + Local SQLite            |
| Styling   | Tailwind CSS, Lucide Icons, React Icons         |

## Features

- Personalized story generation in Egyptian Arabic using AI
- Child name, age, gender, and challenge theme customization
- Photo upload for personalized story illustrations
- Payment system with screenshot verification
- Admin dashboard for order management
- Sample stories showcase
- WhatsApp integration for communication

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- A Supabase account
- A NextToken API key (for AI story generation)

### 1. Clone the Repository

```bash
git clone https://github.com/Omarhussien2/kids-story.git
cd kids-story
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
WHATSAPP_NUMBER=201152806034
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Database Setup (Supabase)

1. Go to your Supabase project -> **SQL Editor**
2. Copy the contents of `schema.sql` and execute it
3. Go to **Storage** -> Create a new bucket named `khayal-assets` and set it to **Public**

### 5. Build for Production

```bash
cd frontend
npm run build
```

## Deployment (Vercel)

1. Push your code to GitHub
2. Go to **Vercel** -> Add New Project -> Import your GitHub repository
3. Add the following **Environment Variables**:
   - `SUPABASE_URL` - Your Supabase Project URL
   - `SUPABASE_ANON_KEY` - Your Supabase Anon Key
   - `ADMIN_PASSWORD` - Choose a password for your Admin Panel
   - `WHATSAPP_NUMBER` - WhatsApp number for contact
   - `NEXTTOKEN_API_KEY` - Your NextToken API key
4. Click **Deploy**

## Admin Access

Access the admin panel by clicking the "الإدارة" link in the footer and entering your `ADMIN_PASSWORD`.

## License

This project is proprietary and confidential.
