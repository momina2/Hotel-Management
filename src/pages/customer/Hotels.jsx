// import { useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   MapPin,
//   Star,
//   Search,
//   SlidersHorizontal,
//   BedDouble,
//   Users,
//   ArrowRight,
//   CalendarDays,
// } from "lucide-react";

// import { useActiveHotels } from "../../data/hotelStore";
// import {
//   useBookings,
//   remainingRooms,
//   nightsBetween,
// } from "../../data/bookingStore";
// import { formatPKR } from "../../data/hotels";
// import { destinations, getAreasByDestination } from "../../data/destinations";

// import "../../styles/hotels.css";

// const getToday = () => {
//   const date = new Date();

//   return [
//     date.getFullYear(),
//     String(date.getMonth() + 1).padStart(2, "0"),
//     String(date.getDate()).padStart(2, "0"),
//   ].join("-");
// };

// const normalize = (value) =>
//   String(value ?? "")
//     .trim()
//     .toLowerCase();

// export default function Hotels() {
//   const hotels = useActiveHotels();

//   // Keep room availability updated when bookings change.
//   useBookings();

//   const [params, setParams] = useSearchParams();

//   const [keyword, setKeyword] = useState("");
//   const [maxPrice, setMaxPrice] = useState(100000);
//   const [sortBy, setSortBy] = useState("recommended");

//   const city = params.get("destination") || "";
//   const area = params.get("area") || "";

//   const checkIn = params.get("checkIn") || "";
//   const checkOut = params.get("checkOut") || "";

//   const roomCount = Number(params.get("rooms") ?? params.get("roomCount") ?? 1);

//   const guests = Number(params.get("guests") || 2);

//   const nights = nightsBetween(checkIn, checkOut);

//   const datesSelected = Boolean(checkIn && checkOut);

//   const datesValid = datesSelected && checkIn >= getToday() && nights > 0;

//   const datesInvalid = Boolean(checkIn || checkOut) && !datesValid;

//   // Combine configured destinations with destinations
//   // already saved in the hotel store.
//   const cities = [
//     ...new Set([...destinations, ...hotels.map((hotel) => hotel.destination)]),
//   ].filter(Boolean);

//   // Areas depend on the selected destination.
//   // Also include any custom areas saved by admin.
//   const areas = [
//     ...new Set([
//       ...getAreasByDestination(city),
//       ...hotels
//         .filter((hotel) => normalize(hotel.destination) === normalize(city))
//         .map((hotel) => hotel.area)
//         .filter(Boolean),
//     ]),
//   ];

//   const updateParam = (key, value) => {
//     const next = new URLSearchParams(params);

//     if (String(value ?? "").trim()) {
//       next.set(key, String(value));
//     } else {
//       next.delete(key);
//     }

//     // Changing the destination resets its area.
//     if (key === "destination") {
//       next.delete("area");
//     }

//     if (key === "rooms") {
//       next.delete("roomCount");
//     }

//     // Reset check-out when it is no longer valid.
//     if (
//       key === "checkIn" &&
//       next.get("checkOut") &&
//       next.get("checkOut") <= value
//     ) {
//       next.delete("checkOut");
//     }

//     setParams(next);
//   };

//   // Convert each hotel's room types into separate cards.
//   const allRooms = hotels.flatMap((hotel) =>
//     (hotel.rooms || []).map((room) => {
//       const inventory = Number(room.available ?? 0);

//       const available = datesValid
//         ? remainingRooms(hotel.id, room.id, checkIn, checkOut)
//         : inventory;

//       return {
//         hotel,
//         room,
//         available,
//       };
//     }),
//   );

//   const results = allRooms
//     .filter(({ hotel, room, available }) => {
//       // Destination filtering
//       const cityMatch =
//         !city || normalize(hotel.destination) === normalize(city);

//       // Area filtering
//       const areaMatch = !area || normalize(hotel.area) === normalize(area);

