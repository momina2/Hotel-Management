




// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BedDouble, Plus, Pencil, Trash2, Users, ImagePlus, X } from "lucide-react";
// import "./admin.css";


// const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");

// const ROOMS_API = "https://coreops.pk/Hotel/api/rooms.php";
// const ROOM_CITIES_API = "https://coreops.pk/Hotel/api/getCities.php";
// const ROOM_AREAS_API = "https://coreops.pk/Hotel/api/getAreasByCities.php";
// const ROOM_UPLOAD_API = ROOMS_API;

// async function roomLocationRequest(url, signal) {
//     const response = await fetch(url, { method: "GET", credentials: "include", cache: "no-store", signal });
//     const result = await response.json();
//     if (!response.ok || !result.success) throw new Error(result.message || "Could not load locations.");
//     return result;
// }


// const blankRoom = {

//     room_type: "", original_room_number: "", price_per_night: "", discounted_price_per_night: "",
//     city_id: "", area_id: "",

//     capacity: "2", availability: "Online", description: "", image_url: "", gallery: [], amenities: [], status: "YES",

// };



// async function roomsRequest(action, fields = {}, signal) {

//     const response = await fetch(ROOMS_API, {

//         method: "POST",

//         credentials: "include",

//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action, ...fields }),

//         signal,

//     });

//     let result;

//     try { result = await response.json(); }

//     catch { throw new Error("Server returned an invalid response."); }

//     if (response.status === 401 || response.status === 403) {

//         throw new Error(result.message || "Session expired. Please log in again.");

//     }

//     if (!response.ok || !result.success) {

//         throw new Error(result.message || "Room request failed.");

//     }

//     return result;

// }



// export function AdminRooms() {

//     const navigate = useNavigate();

//     const [rooms, setRooms] = useState([]);
//     const [hotels, setHotels] = useState([]);
//     const [selectedHotelId, setSelectedHotelId] = useState("");
//     const [roomLocation, setRoomLocation] = useState(null);
//     const [cityOptions, setCityOptions] = useState([]);
//     const [areaOptions, setAreaOptions] = useState([]);
//     const [locationsLoading, setLocationsLoading] = useState(false);
//     const [locationError, setLocationError] = useState("");
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [imageUploadError, setImageUploadError] = useState("");

//     const [search, setSearch] = useState("");

//     const [editor, setEditor] = useState(null);

//     const [form, setForm] = useState(blankRoom);

//     const [error, setError] = useState("");

//     const [formError, setFormError] = useState("");

//     const [loading, setLoading] = useState(true);

//     const [saving, setSaving] = useState(false);

//     const [deletingId, setDeletingId] = useState(null);



//     async function reload(signal, hotelId = selectedHotelId) {

//         const response = await fetch(ROOMS_API, {
//             method: "POST", credentials: "include", cache: "no-store", signal,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "list", ...(hotelId ? { hotel_id: hotelId } : {}) })
//         });
//         const result = await response.json();
//         if (!response.ok || !result.success) throw new Error(result.message || "Unable to load rooms");
//         setHotels(Array.isArray(result.hotels) ? result.hotels : []);
//         // City/area dropdown data is loaded separately from company location APIs.
//         if (!hotelId) {
//             const nextId = result.hotel_id || result.hotels?.[0]?.id;
//             if (nextId) setSelectedHotelId(String(nextId));
//         }

//         setRooms(Array.isArray(result.rooms) ? result.rooms : []);
//         setRoomLocation(result.location || null);

//     }



//     useEffect(() => {

//         const controller = new AbortController();

//         reload(controller.signal, selectedHotelId)

//             .catch((err) => {

//                 if (err.name === "AbortError") return;

//                 if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//                 else setError(err.message);

//             })

//             .finally(() => { if (!controller.signal.aborted) setLoading(false); });

//         return () => controller.abort();

//     }, [navigate, selectedHotelId]);



//     // Load company-wide locations independently of the selected hotel/rooms response.
//     useEffect(() => {
//         const controller = new AbortController();
//         const loadLocations = async () => {
//             setLocationsLoading(true);
//             setLocationError("");
//             try {
//                 const endpoints = [
//                     "https://coreops.pk/Hotel/api/cities.php",
//                     "https://coreops.pk/Hotel/api/getAreas.php?city_id=all",
//                 ];
//                 const results = await Promise.all(endpoints.map(async (url) => {
//                     const response = await fetch(url, {
//                         method: "GET", credentials: "include", cache: "no-store", signal: controller.signal,
//                     });
//                     const data = await response.json();
//                     if (!response.ok || !data.success) throw new Error(data.message || `Unable to load locations (${response.status})`);
//                     return data;
//                 }));
//                 if (controller.signal.aborted) return;
//                 const [cityData, areaData] = results;
//                 // getAreas includes the cities used by Area Management as a fallback.
//                 const cityList = Array.isArray(cityData.cities) && cityData.cities.length
//                     ? cityData.cities : (Array.isArray(areaData.cities) ? areaData.cities : []);
//                 setCityOptions(cityList);
//                 setAreaOptions(Array.isArray(areaData.areas) ? areaData.areas : []);
//             } catch (err) {
//                 if (!controller.signal.aborted) setLocationError(err.message || "Unable to load cities and areas.");
//             } finally {
//                 if (!controller.signal.aborted) setLocationsLoading(false);
//             }
//         };
//         loadLocations();
//         return () => controller.abort();
//     }, []);

//     // City and area options come from company-scoped location APIs.
//     // Rooms remain tied to one hotel; changing the location filters hotel choices.
//     const filteredAreaOptions = areaOptions.filter(a => String(a.city_id) === String(form.city_id));

//     const visible = rooms.filter((room) =>

//         `${room.room_name} ${room.room_code || ""} ${room.room_type || ""} ${room.original_room_number || room.room_number || ""} ${room.status || ""}`

