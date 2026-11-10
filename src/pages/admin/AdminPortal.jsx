// import { useCallback, useEffect, useMemo, useState } from "react";
// import { createPortal } from "react-dom";



// import {

//   Link,

//   NavLink,

//   Outlet,

//   useNavigate,

// } from "react-router-dom";

// import {

//   LayoutDashboard,

//   Hotel,

//   BedDouble,
//   PackagePlus,

//   CalendarCheck,

//   MapPin,

//   Map,

//   Menu,

//   X,

//   Plus,

//   Pencil,

//   Trash2,

//   ArrowLeft,

//   ImagePlus,

//   Users,
//   RefreshCw,

// } from "lucide-react";

// import "./admin.css";





// const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



// export function AdminLayout() {

//   const [open, setOpen] = useState(false);
//   const [isStaff, setIsStaff] = useState(false);
//   const [brand, setBrand] = useState({ name: "NorthernStays", logo: "" });
//   const [logoFailed, setLogoFailed] = useState(false);
//   const brandLogoUrl = brand.logo
//     ? new URL(brand.logo, "https://coreops.pk").href
//     : "";

//   useEffect(() => {
//     const controller = new AbortController();
//     async function loadSessionBrand() {
//       try {
//         const response = await fetch("https://coreops.pk/Hotel/api/login.php", {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ action: "check_session" }),
//           cache: "no-store",
//           signal: controller.signal,
//         });
//         const data = await response.json();
//         if (!response.ok || !data.success || !data.authenticated) return;
//         const user = data.user || {};
//         setIsStaff(user.hotel_role === "hotel_user");
//         setLogoFailed(false);
//         setBrand({
//           name: String(user.company_name || user.hotel_name || "NorthernStays"),
//           logo: String(user.logo_url || "").trim(),
//         });
//       } catch (error) {
//         if (error.name !== "AbortError") console.error("Unable to load hotel branding:", error);
//       }
//     }
//     loadSessionBrand();
//     return () => controller.abort();
//   }, []);
//   return (

//     <div className="ns-admin">

//       <button

//         className="ns-menu"

//         onClick={() => setOpen(!open)}

//         aria-label="Toggle admin menu"

//       >

//         {open ? <X /> : <Menu />}

//       </button>

//       {open && (

//         <button

//           className="ns-backdrop"

//           aria-label="Close menu"

//           onClick={() => setOpen(false)}

//         />

//       )}

//       <aside className={"ns-sidebar " + (open ? "ns-open" : "")}>

//         <div className="ns-brand" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//           {brandLogoUrl && !logoFailed ? (
//             <img
//               src={brandLogoUrl}
//               alt={`${brand.name} logo`}
//               onError={() => {
//                 console.error("Hotel logo could not load:", brandLogoUrl);
//                 setLogoFailed(true);
//               }}
//               style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 10, flexShrink: 0, display: "block" }}
//             />
//           ) : (
//             <Hotel style={{ flexShrink: 0 }} />
//           )}
//           <span style={{ minWidth: 0, overflowWrap: "anywhere", lineHeight: 1.25 }}>
//             {brand.name}
//             <small style={{ display: "block", marginTop: 4 }}>{isStaff ? "HOTEL USER" : "HOTEL ADMIN"}</small>
//           </span>
//         </div>

//         <nav>

//           {[

//             ["/admin", "Dashboard", LayoutDashboard],

//             ["/admin/areas", "Area Management", MapPin],

//             ["/admin/cities", "City Management", Map],

//             ["/admin/hotels", "Hotel Management", Hotel],

//             ["/admin/rooms", "Room Management", BedDouble],
//             ["/admin/addons", "Add-ons Management", PackagePlus],

//             ["/admin/bookings", "Booking Management", CalendarCheck],
//             ["/admin/hotel-users", "Hotel Users Management", Users],

//           ].filter(([url]) => !isStaff || url === "/admin/bookings").map(([url, label, Icon]) => (

//             <NavLink

//               key={url}

//               to={url}

//               end={url === "/admin"}

//               onClick={() => setOpen(false)}

//             >

//               <Icon size={19} />

//               {label}

//             </NavLink>

//           ))}

//         </nav>

//         <Link className="ns-return" to="/">

//           <ArrowLeft size={17} /> Customer Website

//         </Link>

//       </aside>

//       <main className="ns-content">

//         <Outlet />

//       </main>

//     </div>

//   );

// }



// export function AdminDashboard() {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [period, setPeriod] = useState("30");
//   const [hotelId, setHotelId] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     const controller = new AbortController();
//     setLoading(true); setError("");
//     const params = new URLSearchParams({ days: period });
//     if (hotelId) params.set("hotel_id", hotelId);
//     fetch(`https://coreops.pk/Hotel/api/dashboard.php?${params}`, {
//       credentials: "include", cache: "no-store", signal: controller.signal
//     }).then(async (response) => {
//       const result = await response.json().catch(() => ({}));
//       if (response.status === 401 || response.status === 403) {
//         navigate("/admin/login", { replace: true }); return null;
//       }
//       if (!response.ok || !result.success) throw new Error(result.message || "Dashboard could not be loaded.");
//       return result;
//     }).then(result => { if (result && !controller.signal.aborted) setData(result); })
//       .catch(err => { if (err.name !== "AbortError") setError(err.message || "Network error"); })
//       .finally(() => { if (!controller.signal.aborted) setLoading(false); });
//     return () => controller.abort();
//   }, [navigate, period, hotelId, refreshKey]);

//   const n = value => Number(value || 0);
//   const fmt = value => n(value).toLocaleString("en-PK", { maximumFractionDigits: 1 });
//   const pct = value => `${fmt(value)}%`;
//   const colors = ["#174c40", "#b78948", "#3d8977", "#9ab5a9", "#d8b884", "#738b85"];
//   const card = (label, value, subtitle, Icon) => (
//     <article className="nsda-kpi" key={label}>
//       <div className="nsda-kpi-top"><span>{label}</span><Icon size={19} /></div>
//       <strong>{value}</strong><small>{subtitle}</small>
//     </article>
//   );
//   const barChart = (items, valueKey, labelKey, currency = false) => {
//     const max = Math.max(1, ...items.map(item => n(item[valueKey])));
//     return <div className="nsda-bars">{items.map((item, i) => (
//       <div className="nsda-bar-row" key={`${item[labelKey]}-${i}`}>
//         <span title={String(item[labelKey])}>{item[labelKey]}</span>
//         <div className="nsda-track"><div style={{ width: `${Math.max(0, n(item[valueKey]) / max * 100)}%`, background: colors[i % colors.length] }} /></div>
//         <b>{currency ? money(item[valueKey]) : fmt(item[valueKey])}</b>
//       </div>
//     ))}{!items.length && <p className="nsda-empty">No data for this period</p>}</div>;
//   };
//   const chart = (items, key, formatMoney = false) => {
//     const values = items.map(item => n(item[key]));
//     const max = Math.max(1, ...values);
//     const w = 760, h = 185, pad = 18;
//     const coords = values.map((value, i) => `${pad + (values.length === 1 ? 0 : i * (w - pad * 2) / (values.length - 1))},${h - pad - value / max * (h - pad * 2)}`);
//     return <div className="nsda-line-wrap">
//       <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Daily trend chart" preserveAspectRatio="none">
//         {[0, .25, .5, .75, 1].map(v => <line key={v} x1="0" x2={w} y1={pad + v * (h - pad * 2)} y2={pad + v * (h - pad * 2)} stroke="#e5ece8" />)}
//         {coords.length > 1 && <polyline points={coords.join(" ")} fill="none" stroke="#17634f" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
//         {coords.map((point, i) => { const [cx, cy] = point.split(","); return <circle key={i} cx={cx} cy={cy} r="3.2" fill="#17634f"><title>{`${items[i].date}: ${formatMoney ? money(values[i]) : fmt(values[i])}`}</title></circle>; })}
//       </svg>
//       <div className="nsda-axis"><span>{items[0]?.date || "—"}</span><span>{items.at(-1)?.date || "—"}</span></div>
//     </div>;
//   };
//   const section = (title, content, note = "") => <section className="nsda-card"><div className="nsda-card-title"><h2>{title}</h2>{note && <small>{note}</small>}</div>{content}</section>;

//   return <div className="nsda">
//     <div className="ns-heading"><div><span>BUSINESS INTELLIGENCE · LIVE MYSQL</span><h1>{data?.hotel?.hotel_name || "Hotel Analytics"}</h1><p>Bookings, revenue, occupancy, inventory and guest insights.</p></div>
//       <div className="nsda-controls">
//         {data?.hotels?.length > 1 && <select aria-label="Select hotel" value={hotelId} onChange={e => setHotelId(e.target.value)}><option value="">All hotels</option>{data.hotels.map(h => <option value={h.id} key={h.id}>{h.hotel_name}</option>)}</select>}
//         <select aria-label="Date range" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 12 months</option></select>
//         <button className="nsda-refresh" type="button" onClick={() => setRefreshKey(k => k + 1)}><RefreshCw size={16} /> Refresh</button>
//       </div>
//     </div>
//     {error && <section className="ns-panel"><p role="alert">{error}</p><button type="button" className="ns-btn" onClick={() => setRefreshKey(k => k + 1)}>Retry</button></section>}
//     {loading && <section className="ns-panel"><p>Loading analytics...</p></section>}
//     {!loading && data && !error && <>
//       <div className="nsda-kpis">
//         {card("Total bookings", fmt(data.stats.bookings), `${fmt(data.period.bookings)} in selected period`, CalendarCheck)}
//         {card("Completed revenue", money(data.stats.revenue), `${money(data.period.revenue)} in selected period`, LayoutDashboard)}
//         {card("Average booking value", money(data.period.average_booking_value), "Non-cancelled reservations", LayoutDashboard)}
//         {card("Booked room nights", fmt(data.period.room_nights), "Non-cancelled reservations", BedDouble)}
//         {card("Occupancy estimate", pct(data.period.occupancy_rate), "Booked nights ÷ room-night capacity", Hotel)}
//         {card("Cancellation rate", pct(data.period.cancellation_rate), "Cancelled / all period bookings", CalendarCheck)}
//         {card("Online bookings", fmt(data.period.online_bookings), "Website / online sources", CalendarCheck)}
//         {card("Offline bookings", fmt(data.period.offline_bookings), "Walk-in, phone and offline", Users)}
//         {card("Pending requests", fmt(data.stats.pending), "All-time pending", CalendarCheck)}
//         {card("Currently checked in", fmt(data.stats.checked_in), "Not yet checked out", Hotel)}
//         {card("Online inventory", fmt(data.stats.online_rooms), "Rooms enabled for website", BedDouble)}
//         {card("Offline inventory", fmt(data.stats.offline_rooms), "Manual booking rooms", BedDouble)}
//       </div>
//       <div className="nsda-grid nsda-wide">
//         {section("Booking activity", chart(data.daily || [], "bookings"), "By creation date")}
//         {section("Revenue trend", chart(data.daily || [], "revenue", true), "Completed bookings by completion date")}
//       </div>
//       <div className="nsda-grid">
//         {section("Booking status breakdown", barChart(data.status_breakdown || [], "count", "status"))}
//         {section("Booking channels", barChart(data.channel_breakdown || [], "count", "channel"))}
//         {section("Top room types", barChart(data.top_rooms || [], "bookings", "room_name"), "By reservations")}
//         {section("Revenue by room", barChart(data.top_rooms || [], "revenue", "room_name", true), "Completed revenue")}
//         {section("Monthly revenue", barChart(data.monthly || [], "revenue", "month", true), "Last 12 months")}
//         {section("Monthly bookings", barChart(data.monthly || [], "bookings", "month"), "Last 12 months")}
//       </div>
//       <div className="nsda-grid">
//         {section("Operations overview", <div className="nsda-mini-grid">
//           <div><span>Active hotels</span><b>{fmt(data.stats.hotels)}</b></div>
//           <div><span>Total rooms</span><b>{fmt(data.stats.total_rooms)}</b></div>
//           <div><span>Active rooms</span><b>{fmt(data.stats.active_rooms)}</b></div>
//           <div><span>Confirmed</span><b>{fmt(data.stats.confirmed)}</b></div>
//           <div><span>Completed</span><b>{fmt(data.stats.completed)}</b></div>
//           <div><span>Cancelled</span><b>{fmt(data.stats.cancelled)}</b></div>
//           <div><span>Check-ins today</span><b>{fmt(data.stats.checkins_today)}</b></div>
//           <div><span>Check-outs today</span><b>{fmt(data.stats.checkouts_today)}</b></div>
//           <div><span>Arrivals today</span><b>{fmt(data.stats.arrivals_today)}</b></div>
//           <div><span>Departures today</span><b>{fmt(data.stats.departures_today)}</b></div>
//         </div>)}
//         {section("Upcoming arrivals", <div className="nsda-list">{(data.upcoming || []).map(b => <div key={b.id}><div><strong>{b.guest_name}</strong><small>{b.room_name} · {b.booking_reference}</small></div><span>{b.check_in}</span></div>)}{!data.upcoming?.length && <p className="nsda-empty">No upcoming confirmed arrivals</p>}</div>, "Next 7 days")}
//       </div>
//       {section("Recent reservations", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th></tr></thead><tbody>{(data.recent_bookings || []).map(b => <tr key={b.id}><td>{b.booking_reference}</td><td>{b.guest_name}</td><td>{b.room_name || "—"}</td><td>{b.check_in}</td><td>{b.check_out}</td><td>{money(b.total_amount)}</td><td><span className="ns-status">{b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status}</span></td></tr>)}</tbody></table>{!data.recent_bookings?.length && <p className="nsda-empty">No bookings yet</p>}</div>)}
//       {section("Recent rooms", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Room</th><th>Type</th><th>Channel</th><th>Nightly price</th><th>Status</th></tr></thead><tbody>{(data.recent_rooms || []).map(r => <tr key={r.id}><td>{r.room_name}</td><td>{r.room_type || "—"}</td><td>{n(r.online_rooms) > 0 ? "Online" : "Offline"}</td><td>{r.discounted_price_per_night != null && n(r.discounted_price_per_night) < n(r.price_per_night) ? <><s>{money(r.price_per_night)}</s> <strong>{money(r.discounted_price_per_night)}</strong></> : money(r.price_per_night)}</td><td>{r.status}</td></tr>)}</tbody></table></div>)}
//       <p className="ns-note">Revenue counts completed bookings only; it is not verified cash collection. Occupancy is an estimate based on booked room nights, not actual check-in nights. Selected period uses booking creation dates unless stated otherwise.</p>
//     </>}
//     <style>{`
//       .nsda{color:#153c32}.nsda-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.nsda-controls select,.nsda-refresh{padding:11px 13px;border:1px solid #dbe5df;border-radius:10px;background:#fff;color:#153c32;font:inherit}.nsda-refresh{display:flex;gap:7px;align-items:center;cursor:pointer}
//       .nsda-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:20px 0}.nsda-kpi{background:#fff;border:1px solid #e1e8e2;border-radius:14px;padding:20px;min-width:0}.nsda-kpi-top{display:flex;align-items:center;justify-content:space-between;color:#637a71;gap:10px;font-size:13px}.nsda-kpi-top svg{color:#b78b4d}.nsda-kpi strong{display:block;margin:14px 0 8px;font-size:clamp(19px,2vw,28px);overflow-wrap:anywhere}.nsda-kpi small{color:#72867d;font-size:12px}
//       .nsda-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:16px 0}.nsda-card{background:#fff;border:1px solid #e1e8e2;border-radius:14px;padding:20px;min-width:0}.nsda-card-title{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:20px}.nsda-card-title h2{font-size:18px;margin:0}.nsda-card-title small{color:#71857b;font-size:12px}.nsda-bars{display:grid;gap:14px}.nsda-bar-row{display:grid;grid-template-columns:minmax(80px,1fr) minmax(60px,2fr) minmax(55px,auto);gap:12px;align-items:center;font-size:12px}.nsda-bar-row>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nsda-bar-row>b{text-align:right;font-size:12px}.nsda-track{height:11px;background:#eef3ef;border-radius:10px;overflow:hidden}.nsda-track>div{height:100%;border-radius:10px}.nsda-line-wrap svg{width:100%;height:190px;display:block}.nsda-axis{display:flex;justify-content:space-between;color:#82958c;font-size:11px}.nsda-mini-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.nsda-mini-grid>div{background:#f5f8f5;padding:13px;border-radius:10px;display:flex;justify-content:space-between;gap:10px}.nsda-mini-grid span{color:#667d72;font-size:12px}.nsda-mini-grid b{font-size:17px}.nsda-list>div{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #edf1ed}.nsda-list small{display:block;color:#789085;margin-top:4px}.nsda-list>div>span{white-space:nowrap;font-size:12px}.nsda-empty{color:#788b82;font-size:13px;padding:14px 0}.nsda .ns-table-wrap{overflow-x:auto}
//       @media(max-width:1100px){.nsda-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.nsda-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.nsda-grid{grid-template-columns:1fr}.nsda-card{padding:15px}}@media(max-width:440px){.nsda-kpis{grid-template-columns:1fr}.nsda-bar-row{grid-template-columns:85px 1fr auto}}
//     `}</style>
//   </div>;
// }