//       const searchableText = [
//         hotel.name,
//         hotel.location,
//         hotel.destination,
//         hotel.area,
//         hotel.type,
//         room.name,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       const keywordMatch = searchableText.includes(normalize(keyword));

//       const price = Number(room.price || 0);
//       const capacity = Number(room.capacity || 0);

//       const priceMatch = price > 0 && price <= maxPrice;

//       const capacityMatch = capacity > 0 && capacity * roomCount >= guests;

//       const inventoryMatch = available >= roomCount;

//       return (
//         cityMatch &&
//         areaMatch &&
//         keywordMatch &&
//         priceMatch &&
//         capacityMatch &&
//         inventoryMatch
//       );
//     })
//     .sort((a, b) => {
//       if (sortBy === "price-low") {
//         return Number(a.room.price) - Number(b.room.price);
//       }

//       if (sortBy === "price-high") {
//         return Number(b.room.price) - Number(a.room.price);
//       }

//       if (sortBy === "rating") {
//         return Number(b.hotel.rating || 0) - Number(a.hotel.rating || 0);
//       }

//       return 0;
//     });

//   const resetFilters = () => {
//     setParams({});
//     setKeyword("");
//     setMaxPrice(100000);
//     setSortBy("recommended");
//   };

//   return (
//     <main className="hotels-page">
//       {/* PAGE HEADING */}
//       <section className="listing-banner">
//         <div className="container">
//           <span className="section-label">FIND YOUR PERFECT ROOM</span>

//           <h1>Available Rooms</h1>

//           <p>
//             Choose your destination and preferred area. Compare rooms, prices
//             and availability across Northern Pakistan.
//           </p>
//         </div>
//       </section>

//       <div className="container listing-layout">
//         {/* SEARCH FILTERS */}
//         <aside className="filters-panel">
//           <div className="filters-title">
//             <SlidersHorizontal size={20} />
//             <h3>Search & Filters</h3>
//           </div>

//           <label htmlFor="room-keyword">Search Room or Hotel</label>

//           <div className="filter-input">
//             <Search size={17} />

//             <input
//               id="room-keyword"
//               type="text"
//               placeholder="Deluxe, family, mountain..."
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//             />
//           </div>

//           {/* DESTINATION */}
//           <label htmlFor="room-city">
//             <MapPin size={15} />
//             Destination
//           </label>

//           <select
//             id="room-city"
//             value={city}
//             onChange={(e) => updateParam("destination", e.target.value)}
//           >
//             <option value="">All Destinations</option>

//             {cities.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>

//           {/* AREA */}
//           <label htmlFor="room-area">
//             <MapPin size={15} />
//             Area
//           </label>

//           <select
//             id="room-area"
//             value={area}
//             disabled={!city}
//             onChange={(e) => updateParam("area", e.target.value)}
//           >
//             <option value="">
//               {city ? "All Areas" : "Select Destination First"}
//             </option>

//             {areas.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>

//           {/* DATES */}
//           <label htmlFor="room-checkin">
//             <CalendarDays size={15} />
//             Check-in
//           </label>

//           <input
//             id="room-checkin"
//             type="date"
//             min={getToday()}
//             value={checkIn}
//             onChange={(e) => updateParam("checkIn", e.target.value)}
//           />

//           <label htmlFor="room-checkout">
//             <CalendarDays size={15} />
//             Check-out
//           </label>

//           <input
//             id="room-checkout"
//             type="date"
//             min={checkIn || getToday()}
//             value={checkOut}
//             onChange={(e) => updateParam("checkOut", e.target.value)}
//           />

//           {/* ROOM QUANTITY */}
//           <label htmlFor="room-quantity">
//             <BedDouble size={15} />
//             Number of Rooms
//           </label>

//           <select
//             id="room-quantity"
//             value={roomCount}
//             onChange={(e) => updateParam("rooms", e.target.value)}
//           >
//             {Array.from({ length: 10 }, (_, index) => index + 1).map(
//               (count) => (
//                 <option key={count} value={count}>
//                   {count} {count === 1 ? "Room" : "Rooms"}
//                 </option>
//               ),
//             )}
//           </select>

