import { useEffect, useState } from "react"
import "../styles/global.css"

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0)
  const [hotelCount, setHotelCount] = useState(0)
  const [reservationCount, setReservationCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const [usersRes, hotelsRes, reservationsRes] = await Promise.all([
          fetch("http://localhost:5500/api/users", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5500/api/hotels"),
          fetch("http://localhost:5500/api/reservations", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const usersData = await usersRes.json()
        const hotelsData = await hotelsRes.json()
        const reservationsData = await reservationsRes.json()

        setUserCount(Array.isArray(usersData.users) ? usersData.users.length : 0)
        setHotelCount(Array.isArray(hotelsData.hotels) ? hotelsData.hotels.length : 0)
        setReservationCount(Array.isArray(reservationsData.reservations) ? reservationsData.reservations.length : 0)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h2>Bienvenido a Gestión Admin</h2>
        <p>Administra tus hoteles y reservaciones desde este panel</p>
      </div>

      <div className="stats-container">
        <div className="custom-card">
          <div className="card-header">
            <h3>Usuarios Registrados</h3>
          </div>
          <div className="card-body">
            <div className="stat-value">{userCount}</div>
            <div className="stat-description">
              <span className="stat-increase">+0%</span> crecimiento simulado
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">Ver Detalles</button>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-header">
            <h3>Hoteles Registrados</h3>
          </div>
          <div className="card-body">
            <div className="stat-value">{hotelCount}</div>
            <div className="stat-description">
              <span className="stat-increase">+0%</span> crecimiento simulado
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">Ver Detalles</button>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-header">
            <h3>Reservaciones</h3>
          </div>
          <div className="card-body">
            <div className="stat-value">{reservationCount}</div>
            <div className="stat-description">
              <span className="stat-increase">+0%</span> crecimiento simulado
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">Ver Detalles</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
