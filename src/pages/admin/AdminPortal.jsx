










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
//   KeyRound,

// } from "lucide-react";

// import "./admin.css";





// const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



// export function AdminLayout() {

//   const [open, setOpen] = useState(false);
//   const [showChangePassword, setShowChangePassword] = useState(false);
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

//               onClick={() => { setOpen(false); setShowChangePassword(false); }}

//             >

//               <Icon size={19} />

//               {label}

//             </NavLink>

//           ))}

//           <button
//             type="button"
//             onClick={() => { setShowChangePassword(true); setOpen(false); }}
//             style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", background: showChangePassword ? "#e7f1eb" : "transparent", color: "inherit", border: 0, borderRadius: 8, font: "inherit", cursor: "pointer", textAlign: "left" }}
//           >
//             <KeyRound size={19} /> Change Password
//           </button>
//         </nav>

//         <Link className="ns-return" to="/">

//           <ArrowLeft size={17} /> Customer Website

//         </Link>

//       </aside>

//       <main className="ns-content">

//         {showChangePassword ? (
//           <HotelChangePassword onBack={() => setShowChangePassword(false)} />
//         ) : (
//           <Outlet />
//         )}

//       </main>

//     </div>

//   );

// }




// // Shared password screen for Hotel Admin and Hotel User.
// // Requires an authenticated POST endpoint at /Hotel/api/change_password.php.
// function HotelChangePassword({ onBack }) {
//   const navigate = useNavigate();
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPasswords, setShowPasswords] = useState(false);

//   async function submit(event) {
//     event.preventDefault();
//     if (busy) return;
//     setError("");
//     setSuccess("");

//     // Read actual input values, including values inserted by browser autofill.
//     // This avoids comparing stale React state against what the user sees.
//     const form = event.currentTarget;
//     const currentPassword = form.elements.namedItem("current_password")?.value ?? "";
//     const newPassword = form.elements.namedItem("new_password")?.value ?? "";
//     const confirmPassword = form.elements.namedItem("confirm_password")?.value ?? "";

//     if (newPassword.length < 6) {
//       setError("New password must be at least 6 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setError("New passwords do not match. Please re-enter both fields.");
//       return;
//     }
//     if (currentPassword === newPassword) {
//       setError("Choose a different new password.");
//       return;
//     }

//     setBusy(true);
//     try {
//       const response = await fetch("https://coreops.pk/Hotel/api/change_password.php", {
//         method: "POST",
//         credentials: "include",
//         cache: "no-store",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "change_password",
//           current_password: currentPassword,
//           new_password: newPassword,
//           confirm_password: confirmPassword,
//         }),
//       });
//       const data = await response.json().catch(() => {
//         throw new Error("Password API is unavailable or returned invalid JSON.");
//       });
//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Password could not be changed.");
//       }
//       form.reset();
//       setShowPasswords(false);
//       if (data.relogin_required) {
//         navigate("/admin/login", { replace: true, state: { passwordUpdated: true } });
//         return;
//       }
//       setSuccess(data.message || "Password changed successfully.");
//     } catch (err) {
//       setError(err.message || "Unable to change password.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <>
//       <div className="ns-heading">
//         <div><span>ACCOUNT SECURITY</span><h1>Change Password</h1><p>Update your hotel portal login password.</p></div>
//       </div>
//       <section className="ns-panel" style={{ maxWidth: 560 }}>
//         <form className="ns-form" onSubmit={submit} autoComplete="on" onChange={() => { setError(""); setSuccess(""); }}>
//           <label className="ns-full">Current Password
//             <input name="current_password" type={showPasswords ? "text" : "password"} autoComplete="current-password" required />
//           </label>
//           <label className="ns-full">New Password
//             <input name="new_password" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={6} maxLength={128} required />
//           </label>
//           <label className="ns-full">Confirm New Password
//             <input name="confirm_password" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={6} maxLength={128} required />
//           </label>
//           <div className="ns-full" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
//             <input id="hotel-show-passwords" type="checkbox" checked={showPasswords} onChange={e => setShowPasswords(e.target.checked)} style={{ width: 18, height: 18, margin: 0, flex: "0 0 18px" }} />
//             <label htmlFor="hotel-show-passwords" style={{ display: "inline", width: "auto", margin: 0, cursor: "pointer" }}>Show passwords</label>
//           </div>
//           {error && <p className="ns-room-error ns-full" role="alert">{error}</p>}
//           {success && <p className="ns-note ns-full" role="status">{success}</p>}
//           <div className="ns-form-actions ns-full">
//             <button type="button" className="ns-cancel" onClick={onBack}>Back</button>
//             <button type="submit" className="ns-btn" disabled={busy}>{busy ? "Updating..." : "Change Password"}</button>
//           </div>
//         </form>
//       </section>
//     </>
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
//   const isMultipart = fields instanceof FormData;
//   if (isMultipart) fields.set("action", action);

//   const response = await fetch(HOTEL_PROFILE_API, {

//     method: "POST",

//     credentials: "include",

//     ...(isMultipart ? {} : { headers: { "Content-Type": "application/json" } }),

//     body: isMultipart ? fields : JSON.stringify({ action, ...fields }),

//     signal,

//   });

//   const result = await response.json().catch(() => { throw new Error("Server returned an invalid JSON response."); });

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
//         <div className="ns-hotel-toolbar">
//           <input
//             className="ns-search"
//             aria-label="Search hotels"
//             placeholder="Search hotel name, code, city or area..."
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             style={{ flex: "1 1 280px", minWidth: 0 }}
//           />
//           <button type="button" className="ns-hotel-refresh" onClick={() => loadHotels()} disabled={loading}>
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
//                   <th>Picture</th>
//                   <th>Hotel Code</th>
//                   <th>Hotel Name</th>
//                   <th>City</th>
//                   <th>Area</th>
//                   <th>Contact</th>
//                   <th>Contact Person</th>
//                   <th>Status</th>
//                   {canManage && <th>Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleHotels.map((hotel) => (
//                   <tr key={hotel.id}>
//                     <td>{(hotel.picture_url || hotel.picture || hotel.image_url) ? <img className="ns-hotel-thumb" src={String(hotel.picture_url || hotel.picture || hotel.image_url).startsWith("http") ? (hotel.picture_url || hotel.picture || hotel.image_url) : new URL(hotel.picture_url || hotel.picture || hotel.image_url, "https://coreops.pk").href} alt={hotel.hotel_name || "Hotel"} /> : <span className="ns-hotel-no-photo"><ImagePlus size={19} /></span>}</td>
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
//                     <td>{hotel.contact_person_name || "—"}</td>
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
//   const [picture, setPicture] = useState(null);
//   const [picturePreview, setPicturePreview] = useState("");
//   const [existingPicture, setExistingPicture] = useState("");

//   const [form, setForm] = useState({

//     hotel_name: "",

//     city_id: "",

//     area_id: "",

//     address: "",

//     contact_number: "",

//     email: "",

//     description: "",

//     contact_person_name: "",

//     latitude: "",

//     longitude: "",

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

//         const h = result.hotel || {};
//         setExistingPicture(h.picture_url || h.picture || h.image_url || "");

//         setHotelCode(h.hotel_code || "");