//           {/* GUESTS */}
//           <label htmlFor="room-guests">
//             <Users size={15} />
//             Total Guests
//           </label>

//           <select
//             id="room-guests"
//             value={guests}
//             onChange={(e) => updateParam("guests", e.target.value)}
//           >
//             {Array.from({ length: 30 }, (_, index) => index + 1).map(
//               (count) => (
//                 <option key={count} value={count}>
//                   {count} {count === 1 ? "Guest" : "Guests"}
//                 </option>
//               ),
//             )}
//           </select>

//           {/* PRICE */}
//           <label htmlFor="room-price">Maximum Price / Room / Night</label>

//           <input
//             id="room-price"
//             type="range"
//             min="1000"
//             max="100000"
//             step="1000"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(Number(e.target.value))}
//           />

//           <strong className="price-value">{formatPKR(maxPrice)}</strong>

//           <button
//             type="button"
//             className="reset-filters"
//             onClick={resetFilters}
//           >
//             Reset Filters
//           </button>
//         </aside>

//         {/* ROOM RESULTS */}
//         <section className="hotel-results">
//           <div className="results-header">
//             <div>
//               <h2>
//                 {city || "All Destinations"}
//                 {area ? ` · ${area}` : ""}
//                 {" · Rooms"}
//               </h2>

//               <p>
//                 {results.length} matching room types
//                 {datesValid
//                   ? ` · ${roomCount} rooms · ${guests} guests · ${nights} nights`
//                   : " · Select dates to check availability"}
//               </p>
//             </div>

//             <select
//               className="sort-select"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               aria-label="Sort rooms"
//             >
//               <option value="recommended">Recommended</option>

//               <option value="price-low">Price: Low to High</option>

//               <option value="price-high">Price: High to Low</option>

//               <option value="rating">Highest Rated</option>
//             </select>
//           </div>

//           {datesInvalid && (
//             <div
//               role="alert"
//               style={{
//                 padding: "13px 16px",
//                 marginBottom: 20,
//                 borderRadius: 9,
//                 background: "#fff3e5",
//                 color: "#925c1b",
//                 fontSize: 13,
//               }}
//             >
//               Please select valid future check-in and check-out dates. Rooms
//               below are shown for browsing only.
//             </div>
//           )}

//           <div className="hotel-cards">
//             {results.map(({ hotel, room, available }) => {
//               const photo =
//                 room.image ||
//                 room.gallery?.[0] ||
//                 hotel.image ||
//                 hotel.gallery?.[0];

//               const price = Number(room.price || 0);

//               const total = datesValid ? price * roomCount * nights : 0;

//               const bookingParams = new URLSearchParams({
//                 destination: hotel.destination || "",
//                 rooms: String(roomCount),
//                 guests: String(guests),
//                 roomId: String(room.id),
//               });

//               if (hotel.area) {
//                 bookingParams.set("area", hotel.area);
//               }

//               if (datesValid) {
//                 bookingParams.set("checkIn", checkIn);

//                 bookingParams.set("checkOut", checkOut);
//               }

//               return (
//                 <article
//                   className="hotel-list-card"
//                   key={`${hotel.id}-${room.id}`}
//                 >
//                   {photo ? (
//                     <img src={photo} alt={room.name} loading="lazy" />
//                   ) : (
//                     <div
//                       style={{
//                         display: "grid",
//                         placeItems: "center",
//                         minHeight: 240,
//                         background: "#e8efeb",
//                         color: "#789085",
//                       }}
//                     >
//                       <BedDouble size={46} />
//                     </div>
//                   )}

//                   <div className="hotel-card-body">
//                     <span className="hotel-type">
//                       {hotel.destination}

//                       {hotel.area ? ` · ${hotel.area}` : ""}

