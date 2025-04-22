# recap.games

<div align="center">
  <a href="https://github.com/tdanks2000/recap.games">
    <img src="./public/icon.png" alt="Games Recaped Logo" width="150" />
  </a>
</div>

## About

recap.games provides the latest updates from game conferences such as E3, SGF, and more. Stay informed on new game announcements, trailers

## Features

- **Conference Coverage**: Real‑time recaps from E3, SGF, Tokyo Game Show, and other major events.
- **Easy Navigation**: Responsive UI built with Next.js and Tailwind CSS.
- **Authentication**: Secure Email/Password and Discord OAuth via NextAuth.
- **User Roles**: Admin, Editor, and Subscriber permissions for tailored access.
- **Personalized Experience**: User dashboards powered by tRPC and TanStack Query.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/tdanks2000/recap.games.git
   cd recap.games
   ```
2. Install dependencies (requires Bun v1+):
   ```
   bun install
   ```

## Scripts

Use `bun run <script>` to manage development, build, and database tasks:

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `bun run dev`         | Start development server                           |
| `bun run build`       | Compile production build                           |
| `bun run preview`     | Build & preview production                         |
| `bun run start`       | Run production server                              |
| `bun run typecheck`   | TypeScript type checking                           |
| `bun run check`       | Run Biome lint and formatting                      |
| `bun run db:generate` | Generate database migration files with drizzle-kit |
| `bun run db:migrate`  | Apply database migrations                          |
| `bun run db:seed`     | Seed initial data                                  |
| `bun run db:studio`   | Launch Drizzle ORM Studio                          |

## Setup

Create a `.env` file in the project root by copying `.env.example`:

```
cp .env.example .env
```

Edit `.env` with your credentials:

```
# Database (SQLite)
DATABASE_URL="file:./db.sqlite"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

> **Tip:** Generate a strong `NEXTAUTH_SECRET` using:
>
> ```
> npx next-auth secret
> ```

## Usage

1. Start the dev server:
   ```
   bun run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. Sign in with Discord OAuth or Email/Password.
4. Explore personalized features based on your role.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## ❤️ Mental Health Reminder

<p align="start">
  <a target="_blank" href="https://tdanks.com/mental-health/quote">
    ❤️ You are great, you are enough, and your presence is valued. If you’re struggling with your mental health, please reach out to someone you love and consult a professional. You are not alone. ❤️
  </a>
</p>