//         setForm({

//           hotel_name: h.hotel_name || "",

//           city_id: h.city_id == null ? "" : String(h.city_id),

//           area_id: h.area_id == null ? "" : String(h.area_id),

//           address: h.address || "",

//           contact_number: h.contact_number || "",

//           email: h.email || "",

//           description: h.description || "",

//           contact_person_name: h.contact_person_name || "",

//           latitude: h.latitude ?? "",

//           longitude: h.longitude ?? "",

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

//   useEffect(() => {
//     if (!picture) { setPicturePreview(""); return; }
//     const url = URL.createObjectURL(picture);
//     setPicturePreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [picture]);

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

//       if (form.latitude !== "" && (!Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) throw new Error("Latitude must be between -90 and 90.");
//       if (form.longitude !== "" && (!Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) throw new Error("Longitude must be between -180 and 180.");
//       const payload = new FormData();
//       Object.entries(form).forEach(([key, value]) => payload.append(key, String(value ?? "")));
//       if (picture) payload.append("picture", picture);
//       await hotelProfileRequest("update", payload);

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
//               Contact Person Name
//               <input name="contact_person_name" value={form.contact_person_name} onChange={update} maxLength={150} placeholder="Hotel contact person" />
//             </label>

//             <label>
//               Latitude
//               <input name="latitude" type="number" step="any" min="-90" max="90" value={form.latitude} onChange={update} placeholder="e.g. 36.3167" />
//             </label>

//             <label>
//               Longitude
//               <input name="longitude" type="number" step="any" min="-180" max="180" value={form.longitude} onChange={update} placeholder="e.g. 74.6500" />
//             </label>

//             <label className="ns-full">
//               Hotel Picture
//               <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
//                 const file = event.target.files?.[0] || null;
//                 if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Only JPG, PNG or WebP images are allowed."); event.target.value = ""; return; }
//                 if (file && file.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller."); event.target.value = ""; return; }
//                 setError(""); setPicture(file);
//               }} />
//               {(picturePreview || existingPicture) && <img className="ns-hotel-preview" src={picturePreview || (existingPicture.startsWith("http") ? existingPicture : new URL(existingPicture, "https://coreops.pk").href)} alt="Hotel preview" />}
//               <small>JPG, PNG or WebP, maximum 5 MB. Leave empty to keep the existing picture.</small>
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



// // Room Management is maintained separately in AdminRooms.jsx.
// export { AdminRooms } from "./AdminRooms";

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
//   const [offlineAddons, setOfflineAddons] = useState([]);
//   const [addonQuantities, setAddonQuantities] = useState({});
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
//   const displayStatus = (b) => {
//     if (b.checked_out_at || ["checked out", "checked_out", "checked-out"].includes(String(b.status || "").toLowerCase())) return "Checked Out";
//     if (b.checked_in_at && !b.checked_out_at) return "Checked In";
//     return b.status;
//   };
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

//   const roomsRequest = async (action, payload = {}, signal) => {
//     const response = await fetch(
//       "https://coreops.pk/Hotel/api/rooms.php",
//       {
//         method: "POST",
//         credentials: "include",
//         cache: "no-store",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action,
//           ...payload,
//         }),
//         signal,
//       }
//     );

//     const data = await response.json().catch(() => ({}));

//     if (response.status === 401) {
//       navigate("/admin/login", { replace: true });
//       throw new Error("Session expired");
//     }

//     if (!response.ok || !data.success) {
//       throw new Error(data.message || "Could not load rooms");
//     }

//     return data;
//   };
//   const loadOfflineRooms = async (signal) => {
//     // rooms.php returns no rooms when the account can access multiple hotels
//     // and hotel_id is omitted. First fetch authorized hotel options, then
//     // request inventory for each hotel separately.
//     const initial = await roomsRequest("list", {}, signal);
//     const hotels = Array.isArray(initial.hotels) ? initial.hotels : [];
//     const responses = hotels.length > 0
//       ? await Promise.all(hotels.map(async (hotel) => {
//         const data = await roomsRequest("list", { hotel_id: Number(hotel.id) }, signal);
//         return (Array.isArray(data.rooms) ? data.rooms : []).map((room) => ({
//           ...room,
//           hotel_id: Number(room.hotel_id || hotel.id),
//           hotel_name: hotel.hotel_name || "",
//           area_name: room.area_name || hotel.area_name || "",
//           city_name: room.city_name || hotel.city_name || "",
//         }));
//       }))
//       : [Array.isArray(initial.rooms) ? initial.rooms : []];
//     // Show all active rooms across authorized hotels, even when their
//     // offline allocation is zero. Booking eligibility is still validated
//     // by the server when the reservation is submitted.
//     return responses.flat().filter((room) =>
//       String(room.status || "").trim().toUpperCase() === "YES"
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
//   const bookingStatuses = ["All", "Pending", "Confirmed", "Cancelled", "Checked In", "Checked Out"];
//   const statusCounts = Object.fromEntries(bookingStatuses.map(status => [
//     status,
//     status === "All" ? channelBookings.length : channelBookings.filter(b => displayStatus(b) === status).length,
//   ]));
//   const filtered = channelBookings.filter(b =>
//     (statusFilter === "All" || displayStatus(b) === statusFilter) &&
//     `${b.booking_reference} ${b.guest_name} ${b.guest_phone || ""} ${b.room_code || ""} ${b.room_name || ""}`.toLowerCase().includes(search.toLowerCase()));
//   const selectedRoom = offlineRooms.find(r => String(r.id) === String(form.room_id));
//   useEffect(() => {
//     setOfflineAddons([]);
//     setAddonQuantities({});
//     if (!form.room_id) return;
//     const room = offlineRooms.find(r => String(r.id) === String(form.room_id));
//     if (!room?.hotel_id) return;
//     const controller = new AbortController();
//     fetch(`https://coreops.pk/Hotel/api/addons.php?hotel_id=${encodeURIComponent(room.hotel_id)}`, {
//       credentials: "include", cache: "no-store", signal: controller.signal,
//     }).then(async res => {
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok || !data.success) throw new Error(data.message || "Could not load add-ons");
//       return data;
//     }).then(data => {
//       if (!controller.signal.aborted) setOfflineAddons((Array.isArray(data.addons) ? data.addons : []).filter(a => String(a.status).toUpperCase() === "YES"));
//     }).catch(err => { if (err.name !== "AbortError") setError(`Add-ons: ${err.message}`); });
//     return () => controller.abort();
//   }, [form.room_id, offlineRooms]);
//   const addonNights = form.check_in && form.check_out && form.check_out > form.check_in
//     ? Math.round((new Date(`${form.check_out}T00:00:00`) - new Date(`${form.check_in}T00:00:00`)) / 86400000) : 0;
//   const addonItems = offlineAddons.filter(a => Number(addonQuantities[a.id] || 0) > 0).map(a => ({
//     addon_id: Number(a.id), quantity: Number(addonQuantities[a.id]),
//     line_total: Number(a.price || 0) * Number(addonQuantities[a.id]) *
//       (a.charge_type === "per_guest_per_night" ? Number(form.guests || 0) * addonNights : a.charge_type === "per_night" ? addonNights : 1),
//   }));
//   const addonTotal = addonItems.reduce((sum, a) => sum + a.line_total, 0);

