// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Map, Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
// import "./admin.css";

// const API = "https://coreops.pk/Hotel/api/cities.php";
// const emptyForm = { city_name: "", status: "YES" };

// async function request(method = "GET", payload, signal) {
//   const response = await fetch(API, {
//     method,
//     credentials: "include",
//     ...(method === "POST"
//       ? {
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       : {}),
//     ...(signal ? { signal } : {}),
//   });
//   const raw = await response.text();
//   let data;
//   try {
//     data = JSON.parse(raw);
//   } catch {
//     throw new Error(
//       "API returned invalid JSON. Check cities.php on the server.",
//     );
//   }
//   if (!response.ok || !data.success) {
//     throw new Error(data.message || `Request failed (${response.status})`);
//   }
//   return data;
// }

// export default function AdminCities() {
//   const [cities, setCities] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editor, setEditor] = useState(null);
//   const [form, setForm] = useState(emptyForm);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   const load = useCallback(async (signal) => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await request("GET", undefined, signal);
//       if (!signal?.aborted)
//         setCities(Array.isArray(data.cities) ? data.cities : []);
//     } catch (err) {
//       if (err.name !== "AbortError" && !signal?.aborted) setError(err.message);
//     } finally {
//       if (!signal?.aborted) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     load(controller.signal);
//     return () => controller.abort();
//   }, [load]);

//   const filtered = useMemo(
//     () =>
//       cities.filter((city) =>
//         `${city.city_name} ${city.status}`
//           .toLowerCase()
//           .includes(search.toLowerCase()),
//       ),
//     [cities, search],
//   );

//   function openAdd() {
//     setEditor({ mode: "create" });
//     setForm({ ...emptyForm });
//     setError("");
//     setNotice("");
//   }
//   function openEdit(city) {
//     setEditor({ mode: "update", id: city.id });
//     setForm({ city_name: city.city_name || "", status: city.status || "YES" });
//     setError("");
//     setNotice("");
//   }

//   async function save(event) {
//     event.preventDefault();
//     if (saving) return;
//     const name = form.city_name.trim();
//     if (!name) {
//       setError("City name required.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       const action = editor.mode;
//       const payload = { action, city_name: name, status: form.status };
//       if (action === "update") payload.id = editor.id;
//       const result = await request("POST", payload);
//       setEditor(null);
//       setNotice(result.message || "City saved successfully.");
//       await load();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function remove(city) {
//     if (!window.confirm(`Delete ${city.city_name}? This cannot be undone.`))
//       return;
//     setError("");
//     setNotice("");
//     try {
//       const result = await request("POST", { action: "delete", id: city.id });
//       setNotice(result.message || "City deleted.");
//       await load();
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <>
//       <div className="ns-heading">
//         <div>
//           <span>LOCATION MANAGEMENT</span>
//           <h1>City Management</h1>
//           <p>Add and manage destination cities in MySQL.</p>
//         </div>
//         <button type="button" className="ns-btn" onClick={openAdd}>
//           <Plus size={17} /> Add City
//         </button>
//       </div>

//       <section className="ns-panel">
//         <div
//           style={{
//             display: "flex",
//             gap: 12,
//             alignItems: "center",
//             marginBottom: 18,
//           }}
//         >
//           <input
//             className="ns-search"
//             placeholder="Search cities..."
//             aria-label="Search cities"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             type="button"
//             onClick={() => load()}
//             aria-label="Refresh cities"
//             title="Refresh cities"
//           >
//             <RefreshCw size={19} />
//           </button>
//         </div>
//         {error && (
//           <p role="alert" className="ns-room-error">
//             {error}
//           </p>
//         )}
//         {notice && <p role="status">{notice}</p>}
//         {loading ? (
//           <p>Loading cities...</p>
//         ) : (
//           <div className="ns-table-wrap">
//             <table className="ns-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>City Name</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((city) => (
//                   <tr key={city.id}>
//                     <td>{city.id}</td>
//                     <td>
//                       <strong>{city.city_name}</strong>
//                     </td>
//                     <td>
//                       <span className="ns-status">{city.status}</span>
//                     </td>
//                     <td>
//                       <div className="ns-actions">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(city)}
//                           aria-label={`Edit ${city.city_name}`}
//                         >
//                           <Pencil size={17} />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => remove(city)}
//                           aria-label={`Delete ${city.city_name}`}
//                         >
//                           <Trash2 size={17} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {!filtered.length && <p className="ns-empty">No cities found.</p>}
//           </div>
//         )}
//       </section>

//       {editor && (
//         <div
//           className="ns-room-overlay"
//           role="presentation"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget && !saving) setEditor(null);
//           }}
//         >
//           <section
//             className="ns-room-dialog"
//             role="dialog"
//             aria-modal="true"
//             aria-label={editor.mode === "create" ? "Add City" : "Edit City"}
//           >
//             <div className="ns-room-dialog-header">
//               <h2>{editor.mode === "create" ? "Add City" : "Edit City"}</h2>
//               <button
//                 type="button"
//                 onClick={() => setEditor(null)}
//                 disabled={saving}
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form className="ns-room-form" onSubmit={save}>
//               <label>
//                 City Name
//                 <input
//                   required
//                   maxLength={150}
//                   value={form.city_name}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, city_name: e.target.value }))
//                   }
//                   placeholder="e.g. Hunza"
//                 />
//               </label>
//               <label>
//                 Status
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, status: e.target.value }))
//                   }
//                 >
//                   <option value="YES">YES</option>
//                   <option value="NO">NO</option>
//                   <option value="Closed">Closed</option>
//                 </select>
//               </label>
//               {error && (
//                 <p role="alert" className="ns-room-error">
//                   {error}
//                 </p>
//               )}
//               <div className="ns-room-actions">
//                 <button
//                   type="button"
//                   className="ns-cancel"
//                   onClick={() => setEditor(null)}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="ns-btn" disabled={saving}>
//                   {saving ? "Saving..." : "Save City"}
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

