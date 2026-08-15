import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostView from './pages/PostView'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col" style={{background: 'var(--bg)'}}>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:id" element={<PostView />} />
                  <Route path="/user/:id" element={<PublicProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={
                    <PrivateRoute>
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/create" element={
                    <PrivateRoute>
                      <AdminRoute>
                        <CreatePost />
                      </AdminRoute>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/edit/:id" element={
                    <PrivateRoute>
                      <AdminRoute>
                        <EditPost />
                      </AdminRoute>
                    </PrivateRoute>
                  } />
                  <Route path="/admin/profile" element={
                    <PrivateRoute>
                      <AdminRoute>
                        <Profile />
                      </AdminRoute>
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