// // Hotel profile is resolved by the server from the authenticated session.

// const HOTEL_PROFILE_API = "https://coreops.pk/Hotel/api/hotel_profile.php";



// async function hotelProfileRequest(action, fields = {}, signal) {

//   const response = await fetch(HOTEL_PROFILE_API, {

//     method: "POST",

//     credentials: "include",

//     headers: { "Content-Type": "application/json" },

//     body: JSON.stringify({ action, ...fields }),

//     signal,

//   });

//   const result = await response.json();

//   if (!response.ok || !result.success) {

//     throw new Error(result.message || "Unable to load hotel information.");

//   }

//   return result;

// }



// export function AdminHotels() {
//   const [hotels, setHotels] = useState([]);
//   const [canManage, setCanManage] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   const loadHotels = useCallback(async (signal) => {
//     setLoading(true);
//     setError("");
//     try {
//       const result = await hotelProfileRequest("get", {}, signal);
//       if (signal?.aborted) return;
//       setHotels(Array.isArray(result.hotels) ? result.hotels : result.hotel ? [result.hotel] : []);
//       setCanManage(Boolean(result.can_manage));
//     } catch (err) {
//       if (err.name !== "AbortError" && !signal?.aborted) setError(err.message || "Unable to load hotels.");
//     } finally {
//       if (!signal?.aborted) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     loadHotels(controller.signal);
//     return () => controller.abort();
//   }, [loadHotels]);

//   const visibleHotels = hotels.filter((hotel) =>
//     `${hotel.hotel_code || ""} ${hotel.hotel_name || ""} ${hotel.city_name || ""} ${hotel.area_name || ""} ${hotel.address || ""} ${hotel.status || ""}`
//       .toLowerCase().includes(search.trim().toLowerCase())
//   );

//   return (
//     <>
//       <div className="ns-heading">
//         <div>
//           <span>PROPERTY MANAGEMENT</span>
//           <h1>Hotel Management</h1>
//           <p>View and manage hotels registered under your company.</p>
//         </div>
//         <Link className="ns-btn" to="/admin/hotels/add">
//           <Plus size={17} /> Add Hotel
//         </Link>
//       </div>
//       <section className="ns-panel">
//         <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
//           <input
//             className="ns-search"
//             aria-label="Search hotels"
//             placeholder="Search hotel name, code, city or area..."
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             style={{ flex: "1 1 280px", minWidth: 0 }}
//           />
//           <button type="button" className="ns-cancel" onClick={() => loadHotels()} disabled={loading}>
//             <RefreshCw size={16} /> Refresh
//           </button>
//         </div>
//         {error && <p role="alert" className="ns-room-error">{error}</p>}
//         {loading ? (
//           <p>Loading hotels...</p>
//         ) : (
//           <div className="ns-table-wrap">
//             <table className="ns-table">
//               <thead>
//                 <tr>
//                   <th>Hotel Code</th>
//                   <th>Hotel Name</th>
//                   <th>City</th>
//                   <th>Area</th>
//                   <th>Contact</th>
//                   <th>Status</th>
//                   {canManage && <th>Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleHotels.map((hotel) => (
//                   <tr key={hotel.id}>
//                     <td>{hotel.hotel_code || "—"}</td>
//                     <td>
//                       <strong>{hotel.hotel_name}</strong>
//                       <small>{hotel.address || "No address provided"}</small>
//                     </td>
//                     <td>{hotel.city_name || "—"}</td>
//                     <td>{hotel.area_name || "—"}</td>
//                     <td>
//                       {hotel.contact_number || "—"}
//                       <small>{hotel.email || "—"}</small>
//                     </td>
//                     <td><span className="ns-status">{hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status}</span></td>
//                     {canManage && (
//                       <td>
//                         <Link className="ns-cancel" to={`/admin/hotels/${hotel.id}/edit`}>
//                           <Pencil size={15} /> Edit
//                         </Link>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {!visibleHotels.length && (
//               <p className="ns-empty">
//                 {hotels.length ? "No hotels match your search." : "No hotels added yet. Use Add Hotel to register your first property."}
//               </p>
//             )}
//           </div>
//         )}
//       </section>
//     </>
//   );
// }


// export function AdminHotelForm() {

//   const navigate = useNavigate();

//   const [form, setForm] = useState({

//     hotel_name: "",

//     city_id: "",

//     area_id: "",

//     address: "",

//     contact_number: "",

//     email: "",

//     description: "",

//     status: "YES",

//   });

//   const [hotelCode, setHotelCode] = useState("");

//   const [cities, setCities] = useState([]);

//   const [areas, setAreas] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");

//   useEffect(() => {

//     const controller = new AbortController();

//     hotelProfileRequest("get", {}, controller.signal)

//       .then((result) => {

//         const h = result.hotel;

//         setHotelCode(h.hotel_code || "");

//         setForm({

//           hotel_name: h.hotel_name || "",

//           city_id: h.city_id == null ? "" : String(h.city_id),

//           area_id: h.area_id == null ? "" : String(h.area_id),

//           address: h.address || "",

//           contact_number: h.contact_number || "",

//           email: h.email || "",

//           description: h.description || "",

//           status: h.status || "YES",

//         });

//         setCities(result.cities || []);

//         setAreas(result.areas || []);

//       })

//       .catch((err) => {

//         if (err.name !== "AbortError") setError(err.message);

//       })

//       .finally(() => {

//         if (!controller.signal.aborted) setLoading(false);

//       });

//     return () => controller.abort();

//   }, []);

//   const visibleAreas = areas.filter((a) => String(a.city_id) === form.city_id);

//   const update = (event) => {

//     const { name, value } = event.target;

//     setForm((prev) =>

//       name === "city_id"

//         ? { ...prev, city_id: value, area_id: "" }

//         : { ...prev, [name]: value },

//     );

//   };



//   async function submit(event) {

//     event.preventDefault();

//     if (saving) return;

//     setError("");

//     setSaving(true);

//     try {

//       await hotelProfileRequest("update", form);

//       navigate("/admin/hotels", { replace: true });

//     } catch (err) {

//       setError(err.message || "Unable to save hotel.");

//     } finally {

//       setSaving(false);

//     }

//   }



//   return (

//     <>

//       <div className="ns-heading">

//         <div>

//           <span>PROPERTY MANAGEMENT · {hotelCode}</span>

//           <h1>Edit My Hotel</h1>

//           <p>Changes will be saved to your hotel's MySQL record.</p>

//         </div>

//       </div>

//       <section className="ns-panel">

//         {loading ? (

//           <p>Loading hotel details...</p>

//         ) : (

//           <form className="ns-form" onSubmit={submit}>

//             <label>

//               Hotel Name

//               <input

//                 name="hotel_name"

//                 value={form.hotel_name}

//                 onChange={update}

//                 required

//                 maxLength={200}

//               />

//             </label>

//             <label>

//               City

//               <select name="city_id" value={form.city_id} onChange={update}>

//                 <option value="">Select city</option>

//                 {cities.map((c) => (

//                   <option key={c.id} value={String(c.id)}>

//                     {c.city_name}

//                   </option>

//                 ))}

//               </select>

//             </label>

//             <label>

//               Area

//               <select

//                 name="area_id"

//                 value={form.area_id}

//                 onChange={update}

//                 disabled={!form.city_id}

//               >

//                 <option value="">Select area</option>

//                 {visibleAreas.map((a) => (

//                   <option key={a.id} value={String(a.id)}>

//                     {a.area_name}

//                   </option>

//                 ))}

//               </select>

//             </label>

//             <label className="ns-full">

//               Address

//               <input

//                 name="address"

//                 value={form.address}

//                 onChange={update}

//                 placeholder="Complete hotel address"

//               />

//             </label>

//             <label>

//               Contact Number

//               <input

//                 name="contact_number"

//                 value={form.contact_number}

//                 onChange={update}

//                 maxLength={30}

//               />

//             </label>

//             <label>

//               Email

//               <input

//                 name="email"

//                 type="email"

//                 value={form.email}

//                 onChange={update}

//                 maxLength={150}

//               />

//             </label>

//             <label>

//               Status

//               <select name="status" value={form.status} onChange={update}>

//                 <option value="YES">YES</option>

//                 <option value="NO">NO</option>

//                 <option value="Closed">Closed</option>

//               </select>

//             </label>

//             <label className="ns-full">

//               Description

//               <textarea

//                 name="description"

//                 rows={4}

//                 value={form.description}

//                 onChange={update}

//               />

//             </label>

//             {error && (

//               <p role="alert" className="ns-room-error">

//                 {error}

//               </p>

//             )}

//             <div className="ns-form-actions">

//               <Link to="/admin/hotels" className="ns-cancel">

//                 Cancel

//               </Link>

//               <button className="ns-btn" type="submit" disabled={saving}>

//                 {saving ? "Saving..." : "Save Hotel"}

//               </button>

//             </div>

//           </form>

//         )}

//       </section>

//     </>

//   );

// }



