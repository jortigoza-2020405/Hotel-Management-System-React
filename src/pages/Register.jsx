"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/auth.css"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import axios from "axios"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const { email, password, confirmPassword, firstName, lastName } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = "El email es requerido"
    if (!password) newErrors.password = "La contraseña es requerida"
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden"
    if (!firstName) newErrors.firstName = "El nombre es requerido"
    if (!lastName) newErrors.lastName = "El apellido es requerido"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      })

      const userData = {
        firebaseUid: user.uid,
        email: user.email,
        firstName,
        lastName,
        password,
        photoUrl: user.photoURL || ""
      }

      const response = await axios.post("http://localhost:5500/api/auth/register", userData)
      console.log("Registro exitoso:", response.data)
      localStorage.setItem("token", response.data.token)
      alert("Registro exitoso. Bienvenido!")
      navigate("/dashboard")

    } catch (error) {
      console.error("Error en el registro:", error)
      if (error.code === "auth/email-already-in-use") {
        setErrors({ general: "El correo ya está registrado." })
      } else {
        setErrors({ general: "Error en el registro." })
      }
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userData = {
        firebaseUid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(" ")[0] || "SinNombre",
        lastName: user.displayName?.split(" ")[1] || "SinApellido",
        password: user.uid,
        photoUrl: user.photoURL || ""
      }

      const response = await axios.post("http://localhost:5500/api/auth/register", userData)
      console.log("Registro con Google exitoso:", response.data)
      localStorage.setItem("token", response.data.token)
      alert("Registro exitoso con Google. Bienvenido!")
      navigate("/dashboard")

    } catch (error) {
      console.error("Error al registrar con Google:", error)
      setErrors({ general: "No se pudo registrar con Google o el usuario ya existe." })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="https://res.cloudinary.com/dwvxmneib/image/upload/v1746160558/GallitoCorp_hechkx.jpg" alt="GallitoCorp Logo" className="auth-logo" />
          <h2>Crear Cuenta</h2>
          <p>Regístrate en el sistema de gestión hotelera</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" id="firstName" value={firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" id="lastName" value={lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" id="email" value={email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" id="password" value={password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleChange} />
          </div>

          {errors.general && <span className="error-message">{errors.general}</span>}

          <button type="submit" className="auth-button">Registrarse</button>

          <div className="divider"><span>o</span></div>

          <button type="button" className="google-button" onClick={handleGoogleRegister}>
            Continuar con Google
          </button>

          <div className="auth-footer">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