//             .toLowerCase().includes(search.toLowerCase())

//     );



//     function openNew() {

//         if (!hotels.length) { setError("Add a hotel in Hotel Management first."); return; }
//         setEditor({ id: null });

//         setForm({ ...blankRoom, city_id: String(roomLocation?.city_id || ""), area_id: String(roomLocation?.area_id || ""), hotel_id: String(selectedHotelId || hotels[0]?.id || "") });

//         setFormError("");
//         setImageUploadError("");

//     }



//     function openEdit(room) {

//         if (!selectedHotelId) { setError("Select a hotel first."); return; }
//         setEditor({ id: room.id });

//         setForm({




//             room_type: room.room_type || "",
//             original_room_number: String(room.original_room_number ?? room.room_number ?? ""),

//             price_per_night: String(room.price_per_night ?? ""),
//             discounted_price_per_night: room.discounted_price_per_night == null ? "" : String(room.discounted_price_per_night),

//             capacity: String(room.capacity ?? 2),

//             availability: Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online",

//             description: room.description || "",

//             image_url: room.image_url || "",
//             gallery: Array.isArray(room.gallery) && room.gallery.length ? room.gallery : (room.image_url ? [room.image_url] : []),
//             amenities: Array.isArray(room.amenities) ? room.amenities : [],

//             status: room.status || "YES",
//             city_id: String(room.city_id || roomLocation?.city_id || ""),
//             area_id: String(room.area_id || roomLocation?.area_id || ""),
//             hotel_id: selectedHotelId || "",
//         });

//         setFormError("");
//         setImageUploadError("");

//     }



//     function updateField(key, value) {

//         setForm((previous) => ({ ...previous, [key]: value }));

//     }



//     async function uploadRoomImages(files) {
//         const selected = Array.from(files || []);
//         if (!selected.length) return;
//         if ((form.gallery?.length || 0) + selected.length > 7) {
//             setImageUploadError("Maximum 7 images per room."); return;
//         }
//         if (!selectedHotelId && !form.hotel_id) { setImageUploadError("Please select a hotel before uploading images."); return; }
//         setUploadingImage(true);
//         setImageUploadError("");
//         const urls = [];
//         try {
//             for (const file of selected) {
//                 if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
//                     throw new Error("Only JPG, PNG, WebP images up to 5 MB each are allowed.");
//                 }
//                 const data = new FormData();
//                 data.append("action", "upload_image");
//                 data.append("image", file);
//                 data.append("hotel_id", String(selectedHotelId || form.hotel_id || ""));
//                 const response = await fetch(ROOM_UPLOAD_API, { method: "POST", credentials: "include", body: data });
//                 const json = await response.json().catch(() => null);
//                 if (!json) throw new Error(`Upload server returned an invalid response (HTTP ${response.status}).`);
//                 if (!response.ok || !json.success || !json.image_url) throw new Error(json.message || "Image upload failed.");
//                 urls.push(json.image_url);
//             }
//             setForm(prev => {
//                 const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
//                 return { ...prev, gallery, image_url: gallery[0] || "" };
//             });
//         } catch (err) {
//             // Preserve images that already uploaded successfully.
//             if (urls.length) setForm(prev => {
//                 const gallery = [...new Set([...(prev.gallery || []), ...urls])].slice(0, 7);
//                 return { ...prev, gallery, image_url: gallery[0] || "" };
//             });
//             setImageUploadError(err.message || "Image upload failed.");
//         } finally { setUploadingImage(false); }
//     }

//     function removeGalleryImage(url) {
//         setForm(prev => {
//             const gallery = (prev.gallery || []).filter(item => item !== url);
//             return { ...prev, gallery, image_url: gallery[0] || "" };
//         });
//     }

//     function updateAmenity(index, key, value) {
//         setForm(prev => ({ ...prev, amenities: (prev.amenities || []).map((a, i) => i === index ? { ...a, [key]: value } : a) }));
//     }

//     async function saveRoom(event) {

//         event.preventDefault();

//         if (!editor || saving || uploadingImage) return;

//         const price = Number(form.price_per_night);
//         const discountPrice = form.discounted_price_per_night === "" ? null : Number(form.discounted_price_per_night);

//         const capacity = Number(form.capacity);

//         const online = form.availability === "Online" ? 1 : 0;
//         const offline = form.availability === "Offline" ? 1 : 0;

//         if (!selectedHotelId || !hotels.some(h => String(h.id) === String(selectedHotelId))) {
//             setFormError("Please select a hotel before saving the room."); return;
//         }
//         if (!form.city_id || !form.area_id || !filteredAreaOptions.some(a => String(a.id) === String(form.area_id))) {
//             setFormError("Please select a valid city and area for this room."); return;
//         }
//         if (!form.room_type.trim() || !form.original_room_number.trim() || form.original_room_number.trim().length > 50 || form.price_per_night === "" ||

//             !Number.isFinite(price) || price < 0 || price > 9999999999.99 ||
//             (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) ||

//             !Number.isInteger(capacity) || capacity < 1 || capacity > 1000 ||

//             !["Online", "Offline"].includes(form.availability)) {

//             setFormError("Enter the Original Room Number, room type, price, guest capacity and availability.");

//             return;

//         }

//         if ((form.gallery || []).length > 7) { setFormError("Maximum 7 images allowed."); return; }
//         if ((form.amenities || []).some(a => !a.name.trim() && a.value.trim())) {
//             setFormError("Enter a name for every amenity value."); return;
//         }
//         setSaving(true);

//         setFormError("");

//         try {

//             await roomsRequest(editor.id == null ? "create" : "update", {

//                 ...(editor.id == null ? {} : { id: editor.id }),

//                 ...form,
//                 hotel_id: selectedHotelId,
//                 gallery: form.gallery || [],
//                 image_url: form.gallery?.[0] || "",
//                 amenities: (form.amenities || []).filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), value: a.value.trim() })),
//                 city_id: String(form.city_id),
//                 area_id: String(form.area_id),

//                 original_room_number: form.original_room_number.trim(),
//                 room_name: form.room_type.trim(),
//                 room_type: form.room_type.trim(),

//                 price_per_night: price,
//                 discounted_price_per_night: discountPrice,

//                 capacity,

//                 total_rooms: 1,
//                 online_rooms: online,
//                 offline_rooms: offline,

//             });

//             await reload();

//             setEditor(null);

//             setError("");

//         } catch (err) {

//             if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//             else setFormError(err.message || "Unable to save room.");

//         } finally { setSaving(false); }

//     }



//     async function deleteRoom(room) {

//         if (deletingId != null || !window.confirm(`Delete ${room.room_name}?`)) return;

//         setDeletingId(room.id);

//         setError("");

//         try {

//             await roomsRequest("delete", { id: room.id, hotel_id: selectedHotelId });

//             await reload();

//         } catch (err) {

//             if (/session expired/i.test(err.message)) navigate("/admin/login", { replace: true });

//             else setError(err.message || "Unable to delete room.");

//         } finally { setDeletingId(null); }

//     }



//     return (

//         <>

//             <div className="ns-heading">

//                 <div>

//                     <span>INVENTORY</span>

//                     <h1>Room Management</h1>

//                     <p>Add each room separately, with an Online or Offline booking channel.</p>

//                 </div>

//                 <button type="button" className="ns-btn" onClick={openNew} disabled={!hotels.length}>

//                     <Plus size={17} /> Add Room

//                 </button>

//             </div>

//             <section className="ns-panel">
//                 <div className="ns-room-toolbar">

//                     <input aria-label="Search rooms" placeholder="Search room name, number, type or status..."

//                         value={search} onChange={(e) => setSearch(e.target.value)} />

//                 </div>

//                 {error && <p className="ns-room-error" role="alert">{error}</p>}

//                 {loading ? <p>Loading rooms...</p> : (

//                     <div className="ns-table-wrap ns-rooms-table-wrap">

//                         <table className="ns-table ns-rooms-table">

//                             <thead><tr>

//                                 <th>Room Code / Type</th><th>Original Room Number</th><th>Room Type</th><th>Capacity</th><th>Availability</th>

//                                 <th>Nightly Price</th><th>Status</th><th>Actions</th>

//                             </tr></thead>

//                             <tbody>

//                                 {visible.map((room) => (

//                                     <tr key={room.id}>

//                                         <td><div className="ns-room-name">

//                                             {room.image_url ? <img src={room.image_url} alt={room.room_name} /> :

//                                                 <span className="ns-room-image-placeholder"><BedDouble size={22} /></span>}

//                                             <div><strong>{room.room_name}</strong><small>{room.room_code || "—"}</small></div>

//                                         </div></td>

//                                         <td>{room.original_room_number || room.room_number || "—"}</td>
//                                         <td>{room.room_type || "—"}</td>

//                                         <td><Users size={14} /> {room.capacity}</td>

//                                         <td><span className="ns-status">{Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online"}</span></td>

//                                         <td>{room.discounted_price_per_night != null && Number(room.discounted_price_per_night) < Number(room.price_per_night) ? <><s style={{ color: "#888" }}>{money(room.price_per_night)}</s><br /><strong style={{ color: "#15803d" }}>{money(room.discounted_price_per_night)}</strong></> : money(room.price_per_night)}</td>

//                                         <td><span className="ns-status">{room.status}</span></td>

//                                         <td><div className="ns-actions">

//                                             <button type="button" onClick={() => openEdit(room)} aria-label={`Edit ${room.room_name}`}><Pencil size={17} /></button>

//                                             <button type="button" onClick={() => deleteRoom(room)} disabled={deletingId === room.id}

//                                                 aria-label={`Delete ${room.room_name}`}><Trash2 size={17} /></button>

//                                         </div></td>

//                                     </tr>

//                                 ))}

//                             </tbody>

//                         </table>

//                         {!visible.length && <p className="ns-empty">No room types found. Add a room to get started.</p>}

//                     </div>

//                 )}

//             </section>

//             <p className="ns-note">Room inventory is loaded from MySQL for your assigned hotel.</p>

//             {editor && (

//                 <div className="ns-room-overlay" role="presentation" onMouseDown={(e) => {

//                     if (e.target === e.currentTarget && !saving) setEditor(null);

//                 }}>

//                     <section className="ns-room-dialog" role="dialog" aria-modal="true"

//                         aria-label={editor.id == null ? "Add room" : "Edit room"}>

//                         <div className="ns-room-dialog-header">

//                             <h2>{editor.id == null ? "Add Room" : "Edit Room"}</h2>

//                             <button type="button" disabled={saving} onClick={() => setEditor(null)} aria-label="Close"><X size={20} /></button>

//                         </div>

//                         <form onSubmit={saveRoom} className="ns-room-form">

//                             {locationsLoading && <p>Loading cities and areas...</p>}
//                             {locationError && <p role="alert" className="ns-room-error">{locationError}</p>}
//                             {hotels.length > 1 && <label>Hotel
//                                 <select required value={selectedHotelId} onChange={e => { setSelectedHotelId(e.target.value); setForm(prev => ({ ...prev, hotel_id: e.target.value })); }}>
//                                     <option value="">Select hotel</option>
//                                     {hotels.map(h => <option key={h.id} value={String(h.id)}>{h.hotel_name}</option>)}
//                                 </select>
//                             </label>}
//                             <div className="ns-room-fields">
//                                 <label>City
//                                     <select required value={form.city_id}
//                                         onChange={(e) => {
//                                             setForm(prev => ({ ...prev, city_id: e.target.value, area_id: "" }));
//                                         }}>
//                                         <option value="">Select City</option>
//                                         {cityOptions.filter(c => String(c.status || "YES").toUpperCase() === "YES" || String(c.id) === String(form.city_id)).map(city => (
//                                             <option key={city.id} value={String(city.id)}>{city.city_name}</option>
//                                         ))}
//                                     </select>
//                                 </label>
//                                 <label>Area
//                                     <select required value={form.area_id} disabled={!form.city_id}
//                                         onChange={(e) => {
//                                             const areaId = e.target.value;
//                                             setForm(prev => ({ ...prev, area_id: areaId }));
//                                         }}>
//                                         <option value="">Select Area</option>
//                                         {filteredAreaOptions.filter(a => String(a.status || "YES").toUpperCase() === "YES" || String(a.id) === String(form.area_id)).map(area => (
//                                             <option key={area.id} value={String(area.id)}>{area.area_name}</option>
//                                         ))}
//                                     </select>
//                                 </label>
//                             </div>
//                             {locationError && <p className="ns-room-error" role="alert">{locationError}</p>}
//                             <div className="ns-room-fields">

//                                 <label>Room Type<input required maxLength={100} value={form.room_type} placeholder="e.g. Deluxe"

//                                     onChange={(e) => updateField("room_type", e.target.value)} /></label>
//                                 <label>Original Room Number<input required maxLength={50} value={form.original_room_number} placeholder="e.g. 101 or A-201"
//                                     onChange={(e) => updateField("original_room_number", e.target.value)} /></label>

//                             </div>

//                             <div className="ns-room-fields">

//                                 <label>Price / Night (PKR)<input required type="number" min="0" step="0.01"

//                                     value={form.price_per_night} onChange={(e) => updateField("price_per_night", e.target.value)} /></label>

//                                 <label>Discounted Price / Night (PKR) — optional<input type="number" min="0" step="0.01"
//                                     placeholder="Leave blank for no discount" value={form.discounted_price_per_night}
//                                     onChange={(e) => updateField("discounted_price_per_night", e.target.value)} />
//                                     {form.discounted_price_per_night !== "" && Number(form.price_per_night) > Number(form.discounted_price_per_night) && <small style={{ display: "block", color: "#15803d" }}>
//                                         {Math.round((1 - Number(form.discounted_price_per_night) / Number(form.price_per_night)) * 100)}% OFF · Saves {money(Number(form.price_per_night) - Number(form.discounted_price_per_night))} per night
//                                     </small>}
//                                 </label>
//                                 <label>Guest Capacity<input required type="number" min="1" max="1000" step="1"

//                                     value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} /></label>

//                             </div>

//                             <div className="ns-room-availability">
//                                 <strong>Room Availability</strong>
//                                 <div style={{ display: "flex", gap: 12, marginTop: 10, marginBottom: 10 }}>
//                                     {["Online", "Offline"].map((option) => (
//                                         <button key={option} type="button"
//                                             aria-pressed={form.availability === option}
//                                             onClick={() => updateField("availability", option)}
//                                             style={{
//                                                 flex: 1, padding: "12px 16px", borderRadius: 10,
//                                                 border: form.availability === option ? "2px solid #2563eb" : "1px solid #cbd5e1",
//                                                 background: form.availability === option ? "#dbeafe" : "transparent",
//                                                 color: form.availability === option ? "#1d4ed8" : "inherit",
//                                                 fontWeight: 700, cursor: "pointer"
//                                             }}>
//                                             {option}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 <small>{form.availability === "Online" ? "Bookable on customer website" : "Manual hotel bookings only"}</small>
//                             </div>
//                             <label>Status<select value={form.status} onChange={(e) => updateField("status", e.target.value)}>

//                                 <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>

//                             </select></label>

//                             <div className="ns-room-gallery-editor">
//                                 <strong>Room Images ({(form.gallery || []).length}/7)</strong>
//                                 <p className="ns-note">Upload up to 7 images. First image is the cover.</p>
//                                 <label><span><ImagePlus size={16} /> Add images from device</span>
//                                     <input type="file" multiple accept="image/jpeg,image/png,image/webp"
//                                         disabled={uploadingImage || saving || (form.gallery || []).length >= 7}
//                                         onChange={e => { uploadRoomImages(e.target.files); e.target.value = ""; }} />
//                                 </label>
//                                 <label>Or add image URL
//                                     <div className="ns-room-inline">
//                                         <input type="url" placeholder="https://example.com/room.jpg" id="ns-room-url" />
//                                         <button type="button" className="ns-cancel" onClick={() => {
//                                             const input = document.getElementById("ns-room-url");
//                                             const url = input?.value.trim();
//                                             if (!url) return;
//                                             if ((form.gallery || []).length >= 7) { setImageUploadError("Maximum 7 images."); return; }
//                                             setForm(prev => { const gallery = [...new Set([...(prev.gallery || []), url])]; return { ...prev, gallery, image_url: gallery[0] }; });
//                                             input.value = "";
//                                         }}>Add URL</button>
//                                     </div>
//                                 </label>
//                                 {uploadingImage && <p className="ns-note">Uploading images...</p>}
//                                 {imageUploadError && <p className="ns-room-error" role="alert">{imageUploadError}</p>}
//                                 <div className="ns-room-gallery-grid">
//                                     {(form.gallery || []).map((url, i) => <div key={url} className="ns-room-gallery-tile">
//                                         <img src={url} alt={`Room image ${i + 1}`} />
//                                         <span>{i === 0 ? "Cover" : `Photo ${i + 1}`}</span>
//                                         <button type="button" onClick={() => removeGalleryImage(url)} aria-label="Remove image">×</button>
//                                     </div>)}
//                                 </div>
//                             </div>
//                             <div className="ns-room-amenities-editor">
//                                 <div className="ns-room-amenities-head"><strong>Amenities</strong>
//                                     <button type="button" className="ns-cancel" disabled={(form.amenities || []).length >= 60}
//                                         onClick={() => setForm(prev => ({ ...prev, amenities: [...(prev.amenities || []), { name: "", value: "" }] }))}>+ Add Amenity</button>
//                                 </div>
//                                 {(form.amenities || []).map((a, i) => <div className="ns-room-amenity-row" key={i}>
//                                     <input aria-label={`Amenity ${i + 1} name`} placeholder="Amenity name (e.g. WiFi)" maxLength={100} value={a.name}
//                                         onChange={e => updateAmenity(i, "name", e.target.value)} />
//                                     <input aria-label={`Amenity ${i + 1} value`} placeholder="Value (e.g. Free)" maxLength={250} value={a.value}
//                                         onChange={e => updateAmenity(i, "value", e.target.value)} />
//                                     <button type="button" className="ns-cancel" aria-label="Remove amenity"
//                                         onClick={() => setForm(prev => ({ ...prev, amenities: prev.amenities.filter((_, n) => n !== i) }))}>×</button>
//                                 </div>)}
//                             </div>