//                       {hotel.type ? ` · ${hotel.type}` : ""}
//                     </span>

//                     <h3>{room.name}</h3>

//                     <p className="hotel-location">
//                       <MapPin size={15} />
//                       {hotel.name} · {hotel.location}
//                     </p>

//                     <div className="hotel-rating">
//                       <Star size={16} fill="currentColor" />

//                       <strong>{hotel.rating || "New"}</strong>

//                       <span>({hotel.reviews || 0} reviews)</span>
//                     </div>

//                     <div className="hotel-amenities">
//                       <span>
//                         <Users size={15} />
//                         Up to {room.capacity} guests per room
//                       </span>

//                       <span>
//                         <BedDouble size={15} />

//                         {datesValid
//                           ? `${available} rooms available`
//                           : `${available} rooms listed · Select dates to confirm`}
//                       </span>
//                     </div>

//                     <div className="hotel-card-bottom">
//                       <div>
//                         <small>Per room / night</small>

//                         <strong>{formatPKR(price)}</strong>

//                         {datesValid && (
//                           <>
//                             <small>
//                               {roomCount} rooms × {nights} nights
//                             </small>

//                             <strong>Total: {formatPKR(total)}</strong>
//                           </>
//                         )}
//                       </div>

//                       <Link
//                         className="details-button"
//                         to={`/hotels/${hotel.id}?${bookingParams.toString()}`}
//                       >
//                         View Room
//                         <ArrowRight size={16} />
//                       </Link>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {results.length === 0 && (
//             <div className="empty-results">
//               <h3>No Matching Rooms Found</h3>
//               {area &&
//                 hotels.some(
//                   (hotel) =>
//                     normalize(hotel.destination) === normalize(city) &&
//                     !hotel.area,
//                 ) && (
//                   <p>
//                     Some hotels in this destination do not have an area assigned
//                     yet. Please update their area in Admin Hotel Management.
//                   </p>
//                 )}

//               {allRooms.length === 0 && (
//                 <p>
//                   No room inventory is currently available in the active hotel
//                   data. Please check Admin → Hotels and Admin → Rooms.
//                 </p>
//               )}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }






import { API_BASE } from "../../api/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal, BedDouble, Users, ArrowRight, CalendarDays, Building2, X, RotateCcw } from "lucide-react";
import "../../styles/hotelsPage.css";

const API = `${API_BASE}/`;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const money = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;
const norm = (s) => String(s || "").trim().toLowerCase();
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const roomPrice = (room) => Number(room.discounted_price_per_night || room.price_per_night || 0);

function ResultSkeletons() {
  return Array.from({ length: 3 }, (_, index) => (
    <div key={index} className="nsh-card is-skeleton" aria-hidden="true">
      <div className="nsh-card-media nsh-shimmer" />
      <div className="nsh-card-body">
        <span className="nsh-line is-short nsh-shimmer" />
        <span className="nsh-line nsh-shimmer" />
        <span className="nsh-line is-short nsh-shimmer" />
      </div>
    </div>
  ));
}

