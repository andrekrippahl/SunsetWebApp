# SunsetWebApp

A React + Vite + Tailwind UI that consumes the Sunset API to show sunrise/sunset and golden-hour data for any city. With dark mode, charts, tables, and optional streaming updates.

---

## Features

- Search by city + date range (start / end)
- Table view of daily results (date, sunrise, sunset, golden hour)
- Chart view (Recharts) with sunrise/sunset lines and optional golden-hour band
- Dark mode toggle (persists to localStorage)
- Streaming mode (optional): table updates live as the API streams rows
- Friendly error UI with helpful hints (e.g., invalid location, missing params)
- Built with Vite, React, Tailwind CSS

## Tech Stack

- React 18, Vite
- Tailwind CSS
- Recharts (charts)

---

## Project Setup

### Install

```bash
git clone https://github.com/andrekrippahl/SunsetWebApp.git
cd SunsetWebApp
npm install
```
### Configure environment

Create .env.local in the project root:
```bash
# Base URL of your backend API (no trailing slash)
VITE_API_BASE_URL=http://localhost:3000

# Sunset endpoint path (if you changed it in the API)
VITE_API_SUNSET_PATH=/sunsets
```

### Run dev server

```bash
npm run dev
```


