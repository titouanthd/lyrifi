# Lyrifi 🎵

Lyrifi is a modern music streaming platform built with Next.js, MongoDB, and YouTube IFrame API. It leverages MusicBrainz data to provide a rich musical experience.

Lyrifi est une plateforme de streaming musical moderne construite avec Next.js, MongoDB et l'API YouTube IFrame. Elle utilise les données de MusicBrainz pour offrir une expérience musicale riche.

## 🚀 Tech Stack / Stack Technique

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (with persist middleware)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Audio**: [React-Player](https://github.com/cookpete/react-player) (YouTube IFrame)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

## 🏗 Architecture

- **Atomic Design**: Components are organized into atoms, molecules, and organisms.
- **Persistent Layout**: The player remains active across all pages.
- **YouTube Fallback**: Automatic search and database update if a YouTube ID is missing.

## 🛠 Commands / Commandes

| Command | Description |
|---------|-------------|
| `make install` | Install dependencies / Installer les dépendances |
| `make dev` | Start development server / Démarrer le serveur de développement |
| `make build` | Build for production / Construire pour la production |
| `make lint` | Run linter / Exécuter le linter |
| `make db-up` | Start MongoDB container / Démarrer le conteneur MongoDB |
| `make db-down` | Stop MongoDB container / Arrêter le conteneur MongoDB |
| `make db-logs` | View MongoDB logs / Voir les logs MongoDB |

## 🗄️ Database / Base de données

The project uses MongoDB. For local development, a Docker configuration is provided.

**Connection String (Local):**
```
MONGODB_URI=mongodb://root:toor@localhost:27061/lyrifi?authSource=admin
```

## 📂 Project Structure / Structure du Projet

- `src/app`: Next.js App Router (Pages & Layouts)
- `src/components`: UI components (Atoms, Molecules, Organisms)
- `src/models`: Mongoose database models
- `src/store`: Zustand state management
- `src/lib`: Utility functions and shared logic
