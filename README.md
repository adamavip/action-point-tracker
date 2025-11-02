# Action Point Tracker

A lightweight React application for creating meeting action plans. Define a meeting, add up to ten tasks, and manage up to ten activities for each task while tracking weekly progress, completion percentages, and statuses.

## Features

- Meeting initialisation with live summary of task counts.
- Rich task form supporting assignments, dependencies, date range, priority, and notes.
- Nested activities per task with completion sliders, status tracking, and contextual notes.
- Visual tracker showcasing week-by-week timelines, progress bars, and activity tables.
- Responsive, modern interface built with handcrafted styling.

## Getting started

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`) in your browser.

## Available scripts

- `npm run dev` – run the development server with hot module replacement.
- `npm run build` – create an optimised production bundle.
- `npm run preview` – serve the production build locally for inspection.

## Project structure

```
src/
  App.jsx             # Application shell and layout
  main.jsx            # Entry point
  components/         # Reusable UI building blocks
  styles/             # Global and component styles
  utils/              # Shared helpers (task factory)
```

## Notes

The project references modern web APIs (`crypto.randomUUID`) and depends on React 18, Vite 5, and date-fns for date calculations.
