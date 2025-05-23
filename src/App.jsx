import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import HotelView from './pages/hotel-view.jsx'
import NotFound from './pages/NotFound.jsx'
import RoomTable from './pages/room-table.jsx' 

const getUserRole = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch (err) {
    return null
  }
}

const ProtectedRoute = ({ children, role }) => {
  const userRole = getUserRole()
  if (!userRole || userRole !== role) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const role = getUserRole()

  return (
    <Routes>
      <Route path="/" element={role === 'cliente' ? <HotelView /> : <Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="adminPlataforma">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/habitaciones"
        element={
          <ProtectedRoute role="adminPlataforma">
            <RoomTable />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