// const ROOMS_API = "https://coreops.pk/Hotel/api/rooms.php";
// const ROOM_CITIES_API = "https://coreops.pk/Hotel/api/getCities.php";
// const ROOM_AREAS_API = "https://coreops.pk/Hotel/api/getAreasByCities.php";
// const ROOM_UPLOAD_API = "https://coreops.pk/Hotel/api/uploadRoomImage.php";

// async function roomLocationRequest(url, signal) {
//   const response = await fetch(url, { method: "GET", credentials: "include", cache: "no-store", signal });
//   const result = await response.json();
//   if (!response.ok || !result.success) throw new Error(result.message || "Could not load locations.");
//   return result;
// }


// const blankRoom = {

//   room_type: "", original_room_number: "", price_per_night: "", discounted_price_per_night: "",
//   city_id: "", area_id: "",

//   capacity: "2", availability: "Online", description: "", image_url: "", gallery: [], amenities: [], status: "YES",

// };



// async function roomsRequest(action, fields = {}, signal) {

//   const response = await fetch(ROOMS_API, {

//     method: action === "list" ? "GET" : "POST",

//     credentials: "include",

//     ...(action === "list" ? {} : {

//       headers: { "Content-Type": "application/json" },

//       body: JSON.stringify({ action, ...fields }),

//     }),

//     signal,

//   });

//   let result;

//   try { result = await response.json(); }

//   catch { throw new Error("Server returned an invalid response."); }

//   if (response.status === 401 || response.status === 403) {

//     throw new Error(result.message || "Session expired. Please log in again.");

//   }

//   if (!response.ok || !result.success) {

//     throw new Error(result.message || "Room request failed.");

//   }

//   return result;

// }



// export function AdminRooms() {

//   const navigate = useNavigate();

//   const [rooms, setRooms] = useState([]);
//   const [hotels, setHotels] = useState([]);
//   const [selectedHotelId, setSelectedHotelId] = useState("");
//   const [roomLocation, setRoomLocation] = useState(null);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [locationsLoading, setLocationsLoading] = useState(false);
//   const [locationError, setLocationError] = useState("");
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [imageUploadError, setImageUploadError] = useState("");

//   const [search, setSearch] = useState("");

//   const [editor, setEditor] = useState(null);

//   const [form, setForm] = useState(blankRoom);

//   const [error, setError] = useState("");

//   const [formError, setFormError] = useState("");

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [deletingId, setDeletingId] = useState(null);



//   async function reload(signal, hotelId = selectedHotelId) {

//     const response = await fetch(`${ROOMS_API}${hotelId ? `?hotel_id=${encodeURIComponent(hotelId)}` : ""}`, {
//       method: "GET", credentials: "include", cache: "no-store", signal
//     });
//     const result = await response.json();
//     if (!response.ok || !result.success) throw new Error(result.message || "Unable to load rooms");
//     setHotels(Array.isArray(result.hotels) ? result.hotels : []);
//     // City/area dropdown data is loaded separately from company location APIs.
//     if (!hotelId && result.hotel_id) setSelectedHotelId(String(result.hotel_id));

//     setRooms(Array.isArray(result.rooms) ? result.rooms : []);
//     setRoomLocation(result.location || null);

//   }



//   useEffect(() => {

//     const controller = new AbortController();

//     reload(controller.signal, selectedHotelId)

//       .catch((err) => {

//         if (err.name === "AbortError") return;

//         if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//         else setError(err.message);

//       })

//       .finally(() => { if (!controller.signal.aborted) setLoading(false); });

//     return () => controller.abort();

//   }, [navigate, selectedHotelId]);



//   // Load company-wide locations independently of the selected hotel/rooms response.
//   useEffect(() => {
//     const controller = new AbortController();
//     const loadLocations = async () => {
//       setLocationsLoading(true);
//       setLocationError("");
//       try {
//         const endpoints = [
//           "https://coreops.pk/Hotel/api/cities.php",
//           "https://coreops.pk/Hotel/api/getAreas.php?city_id=all",
//         ];
//         const results = await Promise.all(endpoints.map(async (url) => {
//           const response = await fetch(url, {
//             method: "GET", credentials: "include", cache: "no-store", signal: controller.signal,
//           });
//           const data = await response.json();
//           if (!response.ok || !data.success) throw new Error(data.message || `Unable to load locations (${response.status})`);
//           return data;
//         }));
//         if (controller.signal.aborted) return;
//         const [cityData, areaData] = results;
//         // getAreas includes the cities used by Area Management as a fallback.
//         const cityList = Array.isArray(cityData.cities) && cityData.cities.length
//           ? cityData.cities : (Array.isArray(areaData.cities) ? areaData.cities : []);
//         setCityOptions(cityList);
//         setAreaOptions(Array.isArray(areaData.areas) ? areaData.areas : []);
//       } catch (err) {
//         if (!controller.signal.aborted) setLocationError(err.message || "Unable to load cities and areas.");
//       } finally {
//         if (!controller.signal.aborted) setLocationsLoading(false);
//       }
//     };
//     loadLocations();
//     return () => controller.abort();
//   }, []);

//   // City and area options come from company-scoped location APIs.
//   // Rooms remain tied to one hotel; changing the location filters hotel choices.
//   const filteredAreaOptions = areaOptions.filter(a => String(a.city_id) === String(form.city_id));
//   const matchingHotels = hotels.filter(h =>
//     String(h.city_id) === String(form.city_id) && String(h.area_id) === String(form.area_id)
//   );
//   const cityMatchesHotel = (id) => String(id) === String(roomLocation?.city_id);
//   const areaMatchesHotel = (id) => String(id) === String(roomLocation?.area_id);

//   const visible = rooms.filter((room) =>

//     `${room.room_name} ${room.room_code || ""} ${room.room_type || ""} ${room.original_room_number || room.room_number || ""} ${room.status || ""}`

//       .toLowerCase().includes(search.toLowerCase())

//   );



//   function openNew() {

//     if (!hotels.length) { setError("Add a hotel in Hotel Management first."); return; }
//     setEditor({ id: null });

//     setForm({ ...blankRoom, city_id: "", area_id: "", hotel_id: "" });

//     setFormError("");
//     setImageUploadError("");

//   }



//   function openEdit(room) {

//     if (!selectedHotelId) { setError("Select a hotel first."); return; }
//     setEditor({ id: room.id });

//     setForm({




//       room_type: room.room_type || "",
//       original_room_number: String(room.original_room_number ?? room.room_number ?? ""),

//       price_per_night: String(room.price_per_night ?? ""),
//       discounted_price_per_night: room.discounted_price_per_night == null ? "" : String(room.discounted_price_per_night),

//       capacity: String(room.capacity ?? 2),

//       availability: Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online",

//       description: room.description || "",

//       image_url: room.image_url || "",
//       gallery: Array.isArray(room.gallery) && room.gallery.length ? room.gallery : (room.image_url ? [room.image_url] : []),
//       amenities: Array.isArray(room.amenities) ? room.amenities : [],

//       status: room.status || "YES",
//       city_id: String(roomLocation?.city_id || ""),
//       area_id: String(roomLocation?.area_id || ""),
//       hotel_id: selectedHotelId || "",
//     });

//     setFormError("");
//     setImageUploadError("");

//   }



//   function updateField(key, value) {

//     setForm((previous) => ({ ...previous, [key]: value }));

//   }



//   async function uploadRoomImages(files) {
//     const selected = Array.from(files || []);
//     if (!selected.length) return;
//     if ((form.gallery?.length || 0) + selected.length > 7) {
//       setImageUploadError("Maximum 7 images per room."); return;
//     }
//     setUploadingImage(true);
//     setImageUploadError("");
//     const urls = [];
//     try {
//       for (const file of selected) {
//         if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
//           throw new Error("Only JPG, PNG, WebP images up to 5 MB each are allowed.");
//         }
//         const data = new FormData();
//         data.append("image", file);
//         const response = await fetch(ROOM_UPLOAD_API, { method: "POST", credentials: "include", body: data });
//         const json = await response.json();
//         if (!response.ok || !json.success || !json.image_url) throw new Error(json.message || "Image upload failed.");
//         urls.push(json.image_url);
//       }
//       setForm(prev => {
//         const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
//         return { ...prev, gallery, image_url: gallery[0] || "" };
//       });
//     } catch (err) {
//       // Preserve images that already uploaded successfully.
//       if (urls.length) setForm(prev => {
//         const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
//         return { ...prev, gallery, image_url: gallery[0] || "" };
//       });
//       setImageUploadError(err.message || "Image upload failed.");
//     } finally { setUploadingImage(false); }
//   }

//   function removeGalleryImage(url) {
//     setForm(prev => {
//       const gallery = (prev.gallery || []).filter(item => item !== url);
//       return { ...prev, gallery, image_url: gallery[0] || "" };
//     });
//   }

//   function updateAmenity(index, key, value) {
//     setForm(prev => ({ ...prev, amenities: (prev.amenities || []).map((a, i) => i === index ? { ...a, [key]: value } : a) }));
//   }

//   async function saveRoom(event) {

//     event.preventDefault();

//     if (!editor || saving || uploadingImage) return;

//     const price = Number(form.price_per_night);
//     const discountPrice = form.discounted_price_per_night === "" ? null : Number(form.discounted_price_per_night);

//     const capacity = Number(form.capacity);

//     const online = form.availability === "Online" ? 1 : 0;
//     const offline = form.availability === "Offline" ? 1 : 0;

//     if (!selectedHotelId || !roomLocation || String(form.hotel_id) !== String(selectedHotelId)) {
//       setFormError("Selected city/area must have exactly one registered hotel. Please select a valid location.");
//       return;
//     }
//     if (!form.city_id || !form.area_id ||
//       !cityMatchesHotel(form.city_id) || !areaMatchesHotel(form.area_id)) {
//       setFormError("City and area must match the registered hotel location.");
//       return;
//     }
//     if (!form.room_type.trim() || !form.original_room_number.trim() || form.original_room_number.trim().length > 50 || form.price_per_night === "" ||

//       !Number.isFinite(price) || price < 0 || price > 9999999999.99 ||
//       (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) ||

//       !Number.isInteger(capacity) || capacity < 1 || capacity > 1000 ||

//       !["Online", "Offline"].includes(form.availability)) {

//       setFormError("Enter the Original Room Number, room type, price, guest capacity and availability.");

//       return;

//     }

//     if ((form.gallery || []).length > 7) { setFormError("Maximum 7 images allowed."); return; }
//     if ((form.amenities || []).some(a => !a.name.trim() && a.value.trim())) {
//       setFormError("Enter a name for every amenity value."); return;
//     }
//     setSaving(true);

//     setFormError("");

//     try {

//       await roomsRequest(editor.id == null ? "create" : "update", {

//         ...(editor.id == null ? {} : { id: editor.id }),

//         ...form,
//         hotel_id: selectedHotelId,
//         gallery: form.gallery || [],
//         image_url: form.gallery?.[0] || "",
//         amenities: (form.amenities || []).filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), value: a.value.trim() })),
//         city_id: String(roomLocation.city_id),
//         area_id: String(roomLocation.area_id),

//         original_room_number: form.original_room_number.trim(),
//         room_name: form.room_type.trim(),
//         room_type: form.room_type.trim(),

//         price_per_night: price,
//         discounted_price_per_night: discountPrice,

//         capacity,

//         total_rooms: 1,
//         online_rooms: online,
//         offline_rooms: offline,

//       });

//       await reload();

//       setEditor(null);

//       setError("");

//     } catch (err) {

//       if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//       else setFormError(err.message || "Unable to save room.");

//     } finally { setSaving(false); }

//   }



//   async function deleteRoom(room) {

//     if (deletingId != null || !window.confirm(`Delete ${room.room_name}?`)) return;

//     setDeletingId(room.id);

//     setError("");

//     try {

//       await roomsRequest("delete", { id: room.id, hotel_id: selectedHotelId });

//       await reload();

//     } catch (err) {

//       if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//       else setError(err.message || "Unable to delete room.");

//     } finally { setDeletingId(null); }

//   }



//   return (

//     <>

//       <div className="ns-heading">

//         <div>

//           <span>INVENTORY</span>

//           <h1>Room Management</h1>

//           <p>Add each room separately, with an Online or Offline booking channel.</p>

//         </div>

//         <button type="button" className="ns-btn" onClick={openNew} disabled={!hotels.length}>

//           <Plus size={17} /> Add Room

//         </button>

//       </div>

//       <section className="ns-panel">
//         <div className="ns-room-toolbar">

//           <input aria-label="Search rooms" placeholder="Search room name, number, type or status..."

//             value={search} onChange={(e) => setSearch(e.target.value)} />

//         </div>

//         {error && <p className="ns-room-error" role="alert">{error}</p>}

//         {loading ? <p>Loading rooms...</p> : (

//           <div className="ns-table-wrap" style={{ maxHeight: 390, overflowY: "auto" }}>

//             <table className="ns-table">

//               <thead><tr>

//                 <th>Room Code / Type</th><th>Original Room Number</th><th>Room Type</th><th>Capacity</th><th>Availability</th>

