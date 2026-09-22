# BingeBox

A Letterboxd-style social app for TV shows. Track episodes, rate series, build lists, and discover what to watch.

## Setup

1. Install [Node.js LTS](https://nodejs.org/) (v20+)
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Add your [TMDb API keys](https://www.themoviedb.org/settings/api) to `.env.local`
4. Install dependencies and create the database:
   ```bash
   npm install
   npm run db:push
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

Create an account at `/register`, then browse a show and log an episode.

### Corporate network / SSL issues

If you see `SELF_SIGNED_CERT_IN_CHAIN` errors, your network may use a proxy. Run:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run dev
```

## Features

- **Auth** — email + username sign up / sign in
- **Episode diary** — log episodes with date, half-star rating, and review
- **Watchlist** — save shows to watch later
- **Custom lists** — curated show collections (public or private)
- **Social** — follow members, activity feed, likes on reviews
- **TMDb** — live show metadata, streaming providers, episode details

## TMDb usage

This project uses the **free TMDb API** for non-commercial use.

Required: display [TMDb attribution](https://www.themoviedb.org/documentation/api/terms-of-use) on the site (already in the footer).

## Attribution

This product uses the TMDb API but is not endorsed or certified by TMDb.