//   const submit = async e => {
//     e.preventDefault(); setSaving(true); setError(""); setNotice("");
//     try {
//       if (!selectedRoom) throw new Error("Select an active room");
//       if (!form.check_in || !form.check_out || form.check_out <= form.check_in) throw new Error("Check-out must be after check-in.");
//       if (Number(form.guests) > Number(selectedRoom.capacity)) throw new Error("Guests exceed room capacity.");
//       const result = await apiCall("create_manual", { ...form, hotel_id: Number(selectedRoom.hotel_id), room_id: Number(form.room_id), guests: Number(form.guests), room_count: 1, addons: addonItems.map(({ addon_id, quantity }) => ({ addon_id, quantity })) });
//       setShowForm(false);
//       setNotice(`Offline booking ${result.booking_reference} created successfully.`);
//       setForm({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
//       setAddonQuantities({});
//       try {
//         await refresh();
//       } catch (refreshError) {
//         setNotice(`Offline booking ${result.booking_reference} was saved, but the list could not refresh. Please reload to see it.`);
//       }
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
//   return <div className="ns-booking-page">
//     <div className="ns-heading"><div><span>RESERVATIONS</span><h1>Booking Management</h1><p>Online website bookings and Offline staff bookings.</p></div>
//       {tab === "Offline" && <button className="ns-btn" type="button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> {showForm ? "Close Form" : "Add Offline Booking"}</button>}
//     </div>
//     <section className="ns-panel ns-booking-panel">
//       <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
//         {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setStatusFilter("All"); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
//       </div>
//       {tab === "Offline" && showForm && <form onSubmit={submit} className="ns-room-form ns-offline-booking-form" style={{ marginBottom: 12, padding: 18, border: "1px solid #ddd", borderRadius: 12 }}>
//         <h3>Add Offline Booking</h3>
//         <label>Offline Room<select required value={form.room_id} onChange={e => setForm(p => ({ ...p, room_id: e.target.value }))}><option value="">{loading ? "Loading rooms..." : "Select Room"}</option>{offlineRooms.map(r => <option key={r.id} value={r.id}>{r.hotel_name ? `${r.hotel_name} — ` : ""}{[r.area_name, r.city_name].filter(Boolean).join(", ")}{r.area_name || r.city_name ? " — " : ""}{r.room_code || `Room ${r.id}`} — {r.room_type || r.room_name} — Room {r.original_room_number || r.room_number || "—"} — {money(r.price_per_night)}</option>)}</select>{!loading && offlineRooms.length === 0 && <small style={{ display: "block", marginTop: 8 }}>No active rooms found for your assigned hotels.</small>}</label>
//         <div className="ns-room-fields"><label>Guest Name<input required maxLength={150} value={form.guest_name} onChange={e => setForm(p => ({ ...p, guest_name: e.target.value }))} /></label>
//           <label>Phone<input required maxLength={30} value={form.guest_phone} onChange={e => setForm(p => ({ ...p, guest_phone: e.target.value }))} /></label></div>
//         <div className="ns-room-fields"><label>Email (optional)<input type="email" maxLength={150} value={form.guest_email} onChange={e => setForm(p => ({ ...p, guest_email: e.target.value }))} /></label>
//           <label>Guests<input required type="number" min="1" max={selectedRoom?.capacity || 1000} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} /></label></div>
//         <div className="ns-room-fields"><label>Check-In<input required type="date" value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></label>
//           <label>Check-Out<input required type="date" min={form.check_in || undefined} value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></label></div>
//         <div className="ns-full" style={{ marginTop: 12, marginBottom: 14 }}>
//           <h4 style={{ margin: "0 0 10px" }}>Optional Add-ons</h4>
//           {!form.room_id ? <small>Select a room to see its add-ons.</small> : !offlineAddons.length ? <small>No active add-ons for this branch.</small> : (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
//               {offlineAddons.map(a => <label key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 10, border: "1px solid #dbe5df", borderRadius: 9 }}>
//                 <span><strong>{a.addon_name}</strong><small style={{ display: "block" }}>{money(a.price)} · {String(a.charge_type || "per_stay").replaceAll("_", " ")}</small></span>
//                 <input aria-label={`${a.addon_name} quantity`} type="number" min="0" max="99" step="1" value={addonQuantities[a.id] || 0} onChange={e => setAddonQuantities(p => ({ ...p, [a.id]: Math.max(0, Math.min(99, Math.floor(Number(e.target.value) || 0))) }))} style={{ width: 68, flexShrink: 0 }} />
//               </label>)}
//             </div>
//           )}
//           {!!addonItems.length && <p style={{ margin: "10px 0 0", fontWeight: 600 }}>Add-ons subtotal: {money(addonTotal)}{!addonNights && addonItems.some(a => offlineAddons.find(x => Number(x.id) === a.addon_id)?.charge_type !== "per_stay") ? " (select dates for nightly charges)" : ""}</p>}
//         </div>
//         <div className="ns-room-actions"><button className="ns-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Offline Booking"}</button></div>
//       </form>}
//       <style>{`
//         /* Scroll ONLY the expanded Offline Booking form. */
//         .ns-booking-page .ns-booking-panel > form.ns-offline-booking-form {
//           display: block !important;
//           flex: 0 1 auto !important;
//           min-height: 0 !important;
//           max-height: min(64dvh, 620px) !important;
//           overflow-y: auto !important;
//           overflow-x: hidden !important;
//           overscroll-behavior: contain;
//           scrollbar-width: thin;
//           scrollbar-color: #9eb7aa #f3f7f4;
//         }
//         .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar { width: 7px; }
//         .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar-thumb { background: #9eb7aa; border-radius: 8px; }
//         .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar-track { background: #f3f7f4; }
//         @media (max-height: 750px) {
//           .ns-booking-page .ns-booking-panel > form.ns-offline-booking-form {
//             max-height: 48dvh !important;
//           }
//         }
//         /* The count overlays the right edge of the search field, never outside the panel. */
//         .ns-booking-page .ns-booking-toolbar {
//           display: block !important;
//           position: relative !important;
//           width: 100% !important;
//           min-width: 0 !important;
//           max-width: 100% !important;
//           box-sizing: border-box !important;
//         }
//         .ns-booking-page .ns-booking-toolbar > input.ns-search {
//           display: block !important;
//           width: 100% !important;
//           max-width: 100% !important;
//           min-width: 0 !important;
//           box-sizing: border-box !important;
//           padding-right: 150px !important;
//         }
//         .ns-booking-page .ns-booking-toolbar > span.ns-booking-result-count {
//           position: absolute !important;
//           right: 14px !important;
//           top: 50% !important;
//           transform: translateY(-50%) !important;
//           white-space: nowrap !important;
//           width: auto !important;
//           min-width: 0 !important;
//           margin: 0 !important;
//         }
//         /* Compact booking page: remove excessive vertical gaps */
//         .ns-booking-page > .ns-heading { margin: 0 0 10px !important; padding: 0 !important; gap: 4px !important; }
//         .ns-booking-page > .ns-heading h1 { margin: 3px 0 4px !important; line-height: 1.15; }
//         .ns-booking-page > .ns-heading p { margin: 0 !important; }
//         .ns-booking-page .ns-booking-panel { padding: 14px 18px !important; gap: 0 !important; }
//         .ns-booking-page .ns-booking-panel > div:first-child { margin-bottom: 10px !important; }
//         .ns-booking-page .ns-booking-status-filters { margin-bottom: 10px !important; gap: 8px !important; }
//         .ns-booking-page .ns-booking-filter { padding: 9px 10px !important; min-height: 54px !important; }
//         .ns-booking-page .ns-booking-toolbar { margin: 0 0 9px !important; gap: 10px !important; }
//         .ns-booking-page .ns-booking-toolbar .ns-search { padding: 9px 12px !important; min-height: 38px !important; }
//         .ns-booking-page .ns-room-error, .ns-booking-page .ns-note { margin: 3px 0 8px !important; }
//         /* Booking Management only: fit screen and scroll booking rows */
//         .ns-content:has(.ns-booking-page) {
//           height: 100dvh;
//           min-height: 0;
//           overflow: hidden !important;
//           box-sizing: border-box;
//         }
//         .ns-booking-page {
//           height: 100%;
//           min-height: 0;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }
//         .ns-booking-page > .ns-heading { flex: 0 0 auto; }
//         .ns-booking-page .ns-booking-panel {
//           flex: 1 1 auto;
//           min-height: 0;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }
//         .ns-booking-page .ns-booking-table-scroll {
//           flex: 0 1 auto;
//           min-height: 0;
//           max-height: 464px; /* header + approximately 6 compact rows */
//           overflow-y: auto !important;
//           overflow-x: auto !important;
//           overscroll-behavior: contain;
//           scrollbar-width: thin;
//           scrollbar-color: #a8bbb0 #f1f5f2;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-table {
//           border-collapse: separate;
//           border-spacing: 0;
//           width: 100%;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-table thead th {
//           position: sticky;
//           top: 0;
//           z-index: 2;
//           background: #f4f8f5;
//           padding: 10px 12px !important;
//           height: 44px;
//           box-sizing: border-box;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td {
//           padding: 9px 12px !important;
//           height: 70px;
//           box-sizing: border-box;
//           vertical-align: middle;
//           font-size: 12px;
//           line-height: 1.3;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td small {
//           font-size: 10px;
//           line-height: 1.25;
//           margin-top: 3px;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td strong {
//           font-size: 11px;
//           line-height: 1.3;
//         }
//         .ns-booking-page .ns-booking-table-scroll .ns-booking-action {
//           padding: 6px 9px;
//           min-height: 30px;
//           font-size: 11px;
//         }
//         @media (max-height: 750px) {
//           .ns-booking-page .ns-booking-status-filters { margin-bottom: 12px; }
//           .ns-booking-page .ns-booking-status-filters .ns-booking-filter { padding: 9px 8px !important; }
//         }

