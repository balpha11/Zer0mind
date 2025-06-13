# Zer0mind

Zer0mind is an experimental admin panel built with **React**, **Vite** and **Tailwind CSS**.  The frontend lives in this directory while the FastAPI backend resides in `python backend/`.

## Project structure

- `src/` – React application
- `src/pages/admin` – admin dashboard
- `python backend/` – FastAPI API (see its [README](python%20backend/README.md))

## Requirements

- Node.js 20 (see `.nvmrc`)
- A running instance of the backend

## Setup

1. Copy `.env` and adjust `VITE_API_BASE_URL` to point to your backend.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The dev server proxies API requests to `http://localhost:8000` by default.  Build for production with `npm run build`.

For backend instructions see [`python backend/README.md`](python%20backend/README.md).

