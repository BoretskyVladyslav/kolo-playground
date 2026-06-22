# Kolo Playground — Booking Platform

> Live: [koloplayground.com](https://www.koloplayground.com/)

<img width="1905" height="1086" alt="image" src="https://github.com/user-attachments/assets/ddfb76dc-2f2b-40d0-b961-97a8d909ef84" />


## What it does
Real-time booking system with admin order queue dashboard 
for a children's entertainment venue.

## Tech Stack
Next.js (App Router) · TypeScript · Zustand · Framer Motion · Tailwind CSS · Jest

## Key Engineering Decisions
- Chose Zustand over Context API for booking session state 
  to avoid re-render cascades across the multi-step funnel
- Implemented Framer Motion with code splitting to maintain 
  Lighthouse scores despite animation complexity
- Built admin dashboard entirely on Next.js API Routes — 
  no external backend required

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
