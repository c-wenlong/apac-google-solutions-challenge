# APAC Solution Challenge Frontend (`AIDY`)

This is the frontend for the APAC Solution Challenge project, providing a modern, interactive UI for tourism density mapping and AI-powered features. Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.

---

## Features

- **Tourism Density Mapper**: Visualize and manage lists of places, view live crowd data, and interact with a map-based interface.
- **AI Chat & Guidance**: Chat interface for AI-powered tourist guidance and Q&A.
- **Speech & Text Integration**: Supports speech-to-text and text-to-speech via backend APIs.
- **Responsive UI**: Modern, accessible, and responsive design using shadcn/ui and Tailwind CSS.

---

## Directory Structure

```
frontend/AIDY/
├── src/
│   ├── components/      # Reusable UI components (Sidebar, ChatInterface, PlacesList, etc.)
│   ├── pages/           # Main pages/routes (ListsPage, ChatPage, NotFound, etc.)
│   ├── lib/             # Utility functions and helpers
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets (logo, images, etc.)
├── index.html           # HTML template
├── package.json         # Project metadata and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

---

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/) (for data visualization)
- [Lucide React](https://lucide.dev/) (icons)

---

## Environment Variables

If your frontend needs to connect to a custom backend API, you can set environment variables in a `.env` file at the project root (see Vite docs for details).

---

## Linting

To check code quality and formatting:
```bash
npm run lint
```

---

## Deployment

You can deploy the production build (`dist/`) to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## License

MIT
