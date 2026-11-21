import { API_BASE } from "../../api/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, Users, ArrowLeft, ShieldCheck } from "lucide-react";
import { useActiveHotels } from "../../data/hotelStore";
import "../../styles/hotels.css";
import "../../styles/booking.css";

const PUBLIC_BOOKING_API = `${API_BASE}/createBooking.php`; // Guests do not use admin bookings.php
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900";

function formatPKR(value) {
  return `PKR ${Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.max(0, Math.round((b - a) / 86400000)) : 0;
}

function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function readJson(response) {
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server returned an invalid response (HTTP ${response.status}).`);
  }
  if (!response.ok || json.success === false) {
    throw new Error(json.message || `Request failed (HTTP ${response.status}).`);
  }
  return json;
}

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hotels = useActiveHotels();

  const hotelId = params.get("hotelId") || "";
  const roomId = params.get("roomId") || "";
  const city = params.get("city") || params.get("destination") || "";
  const area = params.get("area") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = Number(params.get("guests") || 2);
  const roomCount = Number(params.get("roomCount") || params.get("rooms") || 1);
  const nights = nightsBetween(checkIn, checkOut);

  const [remoteRoom, setRemoteRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(Boolean(city && area));
  const [roomError, setRoomError] = useState("");
  const [guest, setGuest] = useState({ guestName: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // New public room flow: fetch the real room from MySQL using its city and area.
  useEffect(() => {
    if (!city || !area) {
      setLoadingRoom(false);
      return;
    }
    const controller = new AbortController();
    setLoadingRoom(true);
    setRoomError("");
    setRemoteRoom(null);
    const formData = new FormData();

    formData.append("city", city);
    formData.append("area", area);
    formData.append("rooms", String(roomCount));
    formData.append("guests", String(guests));

    fetch(`${API_BASE}/getRoomsByArea.php`, {
      method: "POST",
      body: formData,
      cache: "no-store",
      signal: controller.signal,
      credentials: "omit",
    })
      .then(readJson)
      .then((data) => {
        if (!Array.isArray(data.rooms)) throw new Error("Room list is missing from the API response.");
        const found = data.rooms.find(
          (r) => String(r.id) === String(roomId) && String(r.hotel_id) === String(hotelId)
        );
        if (!found) throw new Error("The selected room is no longer available in this area.");
        if (!controller.signal.aborted) setRemoteRoom(found);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setRoomError(err.message || "Unable to load room.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingRoom(false);
      });
    return () => controller.abort();
  }, [city, area, hotelId, roomId]);

  // Legacy hotel pages can still show their existing room data.
  const legacyHotel = useMemo(
    () => hotels.find((h) => String(h.id) === String(hotelId)),
    [hotels, hotelId]
  );
  const legacyRoom = legacyHotel?.rooms?.find((r) => String(r.id) === String(roomId));
  const usingRemote = Boolean(city && area);
  const hotelName = usingRemote ? remoteRoom?.hotel_name : legacyHotel?.name;
  const hotelLocation = usingRemote ? `${area}, ${city}` : legacyHotel?.location;
  const roomName = usingRemote ? remoteRoom?.room_name : legacyRoom?.name;
  const imageUrl = usingRemote
    ? remoteRoom?.image_url || FALLBACK_IMAGE
    : legacyRoom?.image_url || legacyHotel?.image || FALLBACK_IMAGE;
  const regularPrice = Number(
    usingRemote ? remoteRoom?.price_per_night : legacyRoom?.price
  );

  const discountedPrice = usingRemote
    ? remoteRoom?.discounted_price_per_night
    : null;

  const price =
    discountedPrice != null &&
      discountedPrice !== "" &&
      Number(discountedPrice) >= 0 &&
      Number(discountedPrice) < regularPrice
      ? Number(discountedPrice)
      : regularPrice;
  const capacity = Number(usingRemote ? remoteRoom?.capacity : legacyRoom?.capacity);
  const inventory = Number(
    usingRemote
      ? remoteRoom?.online_rooms ?? 0
      : legacyRoom?.available ?? 0
  );
  const roomFound = usingRemote ? Boolean(remoteRoom) : Boolean(legacyHotel && legacyRoom);

  const valid =
    roomFound &&
    nights > 0 &&
    checkIn >= todayISO() &&
    Number.isInteger(guests) && guests >= 1 &&
    Number.isInteger(roomCount) && roomCount >= 1 &&
    Number.isFinite(price) && price >= 0 &&
    Number.isFinite(capacity) && capacity >= 1 &&
    Number.isFinite(inventory) && inventory >= 1 &&
    guests <= capacity * roomCount &&
    roomCount <= inventory;

  const subtotal = valid ? price * nights * roomCount : 0;

  async function submit(event) {
    event.preventDefault();
    if (saving || !valid) return;
    setError("");
    setSaving(true);
    try {
      const payload = {
        hotel_id: Number(hotelId),
        room_id: Number(roomId),
        guest_name: guest.guestName.trim(),
        guest_email: guest.email.trim(),
        guest_phone: guest.phone.trim(),
        check_in: checkIn,
        check_out: checkOut,
        guests,
        room_count: roomCount,
      };
      if (!payload.guest_name || !payload.guest_email || !payload.guest_phone) {
        throw new Error("Please complete all guest details.");
      }
      const response = await fetch(PUBLIC_BOOKING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJson(response);
      const result = data.booking && typeof data.booking === "object" ? data.booking : data;
      const bookingId = result.id ?? result.booking_id ?? data.id ?? data.booking_id;
      const reference = result.booking_reference ?? data.booking_reference ?? result.reference ?? data.reference;
      if (!bookingId && !reference) {
        throw new Error("Booking was submitted, but the server did not return a booking ID or reference. Please check with support before trying again.");
      }
      const booking = {
        ...result,
        id: bookingId || reference,
        booking_reference: reference || String(bookingId),
        hotel_id: Number(hotelId),
        room_id: Number(roomId),
        hotelName,
        roomName,
        city,
        area,
        checkIn,
        checkOut,
        guests,
        roomCount,
        guestName: payload.guest_name,
        email: payload.guest_email,
        phone: payload.guest_phone,
        total: result.total_amount ?? data.total_amount ?? subtotal,
        status: result.status || data.status || "Pending",
      };
      navigate(`/booking-success/${encodeURIComponent(String(booking.id))}`, {
        replace: true,
        state: { booking },
      });
    } catch (err) {
      setError(err.message || "Unable to complete your reservation. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingRoom) {
    return <main className="container empty-results" role="status"><h2>Loading your room...</h2><p>Checking the latest room details.</p></main>;
  }

  if (!valid) {
    return (
      <main className="container empty-results">
        <h2>Invalid Booking Details</h2>
        <p>{roomError || "Please choose an active hotel, valid dates, and a suitable room."}</p>
        <Link to="/hotels" className="details-button">Browse Hotels</Link>
      </main>
    );
  }

  const backQuery = new URLSearchParams({
    checkIn, checkOut, guests: String(guests),
    rooms: String(roomCount), roomCount: String(roomCount),
    roomId: String(roomId),
  });
  if (city) backQuery.set("city", city);
  if (area) backQuery.set("area", area);
  const backLink = usingRemote
    ? `/rooms/${encodeURIComponent(hotelId)}/${encodeURIComponent(roomId)}?${backQuery.toString()}`
    : `/hotels/${encodeURIComponent(hotelId)}?${backQuery.toString()}`;

  return (
    <main className="checkout-page container">
      <Link className="back-link" to={backLink}><ArrowLeft size={17} /> Back to Rooms</Link>
      <span className="section-label">GUEST RESERVATION</span>
      <h1>Complete Your Stay</h1>
      <p className="checkout-subtitle">No account required. Complete your reservation by entering your guest details below.</p>

      <form className="checkout-layout" onSubmit={submit}>
        <section className="checkout-main">
          <div className="checkout-panel">
            <h2>Your Reservation</h2>
            <div className="checkout-hotel">
              <img src={imageUrl} alt={hotelName || roomName} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }} />
              <div>
                <h3>{hotelName}</h3>
                <p>{hotelLocation}</p>
                <strong>{roomName}</strong>
              </div>
            </div>
            <p><strong>{roomCount} {roomCount === 1 ? "room" : "rooms"} selected</strong></p>
            <div className="booking-facts">
              <div><CalendarDays size={19} /><span>Check-in</span><strong>{checkIn}</strong></div>
              <div><CalendarDays size={19} /><span>Check-out</span><strong>{checkOut}</strong></div>
              <div><Users size={19} /><span>Guests</span><strong>{guests}</strong></div>
            </div>
          </div>

          <div className="checkout-panel">
            <h2>Guest Information</h2>
            <p>Enter your details to submit your reservation.</p>
            <div className="checkout-form">
              <label>Full Name
                <input required maxLength={100} autoComplete="name" value={guest.guestName}
                  onChange={(e) => setGuest((prev) => ({ ...prev, guestName: e.target.value }))}
                  placeholder="Full name" />
              </label>
              <label>Email Address
                <input required type="email" maxLength={150} autoComplete="email" value={guest.email}
                  onChange={(e) => setGuest((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com" />
              </label>
              <label>Phone Number
                <input required type="tel" maxLength={30} autoComplete="tel" value={guest.phone}
                  onChange={(e) => setGuest((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+92 3XX XXXXXXX" />
              </label>
            </div>
          </div>
        </section>

        <aside className="checkout-panel checkout-price">
          <h2>Price Summary</h2>
          <div className="price-line">
            <span>{formatPKR(price)} × {roomCount} {roomCount === 1 ? "room" : "rooms"} × {nights} {nights === 1 ? "night" : "nights"}</span>
            <strong>{formatPKR(subtotal)}</strong>
          </div>
          <div className="price-line"><span>Taxes / extra charges</span><span>Not included</span></div>
          <div className="price-line total-line"><span>Estimated Total</span><strong>{formatPKR(subtotal)}</strong></div>
          <p className="demo-notice">Room availability and final total will be verified by the server when you submit your reservation. No online payment will be taken.</p>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <button type="submit" className="confirm-button" disabled={saving}>
            {saving ? "Submitting Reservation..." : "Confirm Reservation"}
          </button>
          <p className="secure-note"><ShieldCheck size={17} /> Your reservation will be submitted to NorthernStays. Confirmation is subject to room availability.</p>
        </aside>
      </form>
    </main>
  );
}