//                 <th>Nightly Price</th><th>Status</th><th>Actions</th>

//               </tr></thead>

//               <tbody>

//                 {visible.map((room) => (

//                   <tr key={room.id}>

//                     <td><div className="ns-room-name">

//                       {room.image_url ? <img src={room.image_url} alt={room.room_name} /> :

//                         <span className="ns-room-image-placeholder"><BedDouble size={22} /></span>}

//                       <div><strong>{room.room_name}</strong><small>{room.room_code || "—"}</small></div>

//                     </div></td>

//                     <td>{room.original_room_number || room.room_number || "—"}</td>
//                     <td>{room.room_type || "—"}</td>

//                     <td><Users size={14} /> {room.capacity}</td>

//                     <td><span className="ns-status">{Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online"}</span></td>

//                     <td>{room.discounted_price_per_night != null && Number(room.discounted_price_per_night) < Number(room.price_per_night) ? <><s style={{ color: "#888" }}>{money(room.price_per_night)}</s><br /><strong style={{ color: "#15803d" }}>{money(room.discounted_price_per_night)}</strong></> : money(room.price_per_night)}</td>

//                     <td><span className="ns-status">{room.status}</span></td>

//                     <td><div className="ns-actions">

//                       <button type="button" onClick={() => openEdit(room)} aria-label={`Edit ${room.room_name}`}><Pencil size={17} /></button>

//                       <button type="button" onClick={() => deleteRoom(room)} disabled={deletingId === room.id}

//                         aria-label={`Delete ${room.room_name}`}><Trash2 size={17} /></button>

//                     </div></td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//             {!visible.length && <p className="ns-empty">No room types found. Add a room to get started.</p>}

//           </div>

//         )}

//       </section>

//       <p className="ns-note">Room inventory is loaded from MySQL for your assigned hotel.</p>

//       {editor && (

//         <div className="ns-room-overlay" role="presentation" onMouseDown={(e) => {

//           if (e.target === e.currentTarget && !saving) setEditor(null);

//         }}>

//           <section className="ns-room-dialog" role="dialog" aria-modal="true"

//             aria-label={editor.id == null ? "Add room" : "Edit room"}>

//             <div className="ns-room-dialog-header">

//               <h2>{editor.id == null ? "Add Room" : "Edit Room"}</h2>

//               <button type="button" disabled={saving} onClick={() => setEditor(null)} aria-label="Close"><X size={20} /></button>

//             </div>

//             <form onSubmit={saveRoom} className="ns-room-form">

//               {locationsLoading && <p>Loading cities and areas...</p>}
//               {locationError && <p role="alert" className="ns-room-error">{locationError}</p>}
//               <div className="ns-room-fields">
//                 <label>City
//                   <select required value={form.city_id}
//                     onChange={(e) => {
//                       setForm(prev => ({ ...prev, city_id: e.target.value, area_id: "", hotel_id: "" }));
//                     }}>
//                     <option value="">Select City</option>
//                     {cityOptions.filter(c => String(c.status || "YES").toUpperCase() === "YES" || String(c.id) === String(form.city_id)).map(city => (
//                       <option key={city.id} value={String(city.id)}>{city.city_name}</option>
//                     ))}
//                   </select>
//                 </label>
//                 <label>Area
//                   <select required value={form.area_id} disabled={!form.city_id}
//                     onChange={(e) => {
//                       const areaId = e.target.value;
//                       const candidates = hotels.filter(h => String(h.city_id) === String(form.city_id) && String(h.area_id) === String(areaId));
//                       const hotelId = candidates.length === 1 ? String(candidates[0].id) : "";
//                       setForm(prev => ({ ...prev, area_id: areaId, hotel_id: hotelId }));
//                       if (hotelId) { setSelectedHotelId(hotelId); setRoomLocation(null); setRooms([]); }
//                     }}>
//                     <option value="">Select Area</option>
//                     {filteredAreaOptions.filter(a => String(a.status || "YES").toUpperCase() === "YES" || String(a.id) === String(form.area_id)).map(area => (
//                       <option key={area.id} value={String(area.id)}>{area.area_name}</option>
//                     ))}
//                   </select>
//                 </label>
//               </div>
//               {form.city_id && form.area_id && matchingHotels.length === 0 && (
//                 <p className="ns-room-error">Is city aur area mein koi registered hotel nahi hai. Pehle Hotel Management mein hotel add karein.</p>
//               )}
//               {form.city_id && form.area_id && matchingHotels.length > 1 && (
//                 <p className="ns-room-error">Is location par multiple hotels hain. Bina hotel select kiye room assign nahi ho sakta; pehle hotel ki location unique karein.</p>
//               )}
//               {locationError && <p className="ns-room-error" role="alert">{locationError}</p>}
//               <div className="ns-room-fields">

//                 <label>Room Type<input required maxLength={100} value={form.room_type} placeholder="e.g. Deluxe"

//                   onChange={(e) => updateField("room_type", e.target.value)} /></label>
//                 <label>Original Room Number<input required maxLength={50} value={form.original_room_number} placeholder="e.g. 101 or A-201"
//                   onChange={(e) => updateField("original_room_number", e.target.value)} /></label>

//               </div>

//               <div className="ns-room-fields">

//                 <label>Price / Night (PKR)<input required type="number" min="0" step="0.01"

//                   value={form.price_per_night} onChange={(e) => updateField("price_per_night", e.target.value)} /></label>

//                 <label>Discounted Price / Night (PKR) — optional<input type="number" min="0" step="0.01"
//                   placeholder="Leave blank for no discount" value={form.discounted_price_per_night}
//                   onChange={(e) => updateField("discounted_price_per_night", e.target.value)} />
//                   {form.discounted_price_per_night !== "" && Number(form.price_per_night) > Number(form.discounted_price_per_night) && <small style={{ display: "block", color: "#15803d" }}>
//                     {Math.round((1 - Number(form.discounted_price_per_night) / Number(form.price_per_night)) * 100)}% OFF · Saves {money(Number(form.price_per_night) - Number(form.discounted_price_per_night))} per night
//                   </small>}
//                 </label>
//                 <label>Guest Capacity<input required type="number" min="1" max="1000" step="1"

//                   value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} /></label>

//               </div>

//               <div className="ns-room-availability">
//                 <strong>Room Availability</strong>
//                 <div style={{ display: "flex", gap: 12, marginTop: 10, marginBottom: 10 }}>
//                   {["Online", "Offline"].map((option) => (
//                     <button key={option} type="button"
//                       aria-pressed={form.availability === option}
//                       onClick={() => updateField("availability", option)}
//                       style={{
//                         flex: 1, padding: "12px 16px", borderRadius: 10,
//                         border: form.availability === option ? "2px solid #2563eb" : "1px solid #cbd5e1",
//                         background: form.availability === option ? "#dbeafe" : "transparent",
//                         color: form.availability === option ? "#1d4ed8" : "inherit",
//                         fontWeight: 700, cursor: "pointer"
//                       }}>
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//                 <small>{form.availability === "Online" ? "Bookable on customer website" : "Manual hotel bookings only"}</small>
//               </div>
//               <label>Status<select value={form.status} onChange={(e) => updateField("status", e.target.value)}>

//                 <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>

//               </select></label>

//               <div className="ns-room-gallery-editor">
//                 <strong>Room Images ({(form.gallery || []).length}/7)</strong>
//                 <p className="ns-note">Upload up to 7 images. First image is the cover.</p>
//                 <label><span><ImagePlus size={16} /> Add images from device</span>
//                   <input type="file" multiple accept="image/jpeg,image/png,image/webp"
//                     disabled={uploadingImage || saving || (form.gallery || []).length >= 7}
//                     onChange={e => { uploadRoomImages(e.target.files); e.target.value = ""; }} />
//                 </label>
//                 <label>Or add image URL
//                   <div className="ns-room-inline">
//                     <input type="url" placeholder="https://example.com/room.jpg" id="ns-room-url" />
//                     <button type="button" className="ns-cancel" onClick={() => {
//                       const input = document.getElementById("ns-room-url");
//                       const url = input?.value.trim();
//                       if (!url) return;
//                       if ((form.gallery || []).length >= 7) { setImageUploadError("Maximum 7 images."); return; }
//                       setForm(prev => { const gallery = [...new Set([...(prev.gallery || []), url])]; return { ...prev, gallery, image_url: gallery[0] }; });
//                       input.value = "";
//                     }}>Add URL</button>
//                   </div>
//                 </label>
//                 {uploadingImage && <p className="ns-note">Uploading images...</p>}
//                 {imageUploadError && <p className="ns-room-error" role="alert">{imageUploadError}</p>}
//                 <div className="ns-room-gallery-grid">
//                   {(form.gallery || []).map((url, i) => <div key={url} className="ns-room-gallery-tile">
//                     <img src={url} alt={`Room image ${i + 1}`} />
//                     <span>{i === 0 ? "Cover" : `Photo ${i + 1}`}</span>
//                     <button type="button" onClick={() => removeGalleryImage(url)} aria-label="Remove image">×</button>
//                   </div>)}
//                 </div>
//               </div>
//               <div className="ns-room-amenities-editor">
//                 <div className="ns-room-amenities-head"><strong>Amenities</strong>
//                   <button type="button" className="ns-cancel" disabled={(form.amenities || []).length >= 60}
//                     onClick={() => setForm(prev => ({ ...prev, amenities: [...(prev.amenities || []), { name: "", value: "" }] }))}>+ Add Amenity</button>
//                 </div>
//                 {(form.amenities || []).map((a, i) => <div className="ns-room-amenity-row" key={i}>
//                   <input aria-label={`Amenity ${i + 1} name`} placeholder="Amenity name (e.g. WiFi)" maxLength={100} value={a.name}
//                     onChange={e => updateAmenity(i, "name", e.target.value)} />
//                   <input aria-label={`Amenity ${i + 1} value`} placeholder="Value (e.g. Free)" maxLength={250} value={a.value}
//                     onChange={e => updateAmenity(i, "value", e.target.value)} />
//                   <button type="button" className="ns-cancel" aria-label="Remove amenity"
//                     onClick={() => setForm(prev => ({ ...prev, amenities: prev.amenities.filter((_, n) => n !== i) }))}>×</button>
//                 </div>)}
//               </div>

//               <label>Description<textarea rows={3} maxLength={20000} value={form.description}

//                 onChange={(e) => updateField("description", e.target.value)} /></label>

//               {formError && <p className="ns-room-error" role="alert">{formError}</p>}

//               <div className="ns-room-actions">

//                 <button type="button" className="ns-cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</button>

//                 <button type="submit" className="ns-btn" disabled={saving || uploadingImage}>{saving ? "Saving..." : "Save Room"}</button>

//               </div>

//             </form>

//           </section>

//         </div>

//       )}

//     </>

//   );

// }



// const BOOKINGS_API = "https://coreops.pk/Hotel/api/bookings.php"



// async function bookingsRequest(action, fields = {}, signal) {

//   const response = await fetch(BOOKINGS_API, {

//     method: action === "list" ? "GET" : "POST",

//     credentials: "include",

//     ...(action === "list" ? {} : {

//       headers: { "Content-Type": "application/json" },

//       body: JSON.stringify({ action, ...fields }),

//     }),

//     signal,

//   });

//   let result;

//   try { result = await response.json(); }

//   catch { throw new Error("Server returned an invalid response."); }

//   if (response.status === 401 || response.status === 403) {

//     throw new Error(result.message || "Session expired. Please log in again.");

//   }

//   if (!response.ok || !result.success) {

//     throw new Error(result.message || "Booking request failed.");

//   }

//   return result;

// }



