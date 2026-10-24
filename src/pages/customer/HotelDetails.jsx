import { useMemo, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  BedDouble,
  CalendarDays,
  Wifi,
  Car,
  Coffee,
  Mountain,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useHotels } from "../../data/hotelStore";
import {
  useBookings,
  remainingRooms,
  nightsBetween,
} from "../../data/bookingStore";
import { formatPKR } from "../../data/hotels";

import "../../styles/room-details.css";

const localToday = () => {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Breakfast: Coffee,
  "Mountain View": Mountain,
};

export default function HotelDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const hotels = useHotels();
  useBookings();

  const hotel = hotels.find((item) => String(item.id) === String(id));

  const requestedRoomId = params.get("roomId");

  const initialRoom = hotel?.rooms?.find(
    (room) => String(room.id) === String(requestedRoomId),
  );

  const [selectedRoomId, setSelectedRoomId] = useState(
    initialRoom?.id ?? hotel?.rooms?.[0]?.id ?? "",
  );

  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [roomCount, setRoomCount] = useState(Number(params.get("rooms") || 1));
  const [guests, setGuests] = useState(Number(params.get("guests") || 2));
  const [error, setError] = useState("");

  const selectedRoom = hotel?.rooms?.find(
    (room) => String(room.id) === String(selectedRoomId),
  );

  const nights = nightsBetween(checkIn, checkOut);

  const datesValid =
    Boolean(checkIn && checkOut) && checkIn >= localToday() && nights > 0;

  const available = useMemo(() => {
    if (!hotel || !selectedRoom || !datesValid) return 0;

    return remainingRooms(hotel.id, selectedRoom.id, checkIn, checkOut);
  }, [hotel, selectedRoom, checkIn, checkOut, datesValid]);

  const total = selectedRoom
    ? Number(selectedRoom.price) * roomCount * nights
    : 0;

  const gallery = [
    selectedRoom?.image,
    ...(selectedRoom?.gallery || []),
    hotel?.image,
    ...(hotel?.gallery || []),
  ].filter(Boolean);

  const uniqueGallery = [...new Set(gallery)];

  const handleBooking = () => {
    setError("");

    if (!selectedRoom) {
      setError("Please select a room.");
      return;
    }

    if (!datesValid) {
      setError("Please select valid booking dates.");
      return;
    }

    if (
      !Number.isInteger(roomCount) ||
      roomCount < 1 ||
      roomCount > available
    ) {
      setError(`Only ${available} rooms are available for these dates.`);
      return;
    }

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > Number(selectedRoom.capacity) * roomCount
    ) {
      setError("Guest count exceeds the selected rooms' capacity.");
      return;
    }

    const query = new URLSearchParams({
      hotelId: String(hotel.id),
      roomId: String(selectedRoom.id),
      checkIn,
      checkOut,
      rooms: String(roomCount),
      guests: String(guests),
    });

    navigate(`/checkout?${query.toString()}`);
  };

  if (!hotel) {
    return (
      <main className="container room-not-found">
        <h2>Hotel not found</h2>
        <Link to="/hotels">Back to Available Rooms</Link>
      </main>
    );
  }

  return (
    <main className="room-details-page">
      <div className="container">
        <Link to="/hotels" className="room-back-link">
          <ArrowLeft size={17} />
          Back to Rooms
        </Link>

        <div className="room-heading">
          <div>
            <span className="room-eyebrow">
              {hotel.destination} · {hotel.type}
            </span>

            <h1>{selectedRoom?.name || hotel.name}</h1>

            <p>
              <MapPin size={16} />
              {hotel.name} · {hotel.location}
            </p>
          </div>

          <div className="room-rating">
            <Star size={17} fill="currentColor" />
            <strong>{hotel.rating || "New"}</strong>
            <span>({hotel.reviews || 0} reviews)</span>
          </div>
        </div>

        <div className="room-gallery">
          <div className="room-gallery-main">
            <img
              src={uniqueGallery[0] || ""}
              alt={selectedRoom?.name || hotel.name}
            />
          </div>

          <div className="room-gallery-side">
            {uniqueGallery.slice(1, 3).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Room view ${index + 2}`}
              />
            ))}
          </div>
        </div>

        <div className="room-details-layout">
          <section className="room-main-content">
            <div className="room-info-card">
              <h2>About This Stay</h2>
              <p>
                {hotel.description ||
                  "Enjoy a comfortable stay surrounded by the beauty of Northern Pakistan."}
              </p>

              <div className="room-info-highlights">
                <span>
                  <Users size={19} />
                  Up to {selectedRoom?.capacity || 0} guests per room
                </span>
                <span>
                  <BedDouble size={19} />
                  {datesValid
                    ? `${available} available for selected dates`
                    : "Select dates to check availability"}
                </span>
              </div>
            </div>

            <div className="room-info-card">
              <h2>Choose Room Type</h2>

              <div className="room-type-list">
                {(hotel.rooms || []).map((room) => {
                  const roomAvailable = datesValid
                    ? remainingRooms(hotel.id, room.id, checkIn, checkOut)
                    : Number(room.available || 0);

                  const active = String(selectedRoomId) === String(room.id);

                  return (
                    <button
                      type="button"
                      key={room.id}
                      className={`room-type-option ${active ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setError("");
                      }}
                    >
                      <div>
                        <strong>{room.name}</strong>
                        <span>{room.capacity} guests per room</span>
                        <small>{roomAvailable} rooms available</small>
                      </div>

                      <div className="room-type-price">
                        <strong>{formatPKR(Number(room.price))}</strong>
                        <small>per night</small>
                        {active && <CheckCircle2 size={20} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="room-info-card">
              <h2>Facilities & Amenities</h2>

              <div className="room-amenities-grid">
                {(hotel.amenities || []).map((amenity) => {
                  const Icon = amenityIcons[amenity] || CheckCircle2;

                  return (
                    <div className="room-amenity" key={amenity}>
                      <Icon size={19} />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="room-booking-card">
            <div className="room-booking-price">
              <strong>{formatPKR(Number(selectedRoom?.price || 0))}</strong>
              <span>/ room / night</span>
            </div>

            <label>
              <CalendarDays size={16} />
              Check-in
            </label>
            <input
              type="date"
              min={localToday()}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut <= e.target.value) {
                  setCheckOut("");
                }
              }}
            />

            <label>
              <CalendarDays size={16} />
              Check-out
            </label>
            <input
              type="date"
              min={checkIn || localToday()}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <label>
              <BedDouble size={16} />
              Number of Rooms
            </label>
            <select
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "Room" : "Rooms"}
                  </option>
                ),
              )}
            </select>

            <label>
              <Users size={16} />
              Total Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {Array.from({ length: 30 }, (_, index) => index + 1).map(
                (count) => (
                  <option key={count} value={count}>
                    {count} Guests
                  </option>
                ),
              )}
            </select>

            <div className="room-booking-summary">
              <div>
                <span>Room price</span>
                <strong>{formatPKR(Number(selectedRoom?.price || 0))}</strong>
              </div>

              <div>
                <span>Rooms</span>
                <strong>{roomCount}</strong>
              </div>

              <div>
                <span>Nights</span>
                <strong>{nights > 0 ? nights : 0}</strong>
              </div>

              <div className="room-total">
                <span>Estimated Total</span>
                <strong>{formatPKR(nights > 0 ? total : 0)}</strong>
              </div>
            </div>

            {error && (
              <p className="room-booking-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className="room-book-now"
              onClick={handleBooking}
            >
              Continue to Booking
              <ArrowRight size={18} />
            </button>

            <p className="room-booking-note">
              Availability and final price will be rechecked during checkout.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
