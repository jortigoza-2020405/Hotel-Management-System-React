import { useState, useEffect } from "react"
import "../styles/global.css"

const HotelView = () => {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)

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
    fetchHotels()
  }, [])

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel)
  }

  const handleBackToList = () => {
    setSelectedHotel(null)
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelView
