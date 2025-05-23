"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import { registerUser, updateUserProfile, loginWithGoogle } from "../../services/auth";
import { validateFields } from "../../hooks/useAuthForm";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields(formData, true);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential.user;
      await updateUserProfile(user, `${formData.firstName} ${formData.lastName}`);

      const response = await axios.post("http://localhost:5500/api/auth/register", {
        firebaseUid: user.uid,
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        photoUrl: user.photoURL || ""
      });

      localStorage.setItem("token", response.data.token);
      alert("Registro exitoso. Bienvenido!");
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrors({ general: "El correo ya está registrado o hubo un error." });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      const response = await axios.post("http://localhost:5500/api/auth/register", {
        firebaseUid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(" ")[0] || "SinNombre",
        lastName: user.displayName?.split(" ")[1] || "SinApellido",
        password: user.uid,
        photoUrl: user.photoURL || ""
      });

      localStorage.setItem("token", response.data.token);
      alert("Registro exitoso con Google. Bienvenido!");
      navigate("/");
    } catch (error) {
      console.error("Error al registrar con Google:", error);
      setErrors({ general: "No se pudo registrar con Google o el usuario ya existe." });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="https://res.cloudinary.com/dwvxmneib/image/upload/v1746160558/GallitoCorp_hechkx.jpg" alt="Logo" className="auth-logo" />
          <h2>Crear Cuenta</h2>
          <p>Regístrate en el sistema de gestión hotelera</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          {errors.general && <span className="error-message">{errors.general}</span>}
          <button type="submit" className="auth-button">Registrarse</button>
          <div className="divider"><span>o</span></div>
          <button type="button" className="google-button" onClick={handleGoogleRegister}>Continuar con Google</button>
          <div className="auth-footer"> ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link> </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