// export function AdminBookings() {
//   const navigate = useNavigate();
//   const [tab, setTab] = useState("Online");
//   const [bookings, setBookings] = useState([]);
//   const [offlineRooms, setOfflineRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [busyId, setBusyId] = useState(null);
//   const [confirmBooking, setConfirmBooking] = useState(null);
//   const [confirmCnic, setConfirmCnic] = useState("");
//   const [confirmAdults, setConfirmAdults] = useState("");
//   const [confirmError, setConfirmError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");
//   const [form, setForm] = useState({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
//   const channel = (b) => ["Offline", "Walk-in", "Phone"].includes(b.booking_source) ? "Offline" : "Online";
//   const displayStatus = (b) => b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status;
//   const apiCall = async (action, fields = {}) => {
//     const res = await fetch(BOOKINGS_API, {
//       method: action === "list" || action === "rooms" ? "GET" : "POST",
//       credentials: "include",
//       ...(action === "list" || action === "rooms" ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...fields }) }),
//     });
//     const json = await res.json().catch(() => ({}));
//     if (!res.ok || !json.success) {
//       if (res.status === 401) navigate("/admin/login", { replace: true });
//       throw new Error(json.message || "Request failed");
//     }
//     return json;
//   };
//   const loadOfflineRooms = async (signal) => {
//     // Use the same authenticated room inventory API as Room Management.
//     const result = await roomsRequest("list", {}, signal);
//     const allRooms = Array.isArray(result.rooms) ? result.rooms : [];
//     return allRooms.filter((room) =>
//       String(room.status || "").toUpperCase() === "YES" &&
//       Number(room.offline_rooms) > 0
//     );
//   };
//   const refresh = async () => {
//     const [list, rooms] = await Promise.all([
//       bookingsRequest("list"),
//       loadOfflineRooms(),
//     ]);
//     setBookings(Array.isArray(list.bookings) ? list.bookings : []);
//     setOfflineRooms(rooms);
//   };
//   useEffect(() => {
//     const controller = new AbortController();
//     let active = true;
//     Promise.allSettled([
//       bookingsRequest("list", {}, controller.signal),
//       loadOfflineRooms(controller.signal),
//     ]).then(([bookingResult, roomResult]) => {
//       if (!active) return;
//       const errors = [];
//       if (bookingResult.status === "fulfilled") {
//         setBookings(Array.isArray(bookingResult.value.bookings) ? bookingResult.value.bookings : []);
//       } else {
//         errors.push(`Bookings: ${bookingResult.reason?.message || "Could not load bookings"}`);
//       }
//       if (roomResult.status === "fulfilled") {
//         setOfflineRooms(roomResult.value);
//       } else {
//         errors.push(`Rooms: ${roomResult.reason?.message || "Could not load rooms"}`);
//       }
//       if (errors.length) setError(errors.join(" | "));
//       if (errors.some((message) => /session expired/i.test(message))) {
//         navigate("/admin/login", { replace: true });
//       }
//     }).finally(() => { if (active) setLoading(false); });
//     return () => { active = false; controller.abort(); };
//   }, [navigate]);
//   const channelBookings = bookings.filter(b => channel(b) === tab);
//   const statusCounts = {
//     All: channelBookings.length,
//     Pending: channelBookings.filter(b => b.status === "Pending").length,
//     Confirmed: channelBookings.filter(b => b.status === "Confirmed").length,
//     Cancelled: channelBookings.filter(b => b.status === "Cancelled").length,
//   };
//   const filtered = channelBookings.filter(b =>
//     (statusFilter === "All" || b.status === statusFilter) &&
//     `${b.booking_reference} ${b.guest_name} ${b.guest_phone || ""} ${b.room_code || ""} ${b.room_name || ""}`.toLowerCase().includes(search.toLowerCase()));
//   const selectedRoom = offlineRooms.find(r => String(r.id) === String(form.room_id));
//   const submit = async e => {
//     e.preventDefault(); setSaving(true); setError(""); setNotice("");
//     try {
//       if (!selectedRoom) throw new Error("Select an active offline room");
//       if (!form.check_in || !form.check_out || form.check_out <= form.check_in) throw new Error("Check-out must be after check-in.");
//       if (Number(form.guests) > Number(selectedRoom.capacity)) throw new Error("Guests exceed room capacity.");
//       const result = await apiCall("create_manual", { ...form, hotel_id: Number(selectedRoom.hotel_id), room_id: Number(form.room_id), guests: Number(form.guests), room_count: 1 });
//       await refresh(); setShowForm(false); setNotice(`Offline booking ${result.booking_reference} created.`);
//       setForm({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
//     } catch (e) { setError(e.message); } finally { setSaving(false); }
//   };
//   const openConfirmation = (booking) => {
//     setConfirmBooking(booking);
//     setConfirmCnic(booking.guest_cnic || "");
//     setConfirmAdults(booking.number_of_adults ? String(booking.number_of_adults) : "");
//     setConfirmError("");
//   };
//   const submitConfirmation = async (event) => {
//     event.preventDefault();
//     if (!confirmBooking || busyId !== null) return;
//     if (!/^\d{5}-\d{7}-\d$/.test(confirmCnic)) { setConfirmError("CNIC must be in 12345-1234567-1 format."); return; }
//     const adults = Number(confirmAdults);
//     if (!Number.isInteger(adults) || adults < 1 || adults > Number(confirmBooking.guests)) {
//       setConfirmError("Adults must be between 1 and total guests."); return;
//     }
//     setBusyId(confirmBooking.id); setConfirmError(""); setError(""); setNotice("");
//     try {
//       const result = await apiCall("update_status", {
//         id: Number(confirmBooking.id), status: "Confirmed",
//         guest_cnic: confirmCnic, number_of_adults: adults
//       });
//       setConfirmBooking(null);
//       setNotice(result.email_sent ? `Booking ${confirmBooking.booking_reference} confirmed; email submitted.` :
//         `Booking ${confirmBooking.booking_reference} confirmed. ${result.email_warning || "Email not sent."}`);
//       await refresh();
//     } catch (err) { setConfirmError(err.message || "Could not confirm booking."); }
//     finally { setBusyId(null); }
//   };
//   const change = async (b, action, status) => {
//     if (busyId !== null) return;
//     const verb = action === "check_in" ? "check in" : action === "check_out" ? "check out" : status.toLowerCase();
//     if (!window.confirm(`${verb} booking ${b.booking_reference}?`)) return;
//     setBusyId(b.id); setError(""); setNotice("");
//     try { await apiCall(action, { id: Number(b.id), ...(status ? { status } : {}) }); await refresh(); setNotice(`Booking ${b.booking_reference} updated.`); }
//     catch (e) { setError(e.message); } finally { setBusyId(null); }
//   };
//   return <>
//     <div className="ns-heading"><div><span>RESERVATIONS</span><h1>Booking Management</h1><p>Online website bookings and Offline staff bookings.</p></div>
//       {tab === "Offline" && <button className="ns-btn" type="button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> {showForm ? "Close Form" : "Add Offline Booking"}</button>}
//     </div>
//     <section className="ns-panel">
//       <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
//         {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setStatusFilter("All"); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
//       </div>
//       {tab === "Offline" && showForm && <form onSubmit={submit} className="ns-room-form" style={{ marginBottom: 24, padding: 18, border: "1px solid #ddd", borderRadius: 12 }}>
//         <h3>Add Offline Booking</h3>
//         <label>Offline Room<select required value={form.room_id} onChange={e => setForm(p => ({ ...p, room_id: e.target.value }))}><option value="">{loading ? "Loading rooms..." : "Select Room"}</option>{offlineRooms.map(r => <option key={r.id} value={r.id}>{r.hotel_name ? `${r.hotel_name} — ` : ""}{r.room_code || `Room ${r.id}`} — {r.room_type || r.room_name} — Room {r.original_room_number || r.room_number || "—"} — {money(r.price_per_night)}</option>)}</select>{!loading && offlineRooms.length === 0 && <small style={{ display: "block", marginTop: 8 }}>No active Offline rooms found. In Room Management, set a room's availability to Offline and save it.</small>}</label>
//         <div className="ns-room-fields"><label>Guest Name<input required maxLength={150} value={form.guest_name} onChange={e => setForm(p => ({ ...p, guest_name: e.target.value }))} /></label>
//           <label>Phone<input required maxLength={30} value={form.guest_phone} onChange={e => setForm(p => ({ ...p, guest_phone: e.target.value }))} /></label></div>
//         <div className="ns-room-fields"><label>Email (optional)<input type="email" maxLength={150} value={form.guest_email} onChange={e => setForm(p => ({ ...p, guest_email: e.target.value }))} /></label>
//           <label>Guests<input required type="number" min="1" max={selectedRoom?.capacity || 1000} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} /></label></div>
//         <div className="ns-room-fields"><label>Check-In<input required type="date" value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></label>
//           <label>Check-Out<input required type="date" min={form.check_in || undefined} value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></label></div>
//         <div className="ns-room-actions"><button className="ns-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Offline Booking"}</button></div>
//       </form>}
//       <div className="ns-booking-status-filters" role="group" aria-label="Filter bookings by status">
//         {["All", "Pending", "Confirmed", "Cancelled"].map(status => (
//           <button key={status} type="button" className={`ns-booking-filter ${statusFilter === status ? "is-active" : ""}`}
//             aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
//             <span className="ns-booking-filter-label">{status}</span>
//             <strong className="ns-booking-filter-count">{statusCounts[status]}</strong>
//           </button>
//         ))}
//       </div>
//       <div className="ns-booking-toolbar">
//         <input className="ns-search" aria-label="Search bookings" placeholder="Search booking reference, guest or room..." value={search} onChange={e => setSearch(e.target.value)} />
//         <span className="ns-booking-result-count">Showing {filtered.length} booking{filtered.length === 1 ? "" : "s"}</span>
//       </div>
//       {error && <p className="ns-room-error" role="alert">{error}</p>}{notice && <p className="ns-note" role="status">{notice}</p>}
//       {loading ? <p>Loading bookings...</p> : <div className="ns-table-wrap ns-booking-table-scroll"><table className="ns-table ns-booking-table"><thead><tr><th>Booking / Guest</th><th>Room</th><th>Dates</th><th>Selected Add-ons</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
//         {filtered.map(b => <tr key={b.id}><td><strong>{b.booking_reference}</strong><small>{b.guest_name}</small><small>{b.guest_phone}</small></td>
//           <td><strong>{b.room_code || b.room_name || `RM #${b.room_id}`}</strong><small>{b.hotel_name || ""}</small></td>
//           <td>{b.check_in} → {b.check_out}</td>
//           <td>{Array.isArray(b.addons) && b.addons.length ? b.addons.map((a, i) =>
//             <div key={`${a.addon_id}-${i}`} style={{ marginBottom: 5 }}>
//               <strong>{String(a.addon_name ?? "").trim() && String(a.addon_name).trim() !== "0" ? a.addon_name : `Add-on #${a.addon_id}`}</strong><small>{money(a.line_total)}{Number(a.quantity) > 1 ? ` · Qty ${a.quantity}` : ""}</small>
//             </div>) : "—"}</td>
//           <td><strong>{money(b.total_amount)}</strong>{Number(b.addons_subtotal) > 0 && <small>Room: {money(b.room_subtotal)}<br />Add-ons: {money(b.addons_subtotal)}</small>}</td><td>{displayStatus(b)}</td>
//           <td><div className="ns-booking-actions">
//             {b.status === "Pending" && <><button disabled={busyId !== null} className="ns-booking-action ns-booking-confirm" onClick={() => openConfirmation(b)}>Confirm</button><button disabled={busyId !== null} className="ns-booking-action ns-booking-cancel" onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
//             {b.status === "Confirmed" && !b.checked_in_at && <><button disabled={busyId !== null} className="ns-booking-action ns-booking-checkin" onClick={() => change(b, "check_in")}>Check In</button><button disabled={busyId !== null} className="ns-booking-action ns-booking-cancel" onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
//             {b.status === "Confirmed" && b.checked_in_at && !b.checked_out_at && <button disabled={busyId !== null} className="ns-booking-action ns-booking-checkout" onClick={() => change(b, "check_out")}>Check Out</button>}
//           </div></td></tr>)}
//       </tbody></table>{filtered.length === 0 && <p className="ns-empty">No {tab.toLowerCase()} bookings found.</p>}</div>}
//     </section>
//     {confirmBooking && createPortal(<div className="ns-booking-modal-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && busyId === null) setConfirmBooking(null); }}>
//       <section className="ns-booking-modal-dialog ns-confirm-dialog" role="dialog" aria-modal="true" aria-label="Confirm booking">
//         <div className="ns-booking-modal-header"><h2>Review & Confirm Booking</h2>
//           <button type="button" disabled={busyId !== null} onClick={() => setConfirmBooking(null)} aria-label="Close"><X size={20} /></button></div>
//         <form onSubmit={submitConfirmation} className="ns-booking-modal-form">
//           <p className="ns-note">Review all details before confirming. Only CNIC and number of adults can be entered here.</p>
//           <div className="ns-confirm-details">
//             {[
//               ["Booking Reference", confirmBooking.booking_reference], ["Booking Status", confirmBooking.status],
//               ["Customer Name", confirmBooking.guest_name], ["Customer Email", confirmBooking.guest_email || "—"],
//               ["Customer Phone", confirmBooking.guest_phone || "—"], ["Hotel", confirmBooking.hotel_name || "—"],
//               ["Room", `${confirmBooking.room_name || confirmBooking.room_type || "Room"} (${confirmBooking.room_code || confirmBooking.room_number || "—"})`],
//               ["Check-in", confirmBooking.check_in], ["Check-out", confirmBooking.check_out],
//               ["Total Guests", confirmBooking.guests], ["Rooms", confirmBooking.room_count],
//               ["Booking Source", confirmBooking.booking_source || "Online"],
//               ["Room Subtotal", money(confirmBooking.room_subtotal ?? confirmBooking.total_amount)],
//               ["Add-ons Subtotal", money(confirmBooking.addons_subtotal || 0)]
//             ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
//           </div>
//           <div className="ns-confirm-addons"><strong>Selected Add-ons</strong>
//             {Array.isArray(confirmBooking.addons) && confirmBooking.addons.length ? confirmBooking.addons.map((a, i) =>
//               <div key={i}><span>{a.addon_name || `Add-on #${a.addon_id}`} (Qty {a.quantity})</span><strong>{money(a.line_total)}</strong></div>
//             ) : <p>No add-ons selected.</p>}
//           </div>
//           <div className="ns-confirm-total"><span>Grand Total</span><strong>{money(confirmBooking.total_amount)}</strong></div>
//           <div className="ns-room-fields">
//             <label>Customer CNIC Number<input required inputMode="numeric" placeholder="12345-1234567-1" maxLength={15}
//               value={confirmCnic} onChange={e => setConfirmCnic(e.target.value)} /></label>
//             <label>Number of Adults<input required type="number" min="1" max={confirmBooking.guests} step="1"
//               value={confirmAdults} onChange={e => setConfirmAdults(e.target.value)} /></label>
//           </div>
//           {confirmError && <p className="ns-room-error" role="alert">{confirmError}</p>}
//           <div className="ns-booking-modal-actions"><button type="button" className="ns-cancel" disabled={busyId !== null} onClick={() => setConfirmBooking(null)}>Cancel</button>
//             <button type="submit" className="ns-btn" disabled={busyId !== null}>{busyId !== null ? "Confirming..." : "Confirm Booking & Send Email"}</button></div>
//         </form>
//       </section>
//     </div>, document.body)}
//   </>;
// }

