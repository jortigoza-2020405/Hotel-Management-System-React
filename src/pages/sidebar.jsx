"use client"

import { useNavigate } from "react-router-dom"
import "../styles/global.css"

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <aside className="sidebar d-flex flex-column justify-content-between">
      <div>
        <div className="sidebar-header p-3">
          <h2 className="text-white">Admin</h2>
        </div>
        <nav className="sidebar-nav px-3">
          <ul className="list-unstyled">
            <li className={`sidebar-item ${activeTab === "inicio" ? "active" : ""}`} onClick={() => setActiveTab("inicio")}>
              🏠 <span>Inicio</span>
            </li>
            <li className={`sidebar-item ${activeTab === "hotel" ? "active" : ""}`} onClick={() => setActiveTab("hotel")}>
              🏨 <span>Hotel</span>
            </li>
            <li className={`sidebar-item ${activeTab === "vista-hoteles" ? "active" : ""}`} onClick={() => setActiveTab("vista-hoteles")}>
              👁️ <span>Vista Hoteles</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-3">
        <div className="sidebar-item logout-item" onClick={handleLogout}>
          🔒 <span>Cerrar sesión</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
