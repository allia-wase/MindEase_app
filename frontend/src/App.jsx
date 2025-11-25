import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Resources from './pages/Resources'
import CrisisSupport from './pages/CrisisSupport'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading MindEase...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/assessment" 
            element={user ? <Assessment /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/resources" 
            element={user ? <Resources /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/crisis-support" 
            element={<CrisisSupport />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <Signup /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
