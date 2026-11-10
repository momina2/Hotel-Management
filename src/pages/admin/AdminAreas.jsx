// // // import { useCallback, useEffect, useMemo, useState } from "react";
// // // import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
// // // import "./admin.css";

// // // const ROOT = "https://coreops.pk/Hotel/api";
// // // const blank = { city_id: "", area_name: "", status: "YES" };

// // // async function api(endpoint, payload, signal) {
// // //   const response = await fetch(`${ROOT}/${endpoint}.php`, {
// // //     method: payload ? "POST" : "GET",
// // //     credentials: "include",
// // //     ...(payload ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) } : {}),
// // //     ...(signal ? { signal } : {}),
// // //   });
// // //   const raw = await response.text();
// // //   let data;
// // //   try { data = JSON.parse(raw); }
// // //   catch { throw new Error(`${endpoint}.php returned invalid JSON.`); }
// // //   if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
// // //   return data;
// // // }

// // // export default function AdminAreas() {
// // //   const [areas, setAreas] = useState([]);
// // //   const [cities, setCities] = useState([]);
// // //   const [search, setSearch] = useState("");
// // //   const [cityFilter, setCityFilter] = useState("");
// // //   const [editor, setEditor] = useState(null);
// // //   const [form, setForm] = useState(blank);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [deleting, setDeleting] = useState(null);
// // //   const [error, setError] = useState("");
// // //   const [notice, setNotice] = useState("");

// // //   const load = useCallback(async (signal) => {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const [areaData, cityData] = await Promise.all([
// // //         api("areas", undefined, signal), api("cities", undefined, signal),
// // //       ]);
// // //       if (!signal?.aborted) {
// // //         setAreas(Array.isArray(areaData.areas) ? areaData.areas : []);
// // //         setCities(Array.isArray(cityData.cities) ? cityData.cities : []);
// // //       }
// // //     } catch (err) {
// // //       if (err.name !== "AbortError" && !signal?.aborted) setError(err.message);
// // //     } finally {
// // //       if (!signal?.aborted) setLoading(false);
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     const controller = new AbortController();
// // //     load(controller.signal);
// // //     return () => controller.abort();
// // //   }, [load]);

// // //   const activeCities = useMemo(() => cities.filter(c => c.status === "YES"), [cities]);
// // //   const filtered = useMemo(() => areas.filter(a => {
// // //     const matchesText = `${a.area_name} ${a.city_name} ${a.status}`.toLowerCase().includes(search.trim().toLowerCase());
// // //     return matchesText && (!cityFilter || String(a.city_id) === cityFilter);
// // //   }), [areas, search, cityFilter]);

// // //   function add() {
// // //     setForm({ ...blank, city_id: activeCities[0] ? String(activeCities[0].id) : "" });
// // //     setEditor({ mode: "create" });
// // //     setError(""); setNotice("");
// // //   }
// // //   function edit(area) {
// // //     setForm({ city_id: String(area.city_id), area_name: area.area_name || "", status: area.status || "YES" });
// // //     setEditor({ mode: "update", id: area.id });
// // //     setError(""); setNotice("");
// // //   }

// // //   async function save(e) {
// // //     e.preventDefault();
// // //     if (!editor || saving) return;
// // //     const cityId = Number(form.city_id);
// // //     if (!Number.isInteger(cityId) || cityId < 1) { setError("Select a city."); return; }
// // //     if (!form.area_name.trim()) { setError("Area name is required."); return; }
// // //     setSaving(true); setError("");
// // //     try {
// // //       const result = await api("areas", {
// // //         action: editor.mode,
// // //         ...(editor.mode === "update" ? { id: editor.id } : {}),
// // //         city_id: cityId,
// // //         area_name: form.area_name.trim(),
// // //         status: form.status,
// // //       });
// // //       setEditor(null);
// // //       await load();
// // //       setNotice(result.message || "Area saved successfully.");
// // //     } catch (err) { setError(err.message); }
// // //     finally { setSaving(false); }
// // //   }

// // //   async function remove(area) {
// // //     if (!window.confirm(`Delete ${area.area_name} (${area.city_name})? This cannot be undone.`)) return;
// // //     setDeleting(area.id); setError(""); setNotice("");
// // //     try {
// // //       const result = await api("areas", { action: "delete", id: area.id });
// // //       await load();
// // //       setNotice(result.message || "Area deleted.");
// // //     } catch (err) { setError(err.message); }
// // //     finally { setDeleting(null); }
// // //   }

// // //   return (
// // //     <>
// // //       <div className="ns-heading">
// // //         <div>
// // //           <span>LOCATION MANAGEMENT</span>
// // //           <h1>Area Management</h1>
// // //           <p>Manage areas and their cities in MySQL.</p>
// // //         </div>
// // //         <button type="button" className="ns-btn" onClick={add} disabled={loading || !activeCities.length}>
// // //           <Plus size={17} /> Add Area
// // //         </button>
// // //       </div>

// // //       <section className="ns-panel">
// // //         <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 18 }}>
// // //           <input className="ns-search" placeholder="Search areas..." aria-label="Search areas" value={search} onChange={e => setSearch(e.target.value)} />
// // //           <select aria-label="Filter by city" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
// // //             <option value="">All Cities</option>
// // //             {cities.map(c => <option key={c.id} value={String(c.id)}>{c.city_name}</option>)}
// // //           </select>
// // //           <button type="button" onClick={() => load()} aria-label="Refresh areas" title="Refresh areas" disabled={loading}>
// // //             <RefreshCw size={19} />
// // //           </button>
// // //         </div>
// // //         {!loading && !activeCities.length && <p role="status">Add an active city in City Management before adding an area.</p>}
// // //         {error && <p role="alert" className="ns-room-error">{error}</p>}
// // //         {notice && <p role="status">{notice}</p>}
// // //         {loading ? <p>Loading areas...</p> : (
// // //           <div className="ns-table-wrap">
// // //             <table className="ns-table">
// // //               <thead><tr><th>ID</th><th>Area Name</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
// // //               <tbody>
// // //                 {filtered.map(area => (
// // //                   <tr key={area.id}>
// // //                     <td>{area.id}</td>
// // //                     <td><strong>{area.area_name}</strong></td>
// // //                     <td>{area.city_name}</td>
// // //                     <td><span className="ns-status">{area.status}</span></td>
// // //                     <td>
// // //                       <div className="ns-actions">
// // //                         <button type="button" onClick={() => edit(area)} aria-label={`Edit ${area.area_name}`}><Pencil size={17} /></button>
// // //                         <button type="button" onClick={() => remove(area)} disabled={deleting === area.id} aria-label={`Delete ${area.area_name}`}><Trash2 size={17} /></button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //             {!filtered.length && <p className="ns-empty">No areas found.</p>}
// // //           </div>
// // //         )}
// // //       </section>

// // //       {editor && (
// // //         <div className="ns-room-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !saving) setEditor(null); }}>
// // //           <section className="ns-room-dialog" role="dialog" aria-modal="true" aria-label={editor.mode === "create" ? "Add Area" : "Edit Area"}>
// // //             <div className="ns-room-dialog-header">
// // //               <h2>{editor.mode === "create" ? "Add Area" : "Edit Area"}</h2>
// // //               <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close"><X size={20} /></button>
// // //             </div>
// // //             <form className="ns-room-form" onSubmit={save}>
// // //               <label>City
// // //                 <select required value={form.city_id} onChange={e => setForm(p => ({ ...p, city_id: e.target.value }))}>
// // //                   <option value="">Select City</option>
// // //                   {cities.filter(c => c.status === "YES" || String(c.id) === form.city_id).map(c => (
// // //                     <option key={c.id} value={String(c.id)} disabled={c.status !== "YES"}>{c.city_name}{c.status !== "YES" ? " (Inactive)" : ""}</option>
// // //                   ))}
// // //                 </select>
// // //               </label>
// // //               <label>Area Name
// // //                 <input required maxLength={150} value={form.area_name} onChange={e => setForm(p => ({ ...p, area_name: e.target.value }))} placeholder="e.g. Gulberg" />
// // //               </label>
// // //               <label>Status
// // //                 <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
// // //                   <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>
// // //                 </select>
// // //               </label>
// // //               {error && <p role="alert" className="ns-room-error">{error}</p>}
// // //               <div className="ns-room-actions">
// // //                 <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
// // //                 <button type="submit" className="ns-btn" disabled={saving}>{saving ? "Saving..." : "Save Area"}</button>
// // //               </div>
// // //             </form>
// // //           </section>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }




// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
// // import "./admin.css";

// // const ROOT = "https://coreops.pk/Hotel/api";
// // const blank = { city_id: "", area_name: "", status: "YES" };

// // // Existing areas.php endpoint is retained for create, update and delete.
// // async function mutateArea(payload) {
// //   const response = await fetch(`${ROOT}/areas.php`, {
// //     method: "POST",
// //     credentials: "include",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(payload),
// //     cache: "no-store",
// //   });
// //   const raw = await response.text();
// //   let data;
// //   try {
// //     data = JSON.parse(raw);
// //   } catch {
// //     throw new Error("areas.php returned invalid JSON.");
// //   }
// //   if (!response.ok || !data.success) {
// //     throw new Error(data.message || `Request failed (${response.status})`);
// //   }
// //   return data;
// // }

// // // getAreas.php returns both cities and areas in one response.
// // async function getAreaData(signal) {
// //   const response = await fetch(`${ROOT}/getAreas.php?city_id=all`, {
// //     method: "GET",
// //     credentials: "include",
// //     cache: "no-store",
// //     ...(signal ? { signal } : {}),
// //   });
// //   const raw = await response.text();
// //   let data;
// //   try {
// //     data = JSON.parse(raw);
// //   } catch {
// //     throw new Error("getAreas.php returned invalid JSON.");
// //   }
// //   if (!response.ok || !data.success) {
// //     throw new Error(data.message || `Request failed (${response.status})`);
// //   }
// //   return data;
// // }

// // export default function AdminAreas() {
// //   const [areas, setAreas] = useState([]);
// //   const [cities, setCities] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [cityFilter, setCityFilter] = useState("");
// //   const [editor, setEditor] = useState(null);
// //   const [form, setForm] = useState(blank);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [deleting, setDeleting] = useState(null);
// //   const [error, setError] = useState("");
// //   const [notice, setNotice] = useState("");

// //   const load = useCallback(async (signal) => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const data = await getAreaData(signal);
// //       if (!signal?.aborted) {
// //         setAreas(Array.isArray(data.areas) ? data.areas : []);
// //         setCities(Array.isArray(data.cities) ? data.cities : []);
// //       }
// //     } catch (err) {
// //       if (err.name !== "AbortError" && !signal?.aborted) {
// //         setError(err.message);
// //       }
// //     } finally {
// //       if (!signal?.aborted) setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const controller = new AbortController();
// //     load(controller.signal);
// //     return () => controller.abort();
// //   }, [load]);

// //   const activeCities = useMemo(
// //     () => cities.filter((city) => city.status === "YES"),
// //     [cities]
// //   );

// //   const filtered = useMemo(() => {
// //     const query = search.trim().toLowerCase();
// //     return areas.filter((area) => {
// //       const matchesText = `${area.area_name ?? ""} ${area.city_name ?? ""} ${area.status ?? ""}`
// //         .toLowerCase()
// //         .includes(query);
// //       const matchesCity = !cityFilter || String(area.city_id) === cityFilter;
// //       return matchesText && matchesCity;
// //     });
// //   }, [areas, search, cityFilter]);

// //   function add() {
// //     setForm({ ...blank, city_id: activeCities[0] ? String(activeCities[0].id) : "" });
// //     setEditor({ mode: "create" });
// //     setError("");
// //     setNotice("");
// //   }

// //   function edit(area) {
// //     setForm({
// //       city_id: String(area.city_id),
// //       area_name: area.area_name || "",
// //       status: area.status || "YES",
// //     });
// //     setEditor({ mode: "update", id: area.id });
// //     setError("");
// //     setNotice("");
// //   }

// //   async function save(event) {
// //     event.preventDefault();
// //     if (!editor || saving) return;
// //     const cityId = Number(form.city_id);
// //     if (!Number.isInteger(cityId) || cityId < 1) {
// //       setError("Select a city.");
// //       return;
// //     }
// //     if (!form.area_name.trim()) {
// //       setError("Area name is required.");
// //       return;
// //     }
// //     setSaving(true);
// //     setError("");
// //     try {
// //       const result = await mutateArea({
// //         action: editor.mode,
// //         ...(editor.mode === "update" ? { id: editor.id } : {}),
// //         city_id: cityId,
// //         area_name: form.area_name.trim(),
// //         status: form.status,
// //       });
// //       await load();
// //       setEditor(null);
// //       setNotice(result.message || "Area saved successfully.");
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   async function remove(area) {
// //     if (!window.confirm(`Delete ${area.area_name} (${area.city_name})? This cannot be undone.`)) return;
// //     setDeleting(area.id);
// //     setError("");
// //     setNotice("");
// //     try {
// //       const result = await mutateArea({ action: "delete", id: area.id });
// //       await load();
// //       setNotice(result.message || "Area deleted.");
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setDeleting(null);
// //     }
// //   }

// //   return (
// //     <>
// //       <div className="ns-heading">
// //         <div>
// //           <span>LOCATION MANAGEMENT</span>
// //           <h1>Area Management</h1>
// //           <p>Manage areas and their cities in MySQL.</p>
// //         </div>
// //         <button type="button" className="ns-btn" onClick={add} disabled={loading || !activeCities.length}>
// //           <Plus size={17} /> Add Area
// //         </button>
// //       </div>

// //       <section className="ns-panel">
// //         <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 18 }}>
// //           <input
// //             className="ns-search"
// //             placeholder="Search areas..."
// //             aria-label="Search areas"
// //             value={search}
// //             onChange={(event) => setSearch(event.target.value)}
// //           />
// //           <select
// //             aria-label="Filter by city"
// //             value={cityFilter}
// //             onChange={(event) => setCityFilter(event.target.value)}
// //           >
// //             <option value="">All Cities</option>
// //             {cities.map((city) => (
// //               <option key={city.id} value={String(city.id)}>{city.city_name}</option>
// //             ))}
// //           </select>
// //           <button type="button" onClick={() => load()} aria-label="Refresh areas" title="Refresh areas" disabled={loading}>
// //             <RefreshCw size={19} />
// //           </button>
// //         </div>

// //         {!loading && !error && !activeCities.length && (
// //           <p role="status">Add an active city in City Management before adding an area.</p>
// //         )}
// //         {error && <p role="alert" className="ns-room-error">{error}</p>}
// //         {notice && <p role="status">{notice}</p>}

// //         {loading ? (
// //           <p>Loading areas...</p>
// //         ) : (
// //           <div className="ns-table-wrap">
// //             <table className="ns-table">
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Area Name</th>
// //                   <th>City</th>
// //                   <th>Status</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filtered.map((area) => (
// //                   <tr key={area.id}>
// //                     <td>{area.id}</td>
// //                     <td><strong>{area.area_name}</strong></td>
// //                     <td>{area.city_name}</td>
// //                     <td><span className="ns-status">{area.status}</span></td>
// //                     <td>
// //                       <div className="ns-actions">
// //                         <button type="button" onClick={() => edit(area)} aria-label={`Edit ${area.area_name}`}>
// //                           <Pencil size={17} />
// //                         </button>
// //                         <button
// //                           type="button"
// //                           onClick={() => remove(area)}
// //                           disabled={deleting === area.id}
// //                           aria-label={`Delete ${area.area_name}`}
// //                         >
// //                           <Trash2 size={17} />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             {!filtered.length && !error && <p className="ns-empty">No areas found.</p>}
// //           </div>
// //         )}
// //       </section>

// //       {editor && (
// //         <div
// //           className="ns-room-overlay"
// //           role="presentation"
// //           onMouseDown={(event) => {
// //             if (event.target === event.currentTarget && !saving) setEditor(null);
// //           }}
// //         >
// //           <section
// //             className="ns-room-dialog"
// //             role="dialog"
// //             aria-modal="true"
// //             aria-label={editor.mode === "create" ? "Add Area" : "Edit Area"}
// //           >
// //             <div className="ns-room-dialog-header">
// //               <h2>{editor.mode === "create" ? "Add Area" : "Edit Area"}</h2>
// //               <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close">
// //                 <X size={20} />
// //               </button>
// //             </div>
// //             <form className="ns-room-form" onSubmit={save}>
// //               <label>
// //                 City
// //                 <select required value={form.city_id} onChange={(event) => setForm((previous) => ({ ...previous, city_id: event.target.value }))}>
// //                   <option value="">Select City</option>
// //                   {cities
// //                     .filter((city) => city.status === "YES" || String(city.id) === form.city_id)
// //                     .map((city) => (
// //                       <option key={city.id} value={String(city.id)} disabled={city.status !== "YES"}>
// //                         {city.city_name}{city.status !== "YES" ? " (Inactive)" : ""}
// //                       </option>
// //                     ))}
// //                 </select>
// //               </label>
// //               <label>
// //                 Area Name
// //                 <input
// //                   required
// //                   maxLength={150}
// //                   value={form.area_name}
// //                   onChange={(event) => setForm((previous) => ({ ...previous, area_name: event.target.value }))}
// //                   placeholder="e.g. Gulberg"
// //                 />
// //               </label>
// //               <label>
// //                 Status
// //                 <select value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}>
// //                   <option value="YES">YES</option>
// //                   <option value="NO">NO</option>
// //                   <option value="Closed">Closed</option>
// //                 </select>
// //               </label>
// //               {error && <p role="alert" className="ns-room-error">{error}</p>}
// //               <div className="ns-room-actions">
// //                 <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
// //                 <button type="submit" className="ns-btn" disabled={saving}>
// //                   {saving ? "Saving..." : "Save Area"}
// //                 </button>
// //               </div>
// //             </form>
// //           </section>
// //         </div>
// //       )}
// //     </>
// //   );
// // }






// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
// import "./admin.css";

// const ROOT = "https://coreops.pk/Hotel/api";
// const blank = { city_id: "", area_name: "", status: "YES" };

// // Existing areas.php endpoint is retained for create, update and delete.
// async function mutateArea(payload) {
//   const response = await fetch(`${ROOT}/areas.php`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//     cache: "no-store",
//   });
//   const raw = await response.text();
//   let data;
//   try {
//     data = JSON.parse(raw);
//   } catch {
//     throw new Error("areas.php returned invalid JSON.");
//   }
//   if (!response.ok || !data.success) {
//     throw new Error(data.message || `Request failed (${response.status})`);
//   }
//   return data;
// }

// // getAreas.php returns both cities and areas in one response.
// async function getAreaData(signal) {
//   const response = await fetch(`${ROOT}/getAreas.php?city_id=all`, {
//     method: "GET",
//     credentials: "include",
//     cache: "no-store",
//     ...(signal ? { signal } : {}),
//   });
//   const raw = await response.text();
//   let data;
//   try {
//     data = JSON.parse(raw);
//   } catch {
//     throw new Error("getAreas.php returned invalid JSON.");
//   }
//   if (!response.ok || !data.success) {
//     throw new Error(data.message || `Request failed (${response.status})`);
//   }
//   return data;
// }

// export default function AdminAreas() {
//   const [areas, setAreas] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [search, setSearch] = useState("");
//   const [cityFilter, setCityFilter] = useState("");
//   const [editor, setEditor] = useState(null);
//   const [form, setForm] = useState(blank);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(null);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   const load = useCallback(async (signal) => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await getAreaData(signal);
//       if (!signal?.aborted) {
//         setAreas(Array.isArray(data.areas) ? data.areas : []);
//         setCities(Array.isArray(data.cities) ? data.cities : []);
//       }
//     } catch (err) {
//       if (err.name !== "AbortError" && !signal?.aborted) {
//         setError(err.message);
//       }
//     } finally {
//       if (!signal?.aborted) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     load(controller.signal);
//     return () => controller.abort();
//   }, [load]);

//   const activeCities = useMemo(
//     () => cities.filter((city) => city.status === "YES"),
//     [cities]
//   );

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     return areas.filter((area) => {
//       const matchesText = `${area.area_name ?? ""} ${area.city_name ?? ""} ${area.status ?? ""}`
//         .toLowerCase()
//         .includes(query);
//       const matchesCity = !cityFilter || String(area.city_id) === cityFilter;
//       return matchesText && matchesCity;
//     });
//   }, [areas, search, cityFilter]);

//   function add() {
//     setForm({ ...blank, city_id: activeCities[0] ? String(activeCities[0].id) : "" });
//     setEditor({ mode: "create" });
//     setError("");
//     setNotice("");
//   }

//   function edit(area) {
//     setForm({
//       city_id: String(area.city_id),
//       area_name: area.area_name || "",
//       status: area.status || "YES",
//     });
//     setEditor({ mode: "update", id: area.id });
//     setError("");
//     setNotice("");
//   }

//   async function save(event) {
//     event.preventDefault();
//     if (!editor || saving) return;
//     const cityId = Number(form.city_id);
//     if (!Number.isInteger(cityId) || cityId < 1) {
//       setError("Select a city.");
//       return;
//     }
//     if (!form.area_name.trim()) {
//       setError("Area name is required.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       const result = await mutateArea({
//         action: editor.mode,
//         ...(editor.mode === "update" ? { id: editor.id } : {}),
//         city_id: cityId,
//         area_name: form.area_name.trim(),
//         status: form.status,
//       });
//       await load();
//       setEditor(null);
//       setNotice(result.message || "Area saved successfully.");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function remove(area) {
//     if (!window.confirm(`Delete ${area.area_name} (${area.city_name})? This cannot be undone.`)) return;
//     setDeleting(area.id);
//     setError("");
//     setNotice("");
//     try {
//       const result = await mutateArea({ action: "delete", id: area.id });
//       await load();
//       setNotice(result.message || "Area deleted.");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setDeleting(null);
//     }
//   }

//   return (
//     <>
//       <div className="ns-heading">
//         <div>
//           <span>LOCATION MANAGEMENT</span>
//           <h1>Area Management</h1>
//           <p>Manage areas and their cities in MySQL.</p>
//         </div>
//         <button type="button" className="ns-btn" onClick={add} disabled={loading || !activeCities.length}>
//           <Plus size={17} /> Add Area
//         </button>
//       </div>

//       <section className="ns-panel">
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 18 }}>
//           <input
//             className="ns-search"
//             placeholder="Search areas..."
//             aria-label="Search areas"
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//           />
//           <select
//             aria-label="Filter by city"
//             value={cityFilter}
//             onChange={(event) => setCityFilter(event.target.value)}
//           >
//             <option value="">All Cities</option>
//             {cities.map((city) => (
//               <option key={city.id} value={String(city.id)}>{city.city_name}</option>
//             ))}
//           </select>
//           <button type="button" onClick={() => load()} aria-label="Refresh areas" title="Refresh areas" disabled={loading}>
//             <RefreshCw size={19} />
//           </button>
//         </div>

//         {!loading && !error && !activeCities.length && (
//           <p role="status">Add an active city in City Management before adding an area.</p>
//         )}
//         {error && <p role="alert" className="ns-room-error">{error}</p>}
//         {notice && <p role="status">{notice}</p>}

//         {loading ? (
//           <p>Loading areas...</p>
//         ) : (
//           <div className="ns-table-wrap">
//             <table className="ns-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Area Name</th>
//                   <th>City</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((area) => (
//                   <tr key={area.id}>
//                     <td>{area.id}</td>
//                     <td><strong>{area.area_name}</strong></td>
//                     <td>{area.city_name}</td>
//                     <td><span className="ns-status">{area.status}</span></td>
//                     <td>
//                       <div className="ns-actions">
//                         <button type="button" onClick={() => edit(area)} aria-label={`Edit ${area.area_name}`}>
//                           <Pencil size={17} />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => remove(area)}
//                           disabled={deleting === area.id}
//                           aria-label={`Delete ${area.area_name}`}
//                         >
//                           <Trash2 size={17} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {!filtered.length && !error && <p className="ns-empty">No areas found.</p>}
//           </div>
//         )}
//       </section>

//       {editor && (
//         <div
//           className="ns-room-overlay"
//           role="presentation"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget && !saving) setEditor(null);
//           }}
//         >
//           <section
//             className="ns-room-dialog"
//             role="dialog"
//             aria-modal="true"
//             aria-label={editor.mode === "create" ? "Add Area" : "Edit Area"}
//           >
//             <div className="ns-room-dialog-header">
//               <h2>{editor.mode === "create" ? "Add Area" : "Edit Area"}</h2>
//               <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close">
//                 <X size={20} />
//               </button>
//             </div>
//             <form className="ns-room-form" onSubmit={save}>
//               <label>
//                 City
//                 <select required value={form.city_id} onChange={(event) => setForm((previous) => ({ ...previous, city_id: event.target.value }))}>
//                   <option value="">Select City</option>
//                   {cities
//                     .filter((city) => city.status === "YES" || String(city.id) === form.city_id)
//                     .map((city) => (
//                       <option key={city.id} value={String(city.id)} disabled={city.status !== "YES"}>
//                         {city.city_name}{city.status !== "YES" ? " (Inactive)" : ""}
//                       </option>
//                     ))}
//                 </select>
//               </label>
//               <label>
//                 Area Name
//                 <input
//                   required
//                   maxLength={150}
//                   value={form.area_name}
//                   onChange={(event) => setForm((previous) => ({ ...previous, area_name: event.target.value }))}
//                   placeholder="e.g. Gulberg"
//                 />
//               </label>
//               <label>
//                 Status
//                 <select value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}>
//                   <option value="YES">YES</option>
//                   <option value="NO">NO</option>
//                   <option value="Closed">Closed</option>
//                 </select>
//               </label>
//               {error && <p role="alert" className="ns-room-error">{error}</p>}
//               <div className="ns-room-actions">
//                 <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
//                 <button type="submit" className="ns-btn" disabled={saving}>
//                   {saving ? "Saving..." : "Save Area"}
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       )}
//     </>
//   );
// }









import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import "./admin.css";

const ROOT = "https://coreops.pk/Hotel/api";
const blank = { city_id: "", area_name: "", status: "YES" };

// Existing areas.php endpoint is retained for create, update and delete.
async function mutateArea(payload) {
  const response = await fetch(`${ROOT}/areas.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("areas.php returned invalid JSON.");
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

// getAreas.php returns both cities and areas in one response.
async function getAreaData(signal) {
  const response = await fetch(`${ROOT}/getAreas.php?city_id=all`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    ...(signal ? { signal } : {}),
  });
  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("getAreas.php returned invalid JSON.");
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export default function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await getAreaData(signal);
      if (!signal?.aborted) {
        setAreas(Array.isArray(data.areas) ? data.areas : []);
        setCities(Array.isArray(data.cities) ? data.cities : []);
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) {
        setError(err.message);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const activeCities = useMemo(
    () => cities.filter((city) => city.status === "YES"),
    [cities]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return areas.filter((area) => {
      const matchesText = `${area.area_name ?? ""} ${area.city_name ?? ""} ${area.status ?? ""}`
        .toLowerCase()
        .includes(query);
      const matchesCity = !cityFilter || String(area.city_id) === cityFilter;
      return matchesText && matchesCity;
    });
  }, [areas, search, cityFilter]);

  function add() {
    setForm({ ...blank, city_id: activeCities[0] ? String(activeCities[0].id) : "" });
    setEditor({ mode: "create" });
    setError("");
    setNotice("");
  }

  function edit(area) {
    setForm({
      city_id: String(area.city_id),
      area_name: area.area_name || "",
      status: area.status || "YES",
    });
    setEditor({ mode: "update", id: area.id });
    setError("");
    setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    if (!editor || saving) return;
    const cityId = Number(form.city_id);
    if (!Number.isInteger(cityId) || cityId < 1) {
      setError("Select a city.");
      return;
    }
    if (!form.area_name.trim()) {
      setError("Area name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await mutateArea({
        action: editor.mode,
        ...(editor.mode === "update" ? { id: editor.id } : {}),
        city_id: cityId,
        area_name: form.area_name.trim(),
        status: form.status,
      });
      await load();
      setEditor(null);
      setNotice(result.message || "Area saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(area) {
    if (!window.confirm(`Delete ${area.area_name} (${area.city_name})? This cannot be undone.`)) return;
    setDeleting(area.id);
    setError("");
    setNotice("");
    try {
      const result = await mutateArea({ action: "delete", id: area.id });
      await load();
      setNotice(result.message || "Area deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
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
          <input
            className="ns-search"
            placeholder="Search areas..."
            aria-label="Search areas"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={String(city.id)}>{city.city_name}</option>
            ))}
          </select>
          <button type="button" onClick={() => load()} aria-label="Refresh areas" title="Refresh areas" disabled={loading}>
            <RefreshCw size={19} />
          </button>
        </div>

        {!loading && !error && !activeCities.length && (
          <p role="status">Add an active city in City Management before adding an area.</p>
        )}
        {error && <p role="alert" className="ns-room-error">{error}</p>}
        {notice && <p role="status">{notice}</p>}

        {loading ? (
          <p>Loading areas...</p>
        ) : (
          <div className="ns-table-wrap" style={{ maxHeight: "360px", overflowY: "auto", overflowX: "auto" }}>
            <table className="ns-table">
              <thead>
                <tr>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "#f7f9f8" }}>ID</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "#f7f9f8" }}>Area Name</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "#f7f9f8" }}>City</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "#f7f9f8" }}>Status</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "#f7f9f8" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((area) => (
                  <tr key={area.id}>
                    <td>{area.id}</td>
                    <td><strong>{area.area_name}</strong></td>
                    <td>{area.city_name}</td>
                    <td><span className="ns-status">{area.status}</span></td>
                    <td>
                      <div className="ns-actions">
                        <button type="button" onClick={() => edit(area)} aria-label={`Edit ${area.area_name}`}>
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(area)}
                          disabled={deleting === area.id}
                          aria-label={`Delete ${area.area_name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !error && <p className="ns-empty">No areas found.</p>}
          </div>
        )}
      </section>

      {editor && (
        <div
          className="ns-room-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditor(null);
          }}
        >
          <section
            className="ns-room-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={editor.mode === "create" ? "Add Area" : "Edit Area"}
          >
            <div className="ns-room-dialog-header">
              <h2>{editor.mode === "create" ? "Add Area" : "Edit Area"}</h2>
              <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form className="ns-room-form" onSubmit={save}>
              <label>
                City
                <select required value={form.city_id} onChange={(event) => setForm((previous) => ({ ...previous, city_id: event.target.value }))}>
                  <option value="">Select City</option>
                  {cities
                    .filter((city) => city.status === "YES" || String(city.id) === form.city_id)
                    .map((city) => (
                      <option key={city.id} value={String(city.id)} disabled={city.status !== "YES"}>
                        {city.city_name}{city.status !== "YES" ? " (Inactive)" : ""}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Area Name
                <input
                  required
                  maxLength={150}
                  value={form.area_name}
                  onChange={(event) => setForm((previous) => ({ ...previous, area_name: event.target.value }))}
                  placeholder="e.g. Gulberg"
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>
              {error && <p role="alert" className="ns-room-error">{error}</p>}
              <div className="ns-room-actions">
                <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="ns-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Area"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
