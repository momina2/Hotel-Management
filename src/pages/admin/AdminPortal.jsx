
// import { useEffect, useState } from "react";



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

// } from "lucide-react";

// import "./admin.css";



// import "./rooms-management.css";



// import "./booking-alignment.css";



// import "../../styles/hotels.css";





// const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



// export function AdminLayout() {

//   const [open, setOpen] = useState(false);
//   const [isStaff, setIsStaff] = useState(false);
//   useEffect(() => { fetch("https://coreops.pk/Hotel/api/login.php", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "check_session" }) }).then(r => r.json()).then(d => setIsStaff(d.user?.hotel_role === "hotel_user")).catch(() => { }); }, []);
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

//         <div className="ns-brand">

//           <Hotel /> NorthernStays <small>ADMIN</small>

//         </div>

//         <nav>

//           {[

//             ["/admin", "Dashboard", LayoutDashboard],

//             ["/admin/areas", "Area Management", MapPin],

//             ["/admin/cities", "City Management", Map],

//             ["/admin/hotels", "Hotel Management", Hotel],

//             ["/admin/rooms", "Room Management", BedDouble],

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

//   useEffect(() => {

//     const controller = new AbortController();



//     async function loadDashboard() {

//       try {

//         const response = await fetch(

//           "https://coreops.pk/Hotel/api/dashboard.php",

//           {

//             method: "GET",

//             credentials: "include",

//             signal: controller.signal,

//           },

//         );



//         const result = await response.json();

//         if (response.status === 401 || response.status === 403) {

//           navigate("/admin/login", { replace: true });

//           return;

//         }



//         if (!response.ok || !result.success) {

//           throw new Error(result.message || "Dashboard could not be loaded.");

//         }



//         setData(result);

//       } catch (err) {

//         if (err.name !== "AbortError")

//           setError(err.message || "Network error.");

//       } finally {

//         if (!controller.signal.aborted) setLoading(false);

//       }

//     }



//     loadDashboard();

//     return () => controller.abort();

//   }, [navigate]);

//   if (loading)

//     return (

//       <section className="ns-panel">

//         <p>Loading your hotel dashboard...</p>

//       </section>

//     );



//   if (error)

//     return (

//       <section className="ns-panel">

//         <p role="alert">{error}</p>

//       </section>

//     );



//   if (!data) return null;

//   const { hotel, stats, recent_rooms: recentRooms = [] } = data;

//   return (

//     <>

//       <div className="ns-heading">

//         <div>

//           <span>{hotel.hotel_code} · OVERVIEW</span>

//           <h1>{hotel.hotel_name}</h1>

//           <p>Manage your hotel's rooms, reservations and revenue.</p>

//         </div>

//         <Link className="ns-btn" to="/admin/rooms">

//           <BedDouble size={17} /> Manage Rooms

//         </Link>

//       </div>

//       <div className="ns-stats">

//         {[

//           ["Hotels", stats.hotels, Hotel],

//           ["Total Rooms", stats.total_rooms, BedDouble],

//           ["Bookings", stats.bookings, CalendarCheck],

//           ["Revenue", money(stats.revenue), LayoutDashboard],

//         ].map(([label, value, Icon]) => (

//           <article key={label}>

//             <Icon size={23} />

//             <span>{label}</span>

//             <strong>{value}</strong>

//           </article>

//         ))}

//       </div>

//       <section className="ns-panel">

//         <div className="ns-panel-head">

//           <h2>Recent Room Types</h2>

//           <Link to="/admin/rooms">View all →</Link>

//         </div>

//         <div className="ns-table-wrap">

//           <table className="ns-table">

//             <thead>

//               <tr>

//                 <th>Room</th>

//                 <th>Type</th>

//                 <th>Inventory</th>

//                 <th>Nightly Price</th>

//                 <th>Status</th>

//               </tr>

//             </thead>

//             <tbody>

//               {recentRooms.map((room) => (

//                 <tr key={room.id}>

//                   <td>

//                     <strong>{room.room_name}</strong>

//                   </td>

//                   <td>{room.room_type || "—"}</td>

//                   <td>{room.total_rooms}</td>

//                   <td>{money(room.price_per_night)}</td>

//                   <td>

//                     <span className="ns-status">{room.status}</span>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//           {!recentRooms.length && (

//             <p className="ns-empty">

//               No rooms have been added for this hotel yet.

//             </p>

//           )}

//         </div>

//       </section>

//       <p className="ns-note">

//         Dashboard totals are loaded from MySQL for your assigned hotel. Other

//         admin management pages still use demo storage until their APIs are

//         connected.

//       </p>

//     </>

//   );

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

//   const [hotel, setHotel] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   useEffect(() => {

//     const controller = new AbortController();

//     hotelProfileRequest("get", {}, controller.signal)

//       .then((result) => setHotel(result.hotel))

//       .catch((err) => {

//         if (err.name !== "AbortError") setError(err.message);

//       })

//       .finally(() => {

//         if (!controller.signal.aborted) setLoading(false);

//       });

//     return () => controller.abort();

//   }, []);

//   return (

//     <>

//       <div className="ns-heading">

//         <div>

//           <span>PROPERTY MANAGEMENT</span>

//           <h1>My Hotel</h1>

//           <p>Only your assigned hotel's information is available here.</p>

//         </div>

//         <Link className="ns-btn" to="/admin/hotels/add">

//           <Pencil size={17} /> Edit My Hotel

//         </Link>

//       </div>

//       <section className="ns-panel">

//         {loading ? (

//           <p>Loading hotel information...</p>

//         ) : error ? (

//           <p role="alert" className="ns-room-error">

//             {error}

//           </p>

//         ) : hotel ? (

//           <div className="ns-table-wrap">

//             <table className="ns-table">

//               <thead>

//                 <tr>

//                   <th>Hotel Code</th>

//                   <th>Hotel Name</th>

//                   <th>City</th>

//                   <th>Area</th>

//                   <th>Status</th>

//                 </tr>

//               </thead>

//               <tbody>

//                 <tr>

//                   <td>{hotel.hotel_code || "—"}</td>

//                   <td>

//                     <strong>{hotel.hotel_name}</strong>

//                     <small>{hotel.address || "No address provided"}</small>

//                   </td>

