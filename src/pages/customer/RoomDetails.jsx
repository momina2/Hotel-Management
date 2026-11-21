import { API_BASE } from "../../api/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BedDouble, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, Info, MapPin, ShieldCheck, Users, CheckCircle2, ExternalLink, X } from "lucide-react";
import "./RoomDetails.css";

const BASE = `${API_BASE}/`;
const API = `${BASE}getRoomsByArea.php`;
const ADDONS_API = `${BASE}getRoomAddons.php`;
const AVAILABILITY_API = `${BASE}checkRoomAvailability.php`;
const BOOKING_API = `${BASE}createBooking.php`;
const FALLBACK = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200";

function localDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000;
  return Number.isFinite(days) ? Math.max(0, days) : 0;
}
const money = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;

export default function RoomDetails() {
  const { hotelId, roomId } = useParams();
  const [params] = useSearchParams();
  const city = params.get("city") || "";
  const area = params.get("area") || "";
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || localDate(1));
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || localDate(2));
  const roomCount = 1;
  const [guests, setGuests] = useState(Math.max(1, Number(params.get("guests")) || 2));
  const [showBooking, setShowBooking] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [addons, setAddons] = useState([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);
  const [addonsLoading, setAddonsLoading] = useState(true);
  const [addonsError, setAddonsError] = useState("");
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const availabilityRequest = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setRoom(null);
    if (!city || !area) {
      setError("Room location is missing. Please open the room from an area page.");
      setLoading(false);
      return () => controller.abort();
    }
    const body = new FormData();
    body.append("city", city); body.append("area", area);
    body.append("rooms", String(roomCount)); body.append("guests", "1");
    fetch(API, { method: "POST", body, signal: controller.signal, cache: "no-store", credentials: "omit" })
      .then(async response => {
        const json = await response.json();
        if (!response.ok || !json.success || !Array.isArray(json.rooms)) throw new Error(json.message || "Could not load room details.");
        return json.rooms;
      })
      .then(rooms => {
        if (controller.signal.aborted) return;
        const match = rooms.find(r => String(r.id) === String(roomId) && String(r.hotel_id) === String(hotelId));
        if (!match) throw new Error("This room is not currently available in the selected area.");
        setRoom(match);
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || "Could not load room details."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [city, area, hotelId, roomId]);

  useEffect(() => {
    const controller = new AbortController();
    setAddons([]); setSelectedAddonIds([]); setAddonsLoading(true); setAddonsError("");
    fetch(ADDONS_API, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: Number(roomId) }), signal: controller.signal, cache: "no-store"
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.addons)) throw new Error(data.message || "Unable to load optional add-ons.");
        return data.addons;
      })
      .then(items => { if (!controller.signal.aborted) setAddons(items); })
      .catch(err => { if (!controller.signal.aborted) setAddonsError(err.message || "Unable to load add-ons."); })
      .finally(() => { if (!controller.signal.aborted) setAddonsLoading(false); });
    return () => controller.abort();
  }, [roomId]);

  const includedAmenities = useMemo(() => {
    const items = Array.isArray(room?.amenities) ? room.amenities : [];
    return items.filter(amenity => {
      const name = String(amenity?.name || "").trim().toLowerCase();
      const value = String(amenity?.value || "").trim().toLowerCase();
      if (/mattress|extra bed|additional bed/i.test(name)) return false;
      if (/^(rs\.?|pkr)\s*[\d,]+/i.test(value) || /\b(rs\.?|pkr)\s*[\d,]+/i.test(value)) return false;
      return !addons.some(addon => String(addon.addon_name || "").trim().toLowerCase() === name);
    });
  }, [room, addons]);
  const toggleAddon = id => setSelectedAddonIds(previous => previous.includes(id) ? previous.filter(v => v !== id) : [...previous, id]);
  const chargeLabel = type => ({ per_night: "Per night", per_guest_per_night: "Per guest / night", per_stay: "One-time" }[type] || "One-time");
  const photos = useMemo(() => {
    if (!room) return [FALLBACK];
    const urls = [room.image_url, ...(Array.isArray(room.gallery) ? room.gallery : [])]
      .filter(v => typeof v === "string" && /^https?:\/\//i.test(v));
    return [...new Set(urls.length ? urls : [FALLBACK])];
  }, [room]);
  const nights = nightsBetween(checkIn, checkOut);
  const capacity = Number(room?.capacity || 2);
  const inventory = Number(room?.online_rooms ?? room?.total_rooms ?? 0);
  const valid = !!room && checkIn >= localDate() && nights > 0 && nights <= 365 &&
    Number.isInteger(roomCount) && roomCount > 0 && roomCount <= inventory &&
    Number.isInteger(guests) && guests > 0 && guests <= capacity * roomCount;

  // Check availability as soon as the dates or guest count change, never on Book Now.
  // Ignore stale responses and block booking until the current selection is confirmed.
  const selectionKey = `${hotelId}|${roomId}|${checkIn}|${checkOut}|${roomCount}|${guests}`;
  useEffect(() => {
    const requestId = ++availabilityRequest.current;
    const controller = new AbortController();
    setAvailability(null); setAvailabilityError(""); setAvailabilityLoading(false);
    if (!valid) return () => controller.abort();
    setAvailabilityLoading(true);
    const body = new FormData();
    body.append("hotel_id", String(room.hotel_id));
    body.append("room_id", String(room.id));
    body.append("room_count", String(roomCount));
    body.append("guests", String(guests));
    body.append("check_in", checkIn);
    body.append("check_out", checkOut);
    fetch(AVAILABILITY_API, { method: "POST", body, signal: controller.signal, cache: "no-store", credentials: "omit" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !data.success || typeof data.available !== "boolean") {
          throw new Error(data.message || "Unable to check room availability.");
        }
        return data;
      })
      .then(data => { if (!controller.signal.aborted && availabilityRequest.current === requestId) setAvailability({ ...data, selectionKey }); })
      .catch(err => {
        if (!controller.signal.aborted && availabilityRequest.current === requestId) setAvailabilityError(err.message || "Availability check failed.");
      })
      .finally(() => {
        if (!controller.signal.aborted && availabilityRequest.current === requestId) setAvailabilityLoading(false);
      });
    return () => controller.abort();
  }, [room, checkIn, checkOut, guests, valid, selectionKey]);

  const confirmedAvailable = valid && availability?.selectionKey === selectionKey && availability.available === true;
  const selectedAddons = addons.filter(addon => selectedAddonIds.includes(Number(addon.id)));
  const addonCharge = addon => {
    const price = Number(addon.price) || 0;
    if (addon.charge_type === "per_guest_per_night") return price * nights * guests;
    if (addon.charge_type === "per_night") return price * nights * roomCount;
    return price;
  };
  const originalNightlyPrice = Number(room?.price_per_night || 0);
  const discountNightlyPrice = room?.discounted_price_per_night == null ? null : Number(room.discounted_price_per_night);
  const hasDiscount = discountNightlyPrice !== null && discountNightlyPrice >= 0 && discountNightlyPrice < originalNightlyPrice;
  const effectiveNightlyPrice = hasDiscount ? discountNightlyPrice : originalNightlyPrice;
  const roomSubtotal = nights * roomCount * effectiveNightlyPrice;
  const discountSavings = nights * roomCount * (originalNightlyPrice - effectiveNightlyPrice);
  const addonsSubtotal = selectedAddons.reduce((sum, addon) => sum + addonCharge(addon), 0);
  const bookingTotal = roomSubtotal + addonsSubtotal;
  const back = city && area ? `/destinations/${encodeURIComponent(city)}/areas/${encodeURIComponent(area)}` : "/hotels";

  function book() {
    if (!confirmedAvailable || availabilityLoading || addonsLoading || addonsError) return;
    setBookingError(""); setShowBooking(true);
  }
  async function submitBooking(event) {
    event.preventDefault();
    if (!confirmedAvailable || bookingLoading || addonsLoading || addonsError) return;
    setBookingLoading(true); setBookingError("");
    try {
      // Keep JSON here: existing createBooking.php accepts JSON, even when form-data is enabled.
      const response = await fetch(BOOKING_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: Number(room.hotel_id), room_id: Number(room.id),
          check_in: checkIn, check_out: checkOut, room_count: roomCount, guests,
          guest_name: guestName.trim(), guest_email: guestEmail.trim(), guest_phone: guestPhone.trim(),
          addon_ids: selectedAddonIds
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Booking could not be submitted.");
      setBookingResult(result); setShowBooking(false);
    } catch (err) {
      setBookingError(err.message || "Network error. Please try again.");
    } finally { setBookingLoading(false); }
  }

  if (loading) {
    return (
      <main className="nsrd-page" role="status" aria-label="Loading room details">
        <div className="nsrd-container">
          <div className="nsrd-skel nsrd-skel-crumb" />
          <div className="nsrd-skel nsrd-skel-title" />
          <div className="nsrd-layout">
            <div className="nsrd-skel nsrd-skel-gallery" />
            <div className="nsrd-skel nsrd-skel-card" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="nsrd-page">
        <div className="nsrd-container">
          <div className="nsrd-state">
            <BedDouble size={30} />
            <h1>Room details unavailable</h1>
            <p>{error || "Room not found."}</p>
            <Link to={back} className="nsrd-btn-outline"><ArrowLeft size={16} /> Back to rooms</Link>
          </div>
        </div>
      </main>
    );
  }

  const showRoomType = room.room_type &&
    room.room_type.trim().toLowerCase() !== String(room.room_name || "").trim().toLowerCase();
  const discountPercent = hasDiscount
    ? Math.round(100 * (originalNightlyPrice - effectiveNightlyPrice) / originalNightlyPrice)
    : 0;
  const availabilityChecked = valid && !availabilityLoading && !availabilityError &&
    availability?.selectionKey === selectionKey;

  return (
    <main className="nsrd-page">
      <div className="nsrd-container">
        <nav className="nsrd-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/#destinations">{city}</Link>
          <ChevronRight size={14} />
          <Link to={back}>{area}</Link>
          <ChevronRight size={14} />
          <span aria-current="page">{room.room_name}</span>
        </nav>

        <header className="nsrd-header">
          <span className="nsrd-kicker"><Building2 size={15} /> {room.hotel_name}</span>
          <h1>{room.room_name}</h1>
          <p>
            <MapPin size={15} /> {area}, {city}
            <span className="nsrd-dot" />
            <Users size={15} /> Up to {capacity} {capacity === 1 ? "guest" : "guests"}
            {showRoomType && <><span className="nsrd-dot" /><BedDouble size={15} /> {room.room_type}</>}
          </p>
        </header>

        <div className="nsrd-layout">
          <div className="nsrd-main">
            <div className="nsrd-gallery">
              <img src={photos[photoIndex]} alt={`${room.room_name} photo ${photoIndex + 1}`}
                onError={e => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK; }} />
              {photos.length > 1 && <>
                <button className="nsrd-gallery-btn is-prev" type="button" aria-label="Previous photo"
                  onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}><ChevronLeft size={20} /></button>
                <button className="nsrd-gallery-btn is-next" type="button" aria-label="Next photo"
                  onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}><ChevronRight size={20} /></button>
                <span className="nsrd-photo-count">{photoIndex + 1} / {photos.length}</span>
              </>}
            </div>
            {photos.length > 1 && (
              <div className="nsrd-thumbs">
                {photos.map((photo, i) => (
                  <button type="button" key={photo} onClick={() => setPhotoIndex(i)}
                    className={i === photoIndex ? "is-selected" : ""} aria-label={`View photo ${i + 1}`}>
                    <img src={photo} alt="" />
                  </button>
                ))}
              </div>
            )}

            <section className="nsrd-section">
              <h2>About this room</h2>
              <p className="nsrd-description">
                {room.description || "A comfortable room with beautiful surroundings for a relaxing stay."}
              </p>
              <div className="nsrd-highlights">
                <div><Users size={20} /><span><small>Capacity</small><strong>{capacity} {capacity === 1 ? "guest" : "guests"}</strong></span></div>
                <div><BedDouble size={20} /><span><small>Room type</small><strong>{room.room_type || "Standard"}</strong></span></div>
                <div><CalendarDays size={20} /><span><small>Price per night</small><strong>{money(effectiveNightlyPrice)}</strong></span></div>
              </div>
            </section>

            {includedAmenities.length > 0 && (
              <section className="nsrd-section">
                <h2>What this room offers</h2>
                <ul className="nsrd-amenities">
                  {includedAmenities.map((amenity, index) => (
                    <li key={`${amenity.name}-${index}`}>
                      <Check size={16} />
                      <span>
                        <strong>{amenity.name}</strong>
                        {amenity.value && !/^(yes|available)$/i.test(String(amenity.value).trim()) && <small>{amenity.value}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="nsrd-section nsrd-hotel-card">
              <span className="nsrd-hotel-icon"><Building2 size={22} /></span>
              <div>
                <h2>{room.hotel_name}</h2>
                <p>{area}, {city} · Questions about this room? Contact the hotel.</p>
              </div>
              <Link to={`/hotels/${encodeURIComponent(room.hotel_id)}`} className="nsrd-btn-outline">
                View hotel <ExternalLink size={15} />
              </Link>
            </section>

            <Link to={back} className="nsrd-back"><ArrowLeft size={16} /> Back to rooms in {area}</Link>
          </div>

          <aside className="nsrd-sidebar">
            <section className="nsrd-booking" aria-label="Book this room">
              <div className="nsrd-price">
                <strong>{money(effectiveNightlyPrice)}</strong>
                <span>/ night</span>
                {hasDiscount && <>
                  <s>{money(originalNightlyPrice)}</s>
                  <em>{discountPercent}% off</em>
                </>}
              </div>

              <div className="nsrd-picker">
                <label className="nsrd-picker-cell">
                  <span>Check-in</span>
                  <input type="date" min={localDate()} value={checkIn}
                    onChange={e => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(""); }} />
                </label>
                <label className="nsrd-picker-cell">
                  <span>Check-out</span>
                  <input type="date" min={checkIn || localDate()} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </label>
                <label className="nsrd-picker-cell is-wide">
                  <span>Guests</span>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {Array.from({ length: Math.min(Math.max(capacity * roomCount, 1), 30) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </label>
              </div>

              {(addonsLoading || addonsError || addons.length > 0) && (
                <div className="nsrd-addons">
                  <h3>Add extras <small>Optional</small></h3>
                  {addonsLoading && <p className="nsrd-muted" role="status">Loading extras…</p>}
                  {addonsError && <p role="alert" className="nsrd-error">{addonsError}</p>}
                  {addons.map(addon => {
                    const checked = selectedAddonIds.includes(Number(addon.id));
                    return (
                      <label className={`nsrd-addon ${checked ? "is-checked" : ""}`} key={addon.id}>
                        <input type="checkbox" checked={checked} onChange={() => toggleAddon(Number(addon.id))} />
                        <span className="nsrd-addon-box"><Check size={13} strokeWidth={3} /></span>
                        <span className="nsrd-addon-name">
                          <strong>{addon.addon_name}</strong>
                          <small>{chargeLabel(addon.charge_type)}</small>
                        </span>
                        <span className="nsrd-addon-cost">+ {money(addon.price)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {nights > 0 && (
                <div className="nsrd-summary">
                  <div><span>{money(effectiveNightlyPrice)} × {nights} {nights === 1 ? "night" : "nights"}</span><span>{money(roomSubtotal + discountSavings)}</span></div>
                  {hasDiscount && <div className="is-saving"><span>Discount</span><span>− {money(discountSavings)}</span></div>}
                  {selectedAddons.map(addon => (
                    <div key={addon.id}><span>{addon.addon_name}</span><span>+ {money(addonCharge(addon))}</span></div>
                  ))}
                  <div className="is-total"><span>Total</span><span>{money(bookingTotal)}</span></div>
                </div>
              )}

              <div className="nsrd-status" aria-live="polite">
                {!valid && <p className="nsrd-error"><Info size={15} /> Select valid dates and number of guests.</p>}
                {valid && availabilityLoading && <p className="nsrd-muted"><span className="nsrd-spinner" /> Checking availability…</p>}
                {valid && availabilityError && <p role="alert" className="nsrd-error"><Info size={15} /> {availabilityError}</p>}
                {availabilityChecked && (availability.available ? (
                  <p className="nsrd-ok">
                    <CheckCircle2 size={15} /> {availability.message || "Available for your dates"}
                    {Number.isFinite(Number(availability.remaining_rooms)) && Number(availability.remaining_rooms) <= 3 &&
                      <b> · Only {availability.remaining_rooms} left</b>}
                  </p>
                ) : (
                  <p className="nsrd-error"><Info size={15} /> {availability.message || "Not available for these dates"}</p>
                ))}
              </div>

              <button type="button" className="nsrd-btn-primary" onClick={book}
                disabled={!confirmedAvailable || availabilityLoading || addonsLoading || !!addonsError}>
                Book now <ArrowRight size={18} />
              </button>
              <p className="nsrd-secure"><ShieldCheck size={15} /> You'll enter your details on the next step</p>
            </section>
          </aside>
        </div>
      </div>

      {showBooking && (
        <div className="nsrd-modal-backdrop" role="presentation"
          onMouseDown={e => { if (e.target === e.currentTarget && !bookingLoading) setShowBooking(false); }}>
          <section className="nsrd-modal" role="dialog" aria-modal="true" aria-labelledby="nsrd-modal-title">
            <button type="button" className="nsrd-modal-close" aria-label="Close" disabled={bookingLoading}
              onClick={() => setShowBooking(false)}><X size={18} /></button>
            <h2 id="nsrd-modal-title">Complete your booking</h2>
            <div className="nsrd-modal-summary">
              <img src={photos[0]} alt="" />
              <div>
                <strong>{room.room_name}</strong>
                <small>{room.hotel_name} · {area}, {city}</small>
                <small>{checkIn} → {checkOut} · {guests} {guests === 1 ? "guest" : "guests"}</small>
              </div>
            </div>
            <div className="nsrd-summary is-compact">
              {selectedAddons.map(addon => (
                <div key={addon.id}><span>{addon.addon_name}</span><span>+ {money(addonCharge(addon))}</span></div>
              ))}
              <div className="is-total"><span>Total</span><span>{money(bookingTotal)}</span></div>
            </div>
            <form onSubmit={submitBooking} className="nsrd-form">
              <label><span>Full name</span>
                <input required maxLength={150} autoComplete="name" value={guestName} onChange={e => setGuestName(e.target.value)} />
              </label>
              <label><span>Email address</span>
                <input required type="email" maxLength={150} autoComplete="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
              </label>
              <label><span>Phone number</span>
                <input required type="tel" maxLength={30} autoComplete="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
              </label>
              {bookingError && <p role="alert" className="nsrd-error"><Info size={15} /> {bookingError}</p>}
              <button type="submit" disabled={bookingLoading || !confirmedAvailable} className="nsrd-btn-primary">
                {bookingLoading ? "Submitting…" : "Confirm booking"}
              </button>
              <button type="button" className="nsrd-btn-ghost" disabled={bookingLoading} onClick={() => setShowBooking(false)}>Cancel</button>
            </form>
          </section>
        </div>
      )}

      {bookingResult && (
        <div className="nsrd-modal-backdrop" role="presentation">
          <section className="nsrd-modal is-success" role="dialog" aria-modal="true" aria-labelledby="nsrd-success-title">
            <span className="nsrd-success-icon"><CheckCircle2 size={34} /></span>
            <h2 id="nsrd-success-title">Booking submitted</h2>
            <p className="nsrd-muted">Your booking request for {room.hotel_name} has been received.</p>
            <div className="nsrd-summary is-compact">
              <div><span>Reference</span><strong>{bookingResult.booking_reference}</strong></div>
              <div><span>Status</span><span>{bookingResult.status || "Pending"}</span></div>
              <div className="is-total"><span>Total</span><span>{money(bookingResult.total_amount)}</span></div>
            </div>
            <button type="button" className="nsrd-btn-primary" onClick={() => setBookingResult(null)}>Done</button>
          </section>
        </div>
      )}
    </main>
  );
}
