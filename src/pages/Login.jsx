"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/auth.css"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import axios from "axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = "El email es requerido"
    if (!password) newErrors.password = "La contraseña es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const response = await axios.post("http://localhost:5500/api/auth/login", {
        email,
        password
      })

      console.log("Login exitoso:", response.data)
      localStorage.setItem("token", response.data.token)
      alert(`Bienvenido ${response.data.loggedUser.name}`)
      navigate("/dashboard")

    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setErrors({ general: "Credenciales inválidas o usuario no registrado." })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const response = await axios.post("http://localhost:5500/api/auth/login", {
        email: user.email,
        password: user.uid
      })

      console.log("Login con Google exitoso:", response.data)
      localStorage.setItem("token", response.data.token)
      alert(`Bienvenido ${response.data.loggedUser.name}`)
      navigate("/dashboard")

    } catch (error) {
      console.error("Error con Google Login:", error)
      setErrors({ general: "No se encontró cuenta. Regístrate primero." })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="https://res.cloudinary.com/dwvxmneib/image/upload/v1746160558/GallitoCorp_hechkx.jpg" alt="GallitoCorp Logo" className="auth-logo" />
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido al sistema de gestión hotelera</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          </div>
          {errors.general && <span className="error-message">{errors.general}</span>}
          <button type="submit" className="auth-button">Iniciar Sesión</button>
          <div className="divider"><span>o</span></div>
          <button type="button" className="google-button" onClick={handleGoogleLogin}>Continuar con Google</button>
          <div className="auth-footer">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