//                   <td>{hotel.city_name || "—"}</td>

//                   <td>{hotel.area_name || "—"}</td>

//                   <td>

//                     <span className="ns-status">{hotel.status}</span>

//                   </td>

//                 </tr>

//               </tbody>

//             </table>

//             <p className="ns-note">

//               Contact: {hotel.contact_number || "—"} · Email:{" "}

//               {hotel.email || "—"}

//             </p>

//           </div>

//         ) : (

//           <p>No hotel assigned.</p>

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
//   const response = await fetch(url, { method: "GET", credentials: "omit", cache: "no-store", signal });
//   const result = await response.json();
//   if (!response.ok || !result.success) throw new Error(result.message || "Could not load locations.");
//   return result;
// }


// const blankRoom = {

//   room_type: "", original_room_number: "", price_per_night: "",
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



//   async function reload(signal) {

//     const result = await roomsRequest("list", {}, signal);

//     setRooms(Array.isArray(result.rooms) ? result.rooms : []);
//     setRoomLocation(result.location || null);

//   }



//   useEffect(() => {

//     const controller = new AbortController();

//     reload(controller.signal)

//       .catch((err) => {

//         if (err.name === "AbortError") return;

//         if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//         else setError(err.message);

//       })

//       .finally(() => { if (!controller.signal.aborted) setLoading(false); });

//     return () => controller.abort();

//   }, [navigate]);



//   // City names come from getCities.php; area names from getAreasByCities.php.
//   useEffect(() => {
//     if (!editor) return;
//     const controller = new AbortController();
//     setLocationsLoading(true);
//     setLocationError("");
//     roomLocationRequest(ROOM_CITIES_API, controller.signal)
//       .then((data) => {
//         if (!controller.signal.aborted) setCityOptions(Array.isArray(data.cities) ? data.cities : []);
//       })
//       .catch((err) => {
//         if (!controller.signal.aborted) setLocationError(err.message || "Unable to load cities.");
//       })
//       .finally(() => { if (!controller.signal.aborted) setLocationsLoading(false); });
//     return () => controller.abort();
//   }, [editor?.id]);

//   useEffect(() => {
//     const city = cityOptions.find((c) => String(c.id) === String(form.city_id)) ||
//       (String(form.city_id) === String(roomLocation?.city_id) && roomLocation?.city_name
//         ? { city_name: roomLocation.city_name } : null);
//     if (!editor || !city) { setAreaOptions([]); return; }
//     const controller = new AbortController();
//     setLocationsLoading(true);
//     setLocationError("");
//     const url = `${ROOM_AREAS_API}?city=${encodeURIComponent(city.city_name)}`;
//     roomLocationRequest(url, controller.signal)
//       .then((data) => {
//         if (!controller.signal.aborted) setAreaOptions(Array.isArray(data.areas) ? data.areas : []);
//       })
//       .catch((err) => {
//         if (!controller.signal.aborted) setLocationError(err.message || "Unable to load areas.");
//       })
//       .finally(() => { if (!controller.signal.aborted) setLocationsLoading(false); });
//     return () => controller.abort();
//   }, [editor?.id, form.city_id, cityOptions]);

//   // Public endpoints deduplicate names across companies. The actual IDs must
//   // always be the IDs belonging to this logged-in user's assigned hotel.
//   const cityMatchesHotel = (id) => {
//     const option = cityOptions.find((c) => String(c.id) === String(id));
//     return Boolean(roomLocation?.city_name && (option?.city_name ||
//       (String(id) === String(roomLocation.city_id) ? roomLocation.city_name : ""))
//       .trim().toLowerCase() === roomLocation.city_name.trim().toLowerCase());
//   };
//   const areaMatchesHotel = (id) => {
//     const option = areaOptions.find((a) => String(a.id) === String(id));
//     return Boolean(roomLocation?.area_name && (option?.area_name ||
//       (String(id) === String(roomLocation.area_id) ? roomLocation.area_name : ""))
//       .trim().toLowerCase() === roomLocation.area_name.trim().toLowerCase());
//   };

//   const visible = rooms.filter((room) =>

//     `${room.room_name} ${room.room_code || ""} ${room.room_type || ""} ${room.original_room_number || room.room_number || ""} ${room.status || ""}`

//       .toLowerCase().includes(search.toLowerCase())

//   );



//   function openNew() {

//     setEditor({ id: null });

//     setForm({ ...blankRoom, city_id: String(roomLocation?.city_id || ""), area_id: String(roomLocation?.area_id || "") });

//     setFormError("");
//     setImageUploadError("");

//   }



//   function openEdit(room) {

//     setEditor({ id: room.id });

//     setForm({




//       room_type: room.room_type || "",
//       original_room_number: String(room.original_room_number ?? room.room_number ?? ""),

//       price_per_night: String(room.price_per_night ?? ""),

//       capacity: String(room.capacity ?? 2),

//       availability: Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online",

//       description: room.description || "",

//       image_url: room.image_url || "",
//       gallery: Array.isArray(room.gallery) && room.gallery.length ? room.gallery : (room.image_url ? [room.image_url] : []),
//       amenities: Array.isArray(room.amenities) ? room.amenities : [],

//       status: room.status || "YES",
//       city_id: String(roomLocation?.city_id || ""),
//       area_id: String(roomLocation?.area_id || ""),
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

//     const capacity = Number(form.capacity);

//     const online = form.availability === "Online" ? 1 : 0;
//     const offline = form.availability === "Offline" ? 1 : 0;

//     if (!form.city_id || !form.area_id ||
//       !cityMatchesHotel(form.city_id) || !areaMatchesHotel(form.area_id)) {
//       setFormError("Select the city and area belonging to your assigned hotel. Update Hotel Management first if needed.");
//       return;
//     }
//     if (!form.room_type.trim() || !form.original_room_number.trim() || form.original_room_number.trim().length > 50 || form.price_per_night === "" ||

//       !Number.isFinite(price) || price < 0 || price > 9999999999.99 ||

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
//         gallery: form.gallery || [],
//         image_url: form.gallery?.[0] || "",
//         amenities: (form.amenities || []).filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), value: a.value.trim() })),
//         city_id: String(roomLocation.city_id),
//         area_id: String(roomLocation.area_id),

