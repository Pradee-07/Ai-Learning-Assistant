# AI Learning Assistant

An intelligent learning platform powered by Google Gemini AI that helps students and professionals learn from documents more effectively.A full-stack, AI-powered educational platform designed to transform static study materials into interactive learning experiences. By uploading a document, users can automatically generate flashcards, take intelligent quizzes, and chat directly with their study materials using Google's Gemini AI.

## Features

- 📄 **Document Upload**: Upload PDF and text documents
- 🎯 **AI-Generated Flashcards**: Automatically generate flashcards from document content
- ✍️ **Smart Quizzes**: Create intelligent quizzes to test your knowledge
- 💬 **AI Chat Assistant**: Chat with an AI about document content
- 📊 **Progress Tracking**: Track your learning progress
- 🎨 **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS


## 📦 Tech Stack & Package Deep Dive

A deliberate choice of libraries was made to balance performance, developer experience, and UI quality. Here is exactly what powers this app and why:

### Frontend (React + Vite)
*   **`react` / `react-dom`:** The core UI library used to build the single-page application using reusable components and state hooks (`useState`, `useEffect`).
*   **`react-router-dom`:** Enables seamless, client-side routing (e.g., navigating from `/dashboard` to `/quizzes/:id` without reloading the page).
*   **`axios`:** A promise-based HTTP client. Used instead of `fetch` for its automatic JSON parsing, request interceptors (for attaching JWT tokens), and easier error handling.
*   **`tailwindcss`:** A utility-first CSS framework. Used to rapidly build the custom "glassmorphism" design, responsive grids, and complex UI states (hover, focus, disabled) without writing external CSS files.
*   **`lucide-react`:** Provides clean, consistent, and customizable SVG icons (e.g., `BookOpen`, `Trash2`, `Eye`) that scale perfectly with Tailwind text sizes.
*   **`react-hot-toast`:** Replaces ugly browser alerts with beautiful, non-blocking popup notifications for API success/error states, improving the UX.
*   **`moment`:** Used for easy date and time formatting (e.g., converting a MongoDB timestamp into "Created 2 hours ago").
*   **`vite`:** Chosen over Create React App (CRA) for its blazing-fast Hot Module Replacement (HMR) and highly optimized production builds.

### Backend (Node.js + Express)
*   **`express`:** The minimalist web framework used to handle routing, HTTP requests, and middleware setup.
*   **`mongoose`:** An ODM for MongoDB. Crucial for defining strict schemas for our dynamic AI data (Users, Documents, Quizzes, Flashcards) and managing relationships (e.g., linking a Quiz to a specific Document ID).
*   **`@google/genai`:** The official SDK used to communicate with Google's Gemini models (`gemini-2.5-pro` / `gemini-1.5-flash`), responsible for generating the educational content.
*   **`jsonwebtoken` (JWT):** Used to create stateless, secure authentication tokens. Once a user logs in, this token is sent back and forth to verify identity without querying the database every time.
*   **`bcryptjs`:** A cryptographic library used to hash user passwords *before* they are saved to the database, ensuring security even if the database is compromised.
*   **`multer`:** Middleware used to handle `multipart/form-data`. Specifically used to intercept, validate, and save PDF and text file uploads from the frontend.
*   **`pdf-parse`:** A library that reads uploaded PDF files and extracts the raw text so it can be fed into the Gemini AI prompt.
*   **`nodemailer`:** Used to connect to SMTP servers (like Gmail) to send One-Time Passwords (OTPs) to users for email verification and password resets.
*   **`cors`:** Middleware that allows our frontend (running on one port/domain) to securely make requests to our backend API (running on another).
*   **`dotenv`:** Loads environment variables from a `.env` file into `process.env`, keeping API keys and database passwords out of the source code.

## 🚀 What Has Been Built

This project is a complete MERN-stack application featuring a complex integration with large language models (LLMs). The core accomplishments include:

- **Secure Authentication System:** Full user registration, login, profile management, and password changing secured via JWT and bcrypt. (Includes OTP email verification architecture).
- **Document Processing:** Ability to upload PDF and text documents, parse the raw text on the backend, and store it securely.
- **Prompt Engineering & AI Integration:** Custom backend logic that wraps user documents in strict system prompts, forcing the Google Gemini API to return predictable, structured JSON data for educational tools.
- **Dynamic Quiz Engine:** An interactive quiz-taking UI that tracks scores, highlights correct/incorrect answers, and provides AI-generated explanations for every question.
- **Spaced Repetition Flashcards:** A beautifully styled flashcard interface allowing users to study, flip cards, track their review progress, and star important concepts.
- **Contextual AI Chat:** A chat interface where users can ask questions specifically about the document they uploaded, preventing AI hallucinations.
- **Premium Glassmorphism UI:** A fully responsive, modern frontend built with Tailwind CSS, featuring smooth animations, hover states, and intuitive modal interactions.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB account
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI_learning_assistant

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI_learning_assistant
```

2. **Backend Setup**
```bash
cd backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Update .env with your credentials
# MONGODB_URI=your-mongodb-connection
# GEMINI_API_KEY=your-api-key
# JWT_SECRET=your-secret

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend/Ai-learning-assistant

# Copy environment template
cp .env.example .env.development

# Install dependencies
npm install

# Start development server
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Project Structure

```
AI_learning_assistant/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Express server
│   └── .env             # Environment variables
│
├── frontend/
│   └── Ai-learning-assistant/
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── pages/        # Page components
│       │   ├── services/     # API services
│       │   ├── context/      # Context providers
│       │   └── utils/        # Utility functions
│       ├── vite.config.js    # Vite configuration
│       └── package.json      # Dependencies
│
├── DEPLOYMENT_GUIDE.md  # Production deployment guide
└── DEPLOYMENT_CHECKLIST.md  # Pre-deployment checklist
```

## Development

### Backend Development
```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm run prod

# Production mode (alternative)
npm start
```

### Frontend Development
```bash
cd frontend/Ai-learning-assistant

# Development mode
npm run dev

# Build for production
npm run build

# Build for production (alternative)
npm run build:prod

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)
```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster/database
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
GEMINI_API_KEY=your-api-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,frontend url(in deplopment)
```

### Frontend (.env.development)
```
VITE_API_BASE_URL=http://localhost:8000,backend url(in deplopment)
VITE_APP_NAME=AI Learning Assistant
VITE_MAX_FILE_SIZE=10485760
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document by ID
- `DELETE /api/documents/:id` - Delete document

### Flashcards
- `GET /api/flashcards` - Get all flashcard sets
- `GET /api/flashcards/:documentId` - Get flashcards for document
- `POST /api/ai/generate-flashcards` - Generate flashcards
- `PUT /api/flashcards/:cardId/review` - Mark flashcard as reviewed
- `DELETE /api/flashcards/:id` - Delete flashcard set

### Quizzes
- `GET /api/quizzes` - Get all quizzes for the authenticated user
- `GET /api/quizzes/:documentId` - Get quizzes for document
- `POST /api/ai/generate-quiz` - Generate quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results

### AI Features
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/generate-summary` - Generate document summary
- `POST /api/ai/explain-concept` - Explain concept

## Database Schema

### User Model
- `name`, `email`, `password`, `createdAt`, `updatedAt`

### Document Model
- `title`, `filename`, `filesize`, `uploadedBy`, `content`, `createdAt`, `updatedAt`

### Flashcard Model
- `question`, `answer`, `difficulty`, `documentId`, `isStarred`, `lastReviewed`, `createdAt`

### Quiz Model
- `title`, `questions`, `documentId`, `userAnswers`, `score`, `completedAt`

### ChatHistory Model
- `documentId`, `userId`, `messages`, `createdAt`, `updatedAt`

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- File upload validation
- Input validation and sanitization
- Environment variables for sensitive data
- Rate limiting (recommended for production)

## Performance

- Optimized bundle size with code splitting
- Database indexing
- Gzip compression
- CDN support
- Lazy loading of components

## License

This project is licensed under the ISC License