const API = "https://coreops.pk/Hotel/api/cities.php";
const emptyForm = { city_name: "", status: "YES" };

async function request(method = "GET", payload, signal) {
  const response = await fetch(API, {
    method,
    credentials: "include",
    ...(method === "POST" ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) } : {}),
    ...(signal ? { signal } : {}),
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error("API returned invalid JSON. Check cities.php on the server."); }
  if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export default function AdminCities() {
  const [cities, setCities] = useState([]);
  const [canManage, setCanManage] = useState(false);
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await request("GET", undefined, signal);
      if (!signal?.aborted) {
        setCities(Array.isArray(data.cities) ? data.cities : []);
        setCanManage(data.can_manage === true);
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) setError(err.message);
    } finally { if (!signal?.aborted) setLoading(false); }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const filtered = useMemo(() => cities.filter((city) =>
    `${city.city_name} ${city.status}`.toLowerCase().includes(search.toLowerCase())
  ), [cities, search]);

  function openAdd() {
    setEditor({ mode: "create" }); setForm({ ...emptyForm }); setError(""); setNotice("");
  }
  function openEdit(city) {
    setEditor({ mode: "update", id: city.id });
    setForm({ city_name: city.city_name || "", status: city.status || "YES" });
    setError(""); setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    if (saving || !canManage || !editor) return;
    const name = form.city_name.trim();
    if (!name) { setError("City name required."); return; }
    setSaving(true); setError("");
    try {
      const payload = { action: editor.mode, city_name: name, status: form.status };
      if (editor.mode === "update") payload.id = editor.id;
      const result = await request("POST", payload);
      setEditor(null); setNotice(result.message || "City saved successfully.");
      await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(city) {
    if (!canManage || !window.confirm(`Delete ${city.city_name}? This cannot be undone.`)) return;
    setError(""); setNotice("");
    try {
      const result = await request("POST", { action: "delete", id: city.id });
      setNotice(result.message || "City deleted."); await load();
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div className="ns-heading">
        <div><span>LOCATION MANAGEMENT</span><h1>City Management</h1><p>Add and manage destination cities in MySQL.</p></div>
        {canManage && <button type="button" className="ns-btn" onClick={openAdd}><Plus size={17} /> Add City</button>}
      </div>
      <section className="ns-panel">
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <input className="ns-search" placeholder="Search cities..." aria-label="Search cities" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" onClick={() => load()} aria-label="Refresh cities" title="Refresh cities"><RefreshCw size={19} /></button>
        </div>
        {error && <p role="alert" className="ns-room-error">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {loading ? <p>Loading cities...</p> : (
          <div className="ns-table-wrap" style={{ maxHeight: 355, overflowY: "auto", overflowX: "auto" }}>
            <table className="ns-table">
              <thead><tr>
                {['ID', 'City Name', 'Status', ...(canManage ? ['Actions'] : [])].map((h) => <th key={h} style={{ position: 'sticky', top: 0, zIndex: 2, background: '#f7faf8' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((city) => (
                  <tr key={city.id}>
                    <td>{city.id}</td><td><strong>{city.city_name}</strong></td>
                    <td><span className="ns-status">{city.status}</span></td>
                    {canManage && <td><div className="ns-actions">
                      <button type="button" onClick={() => openEdit(city)} aria-label={`Edit ${city.city_name}`}><Pencil size={17} /></button>
                      <button type="button" onClick={() => remove(city)} aria-label={`Delete ${city.city_name}`}><Trash2 size={17} /></button>
                    </div></td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <p className="ns-empty">No cities found.</p>}
          </div>
        )}
      </section>
      {editor && canManage && (
        <div className="ns-room-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setEditor(null); }}>
          <section className="ns-room-dialog" role="dialog" aria-modal="true" aria-label={editor.mode === "create" ? "Add City" : "Edit City"}>
            <div className="ns-room-dialog-header"><h2>{editor.mode === "create" ? "Add City" : "Edit City"}</h2>
              <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close"><X size={20} /></button>
            </div>
            <form className="ns-room-form" onSubmit={save}>
              <label>City Name<input required maxLength={150} value={form.city_name} onChange={(e) => setForm((p) => ({ ...p, city_name: e.target.value }))} placeholder="e.g. Hunza" /></label>
              <label>Status<select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="YES">YES</option><option value="NO">NO</option><option value="Closed">Closed</option>
              </select></label>
              {error && <p role="alert" className="ns-room-error">{error}</p>}
              <div className="ns-room-actions">
                <button type="button" className="ns-cancel" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="ns-btn" disabled={saving}>{saving ? "Saving..." : "Save City"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