//         original_room_number: form.original_room_number.trim(),
//         room_name: form.room_type.trim(),
//         room_type: form.room_type.trim(),

//         price_per_night: price,

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

//       await roomsRequest("delete", { id: room.id });

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

//         <button type="button" className="ns-btn" onClick={openNew}>

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

//           <div className="ns-table-wrap">

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

//                     <td>{money(room.price_per_night)}</td>

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

//               <div className="ns-room-fields">
//                 <label>City
//                   <select required value={form.city_id} disabled={locationsLoading && !cityOptions.length}
//                     onChange={(e) => setForm((prev) => ({ ...prev, city_id: e.target.value, area_id: "" }))}>
//                     <option value="">{locationsLoading && !cityOptions.length ? "Loading Cities..." : "Select City"}</option>
//                     {cityOptions.map((city) => (
//                       <option key={city.id} value={String(city.id)}>{city.city_name}</option>
//                     ))}
//                     {roomLocation?.city_id && roomLocation?.city_name &&
//                       !cityOptions.some((c) => String(c.id) === String(roomLocation.city_id)) && (
//                         <option value={String(roomLocation.city_id)}>{roomLocation.city_name}</option>
//                       )}
//                   </select>
//                 </label>
//                 <label>Area
//                   <select required value={form.area_id} disabled={!form.city_id || (locationsLoading && !areaOptions.length)}
//                     onChange={(e) => updateField("area_id", e.target.value)}>
//                     <option value="">{locationsLoading && !areaOptions.length ? "Loading Areas..." : "Select Area"}</option>
//                     {areaOptions.map((area) => (
//                       <option key={area.id} value={String(area.id)}>{area.area_name}</option>
//                     ))}
//                     {String(form.city_id) === String(roomLocation?.city_id) && roomLocation?.area_id && roomLocation?.area_name &&
//                       !areaOptions.some((a) => String(a.id) === String(roomLocation.area_id)) && (
//                         <option value={String(roomLocation.area_id)}>{roomLocation.area_name}</option>
//                       )}
//                   </select>
//                 </label>
//               </div>
//               {locationError && <p className="ns-room-error" role="alert">{locationError}</p>}
//               <p className="ns-note">Cities and areas load from getCities.php and getAreasByCities.php. Rooms must use your assigned hotel's location.</p>
//               <div className="ns-room-fields">

//                 <label>Room Type<input required maxLength={100} value={form.room_type} placeholder="e.g. Deluxe"

//                   onChange={(e) => updateField("room_type", e.target.value)} /></label>
//                 <label>Original Room Number<input required maxLength={50} value={form.original_room_number} placeholder="e.g. 101 or A-201"
//                   onChange={(e) => updateField("original_room_number", e.target.value)} /></label>

//               </div>

//               <div className="ns-room-fields">

//                 <label>Price / Night (PKR)<input required type="number" min="0" step="0.01"

//                   value={form.price_per_night} onChange={(e) => updateField("price_per_night", e.target.value)} /></label>

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
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");
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
//   const filtered = bookings.filter(b => channel(b) === tab &&
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
//         {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
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
//       <input className="ns-search" aria-label="Search bookings" placeholder="Search booking, guest, room..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", marginBottom: 16 }} />
//       {error && <p className="ns-room-error" role="alert">{error}</p>}{notice && <p className="ns-note" role="status">{notice}</p>}
//       {loading ? <p>Loading bookings...</p> : <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Booking / Guest</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
//         {filtered.map(b => <tr key={b.id}><td><strong>{b.booking_reference}</strong><small>{b.guest_name}</small><small>{b.guest_phone}</small></td>
//           <td><strong>{b.room_code || b.room_name || `RM #${b.room_id}`}</strong><small>{b.hotel_name || ""}</small></td>
//           <td>{b.check_in} → {b.check_out}</td><td>{money(b.total_amount)}</td><td>{displayStatus(b)}</td>
//           <td><div className="ns-actions" style={{ flexWrap: "wrap", gap: 6 }}>
//             {b.status === "Pending" && <><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Confirmed")}>Confirm</button><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
//             {b.status === "Confirmed" && !b.checked_in_at && <><button disabled={busyId !== null} onClick={() => change(b, "check_in")}>Check In</button><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
//             {b.status === "Confirmed" && b.checked_in_at && !b.checked_out_at && <button disabled={busyId !== null} onClick={() => change(b, "check_out")}>Check Out</button>}
//           </div></td></tr>)}
//       </tbody></table>{filtered.length === 0 && <p className="ns-empty">No {tab.toLowerCase()} bookings found.</p>}</div>}
//     </section>
//   </>;
// }










import { useCallback, useEffect, useMemo, useState } from "react";



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



import "./rooms-management.css";



import "./booking-alignment.css";



import "../../styles/hotels.css";





const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");