// // Area Management is maintained in its own component.
// export { default as AdminAreas } from "./AdminAreas";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";



import {

  Link,

  NavLink,

  Outlet,

  useNavigate,

} from "react-router-dom";

import {

  LayoutDashboard,

  Hotel,

  BedDouble,
  PackagePlus,

  CalendarCheck,

  MapPin,

  Map,

  Menu,

  X,

  Plus,

  Pencil,

  Trash2,

  ArrowLeft,

  ImagePlus,

  Users,
  RefreshCw,

} from "lucide-react";

import "./admin.css";





const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



export function AdminLayout() {

  const [open, setOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [brand, setBrand] = useState({ name: "NorthernStays", logo: "" });
  const [logoFailed, setLogoFailed] = useState(false);
  const brandLogoUrl = brand.logo
    ? new URL(brand.logo, "https://coreops.pk").href
    : "";

  useEffect(() => {
    const controller = new AbortController();
    async function loadSessionBrand() {
      try {
        const response = await fetch("https://coreops.pk/Hotel/api/login.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check_session" }),
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.authenticated) return;
        const user = data.user || {};
        setIsStaff(user.hotel_role === "hotel_user");
        setLogoFailed(false);
        setBrand({
          name: String(user.company_name || user.hotel_name || "NorthernStays"),
          logo: String(user.logo_url || "").trim(),
        });
      } catch (error) {
        if (error.name !== "AbortError") console.error("Unable to load hotel branding:", error);
      }
    }
    loadSessionBrand();
    return () => controller.abort();
  }, []);
  return (

    <div className="ns-admin">

      <button

        className="ns-menu"

        onClick={() => setOpen(!open)}

        aria-label="Toggle admin menu"

      >

        {open ? <X /> : <Menu />}

      </button>

      {open && (

        <button

          className="ns-backdrop"

          aria-label="Close menu"

          onClick={() => setOpen(false)}

        />

      )}

      <aside className={"ns-sidebar " + (open ? "ns-open" : "")}>

        <div className="ns-brand" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {brandLogoUrl && !logoFailed ? (
            <img
              src={brandLogoUrl}
              alt={`${brand.name} logo`}
              onError={() => {
                console.error("Hotel logo could not load:", brandLogoUrl);
                setLogoFailed(true);
              }}
              style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 10, flexShrink: 0, display: "block" }}
            />
          ) : (
            <Hotel style={{ flexShrink: 0 }} />
          )}
          <span style={{ minWidth: 0, overflowWrap: "anywhere", lineHeight: 1.25 }}>
            {brand.name}
            <small style={{ display: "block", marginTop: 4 }}>{isStaff ? "HOTEL USER" : "HOTEL ADMIN"}</small>
          </span>
        </div>

        <nav>

          {[

            ["/admin", "Dashboard", LayoutDashboard],

            ["/admin/areas", "Area Management", MapPin],

            ["/admin/cities", "City Management", Map],

            ["/admin/hotels", "Hotel Management", Hotel],

            ["/admin/rooms", "Room Management", BedDouble],
            ["/admin/addons", "Add-ons Management", PackagePlus],

            ["/admin/bookings", "Booking Management", CalendarCheck],
            ["/admin/hotel-users", "Hotel Users Management", Users],

          ].filter(([url]) => !isStaff || url === "/admin/bookings").map(([url, label, Icon]) => (

            <NavLink

              key={url}

              to={url}

              end={url === "/admin"}

              onClick={() => setOpen(false)}

            >

              <Icon size={19} />

              {label}

            </NavLink>

          ))}

        </nav>

        <Link className="ns-return" to="/">

          <ArrowLeft size={17} /> Customer Website

        </Link>

      </aside>

      <main className="ns-content">

        <Outlet />

      </main>

    </div>

  );

}



export function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30");
  const [hotelId, setHotelId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    const params = new URLSearchParams({ days: period });
    if (hotelId) params.set("hotel_id", hotelId);
    fetch(`https://coreops.pk/Hotel/api/dashboard.php?${params}`, {
      credentials: "include", cache: "no-store", signal: controller.signal
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login", { replace: true }); return null;
      }
      if (!response.ok || !result.success) throw new Error(result.message || "Dashboard could not be loaded.");
      return result;
    }).then(result => { if (result && !controller.signal.aborted) setData(result); })
      .catch(err => { if (err.name !== "AbortError") setError(err.message || "Network error"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [navigate, period, hotelId, refreshKey]);

  const n = value => Number(value || 0);
  const fmt = value => n(value).toLocaleString("en-PK", { maximumFractionDigits: 1 });
  const pct = value => `${fmt(value)}%`;
  const colors = ["#174c40", "#b78948", "#3d8977", "#9ab5a9", "#d8b884", "#738b85"];
  const card = (label, value, subtitle, Icon) => (
    <article className="nsda-kpi" key={label}>
      <div className="nsda-kpi-top"><span>{label}</span><Icon size={19} /></div>
      <strong>{value}</strong><small>{subtitle}</small>
    </article>
  );
  const barChart = (items, valueKey, labelKey, currency = false) => {
    const max = Math.max(1, ...items.map(item => n(item[valueKey])));
    return <div className="nsda-bars">{items.map((item, i) => (
      <div className="nsda-bar-row" key={`${item[labelKey]}-${i}`}>
        <span title={String(item[labelKey])}>{item[labelKey]}</span>
        <div className="nsda-track"><div style={{ width: `${Math.max(0, n(item[valueKey]) / max * 100)}%`, background: colors[i % colors.length] }} /></div>
        <b>{currency ? money(item[valueKey]) : fmt(item[valueKey])}</b>
      </div>
    ))}{!items.length && <p className="nsda-empty">No data for this period</p>}</div>;
  };
  const chart = (items, key, formatMoney = false) => {
    const values = items.map(item => n(item[key]));
    const max = Math.max(1, ...values);
    const w = 760, h = 185, pad = 18;
    const coords = values.map((value, i) => `${pad + (values.length === 1 ? 0 : i * (w - pad * 2) / (values.length - 1))},${h - pad - value / max * (h - pad * 2)}`);
    return <div className="nsda-line-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Daily trend chart" preserveAspectRatio="none">
        {[0, .25, .5, .75, 1].map(v => <line key={v} x1="0" x2={w} y1={pad + v * (h - pad * 2)} y2={pad + v * (h - pad * 2)} stroke="#e5ece8" />)}
        {coords.length > 1 && <polyline points={coords.join(" ")} fill="none" stroke="#17634f" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
        {coords.map((point, i) => { const [cx, cy] = point.split(","); return <circle key={i} cx={cx} cy={cy} r="3.2" fill="#17634f"><title>{`${items[i].date}: ${formatMoney ? money(values[i]) : fmt(values[i])}`}</title></circle>; })}
      </svg>
      <div className="nsda-axis"><span>{items[0]?.date || "—"}</span><span>{items.at(-1)?.date || "—"}</span></div>
    </div>;
  };
  const section = (title, content, note = "") => <section className="nsda-card"><div className="nsda-card-title"><h2>{title}</h2>{note && <small>{note}</small>}</div>{content}</section>;

  return <div className="nsda">
    <div className="ns-heading"><div><span>BUSINESS INTELLIGENCE · LIVE MYSQL</span><h1>{data?.hotel?.hotel_name || "Hotel Analytics"}</h1><p>Bookings, revenue, occupancy, inventory and guest insights.</p></div>
      <div className="nsda-controls">
        {data?.hotels?.length > 1 && <select aria-label="Select hotel" value={hotelId} onChange={e => setHotelId(e.target.value)}><option value="">All hotels</option>{data.hotels.map(h => <option value={h.id} key={h.id}>{h.hotel_name}</option>)}</select>}
        <select aria-label="Date range" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 12 months</option></select>
        <button className="nsda-refresh" type="button" onClick={() => setRefreshKey(k => k + 1)}><RefreshCw size={16} /> Refresh</button>
      </div>
    </div>
    {error && <section className="ns-panel"><p role="alert">{error}</p><button type="button" className="ns-btn" onClick={() => setRefreshKey(k => k + 1)}>Retry</button></section>}
    {loading && <section className="ns-panel"><p>Loading analytics...</p></section>}
    {!loading && data && !error && <>
      <div className="nsda-kpis">
        {card("Total bookings", fmt(data.stats.bookings), `${fmt(data.period.bookings)} in selected period`, CalendarCheck)}
        {card("Completed revenue", money(data.stats.revenue), `${money(data.period.revenue)} in selected period`, LayoutDashboard)}
        {card("Average booking value", money(data.period.average_booking_value), "Non-cancelled reservations", LayoutDashboard)}
        {card("Booked room nights", fmt(data.period.room_nights), "Non-cancelled reservations", BedDouble)}
        {card("Occupancy estimate", pct(data.period.occupancy_rate), "Booked nights ÷ room-night capacity", Hotel)}
        {card("Cancellation rate", pct(data.period.cancellation_rate), "Cancelled / all period bookings", CalendarCheck)}
        {card("Online bookings", fmt(data.period.online_bookings), "Website / online sources", CalendarCheck)}
        {card("Offline bookings", fmt(data.period.offline_bookings), "Walk-in, phone and offline", Users)}
        {card("Pending requests", fmt(data.stats.pending), "All-time pending", CalendarCheck)}
        {card("Currently checked in", fmt(data.stats.checked_in), "Not yet checked out", Hotel)}
        {card("Online inventory", fmt(data.stats.online_rooms), "Rooms enabled for website", BedDouble)}
        {card("Offline inventory", fmt(data.stats.offline_rooms), "Manual booking rooms", BedDouble)}
      </div>
      <div className="nsda-grid nsda-wide">
        {section("Booking activity", chart(data.daily || [], "bookings"), "By creation date")}
        {section("Revenue trend", chart(data.daily || [], "revenue", true), "Completed bookings by completion date")}
      </div>
      <div className="nsda-grid">
        {section("Booking status breakdown", barChart(data.status_breakdown || [], "count", "status"))}
        {section("Booking channels", barChart(data.channel_breakdown || [], "count", "channel"))}
        {section("Top room types", barChart(data.top_rooms || [], "bookings", "room_name"), "By reservations")}
        {section("Revenue by room", barChart(data.top_rooms || [], "revenue", "room_name", true), "Completed revenue")}
        {section("Monthly revenue", barChart(data.monthly || [], "revenue", "month", true), "Last 12 months")}
        {section("Monthly bookings", barChart(data.monthly || [], "bookings", "month"), "Last 12 months")}
      </div>
      <div className="nsda-grid">
        {section("Operations overview", <div className="nsda-mini-grid">
          <div><span>Active hotels</span><b>{fmt(data.stats.hotels)}</b></div>
          <div><span>Total rooms</span><b>{fmt(data.stats.total_rooms)}</b></div>
          <div><span>Active rooms</span><b>{fmt(data.stats.active_rooms)}</b></div>
          <div><span>Confirmed</span><b>{fmt(data.stats.confirmed)}</b></div>
          <div><span>Completed</span><b>{fmt(data.stats.completed)}</b></div>
          <div><span>Cancelled</span><b>{fmt(data.stats.cancelled)}</b></div>
          <div><span>Check-ins today</span><b>{fmt(data.stats.checkins_today)}</b></div>
          <div><span>Check-outs today</span><b>{fmt(data.stats.checkouts_today)}</b></div>
          <div><span>Arrivals today</span><b>{fmt(data.stats.arrivals_today)}</b></div>
          <div><span>Departures today</span><b>{fmt(data.stats.departures_today)}</b></div>
        </div>)}
        {section("Upcoming arrivals", <div className="nsda-list">{(data.upcoming || []).map(b => <div key={b.id}><div><strong>{b.guest_name}</strong><small>{b.room_name} · {b.booking_reference}</small></div><span>{b.check_in}</span></div>)}{!data.upcoming?.length && <p className="nsda-empty">No upcoming confirmed arrivals</p>}</div>, "Next 7 days")}
      </div>
      {section("Recent reservations", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th></tr></thead><tbody>{(data.recent_bookings || []).map(b => <tr key={b.id}><td>{b.booking_reference}</td><td>{b.guest_name}</td><td>{b.room_name || "—"}</td><td>{b.check_in}</td><td>{b.check_out}</td><td>{money(b.total_amount)}</td><td><span className="ns-status">{b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status}</span></td></tr>)}</tbody></table>{!data.recent_bookings?.length && <p className="nsda-empty">No bookings yet</p>}</div>)}
      {section("Recent rooms", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Room</th><th>Type</th><th>Channel</th><th>Nightly price</th><th>Status</th></tr></thead><tbody>{(data.recent_rooms || []).map(r => <tr key={r.id}><td>{r.room_name}</td><td>{r.room_type || "—"}</td><td>{n(r.online_rooms) > 0 ? "Online" : "Offline"}</td><td>{r.discounted_price_per_night != null && n(r.discounted_price_per_night) < n(r.price_per_night) ? <><s>{money(r.price_per_night)}</s> <strong>{money(r.discounted_price_per_night)}</strong></> : money(r.price_per_night)}</td><td>{r.status}</td></tr>)}</tbody></table></div>)}
      <p className="ns-note">Revenue counts completed bookings only; it is not verified cash collection. Occupancy is an estimate based on booked room nights, not actual check-in nights. Selected period uses booking creation dates unless stated otherwise.</p>
    </>}
    <style>{`
      .nsda{color:#153c32}.nsda-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.nsda-controls select,.nsda-refresh{padding:11px 13px;border:1px solid #dbe5df;border-radius:10px;background:#fff;color:#153c32;font:inherit}.nsda-refresh{display:flex;gap:7px;align-items:center;cursor:pointer}
      .nsda-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:20px 0}.nsda-kpi{background:#fff;border:1px solid #e1e8e2;border-radius:14px;padding:20px;min-width:0}.nsda-kpi-top{display:flex;align-items:center;justify-content:space-between;color:#637a71;gap:10px;font-size:13px}.nsda-kpi-top svg{color:#b78b4d}.nsda-kpi strong{display:block;margin:14px 0 8px;font-size:clamp(19px,2vw,28px);overflow-wrap:anywhere}.nsda-kpi small{color:#72867d;font-size:12px}
      .nsda-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:16px 0}.nsda-card{background:#fff;border:1px solid #e1e8e2;border-radius:14px;padding:20px;min-width:0}.nsda-card-title{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:20px}.nsda-card-title h2{font-size:18px;margin:0}.nsda-card-title small{color:#71857b;font-size:12px}.nsda-bars{display:grid;gap:14px}.nsda-bar-row{display:grid;grid-template-columns:minmax(80px,1fr) minmax(60px,2fr) minmax(55px,auto);gap:12px;align-items:center;font-size:12px}.nsda-bar-row>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nsda-bar-row>b{text-align:right;font-size:12px}.nsda-track{height:11px;background:#eef3ef;border-radius:10px;overflow:hidden}.nsda-track>div{height:100%;border-radius:10px}.nsda-line-wrap svg{width:100%;height:190px;display:block}.nsda-axis{display:flex;justify-content:space-between;color:#82958c;font-size:11px}.nsda-mini-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.nsda-mini-grid>div{background:#f5f8f5;padding:13px;border-radius:10px;display:flex;justify-content:space-between;gap:10px}.nsda-mini-grid span{color:#667d72;font-size:12px}.nsda-mini-grid b{font-size:17px}.nsda-list>div{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #edf1ed}.nsda-list small{display:block;color:#789085;margin-top:4px}.nsda-list>div>span{white-space:nowrap;font-size:12px}.nsda-empty{color:#788b82;font-size:13px;padding:14px 0}.nsda .ns-table-wrap{overflow-x:auto}
      @media(max-width:1100px){.nsda-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.nsda-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.nsda-grid{grid-template-columns:1fr}.nsda-card{padding:15px}}@media(max-width:440px){.nsda-kpis{grid-template-columns:1fr}.nsda-bar-row{grid-template-columns:85px 1fr auto}}
    `}</style>
  </div>;
}

// Hotel profile is resolved by the server from the authenticated session.

const HOTEL_PROFILE_API = "https://coreops.pk/Hotel/api/hotel_profile.php";



async function hotelProfileRequest(action, fields = {}, signal) {

  const response = await fetch(HOTEL_PROFILE_API, {

    method: "POST",

    credentials: "include",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ action, ...fields }),

    signal,

  });

  const result = await response.json();

  if (!response.ok || !result.success) {

    throw new Error(result.message || "Unable to load hotel information.");

  }

  return result;

}



