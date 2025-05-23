import { useState } from "react"
import "../styles/global.css"
import Sidebar from "./sidebar.jsx"
import Dashboard from "./Dashboard.jsx"
import HotelTable from "./hotel-table.jsx"
import HotelView from "./hotel-view.jsx"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("inicio")

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <header className="header">
          <h1>Gestión Admin</h1>
          <div className="search-container">
            <input type="text" placeholder="Buscar..." className="search-input" />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
          <div className="user-profile">
            <span>Admin</span>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="content-container">
          {activeTab === "inicio" && <Dashboard />}
          {activeTab === "hotel" && <HotelTable />}
          {activeTab === "vista-hoteles" && <HotelView />}
        </div>
      </main>
    </div>
  )
}
