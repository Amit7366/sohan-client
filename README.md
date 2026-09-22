# Portfolio CMS Client

Next.js + TypeScript + Tailwind wellness landing + admin CMS.

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

App: `http://localhost:3000`  
API: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`)

## Routes

- `/` — public landing (active profile from API)
- `/login`, `/register`
- `/dashboard` — superadmin profile list (create / activate / deactivate)
- `/dashboard/profiles/[id]` — edit all landing sections for a profile
# sohan-client
