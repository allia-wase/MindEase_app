# MindEase - Mental Health Support App

A comprehensive mental health support platform designed for university students, providing self-assessment tools, counselor matching, peer support, and crisis resources.

![MindEase Logo](https://img.icons8.com/color/96/000000/mental-health.png)

## 🚀 Features

- **📊 Self-Assessment Tools** - PHQ-9 and GAD-7 assessments with personalized recommendations
- **😊 Mood Tracking** - Daily mood monitoring with analytics and trends
- **👨‍⚕️ Counselor Matching** - Connect with certified mental health professionals
- **👥 Peer Support** - Anonymous chat groups with fellow students
- **🆘 Crisis Resources** - Immediate access to emergency contacts and support
- **📚 Resource Library** - Articles, videos, and coping strategies
- **🔐 Secure Authentication** - University student verification system
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with Flexbox/Grid

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Backend**: Railway
- **Frontend**: Vercel  
- **Database**: MongoDB Atlas

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🏃‍♂️ Quick Start

Follow these steps to get MindEase running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mind-ease-app.git
cd mind-ease-app
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit the .env file with your configuration
# See Environment Variables section below for details

# Start the development server
npm run dev
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables  
cp .env.example .env

# Edit the .env file
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
