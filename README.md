# AI Learning Assistant

An intelligent learning platform powered by Google Gemini AI that helps students and professionals learn from documents more effectively.

## Features

- 📄 **Document Upload**: Upload PDF and text documents
- 🎯 **AI-Generated Flashcards**: Automatically generate flashcards from document content
- ✍️ **Smart Quizzes**: Create intelligent quizzes to test your knowledge
- 💬 **AI Chat Assistant**: Chat with an AI about document content
- 📊 **Progress Tracking**: Track your learning progress
- 🎨 **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Processing**: PDF parsing and chunking
- **AI**: Google Gemini API

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB account
- Google Gemini API key

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
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env.development)
```
VITE_API_BASE_URL=http://localhost:8000
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

## Deployment

For production deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deployment Options
- **Backend**: Heroku, Railway, Render, AWS
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License

## Support

For issues and questions, please create an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Multiple language support
- [ ] Custom learning paths
- [ ] Integration with calendar/scheduling

---

**Last Updated**: May 2026
