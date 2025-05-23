import { useState, useEffect } from "react"
import "../styles/global.css"

const RoomTable = () => {
  const [rooms, setRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [editingRoom, setEditingRoom] = useState(null)
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    roomType: "",
    capacity: 1,
    pricePerNight: 0,
    status: "AVAILABLE",
    description: "",
    services: "",
    images: "",
    hotel: ""
  })
  const [isAdding, setIsAdding] = useState(false)

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchRooms()
    fetchHotels()
  }, [])

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/rooms")
      const data = await res.json()
      setRooms(data.rooms || [])
    } catch (err) {
      console.error("Error al obtener habitaciones:", err)
    }
  }

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/hotels", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setHotels(data.hotels || [])
    } catch (err) {
      console.error("Error al obtener hoteles:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5500/api/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchRooms()
    } catch (err) {
      console.error("Error al eliminar habitación:", err)
    }
  }

  const handleSaveEdit = async () => {
    if (editingRoom) {
      try {
        const formattedRoom = {
          ...editingRoom,
          capacity: Number(editingRoom.capacity),
          pricePerNight: Number(editingRoom.pricePerNight)
        }
        await fetch(`http://localhost:5500/api/rooms/${editingRoom.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedRoom),
        })
        setEditingRoom(null)
        fetchRooms()
      } catch (err) {
        console.error("Error al editar habitación:", err)
      }
    }
  }

  const handleAddNew = async () => {
    try {
      const formattedRoom = {
        ...newRoom,
        capacity: Number(newRoom.capacity),
        pricePerNight: Number(newRoom.pricePerNight)
      }
      await fetch("http://localhost:5500/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedRoom),
      })
      setNewRoom({
        roomNumber: "",
        roomType: "",
        capacity: 1,
        pricePerNight: 0,
        status: "AVAILABLE",
        description: "",
        services: "",
        images: "",
        hotel: ""
      })
      setIsAdding(false)
      fetchRooms()
    } catch (err) {
      console.error("Error al crear habitación:", err)
    }
  }

  return (
    <div className="hotel-table-container">
      <div className="table-header">
        <h2>Administración de Habitaciones</h2>
        <button className="add-hotel-btn" onClick={() => setIsAdding(true)}>
          Agregar Habitación
        </button>
      </div>

      {isAdding && (
        <div className="add-hotel-form">
          <h3>Nueva Habitación</h3>
          {Object.keys(newRoom).map((key) => (
            <div className="form-group" key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              {key === "hotel" ? (
                <select
                  value={newRoom.hotel}
                  onChange={(e) => setNewRoom({ ...newRoom, hotel: e.target.value })}
                >
                  <option value="">Seleccione un hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={newRoom[key]}
                  onChange={(e) => setNewRoom({ ...newRoom, [key]: e.target.value })}
                />
              )}
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
          <div className="table-cell">Número</div>
          <div className="table-cell">Tipo</div>
          <div className="table-cell">Capacidad</div>
          <div className="table-cell">Precio/noche</div>
          <div className="table-cell">Estado</div>
          <div className="table-cell">Acciones</div>
        </div>

        {rooms.map((room) => (
          <div key={room.id} className="table-row">
            {editingRoom && editingRoom.id === room.id ? (
              <>
                {Object.keys(newRoom).map((field) => (
                  <div className="table-cell" key={field}>
                    <input
                      type="text"
                      value={editingRoom[field] || ""}
                      onChange={(e) => setEditingRoom({ ...editingRoom, [field]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="table-cell actions">
                  <button className="save-btn" onClick={handleSaveEdit}>Guardar</button>
                  <button className="cancel-btn" onClick={() => setEditingRoom(null)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="table-cell">{room.roomNumber}</div>
                <div className="table-cell">{room.roomType}</div>
                <div className="table-cell">{room.capacity}</div>
                <div className="table-cell">Q{room.pricePerNight}</div>
                <div className="table-cell">{room.status}</div>
                <div className="table-cell actions">
                  <button className="edit-btn" onClick={() => setEditingRoom(room)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(room.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomTable
