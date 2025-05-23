import { useState, useEffect } from "react";
import "../styles/global.css";

const ReservationForm = ({ onClose }) => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    hotel: "",
    room: "",
    startDate: "",
    endDate: ""
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/hotels", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setHotels(data.hotels || data || []);
      } catch (error) {
        console.error("Error al cargar hoteles:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/rooms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRooms(data.rooms || data || []);
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data.users || data || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchHotels();
    fetchRooms();
    fetchUsers();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = async () => {
    const { user, hotel, room, startDate, endDate } = formData;
    if (!user || !hotel || !room || !startDate || !endDate) {
      alert("Por favor completa todos los campos.");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Las fechas no son válidas.");
      return;
    }
    if (start >= end) {
      alert("La fecha de salida debe ser posterior a la de llegada.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5500/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user,
          hotel,
          room,
          startDate,
          endDate,
          status: "PENDING"
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al crear reserva");
      alert("Reservación realizada exitosamente");
      if (onClose) onClose(); // Si se manda onClose, cierra el modal/popup
    } catch (error) {
      console.error("Error al reservar:", error);
      alert("Error al reservar. Revisa consola.");
    }
  };

  return (
    <div className="reservation-form">
      <h2>Reservar Hotel</h2>
      <div className="form-group">
        <label>Usuario (ID):</label>
        <select name="user" value={formData.user} onChange={handleInputChange}>
          <option value="">Seleccione un usuario</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.id}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Hotel (ID):</label>
        <select name="hotel" value={formData.hotel} onChange={handleInputChange}>
          <option value="">Seleccione un hotel</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>{h.id}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Estado:</label>
        <input type="text" value="PENDING" disabled />
      </div>
      <div className="form-group">
        <label>Fecha de llegada:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Fecha de salida:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Habitación (ID):</label>
        <select name="room" value={formData.room} onChange={handleInputChange}>
          <option value="">Seleccione una habitación</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.id}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button className="confirm-reservation-btn" onClick={handleReservationSubmit}>
          Confirmar Reservación
        </button>
        <button className="cancel-btn" onClick={() => onClose && onClose()}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ReservationForm;
