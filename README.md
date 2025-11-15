# LinkedIn Clone 💼✨

Project Link: https://wonderlust-akm-1.onrender.com/listings


![Screenshot 2025-11-15 094130](https://github.com/user-attachments/assets/2a52c83f-70ac-4c1e-ba37-a7026184bfd8)

## A Full-Stack Professional Networking Platform

A comprehensive LinkedIn clone that enables professionals to connect, share content, discover opportunities, and grow their careers. Built with modern technologies to provide a seamless social networking experience for professionals worldwide.

## Table of Contents
- Features
- Technology Stack
- Installation
- Project Structure
- API Documentation
- Contributing
- License

## Features

### For Professionals 👨‍💼👩‍💼

- **Profile Management** 👤 - Create and customize professional profiles with work experience, education, skills, and achievements
- **Networking** 🤝 - Connect with professionals, send connection requests, and build your network
- **Content Sharing** 📝 - Create posts with text and images to share insights, updates, and professional content
- **Engagement** 💬 - Like, comment, and interact with posts from your network
- **Notifications** 🔔 - Real-time notifications for likes, comments, connection requests, and messages
- **Messaging** 💬 - Real-time chat with connections using Socket.IO
- **Job Search** 🔍 - Browse and search job opportunities with advanced filtering
- **Job Applications** 📄 - Apply for jobs with resume upload and cover letter
- **Recommendations** 🌟 - Get personalized job and connection recommendations

### For Recruiters & Companies 🏢

- **Job Posting** 📢 - Create detailed job listings with requirements, responsibilities, and benefits
- **Application Management** 📊 - Review applications, manage candidates, and track hiring process
- **Company Pages** 🏛️ - Showcase company culture, values, and opportunities
- **Candidate Search** 🔎 - Find and reach out to potential candidates
- **Analytics Dashboard** 📈 - Track job post performance, views, and application metrics

### Platform Features 🚀

- **Authentication & Authorization** 🔐 - Secure JWT-based authentication with role-based access control
- **Real-time Updates** ⚡ - Live notifications and messaging powered by Socket.IO
- **Responsive Design** 📱 - Fully responsive UI that works seamlessly on desktop, tablet, and mobile
- **Image Upload** 📷 - Profile pictures, post images, and company logos with Cloudinary integration
- **Search Functionality** 🔍 - Search for people, jobs, companies, and content
- **Feed Algorithm** 🎯 - Personalized content feed based on connections and interests
- **Privacy Controls** 🔒 - Control who can see your profile, posts, and connection list

## Technology Stack

### Frontend 🎨

- **React 18** ⚛️ - Modern UI library with hooks and functional components
- **React Router DOM** 🛣️ - Client-side routing for seamless navigation
- **TanStack Query (React Query)** 🔄 - Powerful data fetching and state management
- **Tailwind CSS** 🎨 - Utility-first CSS framework for rapid UI development
- **Lucide React** 🎭 - Beautiful, consistent icon library
- **Axios** 🌐 - HTTP client for API requests
- **React Hot Toast** 🍞 - Elegant notification system
- **Socket.IO Client** 🔌 - Real-time bidirectional communication
- **Date-fns** 📅 - Modern date utility library
- **Vite** ⚡ - Next-generation frontend build tool

### Backend 🛠️

- **Node.js** 🟢 - JavaScript runtime environment
- **Express.js** 🚂 - Fast, unopinionated web framework
- **MongoDB** 🍃 - NoSQL database for flexible data storage
- **Mongoose** 🦫 - MongoDB object modeling for Node.js
- **JWT** 🎫 - JSON Web Tokens for secure authentication
- **Socket.IO** 🔌 - Real-time communication engine
- **Cloudinary** ☁️ - Image and media management
- **Multer** 📤 - File upload handling middleware
- **Bcrypt** 🔐 - Password hashing and encryption
- **Cookie Parser** 🍪 - Cookie parsing middleware
- **CORS** 🌍 - Cross-Origin Resource Sharing configuration
- **Dotenv** 🔧 - Environment variable management

## Installation 💻

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/wonderlust.git
cd wonderlust

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed the database (optional)
npm run seed

# Start the development server
npm run dev
```

## Project Structure 📁

```
linkedin-clone/
├── backend/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware (auth, error handling)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── lib/                # Utility functions (db, cloudinary)
│   ├── uploads/            # Temporary file storage
│   ├── server.js           # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components (Navbar, Sidebar)
│   │   │   └── ui/         # UI components
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login, Signup pages
│   │   │   └── ...         # Other pages
│   │   ├── lib/            # Utility libraries (axios, etc.)
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── index.html
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
└── README.md
```

## Acknowledgments 🙏

- LinkedIn for design inspiration
- The React and Node.js communities
- All contributors and supporters

## Contact 📧

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/linkedin-clone](https://github.com/yourusername/linkedin-clone)

---

⭐ Star this repo if you find it helpful!

Made with ❤️ and ☕