//         .ns-booking-status-filters {
//           display: grid !important;
//           grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
//           gap: 10px !important;
//           width: 100%;
//           margin-bottom: 22px;
//         }
//         .ns-booking-status-filters .ns-booking-filter {
//           box-sizing: border-box;
//           min-width: 0 !important;
//           width: 100% !important;
//           padding: 13px 10px !important;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 6px;
//           text-align: left;
//         }
//         .ns-booking-status-filters .ns-booking-filter-label {
//           font-size: clamp(10px, .9vw, 13px);
//           white-space: nowrap;
//         }
//         .ns-booking-status-filters .ns-booking-filter-count {
//           flex-shrink: 0;
//           font-size: 13px;
//         }
//         @media (max-width: 900px) {
//           .ns-booking-status-filters { overflow-x: auto; grid-template-columns: repeat(6, minmax(125px, 1fr)) !important; padding-bottom: 6px; }
//         }
//       `}</style>
//       <div className="ns-booking-status-filters" role="group" aria-label="Filter bookings by status">
//         {bookingStatuses.map(status => (
//           <button key={status} type="button" className={`ns-booking-filter ${statusFilter === status ? "is-active" : ""}`}
//             aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
//             <span className="ns-booking-filter-label">{status}</span>
//             <strong className="ns-booking-filter-count">{statusCounts[status]}</strong>
//           </button>
//         ))}
//       </div>
//       <div className="ns-booking-toolbar" style={{
//         position: "relative",
//         display: "block",
//         width: "100%",
//         minWidth: 0,
//         maxWidth: "100%",
//         boxSizing: "border-box",
//         paddingRight: 0,
//         marginBottom: 10
//       }}>
//         <input
//           className="ns-search"
//           aria-label="Search bookings"
//           placeholder="Search booking reference, guest or room..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           style={{
//             display: "block",
//             width: "100%",
//             maxWidth: "100%",
//             minWidth: 0,
//             paddingRight: 150,
//             boxSizing: "border-box"
//           }}
//         />
//         <span className="ns-booking-result-count" style={{
//           position: "absolute",
//           right: 14,
//           top: "50%",
//           transform: "translateY(-50%)",
//           display: "block",
//           width: "auto",
//           maxWidth: "none",
//           minWidth: 0,
//           whiteSpace: "nowrap",
//           margin: 0,
//           padding: 0,
//           fontSize: 12,
//           lineHeight: "18px",
//           pointerEvents: "none",
//           zIndex: 1,
//           background: "#f7faf8"
//         }}>
//           Showing {filtered.length} booking{filtered.length === 1 ? "" : "s"}
//         </span>
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
//   </div>;
// }

// // Area Management is maintained in its own component.
// export { default as AdminAreas } from "./AdminAreas";



















import { API_BASE, apiFetch, readJson } from "../../api/client";
import { useHotelSession } from "../../api/session";
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
  KeyRound,

} from "lucide-react";

import "./admin.css";





const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



