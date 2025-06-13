# Zer0mind Backend

FastAPI server that powers the Zer0mind admin panel.

## Requirements

- Python 3.10+
- MongoDB accessible via `MONGO_URI`

Install dependencies with:

```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file with at least:

```env
MONGO_URI=mongodb://localhost:27017
OPENAI_API_KEY=sk-...
JWT_SECRET=super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Running

Start the API using Uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server exposes routes under `/api` and will initialise MongoDB collections on startup.

