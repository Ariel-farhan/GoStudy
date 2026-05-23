# GoStudy — AI-Powered Learning Platform

Platform belajar berbasis AI yang membantu kamu belajar lebih efektif dan efisien.

---

## Fitur

- AI Chat untuk membantu proses belajar
- Dark mode 
- Dukungan Bahasa Indonesia dan English
- Login via Google, GitHub, atau Email & Password
- Fitur feedback langsung ke developer via Telegram
- Tampilan responsif di semua ukuran layar

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Deployment | Vercel |

---

## Cara Menjalankan Lokal

### 1. Clone repo

```bash
git clone https://github.com/username/gostudy.git
cd gostudy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Buat file `.env.local` di root project:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 4. Push schema ke database

```bash
npx prisma db push
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka http://localhost:3000

---

## Deploy

Project ini di-deploy di Vercel dengan database Neon (PostgreSQL).

1. Push ke GitHub
2. Import repo di vercel.com
3. Tambahkan semua environment variables
4. Deploy

---

## Lisensi

MIT License 2025