export function AdminLayout() {

  const [open, setOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => { fetch("https://coreops.pk/Hotel/api/login.php", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "check_session" }) }).then(r => r.json()).then(d => setIsStaff(d.user?.hotel_role === "hotel_user")).catch(() => { }); }, []);
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

          <Hotel /> NorthernStays <small>ADMIN</small>

        </div>

        <nav>

          {[

            ["/admin", "Dashboard", LayoutDashboard],

            ["/admin/areas", "Area Management", MapPin],

            ["/admin/cities", "City Management", Map],

            ["/admin/hotels", "Hotel Management", Hotel],

            ["/admin/rooms", "Room Management", BedDouble],

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

  useEffect(() => {

    const controller = new AbortController();



    async function loadDashboard() {

      try {

        const response = await fetch(

          "https://coreops.pk/Hotel/api/dashboard.php",

          {

            method: "GET",

            credentials: "include",

            signal: controller.signal,

          },

        );



        const result = await response.json();

        if (response.status === 401 || response.status === 403) {

          navigate("/admin/login", { replace: true });

          return;

        }



        if (!response.ok || !result.success) {

          throw new Error(result.message || "Dashboard could not be loaded.");

        }



        setData(result);

      } catch (err) {

        if (err.name !== "AbortError")

          setError(err.message || "Network error.");

      } finally {

        if (!controller.signal.aborted) setLoading(false);

      }

    }



    loadDashboard();

    return () => controller.abort();

  }, [navigate]);

  if (loading)

    return (

      <section className="ns-panel">

        <p>Loading your hotel dashboard...</p>

      </section>

    );



  if (error)

    return (

      <section className="ns-panel">

        <p role="alert">{error}</p>

      </section>

    );



  if (!data) return null;

  const { hotel, stats, recent_rooms: recentRooms = [] } = data;

  return (

    <>

      <div className="ns-heading">

        <div>

          <span>{hotel.hotel_code} · OVERVIEW</span>

          <h1>{hotel.hotel_name}</h1>

          <p>Manage your hotel's rooms, reservations and revenue.</p>

        </div>

        <Link className="ns-btn" to="/admin/rooms">

          <BedDouble size={17} /> Manage Rooms

        </Link>

      </div>

      <div className="ns-stats">

        {[

          ["Hotels", stats.hotels, Hotel],

          ["Total Rooms", stats.total_rooms, BedDouble],

          ["Bookings", stats.bookings, CalendarCheck],

          ["Revenue", money(stats.revenue), LayoutDashboard],

        ].map(([label, value, Icon]) => (

          <article key={label}>

            <Icon size={23} />

            <span>{label}</span>

            <strong>{value}</strong>

          </article>

        ))}

      </div>

      <section className="ns-panel">

        <div className="ns-panel-head">

          <h2>Recent Room Types</h2>

          <Link to="/admin/rooms">View all →</Link>

        </div>

        <div className="ns-table-wrap">

          <table className="ns-table">

            <thead>

              <tr>

                <th>Room</th>

                <th>Type</th>

                <th>Inventory</th>

                <th>Nightly Price</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {recentRooms.map((room) => (

                <tr key={room.id}>

                  <td>

                    <strong>{room.room_name}</strong>

                  </td>

                  <td>{room.room_type || "—"}</td>

                  <td>{room.total_rooms}</td>

                  <td>{money(room.price_per_night)}</td>

                  <td>

                    <span className="ns-status">{room.status}</span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {!recentRooms.length && (

            <p className="ns-empty">

              No rooms have been added for this hotel yet.

            </p>

          )}

        </div>

      </section>

      <p className="ns-note">

        Dashboard totals are loaded from MySQL for your assigned hotel. Other

        admin management pages still use demo storage until their APIs are

        connected.

      </p>

    </>

  );

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

  const [hotel, setHotel] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const controller = new AbortController();

    hotelProfileRequest("get", {}, controller.signal)

      .then((result) => setHotel(result.hotel))

      .catch((err) => {

        if (err.name !== "AbortError") setError(err.message);

      })

      .finally(() => {

        if (!controller.signal.aborted) setLoading(false);

      });

    return () => controller.abort();

  }, []);

  return (

    <>

      <div className="ns-heading">

        <div>

          <span>PROPERTY MANAGEMENT</span>

          <h1>My Hotel</h1>

          <p>Only your assigned hotel's information is available here.</p>

        </div>

        <Link className="ns-btn" to="/admin/hotels/add">

          <Pencil size={17} /> Edit My Hotel

        </Link>

      </div>

      <section className="ns-panel">

        {loading ? (

          <p>Loading hotel information...</p>

        ) : error ? (

          <p role="alert" className="ns-room-error">

            {error}

          </p>

        ) : hotel ? (

          <div className="ns-table-wrap">

            <table className="ns-table">

              <thead>

                <tr>

                  <th>Hotel Code</th>

                  <th>Hotel Name</th>

                  <th>City</th>

                  <th>Area</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>{hotel.hotel_code || "—"}</td>

                  <td>

                    <strong>{hotel.hotel_name}</strong>

                    <small>{hotel.address || "No address provided"}</small>

                  </td>

                  <td>{hotel.city_name || "—"}</td>

                  <td>{hotel.area_name || "—"}</td>

                  <td>

                    <span className="ns-status">{hotel.status}</span>

                  </td>

                </tr>

              </tbody>

            </table>

            <p className="ns-note">

              Contact: {hotel.contact_number || "—"} · Email:{" "}

              {hotel.email || "—"}

            </p>

          </div>

        ) : (

          <p>No hotel assigned.</p>

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



const ROOMS_API = "https://coreops.pk/Hotel/api/rooms.php";
const ROOM_CITIES_API = "https://coreops.pk/Hotel/api/getCities.php";
const ROOM_AREAS_API = "https://coreops.pk/Hotel/api/getAreasByCities.php";
const ROOM_UPLOAD_API = "https://coreops.pk/Hotel/api/uploadRoomImage.php";

async function roomLocationRequest(url, signal) {
  const response = await fetch(url, { method: "GET", credentials: "omit", cache: "no-store", signal });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Could not load locations.");
  return result;
}


const blankRoom = {

  room_type: "", original_room_number: "", price_per_night: "",
  city_id: "", area_id: "",

  capacity: "2", availability: "Online", description: "", image_url: "", gallery: [], amenities: [], status: "YES",

};



async function roomsRequest(action, fields = {}, signal) {

  const response = await fetch(ROOMS_API, {

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

    throw new Error(result.message || "Room request failed.");

  }

  return result;

}



export function AdminRooms() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [roomLocation, setRoomLocation] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const [search, setSearch] = useState("");

  const [editor, setEditor] = useState(null);

  const [form, setForm] = useState(blankRoom);

  const [error, setError] = useState("");

  const [formError, setFormError] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);



  async function reload(signal) {

    const result = await roomsRequest("list", {}, signal);

    setRooms(Array.isArray(result.rooms) ? result.rooms : []);
    setRoomLocation(result.location || null);

  }



  useEffect(() => {

    const controller = new AbortController();

    reload(controller.signal)

      .catch((err) => {

        if (err.name === "AbortError") return;

        if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

        else setError(err.message);

      })

      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();

  }, [navigate]);



  // City names come from getCities.php; area names from getAreasByCities.php.
  useEffect(() => {
    if (!editor) return;
    const controller = new AbortController();
    setLocationsLoading(true);
    setLocationError("");
    roomLocationRequest(ROOM_CITIES_API, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setCityOptions(Array.isArray(data.cities) ? data.cities : []);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setLocationError(err.message || "Unable to load cities.");
      })
      .finally(() => { if (!controller.signal.aborted) setLocationsLoading(false); });
    return () => controller.abort();
  }, [editor?.id]);

  useEffect(() => {
    const city = cityOptions.find((c) => String(c.id) === String(form.city_id)) ||
      (String(form.city_id) === String(roomLocation?.city_id) && roomLocation?.city_name
        ? { city_name: roomLocation.city_name } : null);
    if (!editor || !city) { setAreaOptions([]); return; }
    const controller = new AbortController();
    setLocationsLoading(true);
    setLocationError("");
    const url = `${ROOM_AREAS_API}?city=${encodeURIComponent(city.city_name)}`;
    roomLocationRequest(url, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAreaOptions(Array.isArray(data.areas) ? data.areas : []);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setLocationError(err.message || "Unable to load areas.");
      })
      .finally(() => { if (!controller.signal.aborted) setLocationsLoading(false); });
    return () => controller.abort();
  }, [editor?.id, form.city_id, cityOptions]);

  // Public endpoints deduplicate names across companies. The actual IDs must
  // always be the IDs belonging to this logged-in user's assigned hotel.
  const cityMatchesHotel = (id) => {
    const option = cityOptions.find((c) => String(c.id) === String(id));
    return Boolean(roomLocation?.city_name && (option?.city_name ||
      (String(id) === String(roomLocation.city_id) ? roomLocation.city_name : ""))
      .trim().toLowerCase() === roomLocation.city_name.trim().toLowerCase());
  };
  const areaMatchesHotel = (id) => {
    const option = areaOptions.find((a) => String(a.id) === String(id));
    return Boolean(roomLocation?.area_name && (option?.area_name ||
      (String(id) === String(roomLocation.area_id) ? roomLocation.area_name : ""))
      .trim().toLowerCase() === roomLocation.area_name.trim().toLowerCase());
  };

  const visible = rooms.filter((room) =>

    `${room.room_name} ${room.room_code || ""} ${room.room_type || ""} ${room.original_room_number || room.room_number || ""} ${room.status || ""}`

      .toLowerCase().includes(search.toLowerCase())

  );



  function openNew() {

    setEditor({ id: null });

    setForm({ ...blankRoom, city_id: String(roomLocation?.city_id || ""), area_id: String(roomLocation?.area_id || "") });

    setFormError("");
    setImageUploadError("");

  }



  function openEdit(room) {

    setEditor({ id: room.id });

    setForm({




      room_type: room.room_type || "",
      original_room_number: String(room.original_room_number ?? room.room_number ?? ""),

      price_per_night: String(room.price_per_night ?? ""),

      capacity: String(room.capacity ?? 2),

      availability: Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online",

      description: room.description || "",

      image_url: room.image_url || "",
      gallery: Array.isArray(room.gallery) && room.gallery.length ? room.gallery : (room.image_url ? [room.image_url] : []),
      amenities: Array.isArray(room.amenities) ? room.amenities : [],

      status: room.status || "YES",
      city_id: String(roomLocation?.city_id || ""),
      area_id: String(roomLocation?.area_id || ""),
    });

    setFormError("");
    setImageUploadError("");

  }



  function updateField(key, value) {

    setForm((previous) => ({ ...previous, [key]: value }));

  }



  async function uploadRoomImages(files) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    if ((form.gallery?.length || 0) + selected.length > 7) {
      setImageUploadError("Maximum 7 images per room."); return;
    }
    setUploadingImage(true);
    setImageUploadError("");
    const urls = [];
    try {
      for (const file of selected) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
          throw new Error("Only JPG, PNG, WebP images up to 5 MB each are allowed.");
        }
        const data = new FormData();
        data.append("image", file);
        const response = await fetch(ROOM_UPLOAD_API, { method: "POST", credentials: "include", body: data });
        const json = await response.json();
        if (!response.ok || !json.success || !json.image_url) throw new Error(json.message || "Image upload failed.");
        urls.push(json.image_url);
      }
      setForm(prev => {
        const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
        return { ...prev, gallery, image_url: gallery[0] || "" };
      });
    } catch (err) {
      // Preserve images that already uploaded successfully.
      if (urls.length) setForm(prev => {
        const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
        return { ...prev, gallery, image_url: gallery[0] || "" };
      });
      setImageUploadError(err.message || "Image upload failed.");
    } finally { setUploadingImage(false); }
  }

  function removeGalleryImage(url) {
    setForm(prev => {
      const gallery = (prev.gallery || []).filter(item => item !== url);
      return { ...prev, gallery, image_url: gallery[0] || "" };
    });
  }

  function updateAmenity(index, key, value) {
    setForm(prev => ({ ...prev, amenities: (prev.amenities || []).map((a, i) => i === index ? { ...a, [key]: value } : a) }));
  }

  async function saveRoom(event) {

    event.preventDefault();

    if (!editor || saving || uploadingImage) return;

    const price = Number(form.price_per_night);

    const capacity = Number(form.capacity);

    const online = form.availability === "Online" ? 1 : 0;
    const offline = form.availability === "Offline" ? 1 : 0;

    if (!form.city_id || !form.area_id ||
      !cityMatchesHotel(form.city_id) || !areaMatchesHotel(form.area_id)) {
      setFormError("Select the city and area belonging to your assigned hotel. Update Hotel Management first if needed.");
      return;
    }
    if (!form.room_type.trim() || !form.original_room_number.trim() || form.original_room_number.trim().length > 50 || form.price_per_night === "" ||

      !Number.isFinite(price) || price < 0 || price > 9999999999.99 ||

      !Number.isInteger(capacity) || capacity < 1 || capacity > 1000 ||

      !["Online", "Offline"].includes(form.availability)) {

      setFormError("Enter the Original Room Number, room type, price, guest capacity and availability.");

      return;

    }

    if ((form.gallery || []).length > 7) { setFormError("Maximum 7 images allowed."); return; }
    if ((form.amenities || []).some(a => !a.name.trim() && a.value.trim())) {
      setFormError("Enter a name for every amenity value."); return;
    }
    setSaving(true);

    setFormError("");

    try {

      await roomsRequest(editor.id == null ? "create" : "update", {

        ...(editor.id == null ? {} : { id: editor.id }),

        ...form,
        gallery: form.gallery || [],
        image_url: form.gallery?.[0] || "",
        amenities: (form.amenities || []).filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), value: a.value.trim() })),
        city_id: String(roomLocation.city_id),
        area_id: String(roomLocation.area_id),

        original_room_number: form.original_room_number.trim(),
        room_name: form.room_type.trim(),
        room_type: form.room_type.trim(),

        price_per_night: price,

        capacity,

        total_rooms: 1,
        online_rooms: online,
        offline_rooms: offline,

      });

      await reload();

      setEditor(null);

      setError("");

    } catch (err) {

      if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

      else setFormError(err.message || "Unable to save room.");

    } finally { setSaving(false); }

  }



  async function deleteRoom(room) {

    if (deletingId != null || !window.confirm(`Delete ${room.room_name}?`)) return;

    setDeletingId(room.id);

    setError("");

    try {

      await roomsRequest("delete", { id: room.id });

      await reload();

    } catch (err) {

      if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

      else setError(err.message || "Unable to delete room.");

    } finally { setDeletingId(null); }

  }



  return (

    <>

      <div className="ns-heading">

        <div>

          <span>INVENTORY</span>

          <h1>Room Management</h1>

          <p>Add each room separately, with an Online or Offline booking channel.</p>

        </div>

        <button type="button" className="ns-btn" onClick={openNew}>

          <Plus size={17} /> Add Room

        </button>

      </div>

      <section className="ns-panel">

        <div className="ns-room-toolbar">

          <input aria-label="Search rooms" placeholder="Search room name, number, type or status..."

            value={search} onChange={(e) => setSearch(e.target.value)} />

        </div>

        {error && <p className="ns-room-error" role="alert">{error}</p>}

        {loading ? <p>Loading rooms...</p> : (

          <div className="ns-table-wrap">

            <table className="ns-table">

              <thead><tr>

                <th>Room Code / Type</th><th>Original Room Number</th><th>Room Type</th><th>Capacity</th><th>Availability</th>

                <th>Nightly Price</th><th>Status</th><th>Actions</th>

              </tr></thead>

              <tbody>

                {visible.map((room) => (

                  <tr key={room.id}>

                    <td><div className="ns-room-name">

                      {room.image_url ? <img src={room.image_url} alt={room.room_name} /> :

                        <span className="ns-room-image-placeholder"><BedDouble size={22} /></span>}

                      <div><strong>{room.room_name}</strong><small>{room.room_code || "—"}</small></div>

                    </div></td>

                    <td>{room.original_room_number || room.room_number || "—"}</td>
                    <td>{room.room_type || "—"}</td>

                    <td><Users size={14} /> {room.capacity}</td>

                    <td><span className="ns-status">{Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online"}</span></td>

                    <td>{money(room.price_per_night)}</td>

                    <td><span className="ns-status">{room.status}</span></td>

                    <td><div className="ns-actions">

                      <button type="button" onClick={() => openEdit(room)} aria-label={`Edit ${room.room_name}`}><Pencil size={17} /></button>

                      <button type="button" onClick={() => deleteRoom(room)} disabled={deletingId === room.id}

                        aria-label={`Delete ${room.room_name}`}><Trash2 size={17} /></button>

                    </div></td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!visible.length && <p className="ns-empty">No room types found. Add a room to get started.</p>}

          </div>

        )}

      </section>

      <p className="ns-note">Room inventory is loaded from MySQL for your assigned hotel.</p>

      {editor && (

        <div className="ns-room-overlay" role="presentation" onMouseDown={(e) => {

          if (e.target === e.currentTarget && !saving) setEditor(null);

        }}>

          <section className="ns-room-dialog" role="dialog" aria-modal="true"

            aria-label={editor.id == null ? "Add room" : "Edit room"}>

            <div className="ns-room-dialog-header">

              <h2>{editor.id == null ? "Add Room" : "Edit Room"}</h2>

              <button type="button" disabled={saving} onClick={() => setEditor(null)} aria-label="Close"><X size={20} /></button>

            </div>

            <form onSubmit={saveRoom} className="ns-room-form">

              <div className="ns-room-fields">
                <label>City
                  <select required value={form.city_id} disabled={locationsLoading && !cityOptions.length}
                    onChange={(e) => setForm((prev) => ({ ...prev, city_id: e.target.value, area_id: "" }))}>
                    <option value="">{locationsLoading && !cityOptions.length ? "Loading Cities..." : "Select City"}</option>
                    {cityOptions.map((city) => (
                      <option key={city.id} value={String(city.id)}>{city.city_name}</option>
                    ))}
                    {roomLocation?.city_id && roomLocation?.city_name &&
                      !cityOptions.some((c) => String(c.id) === String(roomLocation.city_id)) && (
                        <option value={String(roomLocation.city_id)}>{roomLocation.city_name}</option>
                      )}
                  </select>
                </label>
                <label>Area
                  <select required value={form.area_id} disabled={!form.city_id || (locationsLoading && !areaOptions.length)}
                    onChange={(e) => updateField("area_id", e.target.value)}>
                    <option value="">{locationsLoading && !areaOptions.length ? "Loading Areas..." : "Select Area"}</option>
                    {areaOptions.map((area) => (
                      <option key={area.id} value={String(area.id)}>{area.area_name}</option>
                    ))}
                    {String(form.city_id) === String(roomLocation?.city_id) && roomLocation?.area_id && roomLocation?.area_name &&
                      !areaOptions.some((a) => String(a.id) === String(roomLocation.area_id)) && (
                        <option value={String(roomLocation.area_id)}>{roomLocation.area_name}</option>
                      )}
                  </select>
                </label>
              </div>
              {locationError && <p className="ns-room-error" role="alert">{locationError}</p>}
              <p className="ns-note">Cities and areas load from getCities.php and getAreasByCities.php. Rooms must use your assigned hotel's location.</p>
              <div className="ns-room-fields">

                <label>Room Type<input required maxLength={100} value={form.room_type} placeholder="e.g. Deluxe"

                  onChange={(e) => updateField("room_type", e.target.value)} /></label>
                <label>Original Room Number<input required maxLength={50} value={form.original_room_number} placeholder="e.g. 101 or A-201"
                  onChange={(e) => updateField("original_room_number", e.target.value)} /></label>

              </div>

              <div className="ns-room-fields">

                <label>Price / Night (PKR)<input required type="number" min="0" step="0.01"

                  value={form.price_per_night} onChange={(e) => updateField("price_per_night", e.target.value)} /></label>

                <label>Guest Capacity<input required type="number" min="1" max="1000" step="1"

                  value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} /></label>

              </div>

              <div className="ns-room-availability">
                <strong>Room Availability</strong>
                <div style={{ display: "flex", gap: 12, marginTop: 10, marginBottom: 10 }}>
                  {["Online", "Offline"].map((option) => (
                    <button key={option} type="button"
                      aria-pressed={form.availability === option}
                      onClick={() => updateField("availability", option)}
                      style={{
                        flex: 1, padding: "12px 16px", borderRadius: 10,
                        border: form.availability === option ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: form.availability === option ? "#dbeafe" : "transparent",
                        color: form.availability === option ? "#1d4ed8" : "inherit",
                        fontWeight: 700, cursor: "pointer"
                      }}>
                      {option}
                    </button>
                  ))}
                </div>
                <small>{form.availability === "Online" ? "Bookable on customer website" : "Manual hotel bookings only"}</small>
              </div>
              <label>Status<select value={form.status} onChange={(e) => updateField("status", e.target.value)}>

                <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>

              </select></label>

              <div className="ns-room-gallery-editor">
                <strong>Room Images ({(form.gallery || []).length}/7)</strong>
                <p className="ns-note">Upload up to 7 images. First image is the cover.</p>
                <label><span><ImagePlus size={16} /> Add images from device</span>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingImage || saving || (form.gallery || []).length >= 7}
                    onChange={e => { uploadRoomImages(e.target.files); e.target.value = ""; }} />
                </label>
                <label>Or add image URL
                  <div className="ns-room-inline">
                    <input type="url" placeholder="https://example.com/room.jpg" id="ns-room-url" />
                    <button type="button" className="ns-cancel" onClick={() => {
                      const input = document.getElementById("ns-room-url");
                      const url = input?.value.trim();
                      if (!url) return;
                      if ((form.gallery || []).length >= 7) { setImageUploadError("Maximum 7 images."); return; }
                      setForm(prev => { const gallery = [...new Set([...(prev.gallery || []), url])]; return { ...prev, gallery, image_url: gallery[0] }; });
                      input.value = "";
                    }}>Add URL</button>
                  </div>
                </label>
                {uploadingImage && <p className="ns-note">Uploading images...</p>}
                {imageUploadError && <p className="ns-room-error" role="alert">{imageUploadError}</p>}
                <div className="ns-room-gallery-grid">
                  {(form.gallery || []).map((url, i) => <div key={url} className="ns-room-gallery-tile">
                    <img src={url} alt={`Room image ${i + 1}`} />
                    <span>{i === 0 ? "Cover" : `Photo ${i + 1}`}</span>
                    <button type="button" onClick={() => removeGalleryImage(url)} aria-label="Remove image">×</button>
                  </div>)}
                </div>
              </div>
              <div className="ns-room-amenities-editor">
                <div className="ns-room-amenities-head"><strong>Amenities</strong>
                  <button type="button" className="ns-cancel" disabled={(form.amenities || []).length >= 60}
                    onClick={() => setForm(prev => ({ ...prev, amenities: [...(prev.amenities || []), { name: "", value: "" }] }))}>+ Add Amenity</button>
                </div>
                {(form.amenities || []).map((a, i) => <div className="ns-room-amenity-row" key={i}>
                  <input aria-label={`Amenity ${i + 1} name`} placeholder="Amenity name (e.g. WiFi)" maxLength={100} value={a.name}
                    onChange={e => updateAmenity(i, "name", e.target.value)} />
                  <input aria-label={`Amenity ${i + 1} value`} placeholder="Value (e.g. Free)" maxLength={250} value={a.value}
                    onChange={e => updateAmenity(i, "value", e.target.value)} />
                  <button type="button" className="ns-cancel" aria-label="Remove amenity"
                    onClick={() => setForm(prev => ({ ...prev, amenities: prev.amenities.filter((_, n) => n !== i) }))}>×</button>
                </div>)}
              </div>

              <label>Description<textarea rows={3} maxLength={20000} value={form.description}

                onChange={(e) => updateField("description", e.target.value)} /></label>

              {formError && <p className="ns-room-error" role="alert">{formError}</p>}

              <div className="ns-room-actions">

                <button type="button" className="ns-cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</button>

                <button type="submit" className="ns-btn" disabled={saving || uploadingImage}>{saving ? "Saving..." : "Save Room"}</button>

              </div>

            </form>

          </section>

        </div>

      )}

    </>

  );

}



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
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
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
  const filtered = bookings.filter(b => channel(b) === tab &&
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
        {["Online", "Offline"].map(t => <button key={t} type="button" onClick={() => { setTab(t); setShowForm(false); setError(""); }} className={tab === t ? "ns-btn" : "ns-cancel"}>{t} Bookings ({bookings.filter(b => channel(b) === t).length})</button>)}
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
      <input className="ns-search" aria-label="Search bookings" placeholder="Search booking, guest, room..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", marginBottom: 16 }} />
      {error && <p className="ns-room-error" role="alert">{error}</p>}{notice && <p className="ns-note" role="status">{notice}</p>}
      {loading ? <p>Loading bookings...</p> : <div className="ns-table-wrap"><table className="ns-table"><thead><tr><th>Booking / Guest</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {filtered.map(b => <tr key={b.id}><td><strong>{b.booking_reference}</strong><small>{b.guest_name}</small><small>{b.guest_phone}</small></td>
          <td><strong>{b.room_code || b.room_name || `RM #${b.room_id}`}</strong><small>{b.hotel_name || ""}</small></td>
          <td>{b.check_in} → {b.check_out}</td><td>{money(b.total_amount)}</td><td>{displayStatus(b)}</td>
          <td><div className="ns-actions" style={{ flexWrap: "wrap", gap: 6 }}>
            {b.status === "Pending" && <><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Confirmed")}>Confirm</button><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
            {b.status === "Confirmed" && !b.checked_in_at && <><button disabled={busyId !== null} onClick={() => change(b, "check_in")}>Check In</button><button disabled={busyId !== null} onClick={() => change(b, "update_status", "Cancelled")}>Cancel</button></>}
            {b.status === "Confirmed" && b.checked_in_at && !b.checked_out_at && <button disabled={busyId !== null} onClick={() => change(b, "check_out")}>Check Out</button>}
          </div></td></tr>)}
      </tbody></table>{filtered.length === 0 && <p className="ns-empty">No {tab.toLowerCase()} bookings found.</p>}</div>}
    </section>
  </>;
}

