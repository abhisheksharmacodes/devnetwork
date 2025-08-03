# LinkedIn Clone - Community Platform

A mini LinkedIn-like community platform built with Next.js frontend and Node.js/Express backend with MongoDB.

## Features

- **User Authentication**: Register/Login with email and password
- **User Profiles**: View user profiles with name, email, and bio
- **Public Post Feed**: Create and view text-only posts
- **Profile Pages**: View individual user profiles and their posts
- **Real-time Updates**: Posts appear immediately after creation

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- React Hook Form for form handling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd ciann
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```bash
MONGODB_URI=mongodb://localhost:27017/linkedin-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/posts` - Get user's posts

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create a new post (requires authentication)

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Create Posts**: Use the text area to create new posts
3. **View Feed**: See all posts from all users in chronological order
4. **View Profiles**: Click on any user's name to view their profile and posts
5. **Logout**: Use the logout button in the header to sign out

## Project Structure

```
ciann/
├── client/                 # Next.js frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx   # Main page with auth and feed
│   │       └── profile/
│   │           └── [userId]/
│   │               └── page.tsx  # Profile page
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables
└── README.md
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

## Development

### Running in Development Mode
- Backend: `npm run dev` (uses nodemon for auto-restart)
- Frontend: `npm run dev` (Next.js development server)

### Building for Production
- Frontend: `npm run build` then `npm start`
- Backend: `npm start`

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS enabled for frontend-backend communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 