export function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadHotels = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const result = await hotelProfileRequest("get", {}, signal);
      if (signal?.aborted) return;
      setHotels(Array.isArray(result.hotels) ? result.hotels : result.hotel ? [result.hotel] : []);
      setCanManage(Boolean(result.can_manage));
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) setError(err.message || "Unable to load hotels.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadHotels(controller.signal);
    return () => controller.abort();
  }, [loadHotels]);

  const visibleHotels = hotels.filter((hotel) =>
    `${hotel.hotel_code || ""} ${hotel.hotel_name || ""} ${hotel.city_name || ""} ${hotel.area_name || ""} ${hotel.address || ""} ${hotel.status || ""}`
      .toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <div className="ns-heading">
        <div>
          <span>PROPERTY MANAGEMENT</span>
          <h1>Hotel Management</h1>
          <p>View and manage hotels registered under your company.</p>
        </div>
        <Link className="ns-btn" to="/admin/hotels/add">
          <Plus size={17} /> Add Hotel
        </Link>
      </div>
      <section className="ns-panel">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <input
            className="ns-search"
            aria-label="Search hotels"
            placeholder="Search hotel name, code, city or area..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ flex: "1 1 280px", minWidth: 0 }}
          />
          <button type="button" className="ns-cancel" onClick={() => loadHotels()} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
        {error && <p role="alert" className="ns-room-error">{error}</p>}
        {loading ? (
          <p>Loading hotels...</p>
        ) : (
          <div className="ns-table-wrap">
            <table className="ns-table">
              <thead>
                <tr>
                  <th>Hotel Code</th>
                  <th>Hotel Name</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Contact</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visibleHotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{hotel.hotel_code || "—"}</td>
                    <td>
                      <strong>{hotel.hotel_name}</strong>
                      <small>{hotel.address || "No address provided"}</small>
                    </td>
                    <td>{hotel.city_name || "—"}</td>
                    <td>{hotel.area_name || "—"}</td>
                    <td>
                      {hotel.contact_number || "—"}
                      <small>{hotel.email || "—"}</small>
                    </td>
                    <td><span className="ns-status">{hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status}</span></td>
                    {canManage && (
                      <td>
                        <Link className="ns-cancel" to={`/admin/hotels/${hotel.id}/edit`}>
                          <Pencil size={15} /> Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleHotels.length && (
              <p className="ns-empty">
                {hotels.length ? "No hotels match your search." : "No hotels added yet. Use Add Hotel to register your first property."}
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}


export function AdminHotelForm() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    hotel_name: "",

    city_id: "",

    area_id: "",

    address: "",

    contact_number: "",

    email: "",

    description: "",

    status: "YES",

  });

  const [hotelCode, setHotelCode] = useState("");

  const [cities, setCities] = useState([]);

  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {

    const controller = new AbortController();

    hotelProfileRequest("get", {}, controller.signal)

      .then((result) => {

        const h = result.hotel;

        setHotelCode(h.hotel_code || "");

        setForm({

          hotel_name: h.hotel_name || "",

          city_id: h.city_id == null ? "" : String(h.city_id),

          area_id: h.area_id == null ? "" : String(h.area_id),

          address: h.address || "",

          contact_number: h.contact_number || "",

          email: h.email || "",

          description: h.description || "",

          status: h.status || "YES",

        });

        setCities(result.cities || []);

        setAreas(result.areas || []);

      })

      .catch((err) => {

        if (err.name !== "AbortError") setError(err.message);

      })

      .finally(() => {

        if (!controller.signal.aborted) setLoading(false);

      });

    return () => controller.abort();

  }, []);

  const visibleAreas = areas.filter((a) => String(a.city_id) === form.city_id);

  const update = (event) => {

    const { name, value } = event.target;

    setForm((prev) =>

      name === "city_id"

        ? { ...prev, city_id: value, area_id: "" }

        : { ...prev, [name]: value },

    );

  };



  async function submit(event) {

    event.preventDefault();

    if (saving) return;

    setError("");

    setSaving(true);

    try {

      await hotelProfileRequest("update", form);

      navigate("/admin/hotels", { replace: true });

    } catch (err) {

      setError(err.message || "Unable to save hotel.");

    } finally {

      setSaving(false);

    }

  }



  return (

    <>

      <div className="ns-heading">

        <div>

          <span>PROPERTY MANAGEMENT · {hotelCode}</span>

          <h1>Edit My Hotel</h1>

          <p>Changes will be saved to your hotel's MySQL record.</p>

        </div>

      </div>

      <section className="ns-panel">

        {loading ? (

          <p>Loading hotel details...</p>

        ) : (

          <form className="ns-form" onSubmit={submit}>

            <label>

              Hotel Name

              <input

                name="hotel_name"

                value={form.hotel_name}

                onChange={update}

                required

                maxLength={200}

              />

            </label>

            <label>

              City

              <select name="city_id" value={form.city_id} onChange={update}>

                <option value="">Select city</option>

                {cities.map((c) => (

                  <option key={c.id} value={String(c.id)}>

                    {c.city_name}

                  </option>

                ))}

              </select>

            </label>

            <label>

              Area

              <select

                name="area_id"

                value={form.area_id}

                onChange={update}

                disabled={!form.city_id}

              >

                <option value="">Select area</option>

                {visibleAreas.map((a) => (

                  <option key={a.id} value={String(a.id)}>

                    {a.area_name}

                  </option>

                ))}

              </select>

            </label>

            <label className="ns-full">

              Address

              <input

                name="address"

                value={form.address}

                onChange={update}

                placeholder="Complete hotel address"

              />

            </label>

            <label>

              Contact Number

              <input

                name="contact_number"

                value={form.contact_number}

                onChange={update}

                maxLength={30}

              />

            </label>

            <label>

              Email

              <input

                name="email"

                type="email"

                value={form.email}

                onChange={update}

                maxLength={150}

              />

            </label>

            <label>

              Status

              <select name="status" value={form.status} onChange={update}>

                <option value="YES">YES</option>

                <option value="NO">NO</option>

                <option value="Closed">Closed</option>

              </select>

            </label>

            <label className="ns-full">

              Description

              <textarea

                name="description"

                rows={4}

                value={form.description}

                onChange={update}

              />

            </label>

            {error && (

              <p role="alert" className="ns-room-error">

                {error}

              </p>

            )}

            <div className="ns-form-actions">

              <Link to="/admin/hotels" className="ns-cancel">

                Cancel

              </Link>

              <button className="ns-btn" type="submit" disabled={saving}>

                {saving ? "Saving..." : "Save Hotel"}

              </button>

            </div>

          </form>

        )}

      </section>

    </>

  );

}



// Room Management is maintained separately in AdminRooms.jsx.
export { AdminRooms } from "./AdminRooms";

const BOOKINGS_API = "https://coreops.pk/Hotel/api/bookings.php"



async function bookingsRequest(action, fields = {}, signal) {

  const response = await fetch(BOOKINGS_API, {

    method: action === "list" ? "GET" : "POST",

    credentials: "include",

    ...(action === "list" ? {} : {

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ action, ...fields }),

    }),

    signal,

  });

  let result;

  try { result = await response.json(); }

  catch { throw new Error("Server returned an invalid response."); }

  if (response.status === 401 || response.status === 403) {

    throw new Error(result.message || "Session expired. Please log in again.");

  }

  if (!response.ok || !result.success) {

    throw new Error(result.message || "Booking request failed.");

  }

  return result;

}