//                             <label>Description<textarea rows={3} maxLength={20000} value={form.description}

//                                 onChange={(e) => updateField("description", e.target.value)} /></label>

//                             {formError && <p className="ns-room-error" role="alert">{formError}</p>}

//                             <div className="ns-room-actions">

//                                 <button type="button" className="ns-cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</button>

//                                 <button type="submit" className="ns-btn" disabled={saving || uploadingImage}>{saving ? "Saving..." : "Save Room"}</button>

//                             </div>

//                         </form>

//                     </section>

//                 </div>

//             )}

//         </>

//     );

// }







import { API_BASE, apiFetch, readJson } from "../../api/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BedDouble, Plus, Pencil, Trash2, Users, ImagePlus, X } from "lucide-react";
import "./admin.css";

const money = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");

const ROOMS_API = `${API_BASE}/rooms.php`;
const ROOM_CITIES_API = `${API_BASE}/getCities.php`;
const ROOM_AREAS_API = `${API_BASE}/getAreas.php?city_id=all`;
const ROOM_UPLOAD_API = ROOMS_API;

async function roomLocationRequest(url, signal) {
    const response = await apiFetch(url, { method: "GET", credentials: "include", cache: "no-store", signal });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Could not load locations.");
    return result;
}


const blankRoom = {

    room_type: "", original_room_number: "", price_per_night: "", discounted_price_per_night: "",
    city_id: "", area_id: "",

    capacity: "2", availability: "Online", description: "", image_url: "", gallery: [], amenities: [], status: "YES",

};



async function roomsRequest(action, fields = {}, signal) {

    const response = await apiFetch(ROOMS_API, {

        method: "POST",

        credentials: "include",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...fields }),

        signal,

    });

    let result;

    result = await readJson(response);

    if (response.status === 401 || response.status === 403) {

        throw new Error(result.message || "Session expired. Please log in again.");

    }

    if (!response.ok || !result.success) {

        throw new Error(result.message || "Room request failed.");

    }

    return result;

}



const roomFilterStyle = {
    width: "100%", minWidth: 0, height: 46, padding: "0 34px 0 14px",
    border: "1px solid #dbe5df", borderRadius: 10, backgroundColor: "#f8faf9",
    color: "#153c32", font: "inherit", boxSizing: "border-box", margin: 0,
};

