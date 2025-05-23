import { useState, useEffect } from "react"
import "../styles/global.css"

const HotelView = () => {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    room: ""
  })

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/hotels")
        const data = await res.json()
        setHotels(data.hotels || data || [])
      } catch (error) {
        console.error("Error al cargar hoteles:", error)
      }
    }

    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/rooms")
        const data = await res.json()
        setRooms(data.rooms || data || [])
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
      }
    }

    fetchHotels()
    fetchRooms()
  }, [])

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel)
    setShowReservationForm(false)
  }

  const handleReserve = () => {
    setShowReservationForm(true)
  }

  const handleBackToList = () => {
    setSelectedHotel(null)
    setShowReservationForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReservationSubmit = async () => {
    if (!formData.room || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos.")
      return
    }

    try {
      const res = await fetch("http://localhost:5500/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room: formData.room,
          hotel: selectedHotel._id,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Error al crear reservación")

      alert("Reservación realizada exitosamente")
      setShowReservationForm(false)
    } catch (error) {
      console.error("Error al reservar:", error)
      alert("Error al reservar. Revisa consola.")
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>)
    }
    return stars
  }

  return (
    <div className="hotel-view-container">
      {!selectedHotel ? (
        <>
          <h2>Hoteles Disponibles</h2>
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bootstrap-card">
                <img src={hotel.images || "/placeholder.svg"} className="card-img-top" alt={hotel.name} />
                <div className="card-body">
                  <h5 className="card-title">{hotel.name}</h5>
                  <div className="card-location">{hotel.address}, {hotel.city}</div>
                  <div className="card-rating">
                    {renderStars(hotel.rating || 4.5)}
                    <span className="rating-value">{hotel.rating || 4.5}</span>
                  </div>
                  <p className="card-text">{hotel.description?.substring(0, 100)}...</p>
                  <button className="btn-view-details" onClick={() => handleViewDetails(hotel)}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="hotel-detail-view">
          <button className="back-button" onClick={handleBackToList}>&larr; Volver a la lista</button>

          {!showReservationForm ? (
            <div className="hotel-detail-content">
              <div className="hotel-detail-header">
                <h2>{selectedHotel.name}</h2>
                <div className="hotel-detail-location">{selectedHotel.address}, {selectedHotel.city}</div>
                <div className="hotel-detail-rating">
                  {renderStars(selectedHotel.rating || 4.5)}
                  <span className="rating-value">{selectedHotel.rating || 4.5}</span>
                </div>
              </div>
              <div className="hotel-detail-main">
                <div className="hotel-detail-image">
                  <img src={selectedHotel.images || "/placeholder.svg"} alt={selectedHotel.name} />
                </div>
                <div className="hotel-detail-info">
                  <div className="hotel-detail-description">
                    <h3>Descripción</h3>
                    <p>{selectedHotel.description}</p>
                  </div>
                  <div className="hotel-detail-amenities">
                    <h3>Amenidades</h3>
                    <ul>
                      {(selectedHotel.amenities || []).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                  <div className="hotel-detail-price-box">
                    <div className="price-box-header">
                      <div className="price-value">Precio estimado</div>
                      <div className="price-period">Verificado al reservar</div>
                    </div>
                    <button className="reserve-button" onClick={handleReserve}>Reservar Ahora</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="reservation-form">
              <h2>Reservar {selectedHotel.name}</h2>
              <div className="form-group">
                <label>Fecha de llegada:</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Fecha de salida:</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Habitación:</label>
                <select name="room" value={formData.room} onChange={handleInputChange}>
                  <option value="">Seleccione una habitación</option>
                  {rooms
                    .filter(r => r.hotel === selectedHotel._id)
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} - {r.roomType}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-actions">
                <button className="confirm-reservation-btn" onClick={handleReservationSubmit}>Confirmar Reservación</button>
                <button className="cancel-btn" onClick={() => setShowReservationForm(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HotelView
