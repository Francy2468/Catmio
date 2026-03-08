# Catmio — Script Protection & Analytics SaaS

Catmio is a full-stack SaaS platform for script developers to protect, track, and manage their scripts. It provides script obfuscation, execution logging with HWID tracking, webhook notifications, and a full admin panel.

## Features

- **Script Protection** — Integrate with an obfuscator to protect Lua/Python scripts
- **Execution Logging** — Track every script execution (HWID, IP, game name, timestamp)
- **HWID Ban System** — Ban/unban Hardware IDs to prevent unauthorized usage
- **Webhook Notifications** — Get notified on every execution via configurable webhooks
- **User Dashboard** — Overview, executions table, obfuscator, settings, support
- **Admin Panel** — Manage users, view analytics, ban users/HWIDs
- **Script Loader API** — Secure endpoint for loading scripts with HWID verification
- **Google Sign-In** — One-click login and registration via Google OAuth
- **Documentation** — Built-in docs, terms of service, and privacy policy pages

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) |
| Frontend | Next.js 14, React, Tailwind CSS |
| Auth | JWT, bcryptjs, email verification, Google OAuth |
| Charts | Chart.js + react-chartjs-2 |
| Email | Nodemailer |

## Project Structure

```
catmio/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── routes/          # Express routers
│   ├── middleware/       # Auth, rate limiting, error handling
│   ├── services/         # Email service
│   ├── database/         # DB connection
│   └── server.js
├── frontend/
│   ├── pages/           # Next.js pages
│   │   └── auth/        # OAuth callback page
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── lib/              # API client, auth helpers
│   └── styles/
├── .env.example
└── README.md
```

## Step 1 — Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New project**, give it a name, choose a strong database password, and pick a region close to your users.
3. Wait for the project to finish provisioning (~1 minute).
4. In the left sidebar open **Project Settings → Database** and copy the **Connection string** (URI format). It looks like:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres
   ```
   This is your `DATABASE_URL`.
5. Open the **SQL Editor** (left sidebar) and run the following SQL to create the tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,                -- NULL for Google-only accounts
  google_id TEXT UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  hwid TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  hwid_banned BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  webhook_url TEXT
);

CREATE TABLE executions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  ip_address TEXT,
  hwid TEXT,
  script_name TEXT,
  game_name TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);
```

> **Existing database?** Run this migration to add the `google_id` column and make `password_hash` nullable:
> ```sql
> ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
> ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
> ```

## Step 2 — Google OAuth Setup

### 2.1 Create OAuth credentials in Google Cloud Console

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) and sign in.
2. Create a new project (or select an existing one) from the top navigation bar.
3. Enable the **Google+ API** (or **People API**):
   - Left sidebar → **APIs & Services → Library**
   - Search for **"Google+ API"** and click **Enable** (if not already enabled).
4. Go to **APIs & Services → OAuth consent screen**:
   - Choose **External** (for any Google account) or **Internal** (GSuite only).
   - Fill in the required fields: App name, support email, developer contact email.
   - Add the scope `userinfo.email` and `userinfo.profile`.
   - Save and continue.
5. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: e.g. `Catmio`
   - **Authorised redirect URIs** — add **both** of the following:
     | Environment | URI |
     |-------------|-----|
     | Development | `http://localhost:3001/api/auth/google/callback` |
     | Production  | `https://your-domain.com/api/auth/google/callback` |
   - Click **Create**.
6. Copy the **Client ID** and **Client Secret** — you will need them in the next step.

### 2.2 Set environment variables

Copy `.env.example` to `backend/.env` and fill in:

```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
# Must exactly match one of the URIs you added in Google Cloud Console
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

### Backend (`backend/.env`)

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
JWT_SECRET=your-strong-random-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
OBFUSCATOR_API_KEY=your-obfuscator-api-key
PORT=3001
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

## Local Development

### Backend

```bash
cd backend
npm install
cp ../.env.example .env   # fill in values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# create .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

## Deployment

### Render (one-click via render.yaml)

A `render.yaml` Blueprint file is included at the root of this repository. This deploys a single unified Node service (Express API + exported Next.js frontend).

1. Go to [https://render.com](https://render.com) → **New** → **Blueprint**
2. Connect this GitHub repository
3. Render will detect `render.yaml` and create the web service
4. Fill in the required secret environment variables (see [Environment Variables](#environment-variables)):
   - `DATABASE_URL` — Supabase PostgreSQL connection string
    - `FRONTEND_URL` — allowed CORS origin(s), comma-separated when needed
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` — SMTP credentials
   - `OBFUSCATOR_API_KEY` — obfuscator service key
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` — Google OAuth
5. Click **Apply** — Render will build and deploy the service

> **Tip:** A `JWT_SECRET` value is auto-generated by Render; you can override it with your own value.

> **Google OAuth on Render:** Set `GOOGLE_CALLBACK_URL` to `https://your-render-service.onrender.com/api/auth/google/callback` and add that exact URL in Google Cloud Console → Authorised redirect URIs.

### Manual deploy (single Render web service)

1. Connect your GitHub repo
2. Set root directory to repo root (`catmio/`)
3. Build command: `npm install && test -f frontend/out/index.html`
4. Start command: `npm start`
5. Add all required environment variables

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify-email?token=` | Verify email |
| GET | `/api/auth/google` | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | Google OAuth callback (set this as redirect URI) |
| GET | `/api/auth/profile` | Get profile (auth required) |
| PUT | `/api/auth/profile` | Update profile (auth required) |

### Executions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/executions` | Log an execution (auth required) |
| GET | `/api/executions` | List executions (auth required) |
| GET | `/api/executions/stats` | Execution stats (auth required) |

### Obfuscator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/obfuscator` | Obfuscate code (auth required) |

### Webhook
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/webhook/url` | Update webhook URL (auth required) |
| POST | `/api/webhook/test` | Test webhook (auth required) |

### Loader
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loader/:script_id` | Load script with HWID verification |

### Admin (role=admin required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users/:id/ban` | Ban user |
| POST | `/api/admin/users/:id/unban` | Unban user |
| POST | `/api/admin/users/:id/ban-hwid` | Ban user's HWID |
| POST | `/api/admin/users/:id/unban-hwid` | Unban user's HWID |
| POST | `/api/admin/users/:id/reset-hwid` | Reset user's HWID |
| GET | `/api/admin/analytics` | Platform analytics |
| GET | `/api/admin/executions` | All executions |

## Security

- All passwords hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- Rate limiting on auth endpoints (10 req/15 min)
- HWID verification on execution and script loading
- SQL injection prevention via parameterized queries
- CORS restricted to configured frontend URL
- Helmet.js security headers

## Support

Contact: catmiosupport@gmail.com  
Response time: 24–48 hours

## License

MIT