export default function Hotels() {
  const [params, setParams] = useSearchParams();
  const city = params.get("destination") || "";
  const area = params.get("area") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const roomCount = Math.max(1, Number(params.get("rooms") || 1));
  const guests = Math.max(1, Number(params.get("guests") || 2));
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxPrice, setMaxPrice] = useState(null); // null = no price limit
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const nights = checkIn && checkOut ? Math.round((new Date(`${checkOut}T12:00:00`) - new Date(`${checkIn}T12:00:00`)) / 86400000) : 0;
  const datesValid = Boolean(checkIn && checkOut && checkIn >= today() && nights > 0);
  const datesInvalid = Boolean(checkIn || checkOut) && !datesValid;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}getCities.php`, { signal: controller.signal, cache: "no-store" })
      .then(r => r.json()).then(data => {
        if (data.success && Array.isArray(data.cities)) setCities(data.cities.filter(c => c.city_name && (c.status == null || c.status === "YES")));
      }).catch(() => { });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!city) { setAreas([]); return; }
    const controller = new AbortController();
    fetch(`${API}getAreasByCities.php?city=${encodeURIComponent(city)}`, { signal: controller.signal, cache: "no-store" })
      .then(r => r.json()).then(data => {
        if (data.success && Array.isArray(data.areas)) setAreas(data.areas.filter(a => a.area_name && (a.status == null || ["YES", "Active"].includes(a.status))));
      }).catch(() => setAreas([]));
    return () => controller.abort();
  }, [city]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const formData = new FormData();

    formData.append("rooms", String(roomCount));
    formData.append("guests", String(guests));

    if (city) formData.append("city", city);
    if (area) formData.append("area", area);

    fetch(`${API}getRoomsByArea.php`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      cache: "no-store",
      credentials: "omit"
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok || !data.success || !Array.isArray(data.rooms)) throw new Error(data.message || "Unable to load rooms");
        return data.rooms;
      })
      .then(data => { if (!controller.signal.aborted) setRooms(data); })
      .catch(e => { if (!controller.signal.aborted) { setRooms([]); setError(e.message); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [city, area, roomCount, guests]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (String(value ?? "").trim()) next.set(key, String(value));
    else next.delete(key);
    if (key === "destination") next.delete("area");
    if (key === "checkIn" && next.get("checkOut") && next.get("checkOut") <= value) next.delete("checkOut");
    setParams(next);
  };

  // Price slider bounds follow the loaded rooms instead of a fixed 100,000 cap.
  const priceCap = useMemo(() => {
    const highest = Math.max(0, ...rooms.map(roomPrice));
    return highest > 0 ? Math.ceil(highest / 1000) * 1000 : 100000;
  }, [rooms]);
  const effectiveMaxPrice = maxPrice == null ? priceCap : Math.min(maxPrice, priceCap);

  const roomTypes = useMemo(
    () => [...new Set(rooms.map(room => String(room.room_type || "").trim()).filter(Boolean))].sort(),
    [rooms]
  );

  const results = useMemo(() => rooms.filter(room => {
    const price = roomPrice(room);
    const text = [room.room_name, room.room_type, room.hotel_name, room.city_name, room.area_name].join(" ");
    const typeOk = selectedTypes.length === 0 || selectedTypes.includes(String(room.room_type || "").trim());
    return norm(text).includes(norm(keyword)) && typeOk && price > 0 && price <= effectiveMaxPrice &&
      Number(room.online_rooms) >= roomCount && Number(room.capacity) * roomCount >= guests;
  }).sort((a, b) => {
    const pa = roomPrice(a);
    const pb = roomPrice(b);
    return sortBy === "price-low" ? pa - pb : sortBy === "price-high" ? pb - pa : 0;
  }), [rooms, keyword, selectedTypes, effectiveMaxPrice, sortBy, roomCount, guests]);

  const refineCount = (keyword ? 1 : 0) + (maxPrice != null && maxPrice < priceCap ? 1 : 0) + selectedTypes.length;
  const toggleType = (type) => setSelectedTypes(current =>
    current.includes(type) ? current.filter(t => t !== type) : [...current, type]);
  const clearRefine = () => { setKeyword(""); setMaxPrice(null); setSelectedTypes([]); };
  const resetAll = () => { setParams({}); clearRefine(); setSortBy("recommended"); };

  const placeLabel = area ? `${area}, ${city}` : city || "Northern Pakistan";

  return (
    <main className="nsh-page">
      <div className="nsh-container">
        <header className="nsh-header">
          <span className="nsh-eyebrow">Find your perfect room</span>
          <h1>Rooms in {placeLabel}</h1>
        </header>

        {/* Primary search criteria (kept in the URL so results are shareable) */}
        <form className="nsh-searchbar" onSubmit={e => e.preventDefault()} aria-label="Search rooms">
          <label className="nsh-field">
            <span><MapPin size={14} /> Destination</span>
            <select value={city} onChange={e => updateParam("destination", e.target.value)}>
              <option value="">All destinations</option>
              {cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}
            </select>
          </label>
          <label className="nsh-field">
            <span><MapPin size={14} /> Area</span>
            <select value={area} disabled={!city} onChange={e => updateParam("area", e.target.value)}>
              <option value="">{city ? "All areas" : "Choose destination first"}</option>
              {areas.map(a => <option key={a.id ?? a.area_name} value={a.area_name}>{a.area_name}</option>)}
            </select>
          </label>
          <label className="nsh-field">
            <span><CalendarDays size={14} /> Check-in</span>
            <input type="date" min={today()} value={checkIn} onChange={e => updateParam("checkIn", e.target.value)} />
          </label>
          <label className="nsh-field">
            <span><CalendarDays size={14} /> Check-out</span>
            <input type="date" min={checkIn || today()} value={checkOut} onChange={e => updateParam("checkOut", e.target.value)} />
          </label>
          <label className="nsh-field is-small">
            <span><BedDouble size={14} /> Rooms</span>
            <select value={roomCount} onChange={e => updateParam("rooms", e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{plural(n, "room", "rooms")}</option>)}
            </select>
          </label>
          <label className="nsh-field is-small">
            <span><Users size={14} /> Guests</span>
            <select value={guests} onChange={e => updateParam("guests", e.target.value)}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{plural(n, "guest", "guests")}</option>)}
            </select>
          </label>
        </form>
        {datesInvalid && <p className="nsh-alert" role="alert">Please select a valid check-in and check-out date.</p>}

        <div className="nsh-layout">
          {filtersOpen && <div className="nsh-filters-backdrop" onClick={() => setFiltersOpen(false)} />}
          <aside className={`nsh-filters ${filtersOpen ? "is-open" : ""}`} aria-label="Filters">
            <div className="nsh-filters-head">
              <h2><SlidersHorizontal size={17} /> Filters</h2>
              {refineCount > 0 && <button type="button" className="nsh-link-btn" onClick={clearRefine}>Clear</button>}
              <button type="button" className="nsh-icon-btn nsh-filters-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={18} /></button>
            </div>

            <div className="nsh-filter-group">
              <label htmlFor="nsh-keyword">Search</label>
              <div className="nsh-input">
                <Search size={16} />
                <input id="nsh-keyword" placeholder="Room or hotel name" value={keyword} onChange={e => setKeyword(e.target.value)} />
                {keyword && <button type="button" aria-label="Clear search" onClick={() => setKeyword("")}><X size={14} /></button>}
              </div>
            </div>

            <div className="nsh-filter-group">
              <div className="nsh-filter-row">
                <label htmlFor="nsh-price">Max price per night</label>
                <strong>{money(effectiveMaxPrice)}</strong>
              </div>
              <input id="nsh-price" type="range" min="1000" max={priceCap} step="500" value={effectiveMaxPrice}
                style={{ "--nsh-fill": `${((effectiveMaxPrice - 1000) / Math.max(1, priceCap - 1000)) * 100}%` }}
                onChange={e => setMaxPrice(Number(e.target.value))} />
              <div className="nsh-range-labels"><span>{money(1000)}</span><span>{money(priceCap)}</span></div>
            </div>

            {roomTypes.length > 1 && (
              <div className="nsh-filter-group">
                <span className="nsh-filter-label">Room type</span>
                <div className="nsh-checks">
                  {roomTypes.map(type => {
                    const count = rooms.filter(room => String(room.room_type || "").trim() === type).length;
                    return (
                      <label key={type} className="nsh-check">
                        <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                        <span>{type}</span>
                        <small>{count}</small>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="button" className="nsh-reset" onClick={resetAll}><RotateCcw size={15} /> Reset all</button>
            <button type="button" className="nsh-apply" onClick={() => setFiltersOpen(false)}>
              Show {plural(results.length, "room", "rooms")}
            </button>
          </aside>

          <section className="nsh-results" aria-live="polite">
            <div className="nsh-results-head">
              <p>
                {loading ? "Searching rooms…" : <><strong>{plural(results.length, "room", "rooms")}</strong> found
                  <span className="nsh-dot" />{plural(roomCount, "room", "rooms")}, {plural(guests, "guest", "guests")}
                  {datesValid && <><span className="nsh-dot" />{plural(nights, "night", "nights")}</>}</>}
              </p>
              <div className="nsh-results-tools">
                <button type="button" className="nsh-filter-toggle" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal size={16} /> Filters{refineCount > 0 && <b>{refineCount}</b>}
                </button>
                <label className="nsh-sort">
                  <span>Sort</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </div>

            {datesValid && !loading && !error && results.length > 0 && (
              <p className="nsh-note">Prices shown for {plural(nights, "night", "nights")}. Availability for your dates is confirmed on the room page.</p>
            )}

            {error ? (
              <div className="nsh-empty" role="alert">
                <h3>Couldn't load rooms</h3>
                <p>{error}</p>
                <button type="button" className="nsh-btn-outline" onClick={() => window.location.reload()}>Try again</button>
              </div>
            ) : !loading && results.length === 0 ? (
              <div className="nsh-empty">
                <BedDouble size={28} />
                <h3>No rooms match your search</h3>
                <p>Try a different destination, fewer guests, or clear some filters.</p>
                <button type="button" className="nsh-btn-outline" onClick={resetAll}><RotateCcw size={15} /> Reset all filters</button>
              </div>
            ) : (
              <div className="nsh-cards">
                {loading ? <ResultSkeletons /> : results.map(room => {
                  const price = roomPrice(room);
                  const original = Number(room.price_per_night || 0);
                  const discounted = room.discounted_price_per_night && price < original;
                  const left = Number(room.online_rooms);
                  const showType = room.room_type && norm(room.room_type) !== norm(room.room_name);
                  const bookingParams = new URLSearchParams({ city: room.city_name || city, area: room.area_name || area, rooms: String(roomCount), guests: String(guests) });
                  if (datesValid) { bookingParams.set("checkIn", checkIn); bookingParams.set("checkOut", checkOut); }
                  return (
                    <Link className="nsh-card" key={`${room.company_id}-${room.id}`}
                      to={`/rooms/${encodeURIComponent(room.hotel_id)}/${encodeURIComponent(room.id)}?${bookingParams}`}>
                      <div className="nsh-card-media">
                        {room.image_url
                          ? <img src={room.image_url} alt={room.room_name} loading="lazy" />
                          : <span className="nsh-card-placeholder"><BedDouble size={40} /></span>}
                        {discounted && <span className="nsh-badge">{Math.round(100 * (original - price) / original)}% off</span>}
                      </div>
                      <div className="nsh-card-body">
                        <span className="nsh-card-place"><MapPin size={13} /> {room.area_name}, {room.city_name}</span>
                        <h3>{room.room_name}</h3>
                        <span className="nsh-card-hotel"><Building2 size={14} /> {room.hotel_name}</span>
                        <div className="nsh-tags">
                          <span><Users size={13} /> Up to {plural(Number(room.capacity), "guest", "guests")}</span>
                          {showType && <span><BedDouble size={13} /> {room.room_type}</span>}
                          {left > 0 && left <= 3 && <span className="is-warn">Only {left} left</span>}
                        </div>
                      </div>
                      <div className="nsh-card-price">
                        <div>
                          {discounted && <s>{money(original)}</s>}
                          <strong>{money(price)}</strong>
                          <small>per room / night</small>
                          {datesValid && <small className="nsh-total">{money(price * roomCount * nights)} total</small>}
                        </div>
                        <span className="nsh-view">View room <ArrowRight size={15} /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
