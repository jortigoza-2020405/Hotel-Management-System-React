import { useState } from "react"; //jefe de verdad nos va a dejar? ya en el ultimo commit/bimestre?
import { Link, useNavigate } from "react-router-dom"; 
import "../../styles/auth.css"; 
import axios from "axios";
import { loginUser, loginWithGoogle } from "../../services/auth";
import { validateFields } from "../../hooks/useAuthForm";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await loginUser(email, password);
      const response = await axios.post("http://localhost:5500/api/auth/login", { email, password });

      const token = response.data.token;
      loginWithToken(token);

      const role = response.data.loggedUser.role;
      if (role === "adminPlataforma") navigate("/admin");
      else if (role === "adminHotel") navigate("/hotel-admin");
      else navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors({ general: "Credenciales inválidas o usuario no registrado." });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      const response = await axios.post("http://localhost:5500/api/auth/login", {
        email: user.email,
        password: user.uid,
      });

      const token = response.data.token;
      loginWithToken(token);

      const role = response.data.loggedUser.role;
      if (role === "adminPlataforma") navigate("/admin");
      else if (role === "adminHotel") navigate("/hotel-admin");
      else navigate("/");
    } catch (error) {
      console.error("Error con Google Login:", error);
      setErrors({ general: "No se encontró cuenta. Regístrate primero." });
    }
  };

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
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
  );
};

export default Login;