export function AdminLayout() {

  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  // Branding comes from the session already verified by HotelSessionProvider,
  // so the layout no longer makes a second check_session request.
  const { user } = useHotelSession();
  const isStaff = user?.hotel_role === "hotel_user";
  const brand = {
    name: String(user?.company_name || user?.hotel_name || "NorthernStays"),
    logo: String(user?.logo_url || "").trim(),
  };
  const [logoFailed, setLogoFailed] = useState(false);
  const brandLogoUrl = brand.logo
    ? new URL(brand.logo, "https://coreops.pk").href
    : "";
  useEffect(() => setLogoFailed(false), [brand.logo]);
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

        <div className="ns-brand">
          <span className="ns-brand-logo">
            {brandLogoUrl && !logoFailed ? (
              <img
                src={brandLogoUrl}
                alt={`${brand.name} logo`}
                onError={() => {
                  console.error("Hotel logo could not load:", brandLogoUrl);
                  setLogoFailed(true);
                }}
              />
            ) : (
              <Hotel size={22} />
            )}
          </span>
          <span className="ns-brand-text">
            <strong title={brand.name}>{brand.name}</strong>
            <small>{isStaff ? "HOTEL USER" : "HOTEL ADMIN"}</small>
          </span>
        </div>

        <nav>
          <p className="ns-nav-label">Menu</p>
          {[
            ["/admin", "Dashboard", LayoutDashboard],
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
              className={({ isActive }) => (isActive && !showChangePassword ? "active" : "")}
              onClick={() => { setOpen(false); setShowChangePassword(false); }}
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          <div className="ns-nav-divider" />
          <p className="ns-nav-label">Account</p>
          <button
            type="button"
            className={`ns-nav-btn ${showChangePassword ? "is-active" : ""}`}
            onClick={() => { setShowChangePassword(true); setOpen(false); }}
          >
            <KeyRound size={19} /> Change Password
          </button>
        </nav>

        <Link className="ns-return" to="/">

          <ArrowLeft size={17} /> Customer Website

        </Link>

      </aside>

      <main className="ns-content">

        {showChangePassword ? (
          <HotelChangePassword onBack={() => setShowChangePassword(false)} />
        ) : (
          <Outlet />
        )}

      </main>

    </div>

  );

}




// Shared password screen for Hotel Admin and Hotel User.
// Requires an authenticated POST endpoint at /Hotel/api/change_password.php.
function HotelChangePassword({ onBack }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setSuccess("");

    // Read actual input values, including values inserted by browser autofill.
    // This avoids comparing stale React state against what the user sees.
    const form = event.currentTarget;
    const currentPassword = form.elements.namedItem("current_password")?.value ?? "";
    const newPassword = form.elements.namedItem("new_password")?.value ?? "";
    const confirmPassword = form.elements.namedItem("confirm_password")?.value ?? "";

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match. Please re-enter both fields.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Choose a different new password.");
      return;
    }

    setBusy(true);
    try {
      const response = await apiFetch(`${API_BASE}/change_password.php`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await response.json().catch(() => {
        throw new Error("Password API is unavailable or returned invalid JSON.");
      });
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Password could not be changed.");
      }
      form.reset();
      setShowPasswords(false);
      if (data.relogin_required) {
        navigate("/admin/login", { replace: true, state: { passwordUpdated: true } });
        return;
      }
      setSuccess(data.message || "Password changed successfully.");
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="ns-heading">
        <div><span>ACCOUNT SECURITY</span><h1>Change Password</h1><p>Update your hotel portal login password.</p></div>
      </div>
      <section className="ns-panel" style={{ maxWidth: 560 }}>
        <form className="ns-form" onSubmit={submit} autoComplete="on" onChange={() => { setError(""); setSuccess(""); }}>
          <label className="ns-full">Current Password
            <input name="current_password" type={showPasswords ? "text" : "password"} autoComplete="current-password" required />
          </label>
          <label className="ns-full">New Password
            <input name="new_password" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={6} maxLength={128} required />
          </label>
          <label className="ns-full">Confirm New Password
            <input name="confirm_password" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={6} maxLength={128} required />
          </label>
          <div className="ns-full" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
            <input id="hotel-show-passwords" type="checkbox" checked={showPasswords} onChange={e => setShowPasswords(e.target.checked)} style={{ width: 18, height: 18, margin: 0, flex: "0 0 18px" }} />
            <label htmlFor="hotel-show-passwords" style={{ display: "inline", width: "auto", margin: 0, cursor: "pointer" }}>Show passwords</label>
          </div>
          {error && <p className="ns-room-error ns-full" role="alert">{error}</p>}
          {success && <p className="ns-note ns-full" role="status">{success}</p>}
          <div className="ns-form-actions ns-full">
            <button type="button" className="ns-cancel" onClick={onBack}>Back</button>
            <button type="submit" className="ns-btn" disabled={busy}>{busy ? "Updating..." : "Change Password"}</button>
          </div>
        </form>
      </section>
    </>
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
    apiFetch(`${API_BASE}/dashboard.php?${params}`, {
      credentials: "include", cache: "no-store", signal: controller.signal
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        throw new Error(result.message || "Dashboard access could not be verified. Please check your session.");
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
      {section("Recent reservations", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th></tr></thead><tbody>{(data.recent_bookings || []).map(b => <tr key={b.id}><td>{b.booking_reference}</td><td>{b.guest_name}</td><td>{b.room_name || "—"}</td><td>{b.check_in}</td><td>{b.check_out}</td><td>{money(b.total_amount)}</td><td><span className="ns-status" data-status={String(b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status).trim().toLowerCase()}>{b.checked_in_at && !b.checked_out_at ? "Checked In" : b.status}</span></td></tr>)}</tbody></table>{!data.recent_bookings?.length && <p className="nsda-empty">No bookings yet</p>}</div>)}
      {section("Recent rooms", <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Room</th><th>Type</th><th>Channel</th><th>Nightly price</th><th>Status</th></tr></thead><tbody>{(data.recent_rooms || []).map(r => <tr key={r.id}><td>{r.room_name}</td><td>{r.room_type || "—"}</td><td>{n(r.online_rooms) > 0 ? "Online" : "Offline"}</td><td>{r.discounted_price_per_night != null && n(r.discounted_price_per_night) < n(r.price_per_night) ? <><s>{money(r.price_per_night)}</s> <strong>{money(r.discounted_price_per_night)}</strong></> : money(r.price_per_night)}</td><td>{r.status}</td></tr>)}</tbody></table></div>)}
      <p className="ns-note">Revenue counts completed bookings only; it is not verified cash collection. Occupancy is an estimate based on booked room nights, not actual check-in nights. Selected period uses booking creation dates unless stated otherwise.</p>
    </>}
  </div>;
}

// Hotel profile is resolved by the server from the authenticated session.

const HOTEL_PROFILE_API = `${API_BASE}/hotel_profile.php`;



async function hotelProfileRequest(action, fields = {}, signal) {
  const isMultipart = fields instanceof FormData;
  if (isMultipart) fields.set("action", action);

  const response = await apiFetch(HOTEL_PROFILE_API, {

    method: "POST",

    credentials: "include",

    ...(isMultipart ? {} : { headers: { "Content-Type": "application/json" } }),

    body: isMultipart ? fields : JSON.stringify({ action, ...fields }),

    signal,

  });

  const result = await response.json().catch(() => { throw new Error("Server returned an invalid JSON response."); });

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
        <div className="ns-hotel-toolbar">
          <input
            className="ns-search"
            aria-label="Search hotels"
            placeholder="Search hotel name, code, city or area..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ flex: "1 1 280px", minWidth: 0 }}
          />
          <button type="button" className="ns-hotel-refresh" onClick={() => loadHotels()} disabled={loading}>
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
                  <th>Picture</th>
                  <th>Hotel Code</th>
                  <th>Hotel Name</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Contact</th>
                  <th>Contact Person</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visibleHotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{(hotel.picture_url || hotel.picture || hotel.image_url) ? <img className="ns-hotel-thumb" src={String(hotel.picture_url || hotel.picture || hotel.image_url).startsWith("http") ? (hotel.picture_url || hotel.picture || hotel.image_url) : new URL(hotel.picture_url || hotel.picture || hotel.image_url, "https://coreops.pk").href} alt={hotel.hotel_name || "Hotel"} /> : <span className="ns-hotel-no-photo"><ImagePlus size={19} /></span>}</td>
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
                    <td>{hotel.contact_person_name || "—"}</td>
                    <td><span className="ns-status" data-status={String(hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status).trim().toLowerCase()}>{hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status}</span></td>
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
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");
  const [existingPicture, setExistingPicture] = useState("");

  const [form, setForm] = useState({

    hotel_name: "",

    city_id: "",

    area_id: "",

    address: "",

    contact_number: "",

    email: "",

    description: "",

    contact_person_name: "",

    latitude: "",

    longitude: "",

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

        const h = result.hotel || {};
        setExistingPicture(h.picture_url || h.picture || h.image_url || "");

        setHotelCode(h.hotel_code || "");

        setForm({

          hotel_name: h.hotel_name || "",

          city_id: h.city_id == null ? "" : String(h.city_id),

          area_id: h.area_id == null ? "" : String(h.area_id),

          address: h.address || "",

          contact_number: h.contact_number || "",

          email: h.email || "",

          description: h.description || "",

          contact_person_name: h.contact_person_name || "",

          latitude: h.latitude ?? "",

          longitude: h.longitude ?? "",

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

  useEffect(() => {
    if (!picture) { setPicturePreview(""); return; }
    const url = URL.createObjectURL(picture);
    setPicturePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [picture]);

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

      if (form.latitude !== "" && (!Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) throw new Error("Latitude must be between -90 and 90.");
      if (form.longitude !== "" && (!Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) throw new Error("Longitude must be between -180 and 180.");
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, String(value ?? "")));
      if (picture) payload.append("picture", picture);
      await hotelProfileRequest("update", payload);

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
              Contact Person Name
              <input name="contact_person_name" value={form.contact_person_name} onChange={update} maxLength={150} placeholder="Hotel contact person" />
            </label>

            <label>
              Latitude
              <input name="latitude" type="number" step="any" min="-90" max="90" value={form.latitude} onChange={update} placeholder="e.g. 36.3167" />
            </label>

            <label>
              Longitude
              <input name="longitude" type="number" step="any" min="-180" max="180" value={form.longitude} onChange={update} placeholder="e.g. 74.6500" />
            </label>

            <label className="ns-full">
              Hotel Picture
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                const file = event.target.files?.[0] || null;
                if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Only JPG, PNG or WebP images are allowed."); event.target.value = ""; return; }
                if (file && file.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller."); event.target.value = ""; return; }
                setError(""); setPicture(file);
              }} />
              {(picturePreview || existingPicture) && <img className="ns-hotel-preview" src={picturePreview || (existingPicture.startsWith("http") ? existingPicture : new URL(existingPicture, "https://coreops.pk").href)} alt="Hotel preview" />}
              <small>JPG, PNG or WebP, maximum 5 MB. Leave empty to keep the existing picture.</small>
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

const BOOKINGS_API = `${API_BASE}/bookings.php`



async function bookingsRequest(action, fields = {}, signal) {

  const response = await apiFetch(BOOKINGS_API, {

    method: action === "list" ? "GET" : "POST",

    credentials: "include",

    ...(action === "list" ? {} : {

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ action, ...fields }),

    }),

    signal,

  });

  let result;

  result = await readJson(response);

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
  const [offlineAddons, setOfflineAddons] = useState([]);
  const [addonQuantities, setAddonQuantities] = useState({});
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
  const displayStatus = (b) => {
    if (b.checked_out_at || ["checked out", "checked_out", "checked-out"].includes(String(b.status || "").toLowerCase())) return "Checked Out";
    if (b.checked_in_at && !b.checked_out_at) return "Checked In";
    return b.status;
  };
  const apiCall = async (action, fields = {}) => {
    const res = await apiFetch(BOOKINGS_API, {
      method: action === "list" || action === "rooms" ? "GET" : "POST",
      credentials: "include",
      ...(action === "list" || action === "rooms" ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...fields }) }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Booking request failed (HTTP ${res.status})`);
    }
    return json;
  };

  const roomsRequest = async (action, payload = {}, signal) => {
    const response = await apiFetch(
      `${API_BASE}/rooms.php`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...payload,
        }),
        signal,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new Error(data.message || "Rooms API authentication failed (HTTP 401). Please verify your login session.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not load rooms");
    }

    return data;
  };
  const loadOfflineRooms = async (signal) => {
    // rooms.php returns no rooms when the account can access multiple hotels
    // and hotel_id is omitted. First fetch authorized hotel options, then
    // request inventory for each hotel separately.
    const initial = await roomsRequest("list", {}, signal);
    const hotels = Array.isArray(initial.hotels) ? initial.hotels : [];
    const responses = Array.isArray(initial.rooms) && initial.rooms.length > 0
      ? [initial.rooms]
      : hotels.length > 0
        ? await Promise.all(hotels.map(async (hotel) => {
          const data = await roomsRequest("list", { hotel_id: Number(hotel.id) }, signal);
          return (Array.isArray(data.rooms) ? data.rooms : []).map((room) => ({
            ...room,
            hotel_id: Number(room.hotel_id || hotel.id),
            hotel_name: hotel.hotel_name || "",
            area_name: room.area_name || hotel.area_name || "",
            city_name: room.city_name || hotel.city_name || "",
          }));
        }))
        : [Array.isArray(initial.rooms) ? initial.rooms : []];
    // Only active rooms allocated to the Offline channel. Online rooms are
    // sold on the customer website and must not appear in the staff form.
    // bookings.php enforces the same rule when the booking is saved.
    return responses.flat().filter((room) =>
      String(room.status || "").trim().toUpperCase() === "YES" &&
      Number(room.offline_rooms || 0) > 0
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
      // Show the API error instead of forcing logout from a secondary rooms request.
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [navigate]);
  const channelBookings = bookings.filter(b => channel(b) === tab);
  const bookingStatuses = ["All", "Pending", "Confirmed", "Cancelled", "Checked In", "Checked Out"];
  const statusCounts = Object.fromEntries(bookingStatuses.map(status => [
    status,
    status === "All" ? channelBookings.length : channelBookings.filter(b => displayStatus(b) === status).length,
  ]));
  const filtered = channelBookings.filter(b =>
    (statusFilter === "All" || displayStatus(b) === statusFilter) &&
    `${b.booking_reference} ${b.guest_name} ${b.guest_phone || ""} ${b.room_code || ""} ${b.room_name || ""}`.toLowerCase().includes(search.toLowerCase()));
  const selectedRoom = offlineRooms.find(r => String(r.id) === String(form.room_id));
  // Check date availability as soon as room, dates and guests are chosen,
  // using the same checkRoomAvailability.php endpoint as the website.
  // bookings.php re-checks under a row lock when the booking is saved.
  const [availability, setAvailability] = useState({ status: "idle", message: "" });
  useEffect(() => {
    const guests = Number(form.guests);
    if (!selectedRoom || !form.check_in || !form.check_out || form.check_out <= form.check_in || !(guests >= 1)) {
      setAvailability({ status: "idle", message: "" });
      return;
    }
    const controller = new AbortController();
    setAvailability({ status: "checking", message: "Checking availability..." });
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/checkRoomAvailability.php`, {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          hotel_id: Number(selectedRoom.hotel_id),
          room_id: Number(selectedRoom.id),
          room_count: 1,
          guests,
          check_in: form.check_in,
          check_out: form.check_out,
        }),
      }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (controller.signal.aborted) return;
        if (res.ok && data.success) {
          setAvailability(data.available
            ? { status: "available", message: data.message || "Room available for selected dates" }
            : { status: "unavailable", message: data.message || "Room is not available for these dates" });
        } else {
          setAvailability({ status: "error", message: data.message || `Availability could not be checked (HTTP ${res.status}).` });
        }
      }).catch((err) => {
        if (err.name !== "AbortError") setAvailability({ status: "error", message: "Availability could not be checked." });
      });
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [selectedRoom?.id, selectedRoom?.hotel_id, form.check_in, form.check_out, form.guests]);
  const todayLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  useEffect(() => {
    setOfflineAddons([]);
    setAddonQuantities({});
    if (!form.room_id) return;
    const room = offlineRooms.find(r => String(r.id) === String(form.room_id));
    if (!room?.hotel_id) return;
    const controller = new AbortController();
    apiFetch(`${API_BASE}/addons.php?hotel_id=${encodeURIComponent(room.hotel_id)}`, {
      credentials: "include", cache: "no-store", signal: controller.signal,
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Could not load add-ons");
      return data;
    }).then(data => {
      if (!controller.signal.aborted) setOfflineAddons((Array.isArray(data.addons) ? data.addons : []).filter(a => String(a.status).toUpperCase() === "YES"));
    }).catch(err => { if (err.name !== "AbortError") setError(`Add-ons: ${err.message}`); });
    return () => controller.abort();
  }, [form.room_id, offlineRooms]);
  const addonNights = form.check_in && form.check_out && form.check_out > form.check_in
    ? Math.round((new Date(`${form.check_out}T00:00:00`) - new Date(`${form.check_in}T00:00:00`)) / 86400000) : 0;
  const addonItems = offlineAddons.filter(a => Number(addonQuantities[a.id] || 0) > 0).map(a => ({
    addon_id: Number(a.id), quantity: Number(addonQuantities[a.id]),
    line_total: Number(a.price || 0) * Number(addonQuantities[a.id]) *
      (a.charge_type === "per_guest_per_night" ? Number(form.guests || 0) * addonNights : a.charge_type === "per_night" ? addonNights : 1),
  }));
  const addonTotal = addonItems.reduce((sum, a) => sum + a.line_total, 0);

  const submit = async e => {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      if (!selectedRoom) throw new Error("Select an active room");
      if (!form.check_in || !form.check_out || form.check_out <= form.check_in) throw new Error("Check-out must be after check-in.");
      if (Number(form.guests) > Number(selectedRoom.capacity)) throw new Error("Guests exceed room capacity.");
      if (availability.status === "unavailable") throw new Error(availability.message);
      if (availability.status === "checking") throw new Error("Please wait until availability has been checked.");
      const result = await apiCall("create_manual", { ...form, hotel_id: Number(selectedRoom.hotel_id), room_id: Number(form.room_id), guests: Number(form.guests), room_count: 1, addons: addonItems.map(({ addon_id, quantity }) => ({ addon_id, quantity })) });
      setShowForm(false);
      const emailNote = !form.guest_email.trim() ? ""
        : result.email_sent ? ` Confirmation email sent to ${form.guest_email.trim()}.`
        : ` ${result.email_warning || "The confirmation email could not be sent."}`;
      setNotice(`Offline booking ${result.booking_reference} created successfully.${emailNote}`);
      setForm({ room_id: "", guest_name: "", guest_phone: "", guest_email: "", guests: "1", check_in: "", check_out: "" });
      setAddonQuantities({});
      try {
        await refresh();
      } catch (refreshError) {
        setNotice(`Offline booking ${result.booking_reference} was saved, but the list could not refresh. Please reload to see it.`);
      }
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
  return <div className="ns-booking-page">
    <div className="ns-heading"><div><span>RESERVATIONS</span><h1>Booking Management</h1><p>Online website bookings and Offline staff bookings.</p></div>
      {tab === "Offline" && <button className="ns-btn" type="button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> {showForm ? "Close Form" : "Add Offline Booking"}</button>}
    </div>
    <section className="ns-panel ns-booking-panel">
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setStatusFilter("All"); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
      </div>
      {tab === "Offline" && showForm && <form onSubmit={submit} className="ns-room-form ns-offline-booking-form" style={{ marginBottom: 12, padding: 18, border: "1px solid #ddd", borderRadius: 12 }}>
        <h3>Add Offline Booking</h3>
        <label>Offline Room<select required value={form.room_id} onChange={e => setForm(p => ({ ...p, room_id: e.target.value }))}><option value="">{loading ? "Loading rooms..." : "Select Room"}</option>{offlineRooms.map(r => <option key={r.id} value={r.id}>{r.hotel_name ? `${r.hotel_name} — ` : ""}{[r.area_name, r.city_name].filter(Boolean).join(", ")}{r.area_name || r.city_name ? " — " : ""}{r.room_code || `Room ${r.id}`} — {r.room_type || r.room_name} — Room {r.original_room_number || r.room_number || "—"} — {money(r.price_per_night)}</option>)}</select>{!loading && offlineRooms.length === 0 && <small style={{ display: "block", marginTop: 8 }}>No active offline rooms found for your assigned hotels. Online rooms are booked through the website.</small>}</label>
        <div className="ns-room-fields"><label>Guest Name<input required maxLength={150} value={form.guest_name} onChange={e => setForm(p => ({ ...p, guest_name: e.target.value }))} /></label>
          <label>Phone<input required maxLength={30} value={form.guest_phone} onChange={e => setForm(p => ({ ...p, guest_phone: e.target.value }))} /></label></div>
        <div className="ns-room-fields"><label>Email (optional)<input type="email" maxLength={150} value={form.guest_email} onChange={e => setForm(p => ({ ...p, guest_email: e.target.value }))} /></label>
          <label>Guests<input required type="number" min="1" max={selectedRoom?.capacity || 1000} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} /></label></div>
        <div className="ns-room-fields"><label>Check-In<input required type="date" min={todayLocal} value={form.check_in} onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))} /></label>
          <label>Check-Out<input required type="date" min={form.check_in || todayLocal} value={form.check_out} onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))} /></label></div>
        {availability.status !== "idle" && <p role="status" style={{ margin: "4px 0 10px", fontWeight: 600, color: availability.status === "available" ? "#146444" : availability.status === "unavailable" ? "#b42b2b" : "#7a5c12" }}>
          {availability.status === "available" ? "✓ " : availability.status === "unavailable" ? "✕ " : ""}{availability.message}{availability.status === "error" ? " It will be verified again when you save." : ""}
        </p>}
        <div className="ns-full" style={{ marginTop: 12, marginBottom: 14 }}>
          <h4 style={{ margin: "0 0 10px" }}>Optional Add-ons</h4>
          {!form.room_id ? <small>Select a room to see its add-ons.</small> : !offlineAddons.length ? <small>No active add-ons for this branch.</small> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
              {offlineAddons.map(a => <label key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 10, border: "1px solid #dbe5df", borderRadius: 9 }}>
                <span><strong>{a.addon_name}</strong><small style={{ display: "block" }}>{money(a.price)} · {String(a.charge_type || "per_stay").replaceAll("_", " ")}</small></span>
                <input aria-label={`${a.addon_name} quantity`} type="number" min="0" max="99" step="1" value={addonQuantities[a.id] || 0} onChange={e => setAddonQuantities(p => ({ ...p, [a.id]: Math.max(0, Math.min(99, Math.floor(Number(e.target.value) || 0))) }))} style={{ width: 68, flexShrink: 0 }} />
              </label>)}
            </div>
          )}
          {!!addonItems.length && <p style={{ margin: "10px 0 0", fontWeight: 600 }}>Add-ons subtotal: {money(addonTotal)}{!addonNights && addonItems.some(a => offlineAddons.find(x => Number(x.id) === a.addon_id)?.charge_type !== "per_stay") ? " (select dates for nightly charges)" : ""}</p>}
        </div>
        <div className="ns-room-actions"><button className="ns-btn" type="submit" disabled={saving || availability.status === "unavailable" || availability.status === "checking"}>{saving ? "Saving..." : "Save Offline Booking"}</button></div>
      </form>}
      <style>{`
        /* Scroll ONLY the expanded Offline Booking form. */
        .ns-booking-page .ns-booking-panel > form.ns-offline-booking-form {
          display: block !important;
          flex: 0 1 auto !important;
          min-height: 0 !important;
          max-height: min(64dvh, 620px) !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #9eb7aa #f3f7f4;
        }
        .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar { width: 7px; }
        .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar-thumb { background: #9eb7aa; border-radius: 8px; }
        .ns-booking-page .ns-offline-booking-form::-webkit-scrollbar-track { background: #f3f7f4; }
        @media (max-height: 750px) {
          .ns-booking-page .ns-booking-panel > form.ns-offline-booking-form {
            max-height: 48dvh !important;
          }
        }
        /* The count overlays the right edge of the search field, never outside the panel. */
        .ns-booking-page .ns-booking-toolbar {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .ns-booking-page .ns-booking-toolbar > input.ns-search {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
          padding-right: 150px !important;
        }
        .ns-booking-page .ns-booking-toolbar > span.ns-booking-result-count {
          position: absolute !important;
          right: 14px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          white-space: nowrap !important;
          width: auto !important;
          min-width: 0 !important;
          margin: 0 !important;
        }
        /* Compact booking page: remove excessive vertical gaps */
        .ns-booking-page > .ns-heading { margin: 0 0 10px !important; padding: 0 !important; gap: 4px !important; }
        .ns-booking-page > .ns-heading h1 { margin: 3px 0 4px !important; line-height: 1.15; }
        .ns-booking-page > .ns-heading p { margin: 0 !important; }
        .ns-booking-page .ns-booking-panel { padding: 14px 18px !important; gap: 0 !important; }
        .ns-booking-page .ns-booking-panel > div:first-child { margin-bottom: 10px !important; }
        .ns-booking-page .ns-booking-status-filters { margin-bottom: 10px !important; gap: 8px !important; }
        .ns-booking-page .ns-booking-filter { padding: 9px 10px !important; min-height: 54px !important; }
        .ns-booking-page .ns-booking-toolbar { margin: 0 0 9px !important; gap: 10px !important; }
        .ns-booking-page .ns-booking-toolbar .ns-search { padding: 9px 12px !important; min-height: 38px !important; }
        .ns-booking-page .ns-room-error, .ns-booking-page .ns-note { margin: 3px 0 8px !important; }
        /* Booking Management only: fit screen and scroll booking rows */
        .ns-content:has(.ns-booking-page) {
          height: 100dvh;
          min-height: 0;
          overflow: hidden !important;
          box-sizing: border-box;
        }
        .ns-booking-page {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .ns-booking-page > .ns-heading { flex: 0 0 auto; }
        .ns-booking-page .ns-booking-panel {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .ns-booking-page .ns-booking-table-scroll {
          flex: 0 1 auto;
          min-height: 0;
          max-height: 464px; /* header + approximately 6 compact rows */
          overflow-y: auto !important;
          overflow-x: auto !important;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #a8bbb0 #f1f5f2;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #f4f8f5;
          padding: 10px 12px !important;
          height: 44px;
          box-sizing: border-box;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td {
          padding: 9px 12px !important;
          height: 70px;
          box-sizing: border-box;
          vertical-align: middle;
          font-size: 12px;
          line-height: 1.3;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td small {
          font-size: 10px;
          line-height: 1.25;
          margin-top: 3px;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-table tbody td strong {
          font-size: 11px;
          line-height: 1.3;
        }
        .ns-booking-page .ns-booking-table-scroll .ns-booking-action {
          padding: 6px 9px;
          min-height: 30px;
          font-size: 11px;
        }
        @media (max-height: 750px) {
          .ns-booking-page .ns-booking-status-filters { margin-bottom: 12px; }
          .ns-booking-page .ns-booking-status-filters .ns-booking-filter { padding: 9px 8px !important; }
        }

        .ns-booking-status-filters {
          display: grid !important;
          grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
          gap: 10px !important;
          width: 100%;
          margin-bottom: 22px;
        }
        .ns-booking-status-filters .ns-booking-filter {
          box-sizing: border-box;
          min-width: 0 !important;
          width: 100% !important;
          padding: 13px 10px !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          text-align: left;
        }
        .ns-booking-status-filters .ns-booking-filter-label {
          font-size: clamp(10px, .9vw, 13px);
          white-space: nowrap;
        }
        .ns-booking-status-filters .ns-booking-filter-count {
          flex-shrink: 0;
          font-size: 13px;
        }
        @media (max-width: 900px) {
          .ns-booking-status-filters { overflow-x: auto; grid-template-columns: repeat(6, minmax(125px, 1fr)) !important; padding-bottom: 6px; }
        }
      `}</style>
      <div className="ns-booking-status-filters" role="group" aria-label="Filter bookings by status">
        {bookingStatuses.map(status => (
          <button key={status} type="button" className={`ns-booking-filter ${statusFilter === status ? "is-active" : ""}`}
            aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
            <span className="ns-booking-filter-label">{status}</span>
            <strong className="ns-booking-filter-count">{statusCounts[status]}</strong>
          </button>
        ))}
      </div>
      <div className="ns-booking-toolbar" style={{
        position: "relative",
        display: "block",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        paddingRight: 0,
        marginBottom: 10
      }}>
        <input
          className="ns-search"
          aria-label="Search bookings"
          placeholder="Search booking reference, guest or room..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            paddingRight: 150,
            boxSizing: "border-box"
          }}
        />
        <span className="ns-booking-result-count" style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          display: "block",
          width: "auto",
          maxWidth: "none",
          minWidth: 0,
          whiteSpace: "nowrap",
          margin: 0,
          padding: 0,
          fontSize: 12,
          lineHeight: "18px",
          pointerEvents: "none",
          zIndex: 1,
          background: "#f7faf8"
        }}>
          Showing {filtered.length} booking{filtered.length === 1 ? "" : "s"}
        </span>
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
  </div>;
}

// Area Management is maintained in its own component.
export { default as AdminAreas } from "./AdminAreas";