export function AdminRooms() {

    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState("");
    const [roomLocation, setRoomLocation] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState("");

    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("all");
    const [cityFilter, setCityFilter] = useState("all");
    const [hotelFilter, setHotelFilter] = useState("all");

    const [editor, setEditor] = useState(null);
    const [roomScope, setRoomScope] = useState("single");
    const [hotelRoomNumbers, setHotelRoomNumbers] = useState({});

    const [form, setForm] = useState(blankRoom);

    const [error, setError] = useState("");

    const [formError, setFormError] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);



    // The API lists one hotel per request. Aggregate every authorized hotel for admins.
    async function reload(signal) {
        const initial = await roomsRequest("list", {}, signal);
        const permittedHotels = Array.isArray(initial.hotels) ? initial.hotels : [];
        setHotels(permittedHotels);
        const ids = permittedHotels.map(h => String(h.id));
        if (!ids.length) {
            setRooms([]);
            setSelectedHotelId("");
            setRoomLocation(null);
            return;
        }
        // New backend returns all authorized rooms in the first response.
        // Keep compatibility with older backend versions that require a hotel ID.
        if (initial.hotel_id == null && Array.isArray(initial.rooms) && initial.rooms.length) {
            setRooms(initial.rooms);
            setSelectedHotelId(current => ids.includes(String(current)) ? String(current) : ids[0]);
            setRoomLocation(null);
            return;
        }
        const results = await Promise.all(ids.map(id => roomsRequest("list", { hotel_id: id }, signal)));
        if (signal?.aborted) return;
        setRooms(results.flatMap((result, index) =>
            (Array.isArray(result.rooms) ? result.rooms : []).map(room => ({
                ...room,
                hotel_id: room.hotel_id ?? ids[index],
                hotel_name: permittedHotels[index].hotel_name,
            }))
        ));
        setSelectedHotelId(current => ids.includes(String(current)) ? String(current) : ids[0]);
        setRoomLocation(results[0]?.location || null);
    }

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");
        reload(controller.signal)
            .catch(err => {
                if (err.name === "AbortError") return;
                if (/session expired|please log ?in again/i.test(err.message)) setError("Your hotel session is not valid. Please sign in again.");
                else setError(err.message || "Unable to load rooms.");
            })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [navigate]);

    // Load company-wide locations independently of the selected hotel/rooms response.
    useEffect(() => {
        const controller = new AbortController();
        const loadLocations = async () => {
            setLocationsLoading(true);
            setLocationError("");
            try {
                // Universal (all-company) location lists. Requires the fixed
                // _location_access.php on the server; the old version overwrote the
                // admin session cookie and logged the user out of every module.
                const results = await Promise.all(
                    [`${API_BASE}/cities.php`, `${API_BASE}/areas.php`].map((url) => roomLocationRequest(url, controller.signal))
                );
                if (controller.signal.aborted) return;
                const [cityData, areaData] = results;
                // getAreas includes the cities used by Area Management as a fallback.
                const cityList = Array.isArray(cityData.cities) && cityData.cities.length
                    ? cityData.cities : (Array.isArray(areaData.cities) ? areaData.cities : []);
                setCityOptions(cityList);
                setAreaOptions(Array.isArray(areaData.areas) ? areaData.areas : []);
            } catch (err) {
                if (!controller.signal.aborted) setLocationError(err.message || "Unable to load cities and areas.");
            } finally {
                if (!controller.signal.aborted) setLocationsLoading(false);
            }
        };
        loadLocations();
        return () => controller.abort();
    }, []);

    // City and area options come from company-scoped location APIs.
    // Rooms remain tied to one hotel; changing the location filters hotel choices.
    const filteredAreaOptions = areaOptions.filter(a => String(a.city_id) === String(form.city_id));

    // Require a city first; areas are scoped strictly to that city.
    const selectedCityAreas = cityFilter === "all" ? [] : areaOptions.filter(a => String(a.city_id) === cityFilter);
    const roomCityId = (room) => String(room.city_id ?? hotels.find(h => String(h.id) === String(room.hotel_id))?.city_id ?? "");
    const roomMatchesLocation = (room) =>
        (cityFilter === "all" || roomCityId(room) === cityFilter) &&
        (areaFilter === "all" || String(room.area_id ?? "") === areaFilter || room.area_id == null || String(room.area_id) === "0");

    // Build hotel choices from their actual room assignments, not only hotel_properties.city_id.
    // This also handles rooms assigned to a city different from the hotel's default location.
    const selectedCityHotels = cityFilter === "all" ? [] : hotels.filter(h =>
        (String(h.city_id) === cityFilter && areaFilter === "all") ||
        rooms.some(r => String(r.hotel_id) === String(h.id) && roomMatchesLocation(r))
    );
    const hotelRoomCount = (id) => rooms.filter(r => String(r.hotel_id) === String(id) && roomMatchesLocation(r)).length;
    const visible = rooms.filter((room) =>
        roomMatchesLocation(room) &&
        (hotelFilter === "all" || String(room.hotel_id) === hotelFilter) &&
        `${room.hotel_name || ""} ${room.city_name || ""} ${room.area_name || ""} ${room.room_name} ${room.room_code || ""} ${room.room_type || ""} ${room.original_room_number || room.room_number || ""} ${room.status || ""}`
            .toLowerCase().includes(search.toLowerCase())
    );


    function openNew() {

        if (!hotels.length) { setError("No hotels were returned for this login. Check Hotel Management and the hotel company_id mapping; room creation requires a hotel."); return; }
        setEditor({ id: null });
        setRoomScope("single");
        setHotelRoomNumbers({});

        const hotel = hotels.find(h => String(h.id) === String(selectedHotelId)) || hotels[0];
        setForm({ ...blankRoom, city_id: String(hotel?.city_id || ""), area_id: String(hotel?.area_id || ""), hotel_id: String(hotel?.id || "") });

        setFormError("");
        setImageUploadError("");

    }



    function openEdit(room) {

        setEditor({ id: room.id });
        setRoomScope("single");

        setForm({




            room_type: room.room_type || "",
            original_room_number: String(room.original_room_number ?? room.room_number ?? ""),

            price_per_night: String(room.price_per_night ?? ""),
            discounted_price_per_night: room.discounted_price_per_night == null ? "" : String(room.discounted_price_per_night),

            capacity: String(room.capacity ?? 2),

            availability: Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online",

            description: room.description || "",

            image_url: room.image_url || "",
            gallery: Array.isArray(room.gallery) && room.gallery.length ? room.gallery : (room.image_url ? [room.image_url] : []),
            amenities: Array.isArray(room.amenities) ? room.amenities : [],

            status: room.status || "YES",
            city_id: String(room.city_id || roomLocation?.city_id || ""),
            area_id: room.all_areas || room.area_id == null || String(room.area_id) === "0" ? "all" : String(room.area_id),
            hotel_id: String(room.hotel_id || ""),
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
        if (!form.hotel_id) { setImageUploadError("Please select a hotel before uploading images."); return; }
        setUploadingImage(true);
        setImageUploadError("");
        const urls = [];
        try {
            for (const file of selected) {
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
                    throw new Error("Only JPG, PNG, WebP images up to 5 MB each are allowed.");
                }
                const data = new FormData();
                data.append("action", "upload_image");
                data.append("image", file);
                data.append("hotel_id", String(form.hotel_id || ""));
                const response = await apiFetch(ROOM_UPLOAD_API, { method: "POST", credentials: "include", body: data });
                const json = await response.json().catch(() => null);
                if (!json) throw new Error(`Upload server returned an invalid response (HTTP ${response.status}).`);
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
        const discountPrice = form.discounted_price_per_night === "" ? null : Number(form.discounted_price_per_night);

        const capacity = Number(form.capacity);

        const online = form.availability === "Online" ? 1 : 0;
        const offline = form.availability === "Offline" ? 1 : 0;

        if (roomScope !== "all" && (!form.hotel_id || !hotels.some(h => String(h.id) === String(form.hotel_id)))) {
            setFormError("Please select a hotel before saving the room."); return;
        }
        if (roomScope !== "all" && (!form.city_id || (form.area_id !== "all" && (!form.area_id || !filteredAreaOptions.some(a => String(a.id) === String(form.area_id)))))) {
            setFormError("Please select a valid city and area for this room."); return;
        }
        if (!form.room_type.trim() || (roomScope !== "all" && (!form.original_room_number.trim() || form.original_room_number.trim().length > 50)) || form.price_per_night === "" ||

            !Number.isFinite(price) || price < 0 || price > 9999999999.99 ||
            (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) ||

            !Number.isInteger(capacity) || capacity < 1 || capacity > 1000 ||

            !["Online", "Offline"].includes(form.availability)) {

            setFormError("Enter the Original Room Number, room type, price, guest capacity and availability.");

            return;

        }

        if (roomScope === "all" && (hotels.length === 0 || hotels.some(h => !String(hotelRoomNumbers[h.id] || "").trim() || String(hotelRoomNumbers[h.id]).trim().length > 50))) {
            setFormError("Enter a separate room number (maximum 50 characters) for every hotel."); return;
        }
        if ((form.gallery || []).length > 7) { setFormError("Maximum 7 images allowed."); return; }
        if ((form.amenities || []).some(a => !a.name.trim() && a.value.trim())) {
            setFormError("Enter a name for every amenity value."); return;
        }
        setSaving(true);

        setFormError("");

        try {

            await roomsRequest(roomScope === "all" && editor.id == null ? "bulk_create" : (editor.id == null ? "create" : "update"), {

                ...(editor.id == null ? {} : { id: editor.id }),

                ...form,
                ...(roomScope === "all" && editor.id == null ? {
                    hotel_rooms: hotels.map(h => ({ hotel_id: Number(h.id), room_number: String(hotelRoomNumbers[h.id]).trim() }))
                } : {}),
                hotel_id: form.hotel_id,
                gallery: form.gallery || [],
                image_url: form.gallery?.[0] || "",
                amenities: (form.amenities || []).filter(a => a.name.trim()).map(a => ({ name: a.name.trim(), value: a.value.trim() })),
                city_id: String(form.city_id),
                area_id: form.area_id === "all" ? null : String(form.area_id),
                all_areas: form.area_id === "all",

                original_room_number: form.original_room_number.trim(),
                room_name: form.room_type.trim(),
                room_type: form.room_type.trim(),

                price_per_night: price,
                discounted_price_per_night: discountPrice,

                capacity,

                total_rooms: 1,
                online_rooms: online,
                offline_rooms: offline,

            });

            await reload();

            setEditor(null);

            setError("");

        } catch (err) {

            if (/session expired|please log ?in again/i.test(err.message)) setError("Your hotel session is not valid. Please sign in again.");

            else setFormError(err.message || "Unable to save room.");

        } finally { setSaving(false); }

    }



    async function deleteRoom(room) {

        if (deletingId != null || !window.confirm(`Delete ${room.room_name}?`)) return;

        setDeletingId(room.id);

        setError("");

        try {

            await roomsRequest("delete", { id: room.id, hotel_id: room.hotel_id });

            await reload();

        } catch (err) {

            if (/session expired|please log ?in again/i.test(err.message)) setError("Your hotel session is not valid. Please sign in again.");

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
                <div className="ns-room-toolbar" style={{ display: "grid", gridTemplateColumns: "minmax(230px, 3fr) repeat(3, minmax(140px, 1fr))", gap: 12, alignItems: "center", marginBottom: 16 }}>
                    <input aria-label="Search rooms" placeholder="Search room name, number, type or status..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%", minWidth: 0, height: 46, boxSizing: "border-box", margin: 0 }} />
                    <select aria-label="Filter rooms by city" value={cityFilter}
                        onChange={(e) => { setCityFilter(e.target.value); setAreaFilter("all"); setHotelFilter("all"); }}
                        style={roomFilterStyle}>
                        <option value="all">All Cities</option>
                        {cityOptions.map(c => <option key={c.id} value={String(c.id)}>{c.city_name}</option>)}
                    </select>
                    <select aria-label="Filter rooms by area" value={areaFilter}
                        disabled={cityFilter === "all"} onChange={(e) => { setAreaFilter(e.target.value); setHotelFilter("all"); }} style={{ ...roomFilterStyle, opacity: cityFilter === "all" ? 0.65 : 1 }}>
                        <option value="all">{cityFilter === "all" ? "Select City First" : "All Areas"}</option>
                        {selectedCityAreas.map(a => <option key={a.id} value={String(a.id)}>{a.area_name}</option>)}
                    </select>
                    <select aria-label="Filter rooms by hotel" value={hotelFilter}
                        disabled={cityFilter === "all"} onChange={(e) => setHotelFilter(e.target.value)} style={{ ...roomFilterStyle, opacity: cityFilter === "all" ? 0.65 : 1 }}>
                        <option value="all">{cityFilter === "all" ? "Select City First" : "All Hotels"}</option>
                        {selectedCityHotels.map(h => <option key={h.id} value={String(h.id)}>{h.hotel_name} — {h.city_name || "City not set"} — {h.area_name || "Area not set"} ({hotelRoomCount(h.id)} rooms)</option>)}
                    </select>
                </div>
                <style>{`@media (max-width: 900px) { .ns-room-toolbar { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } } @media (max-width: 520px) { .ns-room-toolbar { grid-template-columns: minmax(0, 1fr) !important; } }`}</style>

                {error && <p className="ns-room-error" role="alert">{error}</p>}

                {loading ? <p>Loading rooms...</p> : (

                    <div className="ns-table-wrap ns-rooms-table-wrap">

                        <table className="ns-table ns-rooms-table">

                            <thead><tr>

                                <th>Room Code / Type</th><th>Original Room Number</th><th>Room Type</th><th>Capacity</th><th>Availability</th>

                                <th>Hotel / City</th><th>Area</th><th>Nightly Price</th><th>Status</th><th>Actions</th>

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

                                        <td><span className="ns-status" data-status={String(Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online").trim().toLowerCase()}>{Number(room.offline_rooms) > 0 && Number(room.online_rooms) === 0 ? "Offline" : "Online"}</span></td>

                                        <td><strong>{room.hotel_name || "—"}</strong><small style={{ display: "block" }}>{room.city_name || cityOptions.find(c => String(c.id) === String(room.city_id))?.city_name || "—"}</small></td>
                                        <td>{room.area_id == null || String(room.area_id) === "0" ? "All Areas" : (areaOptions.find(a => String(a.id) === String(room.area_id))?.area_name || room.area_name || "—")}</td>
                                        <td>{room.discounted_price_per_night != null && Number(room.discounted_price_per_night) < Number(room.price_per_night) ? <><s style={{ color: "#888" }}>{money(room.price_per_night)}</s><br /><strong style={{ color: "#15803d" }}>{money(room.discounted_price_per_night)}</strong></> : money(room.price_per_night)}</td>

                                        <td><span className="ns-status" data-status={String(room.status).trim().toLowerCase()}>{room.status}</span></td>

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

            <p className="ns-note">Room inventory is loaded from MySQL for all hotels you are authorized to access.</p>

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

                            {locationsLoading && <p>Loading cities and areas...</p>}
                            {locationError && <p role="alert" className="ns-room-error">{locationError}</p>}
                            {editor.id == null && hotels.length > 1 && <label>Apply Room To
                                <select value={roomScope} onChange={e => { setRoomScope(e.target.value); setFormError(""); }}>
                                    <option value="single">Specific Hotel</option>
                                    <option value="all">All Hotels (separate room numbers)</option>
                                </select>
                            </label>}
                            {roomScope === "all" && editor.id == null && <div className="ns-room-amenities-editor" style={{ marginBottom: 16 }}>
                                <strong>Original Room Number for Each Hotel</strong>
                                <p className="ns-note">Room type, prices, images and amenities are shared. Each hotel receives its own room record.</p>
                                {hotels.map(h => <label key={h.id} style={{ display: "block", marginTop: 10 }}>
                                    {h.hotel_name} — {h.city_name || "City not set"} — {h.area_name || "Area not set"}
                                    <input required maxLength={50} placeholder="e.g. 101 or A-201" value={hotelRoomNumbers[h.id] || ""}
                                        onChange={e => setHotelRoomNumbers(prev => ({ ...prev, [h.id]: e.target.value }))} />
                                </label>)}
                            </div>}
                            {roomScope !== "all" && <>
                                {hotels.length > 1 && <label>Hotel
                                    <select required value={form.hotel_id} onChange={e => { const hotel = hotels.find(h => String(h.id) === e.target.value); setSelectedHotelId(e.target.value); setForm(prev => ({ ...prev, hotel_id: e.target.value, city_id: String(hotel?.city_id || ""), area_id: String(hotel?.area_id || "") })); }}>
                                        <option value="">Select hotel</option>
                                        {hotels.map(h => {
                                            const cityName = h.city_name || cityOptions.find(c => String(c.id) === String(h.city_id))?.city_name || "City not set";
                                            const areaName = h.area_name || areaOptions.find(a => String(a.id) === String(h.area_id) && String(a.city_id) === String(h.city_id))?.area_name || "Area not set";
                                            return <option key={h.id} value={String(h.id)}>{`${h.hotel_name} — ${cityName} — ${areaName}`}</option>;
                                        })}
                                    </select>
                                </label>}
                                <div className="ns-room-fields">
                                    <label>City
                                        <select required value={form.city_id}
                                            onChange={(e) => {
                                                setForm(prev => ({ ...prev, city_id: e.target.value, area_id: "" }));
                                            }}>
                                            <option value="">Select City</option>
                                            {cityOptions.filter(c => String(c.status || "YES").toUpperCase() === "YES" || String(c.id) === String(form.city_id)).map(city => (
                                                <option key={city.id} value={String(city.id)}>{city.city_name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>Area
                                        <select required value={form.area_id} disabled={!form.city_id}
                                            onChange={(e) => {
                                                const areaId = e.target.value;
                                                setForm(prev => ({ ...prev, area_id: areaId }));
                                            }}>
                                            <option value="">Select Area</option>
                                            <option value="all">All Areas (within selected city)</option>
                                            {filteredAreaOptions.filter(a => String(a.status || "YES").toUpperCase() === "YES" || String(a.id) === String(form.area_id)).map(area => (
                                                <option key={area.id} value={String(area.id)}>{area.area_name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </>}
                            {locationError && <p className="ns-room-error" role="alert">{locationError}</p>}
                            <div className="ns-room-fields">

                                <label>Room Type<input required maxLength={100} value={form.room_type} placeholder="e.g. Deluxe"

                                    onChange={(e) => updateField("room_type", e.target.value)} /></label>
                                {roomScope !== "all" && <label>Original Room Number<input required maxLength={50} value={form.original_room_number} placeholder="e.g. 101 or A-201"
                                    onChange={(e) => updateField("original_room_number", e.target.value)} /></label>}

                            </div>

                            <div className="ns-room-fields">

                                <label>Price / Night (PKR)<input required type="number" min="0" step="0.01"

                                    value={form.price_per_night} onChange={(e) => updateField("price_per_night", e.target.value)} /></label>

                                <label>Discounted Price / Night (PKR) — optional<input type="number" min="0" step="0.01"
                                    placeholder="Leave blank for no discount" value={form.discounted_price_per_night}
                                    onChange={(e) => updateField("discounted_price_per_night", e.target.value)} />
                                    {form.discounted_price_per_night !== "" && Number(form.price_per_night) > Number(form.discounted_price_per_night) && <small style={{ display: "block", color: "#15803d" }}>
                                        {Math.round((1 - Number(form.discounted_price_per_night) / Number(form.price_per_night)) * 100)}% OFF · Saves {money(Number(form.price_per_night) - Number(form.discounted_price_per_night))} per night
                                    </small>}
                                </label>
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
