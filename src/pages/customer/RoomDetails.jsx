import { useEffect, useMemo, useState } from "react";

import { Link, useParams, useSearchParams } from "react-router-dom";

import {

  ArrowLeft, ArrowRight, BedDouble, CalendarDays, ChevronLeft, ChevronRight,

  Image as ImageIcon, MapPin, ShieldCheck, Users, Wifi, Coffee,

  Phone, CheckCircle2, ExternalLink

} from "lucide-react";

import "./RoomDetails.css";

const API = "https://coreops.pk/Hotel/api/getRoomsByArea.php";
const ADDONS_API = "https://coreops.pk/Hotel/api/getRoomAddons.php";

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

  useEffect(() => {

    const controller = new AbortController();

    setLoading(true);

    setError("");

    setRoom(null);

    if (!city || !area) {

      setError("Room location is missing. Please open the room from an area page.");

      setLoading(false);

      return () => controller.abort();

    }

    const qs = new URLSearchParams({ city, area });

    fetch(`${API}?${qs}`, { signal: controller.signal, cache: "no-store", credentials: "omit" })

      .then(async (response) => {

        const json = await response.json();

        if (!response.ok || !json.success || !Array.isArray(json.rooms)) {

          throw new Error(json.message || "Could not load room details.");

        }

        return json.rooms;

      })

      .then((rooms) => {

        if (controller.signal.aborted) return;

        const match = rooms.find((r) => String(r.id) === String(roomId) && String(r.hotel_id) === String(hotelId));

        if (!match) throw new Error("This room is not currently available in the selected area.");

        setRoom(match);

      })

      .catch((err) => {

        if (!controller.signal.aborted) setError(err.message || "Could not load room details.");

      })

      .finally(() => {

        if (!controller.signal.aborted) setLoading(false);

      });

    return () => controller.abort();

  }, [city, area, hotelId, roomId]);

  useEffect(() => {
    const controller = new AbortController();
    setAddons([]);
    setSelectedAddonIds([]);
    setAddonsLoading(true);
    setAddonsError("");
    fetch(ADDONS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: Number(roomId) }),
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.addons)) {
          throw new Error(data.message || "Unable to load optional add-ons.");
        }
        return data.addons;
      })
      .then((items) => {
        if (!controller.signal.aborted) setAddons(items);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setAddonsError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setAddonsLoading(false);
      });
    return () => controller.abort();
  }, [roomId]);

  const includedAmenities = useMemo(() => {
    const items = Array.isArray(room?.amenities) ? room.amenities : [];
    return items.filter((amenity) => {
      const name = String(amenity?.name || "").trim().toLowerCase();
      const value = String(amenity?.value || "").trim().toLowerCase();
      // Never display mattress or a paid add-on as an included amenity.
      if (/mattress|extra bed|additional bed/i.test(name)) return false;
      if (/^(rs\\.?|pkr)\\s*[\\d,]+/i.test(value) || /\\b(rs\\.?|pkr)\\s*[\\d,]+/i.test(value)) return false;
      return !addons.some((addon) => String(addon.addon_name || "").trim().toLowerCase() === name);
    });
  }, [room, addons]);

  const toggleAddon = (id) => {
    setSelectedAddonIds((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
    );
  };

  const chargeLabel = (type) => ({
    per_night: "Per night",
    per_guest_per_night: "Per guest / night",
    per_stay: "One-time",
  }[type] || "One-time");

  const photos = useMemo(() => {
    if (!room) return [FALLBACK];

    const urls = [
      room.image_url,
      ...(Array.isArray(room.gallery) ? room.gallery : []),
    ].filter(
      (v) =>
        typeof v === "string" &&
        /^https?:\/\//i.test(v)
    );

    return [...new Set(urls.length ? urls : [FALLBACK])];
  }, [room]);

  const nights = nightsBetween(checkIn, checkOut);

  const capacity = Number(room?.capacity || 2);

  const inventory = Number(room?.online_rooms ?? room?.total_rooms ?? 0);

  const valid = !!room && checkIn >= localDate() && nights > 0 &&

    Number.isInteger(roomCount) && roomCount > 0 && roomCount <= inventory &&

    Number.isInteger(guests) && guests > 0 && guests <= capacity * roomCount;

  const selectedAddons = addons.filter((addon) => selectedAddonIds.includes(Number(addon.id)));
  const addonCharge = (addon) => {
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

  const back = city && area

    ? `/destinations/${encodeURIComponent(city)}/areas/${encodeURIComponent(area)}`

    : "/hotels";

  function book() {

    if (!valid) return;

    setBookingError("");

    setShowBooking(true);

  }

  async function submitBooking(event) {

    event.preventDefault();

    if (!valid || bookingLoading || addonsLoading || addonsError) return;

    setBookingLoading(true);

    setBookingError("");

    try {

      const response = await fetch("https://coreops.pk/Hotel/api/createBooking.php", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          hotel_id: Number(room.hotel_id), room_id: Number(room.id),

          check_in: checkIn, check_out: checkOut,

          room_count: roomCount, guests,

          guest_name: guestName.trim(), guest_email: guestEmail.trim(),

          guest_phone: guestPhone.trim(), addon_ids: selectedAddonIds

        })

      });

      const result = await response.json();

      if (!response.ok || !result.success) {

        throw new Error(result.message || "Booking could not be submitted.");

      }

      setBookingResult(result);

      setShowBooking(false);

    } catch (err) {

      setBookingError(err.message || "Network error. Please try again.");

    } finally {

      setBookingLoading(false);

    }

  }

  if (loading) return <main className="nsrd-container nsrd-state" role="status">Loading room details...</main>;

  if (error || !room) return (

    <main className="nsrd-container nsrd-state">

      <h1>Room details unavailable</h1>

      <p>{error || "Room not found."}</p>

      <Link to={back}>Back to area rooms</Link>

    </main>

  );

  return (

    <main className="nsrd-page">

      <div className="nsrd-container">

        <nav className="nsrd-crumbs" aria-label="Breadcrumb">

          <Link to="/">Home</Link><span>›</span>

          <Link to={`/destinations/${encodeURIComponent(city)}`}>{city}</Link><span>›</span>

          <Link to={back}>{area}</Link><span>›</span>

          <span>{room.room_name}</span>

        </nav>

        <div className="nsrd-layout">

          <div className="nsrd-main">

            <div className="nsrd-gallery">

              <img

                src={photos[photoIndex]}

                alt={`${room.room_name} photo ${photoIndex + 1}`}

                onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK; }}

              />

              <span className="nsrd-photo-label"><BedDouble size={16} /> {room.room_type || "Room"}</span>

              {photos.length > 1 && (

                <>

                  <button className="nsrd-gallery-prev" type="button" aria-label="Previous photo" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}><ChevronLeft /></button>

                  <button className="nsrd-gallery-next" type="button" aria-label="Next photo" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}><ChevronRight /></button>

                </>

              )}

              <span className="nsrd-photo-count">{photoIndex + 1} / {photos.length}</span>

            </div>

            {photos.length > 1 && <div className="nsrd-thumbs">

              {photos.map((photo, i) => (

                <button type="button" key={photo} onClick={() => setPhotoIndex(i)} className={i === photoIndex ? "selected" : ""}>

                  <img src={photo} alt={`View photo ${i + 1}`} />

                </button>

              ))}

            </div>}

            <div className="nsrd-intro">

              <span className="nsrd-kicker">{room.hotel_name}</span>

              <h1>{room.room_name}</h1>

              <p className="nsrd-location"><MapPin size={18} /> {area}, {city}</p>

              <p className="nsrd-description">{room.description || "Discover a comfortable stay with beautiful surroundings and a relaxing room experience."}</p>

            </div>

            <div className="nsrd-features">

              <span><Users size={20} /> Up to {capacity} guests</span>

              <span><BedDouble size={20} /> {room.room_type || "Room"}</span>

              <span><Wifi size={20} /> {includedAmenities.length ? `${includedAmenities.length} amenities` : "Amenities: ask hotel"}</span>

              <span><Coffee size={20} /> Relaxing stay</span>

            </div>

            {includedAmenities.length > 0 && (

              <section className="nsrd-info">

                <h2>Room Amenities</h2>

                <div className="nsrd-amenities">

                  {includedAmenities.map((amenity, index) => (

                    <div key={`${amenity.name}-${index}`} className="nsrd-amenity">

                      <strong>{amenity.name}</strong><span>{amenity.value || "Available"}</span>

                    </div>

                  ))}

                </div>

              </section>

            )}

            <section className="nsrd-info">

              <h2>Room Details</h2>

              <div className="nsrd-facts">

                <div><small>Room Type</small><strong>{room.room_type || "Standard"}</strong></div>

                <div><small>Capacity</small><strong>{capacity} guests</strong></div>

                <div><small>Price per Night</small><strong>{money(effectiveNightlyPrice)}</strong></div>

              </div>

            </section>

          </div>

          <aside className="nsrd-sidebar">

            <section className="nsrd-booking">

              <div className="nsrd-price">
                <div className="nsrd-current-price">
                  <strong>{money(effectiveNightlyPrice)}</strong>
                  <span>/ night</span>
                </div>
                {hasDiscount && (
                  <div className="nsrd-price-discount">
                    <s>{money(originalNightlyPrice)}</s>
                    <small>{Math.round(100 * (originalNightlyPrice - effectiveNightlyPrice) / originalNightlyPrice)}% OFF</small>
                  </div>
                )}
              </div>

              <p className="nsrd-hotel"><MapPin size={18} /> <span>{room.hotel_name}<small>{area}, {city}</small></span></p>

              <div className="nsrd-quick"><span><Users size={17} /> Up to {capacity} guests/room</span><span><BedDouble size={17} /> Online room</span></div>

              <div className="nsrd-form-grid">

                <label><span><CalendarDays size={15} /> Check-in</span><input type="date" min={localDate()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(""); }} /></label>

                <label><span><CalendarDays size={15} /> Check-out</span><input type="date" min={checkIn || localDate()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>

                <label><span>Guests</span><select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{Array.from({ length: Math.min(Math.max(capacity * roomCount, 1), 30) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}</select></label>

              </div>

              {nights > 0 && <>
                <div className="nsrd-subtotal"><span>{nights} night(s) · {roomCount} room(s)</span><strong>{money(roomSubtotal)}</strong></div>
                {selectedAddons.map((addon) => (
                  <div className="nsrd-subtotal nsrd-addon-summary" key={addon.id}>
                    <span><CheckCircle2 size={15} /> {addon.addon_name}</span>
                    <strong>+ {money(addonCharge(addon))}</strong>
                  </div>
                ))}
                {hasDiscount && <div className="nsrd-subtotal"><span>Room Discount Savings</span><strong style={{ color: "#15803d" }}>- {money(discountSavings)}</strong></div>}
                <div className="nsrd-subtotal nsrd-total"><span>Total Amount</span><strong>{money(bookingTotal)}</strong></div>
              </>}

              {!valid && <p className="nsrd-validation">Select valid dates, room count and guest capacity.</p>}

              <button type="button" className="nsrd-book-btn" onClick={book} disabled={!valid || addonsLoading || !!addonsError}>Book Now <ArrowRight size={18} /></button>

              <div className="nsrd-addons">
                <h3>Optional Add-ons</h3>
                <p>Select one or more services for your stay.</p>
                {addonsLoading && <p role="status">Loading add-ons...</p>}
                {addonsError && <p role="alert" className="nsrd-validation">{addonsError}</p>}
                {!addonsLoading && !addonsError && addons.length === 0 && <p>No optional add-ons available.</p>}
                {addons.map((addon) => (
                  <label className="nsrd-addon-option" key={addon.id}>
                    <input type="checkbox" checked={selectedAddonIds.includes(Number(addon.id))}
                      onChange={() => toggleAddon(Number(addon.id))} />
                    <span className="nsrd-addon-name"><strong>{addon.addon_name}</strong>
                      <small>{chargeLabel(addon.charge_type)}</small></span>
                    <span className="nsrd-addon-cost">+ {money(addon.price)}</span>
                  </label>
                ))}
              </div>
              <p className="nsrd-secure"><ShieldCheck size={17} /> Continue to booking details</p>

            </section>

            <section className="nsrd-help"><Phone size={25} /><div><h3>Need Help?</h3><p>Questions about this room?</p><Link to={`/hotels/${encodeURIComponent(room.hotel_id)}`}>View Hotel Details <ExternalLink size={15} /></Link></div></section>

          </aside>

          {bookingResult && (

            <div role="status" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#0009", display: "grid", placeItems: "center", padding: 16 }}>

              <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 480, width: "100%" }}>

                <CheckCircle2 size={34} color="#17624e" />

                <h2>Booking Submitted Successfully</h2>

                <p>Reference: <strong>{bookingResult.booking_reference}</strong></p>

                <p>Status: {bookingResult.status || "Pending"}</p>

                <p>Total: {money(bookingResult.total_amount)}</p>

                <button type="button" className="nsrd-book-btn" onClick={() => setBookingResult(null)}>Done</button>

              </div>

            </div>

          )}

          {showBooking && (

            <div role="presentation" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#0009", display: "grid", placeItems: "center", padding: 16 }} onMouseDown={e => { if (e.target === e.currentTarget && !bookingLoading) setShowBooking(false) }}>

              <section role="dialog" aria-modal="true" aria-label="Booking details" style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>

                <h2>Complete Your Booking</h2>

                <p>{room.room_type || room.room_name} · {checkIn} to {checkOut}</p>

                <p><strong>{money(bookingTotal)}</strong> · {guests} guest(s)</p>
                {selectedAddons.map((addon) => <p key={addon.id} style={{ margin: "4px 0" }}>
                  {addon.addon_name}: + {money(addonCharge(addon))}
                </p>)}

                <form onSubmit={submitBooking} style={{ display: "grid", gap: 14 }}>

                  <label>Full Name<input required maxLength={150} autoComplete="name" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ display: "block", width: "100%", padding: 12, boxSizing: "border-box" }} /></label>

                  <label>Email Address<input required type="email" maxLength={150} autoComplete="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} style={{ display: "block", width: "100%", padding: 12, boxSizing: "border-box" }} /></label>

                  <label>Phone Number<input required type="tel" maxLength={30} autoComplete="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ display: "block", width: "100%", padding: 12, boxSizing: "border-box" }} /></label>

                  {bookingError && <p role="alert" style={{ color: "#b42318" }}>{bookingError}</p>}

                  <button type="submit" disabled={bookingLoading} className="nsrd-book-btn">{bookingLoading ? "Submitting..." : "Confirm Booking"}</button>

                  <button type="button" disabled={bookingLoading} onClick={() => setShowBooking(false)}>Cancel</button>

                </form>

              </section>

            </div>

          )}

        </div>

        <Link to={back} className="nsrd-back"><ArrowLeft size={17} /> Back to rooms in {area}</Link>

      </div>

    </main>

  );

}

