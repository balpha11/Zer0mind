# Zer0mind

This project contains the React front‑end for the Zer0mind prototype. The UI is built using **Vite** and **Tailwind CSS** with various Radix UI and Chakra components. The codebase lives in the `src/` directory and provides both the public site and an extensive admin panel under `src/pages/admin`.

The admin interface includes pages for agents, flows, tools, prompts, plans and more. All communication with the backend is centralized in `src/services/api.js`, which exposes small helper functions for authentication, agent management and other REST endpoints.



Running the script will execute each agent and print their responses.

## Front‑end setup

```bash
npm install
npm run dev
```

The dev server proxies API requests to `http://localhost:8000` as configured in `vite.config.js`.

## Python requirements

Below are the packages required to run `exampleagent.py` and the (now removed) FastAPI backend:

```text
fastapi==0.110.1
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
pydantic>=2.10.0,<3.0.0
pydantic-settings>=2.0.0
python-dotenv==1.0.1
httpx==0.27.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]>=3.3.0
aiofiles==23.2.1
python-multipart==0.0.9
fastapi[all]==0.110.1
openai-agents==0.0.17
loguru==0.7.2
pymongo>=4.3.3
motor>=3.1.1
fastapi>=0.68.0
uvicorn>=0.15.0
python-multipart>=0.0.5
```

These dependencies can be installed with `pip install -r requirements.txt` if such a file is recreated from the list above.

