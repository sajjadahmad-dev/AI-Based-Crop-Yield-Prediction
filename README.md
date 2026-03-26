# AI-Based Crop Yield Prediction

A full-stack web application that predicts crop yield using weather and soil data.

The project combines:
- Frontend: React + TypeScript + Vite
- Backend: FastAPI + SQLAlchemy + SQLite
- ML Inference: scikit-learn model loaded from `backend/model.pkl`

## What This Project Does

This system helps users estimate crop yield for a given set of inputs (area, crop, year, rainfall, pesticides, temperature).

Key capabilities:
- User registration and login (JWT authentication)
- Prediction endpoint usable both with and without login
- Logged-in users get prediction history in My Account
- Dashboard and project information pages for demonstration and reporting

## Project Structure

- `backend/`: FastAPI API, auth, prediction logic, database models
- `frontend/`: React application (UI, auth forms, account page, prediction workflow)
- `render.yaml`: Render deployment config for backend

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Uvicorn
- SQLAlchemy
- Passlib + python-jose (JWT auth)
- NumPy / Pandas / scikit-learn
- SQLite

## Prerequisites

Install these before running:
- Python 3.9+
- Node.js 18+
- npm
- Git

## Environment Variables

### Frontend (`frontend/.env`)
Create from `frontend/.env.example`:

- `VITE_BACKEND_URL` (example: `http://127.0.0.1:8000`)
- `VITE_OPENWEATHER_API_KEY` (optional)

### Backend (`backend/.env`)
Create from `backend/.env.example`:

- `FRONTEND_ORIGIN` (example: `http://localhost:5173`)
- `DATABASE_URL` (default: `sqlite:///./crop.db`)
- `JWT_SECRET_KEY` (set a secure value)

## Local Setup and Run

Open two terminals.

### 1) Backend Terminal

```powershell
cd E:\AI-Based-Crop Yield Prediction
python -m venv .venv
& ".\.venv\Scripts\Activate.ps1"
pip install -r backend\requirements.txt
copy backend\.env.example backend\.env
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend URLs:
- API Root: `http://127.0.0.1:8000`
- Swagger Docs: `http://127.0.0.1:8000/docs`

### 2) Frontend Terminal

```powershell
cd E:\AI-Based-Crop Yield Prediction\frontend
npm install
copy .env.example .env
```

Update `frontend/.env`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Then run:

```powershell
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## How to Use

1. Open frontend in browser.
2. Register a new account.
3. Login with your credentials.
4. Go to prediction section and submit input values.
5. View result instantly.
6. Open My Account to view prediction history (logged-in predictions only).

## API Overview

Main backend routes:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /predict`
- `GET /predictions/history`

## Deployment

### Backend on Render

This repository includes `render.yaml` for backend deployment.

Expected start command:

```bash
uvicorn main:app --host 0.0.0.0 --port 10000
```

Set environment variables on Render:
- `FRONTEND_ORIGIN`
- `JWT_SECRET_KEY`
- `DATABASE_URL` (optional; defaults to SQLite)

### Frontend on Vercel

Build command:

```bash
npm run build
```

Required Vercel env var:
- `VITE_BACKEND_URL` = your Render backend URL

## Troubleshooting

### PowerShell execution policy error

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Port already in use

Check and kill process:

```powershell
Get-NetTCPConnection -LocalPort 8000
Get-NetTCPConnection -LocalPort 5173
taskkill /PID <PID> /F
```

### Frontend cannot call backend

- Verify backend is running on port 8000
- Verify `frontend/.env` has correct `VITE_BACKEND_URL`
- Restart frontend after changing `.env`

## License

This project is intended for educational and final-year project use.
