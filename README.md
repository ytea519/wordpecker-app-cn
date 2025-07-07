# WordPecker App

A personalized language-learning app that brings the magic of Duolingo-style lessons to your own curated vocabulary lists and contexts.

> **🎯 Perfect for:** Language learners who want to practice vocabulary from books, movies, or real-life encounters  
> **🛠️ Tech Stack:** React + TypeScript, Node.js + Express, MongoDB, OpenAI API  
> **🐳 Setup:** One-command Docker setup available  
> **🔓 Auth:** No login required - single user app

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [The Idea](#the-idea)
- [How It Works](#how-it-works)
- [Demo](#demo)
- [Roadmap](#roadmap)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Configuration](#configuration)
  - [Development](#development)
- [Docker Setup (Recommended)](#docker-setup-recommended)
  - [Quick Start with Docker](#quick-start-with-docker)
  - [Docker Commands](#docker-commands)
  - [MongoDB Access](#mongodb-access)
  - [Running Only MongoDB with Docker](#running-only-mongodb-with-docker)
  - [Easy Startup Script](#easy-startup-script)
  - [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

- **🐳 Docker (Recommended):** [Quick Start with Docker](#quick-start-with-docker)
- **💻 Local Development:** [Manual Installation](#installation)
- **🗄️ MongoDB Only:** [Running Only MongoDB](#running-only-mongodb-with-docker)

---

![WordPecker App](./docs/assets/createlist-addword.gif)

## The Idea

Learning a new language can be straightforward, but mastering it is the real challenge. While it's relatively easy to grasp the basics, developing strong communication or reading skills depends on having a solid vocabulary. To build this, you must learn words and phrases at various levels, yet exposure is key. For instance, if you've studied English but don’t live in an English-speaking country, advancing your skills becomes significantly harder. You can read books, watch movies, or browse blogs, but fully immersing yourself in the language is still difficult. Real progress often requires extra effort—studying and revisiting words and phrases encountered in your daily life.

However, this process can be inconvenient. You have to pause whatever you’re doing to note new words, search their meanings, record them, and then review them later. This is time-consuming and tiring. As a result, although you might improve, the learning process can feel painfully slow and inefficient.

To solve this, I have an idea for an app that merges personalized learning with the efficiency of flashcards—a blend of Duolingo-like lessons and custom study lists.

Imagine you’re reading a book—say, Harry Potter. As you come across unfamiliar words, you open the app and create a new list with details like:

- Name: Harry Potter Book
- Description: The first book in the series
- Context: Harry Potter

Once the list is created, you add the words or phrases you’ve found. The app automatically provides their meanings in context after you save them, so you can continue reading without interruption.

Later, you revisit the list and pick one of two options: Learn or Quiz.

- Learn: This mode delivers structured lessons in a Duolingo style. Text, visuals, and exercises are dynamically generated using LLMs.

**Note**: Text-based multiple-choice questions are _currently_ the only question type available.

- Quiz: When you’re ready, you can test what you’ve learned through interactive quizzes. They’re engaging and gamified, awarding points and showing your progress. For example, it might indicate you’ve mastered 75% of your list.

**Note**: The feature that displays something like “You’ve mastered 75% of your list” is planned but not yet built.

The key advantage is that the app keeps your learning tied to the context in which you originally saw the words. By returning to them in their original setting, you strengthen those specific neural pathways, speeding up retention and making learning significantly more effective.

**In short, it’s like having a personalized Duolingo where you can create and learn from your own lists. It’s a powerful way to immerse yourself in the language and make steady progress.**

![WordPecker App](./docs/assets/wordpecker.png)

## How It Works

1. **Encounter New Words**: While reading or watching something, open the app and add new words or phrases to a contextual list (e.g., Harry Potter Book, Science Blog, Netflix Show, etc.).
2. **Automatic Definitions**: The app automatically fetches the word definitions (in the context) after you save them.
3. **Learn**: Dive into Learn Mode, practice exercises—just like Duolingo, but tailored to your words.
4. **Quiz**: Switch to Quiz Mode anytime to check your retention.
5. **Review and Repeat**: Visit your lists.

## Demo

[![Alt text](https://img.youtube.com/vi/QIwPGAXgNLU/0.jpg)](https://www.youtube.com/watch?v=QIwPGAXgNLU)

### Create List & Add Word

[![Alt text](https://img.youtube.com/vi/t1U5vzm5Qw0/0.jpg)](https://www.youtube.com/watch?v=t1U5vzm5Qw0)


## Roadmap

- **Additional Question Types**: Currently, only text-based multiple-choice questions are supported. In the future, I plan to introduce more Duolingo-style exercises such as fill-in-the-blanks, listening comprehension, and visual matching.

![Roadmap](./docs/assets/roadmap-questions.jpeg)

- **Progress Tracking**: Display detailed statistics—like a mastery percentage—and possibly introduce daily goals or streaks to keep learners motivated.

- **List Sharing**: Allow users to share their custom vocabulary lists with others.

- **Improved Onboarding**: Provide a quick tutorial or sample list for new users, helping them understand the app’s features and workflow more easily.

- **Integration with Other Platforms**: Connecting with e-readers?, browsers, or note-taking apps so users can add new words without leaving those platforms.

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- MongoDB (local or cloud instance)
- An OpenAI API key

### Installation

Clone the repository:
```bash
git clone https://github.com/baturyilmaz/wordpecker-app.git
cd wordpecker-app
```

Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

Install and start MongoDB:

**Local MongoDB:**
```bash
# macOS (with Homebrew)
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download and install from https://www.mongodb.com/try/download/community
```

**Or use MongoDB Atlas (cloud):**
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string

### Configuration

Create `.env` files:

Backend `.env`:
```
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
MONGODB_URL=mongodb://localhost:27017/wordpecker
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:3000
```

**Note:** For MongoDB Atlas, use your connection string for `MONGODB_URL`:
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/wordpecker
```

### Development

The database will be automatically created when you first start the backend. No manual database setup is required as MongoDB is schemaless and Mongoose will handle collection creation.

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd frontend
npm run dev
```

## Docker Setup (Recommended)

For the easiest setup experience, use Docker to run the entire application with MongoDB:

### Prerequisites
- Docker and Docker Compose installed on your system

### Quick Start with Docker

1. **Clone and navigate to the project:**
```bash
git clone https://github.com/baturyilmaz/wordpecker-app.git
cd wordpecker-app
```

2. **Set up environment variables:**
```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

3. **Start all services (MongoDB + Backend + Frontend):**
```bash
# For development with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Or for production build
docker-compose up --build
```

4. **Access the application:**
   - Frontend: http://localhost:5173 (dev) or http://localhost:3000 (prod)
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017 (username: admin, password: password)

### Docker Commands

```bash
# Start services in development mode with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Start services in production mode
docker-compose up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
```

### MongoDB Access

When using Docker, MongoDB runs with these credentials:
- **Host:** localhost:27017
- **Username:** admin
- **Password:** password
- **Database:** wordpecker

You can connect to MongoDB using tools like MongoDB Compass or mongosh:
```bash
# Using mongosh
mongosh "mongodb://admin:password@localhost:27017/wordpecker?authSource=admin"
```

### Running Only MongoDB with Docker

If you prefer to run only MongoDB in Docker and the backend/frontend locally:

```bash
# Start only MongoDB
docker-compose -f docker-compose.mongo.yml up -d

# Update your backend .env file to use:
MONGODB_URL=mongodb://admin:password@localhost:27017/wordpecker?authSource=admin

# Then run backend and frontend locally
cd backend && npm run dev
cd frontend && npm run dev
```

### Easy Startup Script

For convenience, use the provided startup script:

```bash
# Make sure you have Docker and Docker Compose installed
./scripts/docker-dev.sh
```

This script will:
- Check if .env file exists and create it from template
- Validate OpenAI API key is set
- Clean up old containers and images
- Start all services in development mode

### Troubleshooting

**Backend won't connect to MongoDB:**
- Check that MongoDB container is healthy: `docker-compose ps`
- View logs: `docker-compose logs mongodb`
- The backend has retry logic and will attempt to connect 5 times

**Port conflicts:**
- Development setup uses ports 5173 (frontend), 3000 (backend), 27017 (mongodb)
- Production setup uses ports 3000 (frontend), 3001 (backend), 27017 (mongodb)
- Change ports in docker-compose files if needed

**Container build issues:**
- Rebuild without cache: `docker-compose build --no-cache`
- Clean everything: `docker system prune -a`

**Environment variables:**
- Make sure .env file has OPENAI_API_KEY set
- Check that environment variables are loaded: `docker-compose config`

## Architecture

- Frontend: React.js with TypeScript
- Backend: Express.js with TypeScript
- Database: MongoDB with Mongoose
- AI: OpenAI API
- Single User: No authentication required

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a pull request

## License

[MIT](LICENSE)