export function AdminBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Online");
  const [bookings, setBookings] = useState([]);
  const [offlineRooms, setOfflineRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmBooking, setConfirmBooking] = useState(null);
  const [confirmCnic, setConfirmCnic] = useState("");
  const [confirmAdults, setConfirmAdults] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
  const channel = (b) => ["Offline", "Walk-in", "Phone"].includes(b.booking_source) ? "Offline" : "Online";
  const displayStatus = (b) => b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status;
  const apiCall = async (action, fields = {}) => {
    const res = await fetch(BOOKINGS_API, {
      method: action === "list" || action === "rooms" ? "GET" : "POST",
      credentials: "include",
      ...(action === "list" || action === "rooms" ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...fields }) }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      if (res.status === 401) navigate("/admin/login", { replace: true });
      throw new Error(json.message || "Request failed");
    }
    return json;
  };
  const loadOfflineRooms = async (signal) => {
    // Use the same authenticated room inventory API as Room Management.
    const result = await roomsRequest("list", {}, signal);
    const allRooms = Array.isArray(result.rooms) ? result.rooms : [];
    return allRooms.filter((room) =>
      String(room.status || "").toUpperCase() === "YES" &&
      Number(room.offline_rooms) > 0
    );
  };
  const refresh = async () => {
    const [list, rooms] = await Promise.all([
      bookingsRequest("list"),
      loadOfflineRooms(),
    ]);
    setBookings(Array.isArray(list.bookings) ? list.bookings : []);
    setOfflineRooms(rooms);
  };
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.allSettled([
      bookingsRequest("list", {}, controller.signal),
      loadOfflineRooms(controller.signal),
    ]).then(([bookingResult, roomResult]) => {
      if (!active) return;
      const errors = [];
      if (bookingResult.status === "fulfilled") {
        setBookings(Array.isArray(bookingResult.value.bookings) ? bookingResult.value.bookings : []);
      } else {
        errors.push(`Bookings: ${bookingResult.reason?.message || "Could not load bookings"}`);
      }
      if (roomResult.status === "fulfilled") {
        setOfflineRooms(roomResult.value);
      } else {
        errors.push(`Rooms: ${roomResult.reason?.message || "Could not load rooms"}`);
      }
      if (errors.length) setError(errors.join(" | "));
      if (errors.some((message) => /session expired/i.test(message))) {
        navigate("/admin/login", { replace: true });
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [navigate]);
  const channelBookings = bookings.filter(b => channel(b) === tab);
  const statusCounts = {
    All: channelBookings.length,
    Pending: channelBookings.filter(b => b.status === "Pending").length,
    Confirmed: channelBookings.filter(b => b.status === "Confirmed").length,
    Cancelled: channelBookings.filter(b => b.status === "Cancelled").length,
  };
  const filtered = channelBookings.filter(b =>
    (statusFilter === "All" || b.status === statusFilter) &&
    `${b.booking_reference} ${b.guest_name} ${b.guest_phone || ""} ${b.room_code || ""} ${b.room_name || ""}`.toLowerCase().includes(search.toLowerCase()));
  const selectedRoom = offlineRooms.find(r => String(r.id) === String(form.room_id));
  const submit = async e => {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      if (!selectedRoom) throw new Error("Select an active offline room");
      if (!form.check_in || !form.check_out || form.check_out <= form.check_in) throw new Error("Check-out must be after check-in.");
      if (Number(form.guests) > Number(selectedRoom.capacity)) throw new Error("Guests exceed room capacity.");
      const result = await apiCall("create_manual", { ...form, hotel_id: Number(selectedRoom.hotel_id), room_id: Number(form.room_id), guests: Number(form.guests), room_count: 1 });
      await refresh(); setShowForm(false); setNotice(`Offline booking ${result.booking_reference} created.`);
      setForm({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  const openConfirmation = (booking) => {
    setConfirmBooking(booking);
    setConfirmCnic(booking.guest_cnic || "");
    setConfirmAdults(booking.number_of_adults ? String(booking.number_of_adults) : "");
    setConfirmError("");
  };
  const submitConfirmation = async (event) => {
    event.preventDefault();
    if (!confirmBooking || busyId !== null) return;
    if (!/^\d{5}-\d{7}-\d$/.test(confirmCnic)) { setConfirmError("CNIC must be in 12345-1234567-1 format."); return; }
    const adults = Number(confirmAdults);
    if (!Number.isInteger(adults) || adults < 1 || adults > Number(confirmBooking.guests)) {
      setConfirmError("Adults must be between 1 and total guests."); return;
    }
    setBusyId(confirmBooking.id); setConfirmError(""); setError(""); setNotice("");
    try {
      const result = await apiCall("update_status", {
        id: Number(confirmBooking.id), status: "Confirmed",
        guest_cnic: confirmCnic, number_of_adults: adults
      });
      setConfirmBooking(null);
      setNotice(result.email_sent ? `Booking ${confirmBooking.booking_reference} confirmed; email submitted.` :
        `Booking ${confirmBooking.booking_reference} confirmed. ${result.email_warning || "Email not sent."}`);
      await refresh();
    } catch (err) { setConfirmError(err.message || "Could not confirm booking."); }
    finally { setBusyId(null); }
  };
  const change = async (b, action, status) => {
    if (busyId !== null) return;
    const verb = action === "check_in" ? "check in" : action === "check_out" ? "check out" : status.toLowerCase();
    if (!window.confirm(`${verb} booking ${b.booking_reference}?`)) return;
    setBusyId(b.id); setError(""); setNotice("");
    try { await apiCall(action, { id: Number(b.id), ...(status ? { status } : {}) }); await refresh(); setNotice(`Booking ${b.booking_reference} updated.`); }
    catch (e) { setError(e.message); } finally { setBusyId(null); }
  };
  return <>
    <div className="ns-heading"><div><span>RESERVATIONS</span><h1>Booking Management</h1><p>Online website bookings and Offline staff bookings.</p></div>
      {tab === "Offline" && <button className="ns-btn" type="button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> {showForm ? "Close Form" : "Add Offline Booking"}</button>}
    </div>
    <section className="ns-panel">
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setStatusFilter("All"); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
      </div>
      {tab === "Offline" && showForm && <form onSubmit={submit} className="ns-room-form" style={{ marginBottom: 24, padding: 18, border: "1px solid #ddd", borderRadius: 12 }}>
        <h3>Add Offline Booking</h3>
        <label>Offline Room<select required value={form.room_id} onChange={e => setForm(p => ({ ...p, room_id: e.target.value }))}><option value="">{loading ? "Loading rooms..." : "Select Room"}</option>{offlineRooms.map(r => <option key={r.id} value={r.id}>{r.hotel_name ? `${r.hotel_name} — ` : ""}{r.room_code || `Room ${r.id}`} — {r.room_type || r.room_name} — Room {r.original_room_number || r.room_number || "—"} — {money(r.price_per_night)}</option>)}</select>{!loading && offlineRooms.length === 0 && <small style={{ display: "block", marginTop: 8 }}>No active Offline rooms found. In Room Management, set a room's availability to Offline and save it.</small>}</label>
        <div className="ns-room-fields"><label>Guest Name<input required maxLength={150} value={form.guest_name} onChange={e => setForm(p => ({ ...p, guest_name: e.target.value }))} /></label>
          <label>Phone<input required maxLength={30} value={form.guest_phone} onChange={e => setForm(p => ({ ...p, guest_phone: e.target.value }))} /></label></div>
        <div className="ns-room-fields"><label>Email (optional)<input type="email" maxLength={150} value={form.guest_email} onChange={e => setForm(p => ({ ...p, guest_email: e.target.value }))} /></label>
          <label>Guests<input required type="number" min="1" max={selectedRoom?.capacity || 1000} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} /></label></div>
        <div className="ns-room-fields"><label>Check-In<input required type="date" value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></label>
          <label>Check-Out<input required type="date" min={form.check_in || undefined} value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></label></div>
        <div className="ns-room-actions"><button className="ns-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Offline Booking"}</button></div>
      </form>}
      <div className="ns-booking-status-filters" role="group" aria-label="Filter bookings by status">
        {["All", "Pending", "Confirmed", "Cancelled"].map(status => (
          <button key={status} type="button" className={`ns-booking-filter ${statusFilter === status ? "is-active" : ""}`}
            aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
            <span className="ns-booking-filter-label">{status}</span>
            <strong className="ns-booking-filter-count">{statusCounts[status]}</strong>
          </button>
        ))}
      </div>
      <div className="ns-booking-toolbar">
        <input className="ns-search" aria-label="Search bookings" placeholder="Search booking reference, guest or room..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className="ns-booking-result-count">Showing {filtered.length} booking{filtered.length === 1 ? "" : "s"}</span>
      </div>
      {error && <p className="ns-room-error" role="alert">{error}</p>}{notice && <p className="ns-note" role="status">{notice}</p>}
      {loading ? <p>Loading bookings...</p> : <div className="ns-table-wrap ns-booking-table-scroll"><table className="ns-table ns-booking-table"><thead><tr><th>Booking / Guest</th><th>Room</th><th>Dates</th><th>Selected Add-ons</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {filtered.map(b => <tr key={b.id}><td><strong>{b.booking_reference}</strong><small>{b.guest_name}</small><small>{b.guest_phone}</small></td>
          <td><strong>{b.room_code || b.room_name || `RM #${b.room_id}`}</strong><small>{b.hotel_name || ""}</small></td>
          <td>{b.check_in} → {b.check_out}</td>
          <td>{Array.isArray(b.addons) && b.addons.length ? b.addons.map((a, i) =>
            <div key={`${a.addon_id}-${i}`} style={{ marginBottom: 5 }}>
              <strong>{String(a.addon_name ?? "").trim() && String(a.addon_name).trim() !== "0" ? a.addon_name : `Add-on #${a.addon_id}`}</strong><small>{money(a.line_total)}{Number(a.quantity) > 1 ? ` · Qty ${a.quantity}` : ""}</small>
            </div>) : "—"}</td>
          <td><strong>{money(b.total_amount)}</strong>{Number(b.addons_subtotal) > 0 && <small>Room: {money(b.room_subtotal)}<br />Add-ons: {money(b.addons_subtotal)}</small>}</td><td>{displayStatus(b)}</td>
          <td><div className="ns-booking-actions">
            {b.status === "Pending" && <><button disabled={busyId !== null} className="ns-booking-action ns-booking-confirm" onClick={() => openConfirmation(b)}>Confirm</button><button disabled={busyId !== null} className="ns-booking-action ns-booking-cancel" onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
            {b.status === "Confirmed" && !b.checked_in_at && <><button disabled={busyId !== null} className="ns-booking-action ns-booking-checkin" onClick={() => change(b, "check_in")}>Check In</button><button disabled={busyId !== null} className="ns-booking-action ns-booking-cancel" onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
            {b.status === "Confirmed" && b.checked_in_at && !b.checked_out_at && <button disabled={busyId !== null} className="ns-booking-action ns-booking-checkout" onClick={() => change(b, "check_out")}>Check Out</button>}
          </div></td></tr>)}
      </tbody></table>{filtered.length === 0 && <p className="ns-empty">No {tab.toLowerCase()} bookings found.</p>}</div>}
    </section>
    {confirmBooking && createPortal(<div className="ns-booking-modal-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && busyId === null) setConfirmBooking(null); }}>
      <section className="ns-booking-modal-dialog ns-confirm-dialog" role="dialog" aria-modal="true" aria-label="Confirm booking">
        <div className="ns-booking-modal-header"><h2>Review & Confirm Booking</h2>
          <button type="button" disabled={busyId !== null} onClick={() => setConfirmBooking(null)} aria-label="Close"><X size={20} /></button></div>
        <form onSubmit={submitConfirmation} className="ns-booking-modal-form">
          <p className="ns-note">Review all details before confirming. Only CNIC and number of adults can be entered here.</p>
          <div className="ns-confirm-details">
            {[
              ["Booking Reference", confirmBooking.booking_reference], ["Booking Status", confirmBooking.status],
              ["Customer Name", confirmBooking.guest_name], ["Customer Email", confirmBooking.guest_email || "—"],
              ["Customer Phone", confirmBooking.guest_phone || "—"], ["Hotel", confirmBooking.hotel_name || "—"],
              ["Room", `${confirmBooking.room_name || confirmBooking.room_type || "Room"} (${confirmBooking.room_code || confirmBooking.room_number || "—"})`],
              ["Check-in", confirmBooking.check_in], ["Check-out", confirmBooking.check_out],
              ["Total Guests", confirmBooking.guests], ["Rooms", confirmBooking.room_count],
              ["Booking Source", confirmBooking.booking_source || "Online"],
              ["Room Subtotal", money(confirmBooking.room_subtotal ?? confirmBooking.total_amount)],
              ["Add-ons Subtotal", money(confirmBooking.addons_subtotal || 0)]
            ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="ns-confirm-addons"><strong>Selected Add-ons</strong>
            {Array.isArray(confirmBooking.addons) && confirmBooking.addons.length ? confirmBooking.addons.map((a, i) =>
              <div key={i}><span>{a.addon_name || `Add-on #${a.addon_id}`} (Qty {a.quantity})</span><strong>{money(a.line_total)}</strong></div>
            ) : <p>No add-ons selected.</p>}
          </div>
          <div className="ns-confirm-total"><span>Grand Total</span><strong>{money(confirmBooking.total_amount)}</strong></div>
          <div className="ns-room-fields">
            <label>Customer CNIC Number<input required inputMode="numeric" placeholder="12345-1234567-1" maxLength={15}
              value={confirmCnic} onChange={e => setConfirmCnic(e.target.value)} /></label>
            <label>Number of Adults<input required type="number" min="1" max={confirmBooking.guests} step="1"
              value={confirmAdults} onChange={e => setConfirmAdults(e.target.value)} /></label>
          </div>
          {confirmError && <p className="ns-room-error" role="alert">{confirmError}</p>}
          <div className="ns-booking-modal-actions"><button type="button" className="ns-cancel" disabled={busyId !== null} onClick={() => setConfirmBooking(null)}>Cancel</button>
            <button type="submit" className="ns-btn" disabled={busyId !== null}>{busyId !== null ? "Confirming..." : "Confirm Booking & Send Email"}</button></div>
        </form>
      </section>
    </div>, document.body)}
  </>;
}

// Area Management is maintained in its own component.
export { default as AdminAreas } from "./AdminAreas";