// Area Management: MySQL-backed city filter, list and CRUD.
const AREAS_ROOT = "https://coreops.pk/Hotel/api";
const areaBlank = { city_id: "", area_name: "", status: "YES" };

async function areasApi(endpoint, payload, signal) {
  const response = await fetch(`${AREAS_ROOT}/${endpoint}.php`, {
    method: payload ? "POST" : "GET",
    credentials: "include",
    ...(payload ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) } : {}),
    ...(signal ? { signal } : {}),
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error(`${endpoint}.php returned invalid JSON.`); }
  if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(areaBlank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const [areaData, cityData] = await Promise.all([
        areasApi("areas", undefined, signal), areasApi("cities", undefined, signal),
      ]);
      if (!signal?.aborted) {
        setAreas(Array.isArray(areaData.areas) ? areaData.areas : []);
        setCities(Array.isArray(cityData.cities) ? cityData.cities : []);
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const activeCities = useMemo(() => cities.filter(c => c.status === "YES"), [cities]);
  const filtered = useMemo(() => areas.filter(a => {
    const matchesText = `${a.area_name} ${a.city_name} ${a.status}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesText && (!cityFilter || String(a.city_id) === cityFilter);
  }), [areas, search, cityFilter]);

  function add() {
    setForm({ ...areaBlank, city_id: activeCities[0] ? String(activeCities[0].id) : "" });
    setEditor({ mode: "create" });
    setError(""); setNotice("");
  }
  function edit(area) {
    setForm({ city_id: String(area.city_id), area_name: area.area_name || "", status: area.status || "YES" });
    setEditor({ mode: "update", id: area.id });
    setError(""); setNotice("");
  }

  async function save(e) {
    e.preventDefault();
    if (!editor || saving) return;
    const cityId = Number(form.city_id);
    if (!Number.isInteger(cityId) || cityId < 1) { setError("Select a city."); return; }
    if (!form.area_name.trim()) { setError("Area name is required."); return; }
    setSaving(true); setError("");
    try {
      const result = await areasApi("areas", {
        action: editor.mode,
        ...(editor.mode === "update" ? { id: editor.id } : {}),
        city_id: cityId,
        area_name: form.area_name.trim(),
        status: form.status,
      });
      setEditor(null);
      await load();
      setNotice(result.message || "Area saved successfully.");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(area) {
    if (!window.confirm(`Delete ${area.area_name} (${area.city_name})? This cannot be undone.`)) return;
    setDeleting(area.id); setError(""); setNotice("");
    try {
      const result = await areasApi("areas", { action: "delete", id: area.id });
      await load();
      setNotice(result.message || "Area deleted.");
    } catch (err) { setError(err.message); }
    finally { setDeleting(null); }
  }

  return (
    <>
      <div className="ns-heading">
        <div>
          <span>LOCATION MANAGEMENT</span>
          <h1>Area Management</h1>
          <p>Manage areas and their cities in MySQL.</p>
        </div>
        <button type="button" className="ns-btn" onClick={add} disabled={loading || !activeCities.length}>
          <Plus size={17} /> Add Area
        </button>
      </div>

      <section className="ns-panel">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <input className="ns-search" placeholder="Search areas..." aria-label="Search areas" value={search} onChange={e => setSearch(e.target.value)} />
          <select aria-label="Filter by city" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c.id} value={String(c.id)}>{c.city_name}</option>)}
          </select>
          <button type="button" onClick={() => load()} aria-label="Refresh areas" title="Refresh areas" disabled={loading}>
            <RefreshCw size={19} />
          </button>
        </div>
        {!loading && !activeCities.length && <p role="status">Add an active city in City Management before adding an area.</p>}
        {error && <p role="alert" className="ns-room-error">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {loading ? <p>Loading areas...</p> : (
          <div className="ns-table-wrap">
            <table className="ns-table">
              <thead><tr><th>ID</th><th>Area Name</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(area => (
                  <tr key={area.id}>
                    <td>{area.id}</td>
                    <td><strong>{area.area_name}</strong></td>
                    <td>{area.city_name}</td>
                    <td><span className="ns-status">{area.status}</span></td>
                    <td>
                      <div className="ns-actions">
                        <button type="button" onClick={() => edit(area)} aria-label={`Edit ${area.area_name}`}><Pencil size={17} /></button>
                        <button type="button" onClick={() => remove(area)} disabled={deleting === area.id} aria-label={`Delete ${area.area_name}`}><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <p className="ns-empty">No areas found.</p>}
          </div>
        )}
      </section>

      {editor && (
        <div className="ns-room-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !saving) setEditor(null); }}>
          <section className="ns-room-dialog" role="dialog" aria-modal="true" aria-label={editor.mode === "create" ? "Add Area" : "Edit Area"}>
            <div className="ns-room-dialog-header">
              <h2>{editor.mode === "create" ? "Add Area" : "Edit Area"}</h2>
              <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close"><X size={20} /></button>
            </div>
            <form className="ns-room-form" onSubmit={save}>
              <label>City
                <select required value={form.city_id} onChange={e => setForm(p => ({ ...p, city_id: e.target.value }))}>
                  <option value="">Select City</option>
                  {cities.filter(c => c.status === "YES" || String(c.id) === form.city_id).map(c => (
                    <option key={c.id} value={String(c.id)} disabled={c.status !== "YES"}>{c.city_name}{c.status !== "YES" ? " (Inactive)" : ""}</option>
                  ))}
                </select>
              </label>
              <label>Area Name
                <input required maxLength={150} value={form.area_name} onChange={e => setForm(p => ({ ...p, area_name: e.target.value }))} placeholder="e.g. Gulberg" />
              </label>
              <label>Status
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>
                </select>
              </label>
              {error && <p role="alert" className="ns-room-error">{error}</p>}
              <div className="ns-room-actions">
                <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="ns-btn" disabled={saving}>{saving ? "Saving..." : "Save Area"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
