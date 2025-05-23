import { useState, useEffect } from "react"
import "../styles/global.css"

const HotelTable = () => {
  const [hotels, setHotels] = useState([])
  const [editingHotel, setEditingHotel] = useState(null)
  const [newHotel, setNewHotel] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    description: "",
    phone: "",
    email: "",
    amenities: "",
    images: ""
  })
  const [isAdding, setIsAdding] = useState(false)

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/hotels", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setHotels(data.hotels || [])
    } catch (err) {
      console.error("Error al obtener hoteles:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5500/api/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchHotels()
    } catch (err) {
      console.error("Error al eliminar hotel:", err)
    }
  }

  const handleSaveEdit = async () => {
    if (editingHotel) {
      try {
        await fetch(`http://localhost:5500/api/hotels/${editingHotel.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editingHotel,
            amenities: editingHotel.amenities.split(",").map(a => a.trim())
          }),
        })
        setEditingHotel(null)
        fetchHotels()
      } catch (err) {
        console.error("Error al editar hotel:", err)
      }
    }
  }

  const handleAddNew = async () => {
    try {
      await fetch("http://localhost:5500/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newHotel,
          amenities: newHotel.amenities.split(",").map(a => a.trim())
        }),
      })
      setNewHotel({
        name: "",
        address: "",
        city: "",
        country: "",
        description: "",
        phone: "",
        email: "",
        amenities: "",
        images: ""
      })
      setIsAdding(false)
      fetchHotels()
    } catch (err) {
      console.error("Error al crear hotel:", err)
    }
  }

  return (
    <div className="hotel-table-container">
      <div className="table-header">
        <h2>Administración de Hoteles</h2>
        <button className="add-hotel-btn" onClick={() => setIsAdding(true)}>
          Agregar Hotel
        </button>
      </div>

      {isAdding && (
        <div className="add-hotel-form">
          <h3>Nuevo Hotel</h3>
          {Object.keys(newHotel).map((key) => (
            <div className="form-group" key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                type="text"
                value={newHotel[key]}
                onChange={(e) => setNewHotel({ ...newHotel, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="form-actions">
            <button className="save-btn" onClick={handleAddNew}>Guardar</button>
            <button className="cancel-btn" onClick={() => setIsAdding(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="custom-table">
        <div className="table-row header">
          <div className="table-cell">ID</div>
          <div className="table-cell">Nombre</div>
          <div className="table-cell">Ubicación</div>
          <div className="table-cell">Habitaciones</div>
          <div className="table-cell">Amenidades</div>
          <div className="table-cell">Acciones</div>
        </div>

        {hotels.map((hotel) => (
          <div key={hotel.id} className="table-row">
            {editingHotel && editingHotel.id === hotel.id ? (
              <>
                {Object.keys(newHotel).map((field) => (
                  <div className="table-cell" key={field}>
                    <input
                      type="text"
                      value={editingHotel[field] || ""}
                      onChange={(e) => setEditingHotel({ ...editingHotel, [field]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="table-cell actions">
                  <button className="save-btn" onClick={handleSaveEdit}>Guardar</button>
                  <button className="cancel-btn" onClick={() => setEditingHotel(null)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="table-cell">{hotel.id}</div>
                <div className="table-cell">{hotel.name}</div>
                <div className="table-cell">{hotel.address}</div>
                <div className="table-cell">{hotel.rooms || "-"}</div>
                <div className="table-cell">{(hotel.amenities || []).join(", ")}</div>
                <div className="table-cell actions">
                  <button className="edit-btn" onClick={() => setEditingHotel({ ...hotel, amenities: (hotel.amenities || []).join(", ") })}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(hotel.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotelTable
