# Cyber Kicks — Full-Stack Sneaker Commerce App

A mobile-first sneaker shopping experience that combines a polished React Native interface with a FastAPI backend and a Supabase product catalog.

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-54-000000?style=flat-square&logo=expo&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

## Product overview

Cyber Kicks explores the complete customer journey of a modern mobile storefront: product discovery, real-time search, favorites, product variants, cart management, delivery simulation, and order submission.

### Highlights

- OLED-inspired dark interface and reusable design system
- Animated hero area with scroll-based parallax
- Real-time product and brand search
- Product detail pages with sizes and delivery estimates
- Global cart and favorites state with React Context
- Typed navigation with stack and bottom tabs
- FastAPI endpoints for catalog and orders
- Supabase-backed product and image data
- Responsive experience for Android and iOS through Expo

## Architecture

```text
Expo / React Native / TypeScript
              |
            Axios
              |
              v
        FastAPI REST API
              |
              v
     Supabase / PostgreSQL
```

## Tech stack

| Area | Technologies |
|---|---|
| Mobile | React Native, Expo, TypeScript |
| Navigation | React Navigation |
| State | React Context API |
| Backend | Python, FastAPI, Pydantic |
| Database | Supabase, PostgreSQL |
| API client | Axios |

## Repository structure

```text
.
├── Front-Apk/
│   ├── src/components/    # Reusable UI
│   ├── src/contexts/      # Cart and favorites state
│   ├── src/routes/        # Navigation
│   ├── src/screens/       # Application screens
│   └── src/services/      # API client
└── Back-Apk/
    ├── routers/           # Product and order endpoints
    ├── schemas/           # Pydantic models
    ├── main.py
    └── seed.py
```

## Run locally

### Backend

```bash
cd Back-Apk
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn supabase python-dotenv pydantic
uvicorn main:app --reload
```

Configure `SUPABASE_URL` and `SUPABASE_KEY` in a local `.env` file before starting the API.

### Mobile app

```bash
cd Front-Apk
npm install
npx expo start -c
```

Point `src/services/api.ts` to the backend URL available to your device or emulator.

## Engineering decisions

- TypeScript keeps screen, navigation, and domain contracts explicit.
- Feature-based folders separate UI, state, routes, and integration code.
- The backend isolates API routes and validation schemas.
- Environment variables keep infrastructure credentials out of source code.

## Author

**João Gabriel Vieira Barbosa**  
Full-Stack Developer focused on Python, FastAPI, React, APIs, and business automation.

[GitHub profile](https://github.com/JoaoGabriel39359)
