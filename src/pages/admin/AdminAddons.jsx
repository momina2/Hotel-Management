// import { useCallback, useEffect, useState } from "react";
// import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
// import "../../pages/admin/admin.css";

// const API = "https://coreops.pk/Hotel/api/addons.php";
// const HOTELS_API = "https://coreops.pk/Hotel/api/hotel_profile.php";
// const empty = { addon_name: "", description: "", price: "", charge_type: "per_stay", status: "YES", website_enabled: true, sort_order: "0" };
// const money = (value) => `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
// const chargeLabels = { per_stay: "Per stay", per_night: "Per night", per_guest_per_night: "Per guest / night" };

// async function jsonRequest(url, options) {
//   const response = await fetch(url, { credentials: "include", cache: "no-store", ...options });
//   const data = await response.json().catch(() => ({}));
//   if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
//   return data;
// }

// export default function AdminAddons() {
//   const [hotels, setHotels] = useState([]);
//   const [hotelId, setHotelId] = useState("");
//   const [addons, setAddons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");
//   const [editor, setEditor] = useState(null);
//   const [form, setForm] = useState(empty);

//   useEffect(() => {
//     const controller = new AbortController();
//     jsonRequest(HOTELS_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "get" }), signal: controller.signal })
//       .then((data) => {
//         const list = Array.isArray(data.hotels) ? data.hotels : data.hotel ? [data.hotel] : [];
//         setHotels(list);
//         setHotelId((prev) => prev || String(list[0]?.id || ""));
//         if (!list.length) setLoading(false);
//       })
//       .catch((err) => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });
//     return () => controller.abort();
//   }, []);

//   const loadAddons = useCallback(async (id, signal) => {
//     if (!id) { setAddons([]); setLoading(false); return; }
//     setLoading(true); setError("");
//     try {
//       const data = await jsonRequest(`${API}?hotel_id=${encodeURIComponent(id)}`, { method: "GET", signal });
//       if (!signal?.aborted) setAddons(Array.isArray(data.addons) ? data.addons : []);
//     } catch (err) {
//       if (err.name !== "AbortError" && !signal?.aborted) setError(err.message);
//     } finally { if (!signal?.aborted) setLoading(false); }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     loadAddons(hotelId, controller.signal);
//     return () => controller.abort();
//   }, [hotelId, loadAddons]);

//   const beginAdd = () => { setForm({ ...empty }); setEditor({ id: null }); setError(""); setNotice(""); };
//   const beginEdit = (item) => {
//     setForm({ addon_name: item.addon_name || "", description: item.description || "", price: String(item.price ?? ""), charge_type: item.charge_type || "per_stay", status: item.status || "YES", website_enabled: Boolean(Number(item.website_enabled)), sort_order: String(item.sort_order ?? 0) });
//     setEditor({ id: Number(item.id) }); setError(""); setNotice("");
//   };
//   const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

//   async function submit(event) {
//     event.preventDefault();
//     if (saving || !hotelId) return;
//     setError(""); setNotice(""); setSaving(true);
//     try {
//       const price = Number(form.price);
//       if (!form.addon_name.trim() || form.price === "" || !Number.isFinite(price) || price < 0) throw new Error("Enter an add-on name and valid price.");
//       const payload = { action: editor?.id ? "update" : "create", hotel_id: Number(hotelId), ...(editor?.id ? { id: editor.id } : {}), ...form, price, sort_order: Number(form.sort_order || 0), website_enabled: Boolean(form.website_enabled) };
//       await jsonRequest(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       setEditor(null); setNotice(editor?.id ? "Add-on updated." : "Add-on created.");
//       await loadAddons(hotelId);
//     } catch (err) { setError(err.message); }
//     finally { setSaving(false); }
//   }

//   async function remove(item) {
//     if (!window.confirm(`Delete ${item.addon_name}?`)) return;
//     setError(""); setNotice("");
//     try {
//       await jsonRequest(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", hotel_id: Number(hotelId), id: Number(item.id) }) });
//       setNotice("Add-on deleted."); await loadAddons(hotelId);
//     } catch (err) { setError(err.message); }
//   }

//   return <div className="ns-addons-page">
//     <div className="ns-heading"><div><span>EXTRA SERVICES</span><h1>Add-ons Management</h1><p>Manage optional services customers can select while booking a room.</p></div><button className="ns-btn" type="button" onClick={beginAdd} disabled={!hotelId}><Plus size={17} /> Add Add-on</button></div>
//     <section className="ns-panel">
//       <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end", marginBottom: 20 }}>
//         <label style={{ display: "grid", gap: 6, minWidth: 240, flex: "1 1 240px" }}>Hotel<select value={hotelId} onChange={(e) => { setHotelId(e.target.value); setEditor(null); setNotice(""); }}><option value="">Select hotel</option>{hotels.map((h) => <option key={h.id} value={String(h.id)}>{h.hotel_name}</option>)}</select></label>
//         <button type="button" className="ns-cancel" disabled={!hotelId || loading} onClick={() => loadAddons(hotelId)}><RefreshCw size={16} /> Refresh</button>
//       </div>
//       {error && <p className="ns-room-error" role="alert">{error}</p>}
//       {notice && <p role="status" style={{ color: "#176143" }}>{notice}</p>}
//       {loading ? <p>Loading add-ons...</p> : !hotels.length ? <p>Add a hotel first in Hotel Management.</p> : <div className="ns-table-wrap ns-addons-table-scroll"><table className="ns-table"><thead><tr><th>Add-on</th><th>Price</th><th>Charge Type</th><th>Status</th><th>On Website</th><th>Actions</th></tr></thead><tbody>{addons.map((a) => <tr key={a.id}><td><strong>{a.addon_name}</strong><small>{a.description || ""}</small></td><td>{money(a.price)}</td><td>{chargeLabels[a.charge_type] || a.charge_type}</td><td><span className="ns-status">{a.status}</span></td><td>{Number(a.website_enabled) === 1 ? "Visible" : "Hidden"}</td><td><div style={{ display: "flex", gap: 8 }}><button type="button" className="ns-cancel" onClick={() => beginEdit(a)} aria-label={`Edit ${a.addon_name}`}><Pencil size={16} /></button><button type="button" className="ns-cancel" onClick={() => remove(a)} aria-label={`Delete ${a.addon_name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>{!addons.length && <p className="ns-empty">No add-ons added for this hotel yet.</p>}</div>}
//     </section>
//     {editor && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setEditor(null); }}><section className="ns-panel" role="dialog" aria-modal="true" aria-label={editor.id ? "Edit add-on" : "Add add-on"} style={{ width: "min(100%, 620px)", maxHeight: "90vh", overflowY: "auto", background: "white" }}><h2>{editor.id ? "Edit Add-on" : "Add New Add-on"}</h2><form className="ns-form" onSubmit={submit}>
//       <label>Add-on Name<input required maxLength={150} placeholder="e.g. Extra Mattress" value={form.addon_name} onChange={(e) => update("addon_name", e.target.value)} /></label>
//       <label>Price (PKR)<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} /></label>
//       <label>Charge Type<select value={form.charge_type} onChange={(e) => update("charge_type", e.target.value)}><option value="per_stay">Per stay</option><option value="per_night">Per night</option><option value="per_guest_per_night">Per guest / night</option></select></label>
//       <label>Status<select value={form.status} onChange={(e) => update("status", e.target.value)}><option value="YES">Active</option><option value="NO">Inactive</option></select></label>
//       <label>Display Order<input type="number" min="0" max="100000" value={form.sort_order} onChange={(e) => update("sort_order", e.target.value)} /></label>
//       <label style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={form.website_enabled} onChange={(e) => update("website_enabled", e.target.checked)} /> Show on Customer Website</label>
//       <label className="ns-full">Description<textarea rows={3} maxLength={500} value={form.description} onChange={(e) => update("description", e.target.value)} /></label>
//       <div className="ns-form-actions"><button type="button" className="ns-cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</button><button type="submit" className="ns-btn" disabled={saving}>{saving ? "Saving..." : "Save Add-on"}</button></div>
//     </form></section></div>}
//   </div>
// }



import { API_BASE, apiFetch } from "../../api/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, ChevronDown, Check } from "lucide-react";
import "../../pages/admin/admin.css";
import "./admin.css";

const API = `${API_BASE}/addons.php`;
const HOTELS_API = `${API_BASE}/hotel_profile.php`;
const empty = { addon_name: "", description: "", price: "", charge_type: "per_stay", status: "YES", website_enabled: true, sort_order: "0" };
const money = (value) => `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
const chargeLabels = { per_stay: "Per stay", per_night: "Per night", per_guest_per_night: "Per guest / night" };
const hotelGroupKey = (hotel) => String(hotel.hotel_name || "").trim().toLocaleLowerCase();
const branchLabel = (hotel) => [hotel.hotel_name, hotel.area_name, hotel.city_name].filter(Boolean).join(" — ");

async function jsonRequest(url, options) {
  const response = await apiFetch(url, { credentials: "include", cache: "no-store", ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export default function AdminAddons() {
  const [hotels, setHotels] = useState([]);
  const [selection, setSelection] = useState("");
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(empty);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    jsonRequest(HOTELS_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "get" }), signal: controller.signal })
      .then((data) => {
        const list = Array.isArray(data.hotels) ? data.hotels : data.hotel ? [data.hotel] : [];
        setHotels(list);
        setSelection((prev) => prev || (list.length ? `hotel:${list[0].id}` : ""));
        if (!list.length) setLoading(false);
      })
      .catch((err) => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const close = (event) => { if (!dropdownRef.current?.contains(event.target)) setDropdownOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const groups = useMemo(() => {
    const map = new Map();
    for (const hotel of hotels) {
      const key = hotelGroupKey(hotel);
      if (!map.has(key)) map.set(key, { key, name: hotel.hotel_name, hotels: [] });
      map.get(key).hotels.push(hotel);
    }
    return [...map.values()];
  }, [hotels]);

  const selectedGroup = selection.startsWith("all:") ? groups.find((g) => g.key === selection.slice(4)) : null;
  const selectedHotel = selection.startsWith("hotel:") ? hotels.find((h) => String(h.id) === selection.slice(6)) : null;
  const selectedHotels = selectedGroup ? selectedGroup.hotels : selectedHotel ? [selectedHotel] : [];
  const selectionLabel = selectedGroup ? `All Branches — ${selectedGroup.name} (${selectedGroup.hotels.length})` : selectedHotel ? branchLabel(selectedHotel) : "Select hotel / branch";

  const loadAddons = useCallback(async (branchIds, signal) => {
    if (!branchIds.length) { setAddons([]); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const result = await Promise.all(branchIds.map(async (id) => {
        const data = await jsonRequest(`${API}?hotel_id=${encodeURIComponent(id)}`, { method: "GET", signal });
        return (Array.isArray(data.addons) ? data.addons : []).map((addon) => ({ ...addon, hotel_id: Number(id) }));
      }));
      if (!signal?.aborted) setAddons(result.flat());
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) { setAddons([]); setError(err.message); }
    } finally { if (!signal?.aborted) setLoading(false); }
  }, []);

  const branchIds = selectedHotels.map((h) => Number(h.id));
  const branchIdsKey = branchIds.join(",");
  useEffect(() => {
    const controller = new AbortController();
    loadAddons(branchIdsKey ? branchIdsKey.split(",").map(Number) : [], controller.signal);
    return () => controller.abort();
  }, [branchIdsKey, loadAddons]);

  const beginAdd = () => { if (!selectedHotels.length) { setError("No hotel is available for this login. Check Hotel Management and the hotel company_id mapping before adding an add-on."); return; } setForm({ ...empty }); setEditor({ id: null, hotelId: null }); setError(""); setNotice(""); };
  const beginEdit = (item) => {
    setForm({ addon_name: item.addon_name || "", description: item.description || "", price: String(item.price ?? ""), charge_type: item.charge_type || "per_stay", status: item.status || "YES", website_enabled: Boolean(Number(item.website_enabled)), sort_order: String(item.sort_order ?? 0) });
    setEditor({ id: Number(item.id), hotelId: Number(item.hotel_id) }); setError(""); setNotice("");
  };
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const refresh = () => loadAddons(branchIds);

  async function submit(event) {
    event.preventDefault();
    if (saving || !selectedHotels.length) return;
    setError(""); setNotice(""); setSaving(true);
    try {
      const price = Number(form.price);
      if (!form.addon_name.trim() || form.price === "" || !Number.isFinite(price) || price < 0) throw new Error("Enter an add-on name and valid price.");
      const isAllCreate = !editor?.id && Boolean(selectedGroup);
      const payload = {
        action: editor?.id ? "update" : isAllCreate ? "create_all" : "create",
        hotel_id: editor?.id ? editor.hotelId : Number(selectedHotels[0].id),
        ...(editor?.id ? { id: editor.id } : {}),
        ...form, price, sort_order: Number(form.sort_order || 0), website_enabled: Boolean(form.website_enabled)
      };
      const result = await jsonRequest(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setEditor(null);
      setNotice(editor?.id ? "Add-on updated for this branch." : isAllCreate ? `Add-on created for ${result.created_count} branches.` : "Add-on created.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    const hotel = hotels.find((h) => Number(h.id) === Number(item.hotel_id));
    if (!window.confirm(`Delete ${item.addon_name} from ${hotel ? branchLabel(hotel) : "this branch"}?`)) return;
    setError(""); setNotice("");
    try {
      await jsonRequest(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", hotel_id: Number(item.hotel_id), id: Number(item.id) }) });
      setNotice("Add-on deleted from this branch."); await refresh();
    } catch (err) { setError(err.message); }
  }

  return <div className="ns-addons-page">
    <div className="ns-heading"><div><span>EXTRA SERVICES</span><h1>Add-ons Management</h1><p>Manage optional services customers can select while booking a room.</p></div><button className="ns-btn" type="button" onClick={beginAdd}><Plus size={17} /> Add Add-on</button></div>
    <section className="ns-panel">
      <div className="ns-addons-toolbar">
        <div className="ns-addons-hotel-field" ref={dropdownRef}>
          <label id="ns-addons-hotel-label">Hotel / Branch</label>
          <button type="button" className="ns-addons-select-trigger" aria-labelledby="ns-addons-hotel-label" aria-expanded={dropdownOpen} aria-haspopup="listbox" onClick={() => setDropdownOpen((v) => !v)}>
            <span>{selectionLabel}</span><ChevronDown size={17} />
          </button>
          {dropdownOpen && <div className="ns-addons-dropdown" role="listbox" aria-label="Hotel / Branch">
            {groups.map((group) => <div key={group.key}>
              <button type="button" role="option" aria-selected={selection === `all:${group.key}`} className={`ns-addons-option ns-addons-option-all ${selection === `all:${group.key}` ? "selected" : ""}`} onClick={() => { setSelection(`all:${group.key}`); setEditor(null); setDropdownOpen(false); setNotice(""); }}>
                <span><strong>All Branches — {group.name}</strong><small>{group.hotels.length} branch(es) · New add-ons apply to all</small></span>{selection === `all:${group.key}` && <Check size={16} />}
              </button>
              {group.hotels.map((hotel) => <button key={hotel.id} type="button" role="option" aria-selected={selection === `hotel:${hotel.id}`} className={`ns-addons-option ${selection === `hotel:${hotel.id}` ? "selected" : ""}`} onClick={() => { setSelection(`hotel:${hotel.id}`); setEditor(null); setDropdownOpen(false); setNotice(""); }}>
                <span><strong>{hotel.hotel_name}</strong><small>{[hotel.area_name, hotel.city_name].filter(Boolean).join(", ") || "Area / city not set"}</small></span>{selection === `hotel:${hotel.id}` && <Check size={16} />}
              </button>)}
            </div>)}
          </div>}
        </div>
        <button type="button" className="ns-addons-refresh" disabled={!selectedHotels.length || loading} onClick={refresh}><RefreshCw size={16} /> Refresh</button>
      </div>
      {selectedGroup && <p className="ns-addons-hint">All Branches: new add-ons are created for every branch of <strong>{selectedGroup.name}</strong>. Existing add-ons can be edited or deleted separately for each branch.</p>}
      {error && <p className="ns-room-error" role="alert">{error}</p>}
      {notice && <p role="status" className="ns-addons-notice">{notice}</p>}
      {loading ? <p>Loading add-ons...</p> : !hotels.length ? <p>Add a hotel first in Hotel Management.</p> : <div className="ns-table-wrap ns-addons-table-scroll"><table className="ns-table"><thead><tr><th>Add-on</th>{selectedGroup && <th>Branch / Location</th>}<th>Price</th><th>Charge Type</th><th>Status</th><th>On Website</th><th>Actions</th></tr></thead><tbody>{addons.map((a) => {
        const hotel = hotels.find((h) => Number(h.id) === Number(a.hotel_id));
        return <tr key={`${a.hotel_id}-${a.id}`}><td><strong>{a.addon_name}</strong><small>{a.description || ""}</small></td>{selectedGroup && <td><small>{[hotel?.area_name, hotel?.city_name].filter(Boolean).join(", ")}</small></td>}<td>{money(a.price)}</td><td>{chargeLabels[a.charge_type] || a.charge_type}</td><td><span className={`ns-status ${a.status === "NO" ? "ns-addons-inactive" : ""}`} data-status={String(a.status).trim().toLowerCase()}>{a.status}</span></td><td>{Number(a.website_enabled) === 1 ? "Visible" : "Hidden"}</td><td><div className="ns-addons-actions"><button type="button" className="ns-addons-icon-btn edit" onClick={() => beginEdit(a)} aria-label={`Edit ${a.addon_name}`}><Pencil size={16} /></button><button type="button" className="ns-addons-icon-btn delete" onClick={() => remove(a)} aria-label={`Delete ${a.addon_name}`}><Trash2 size={16} /></button></div></td></tr>;
      })}</tbody></table>{!addons.length && <p className="ns-empty">No add-ons added for this hotel yet.</p>}</div>}
    </section>
    {editor && <div className="ns-addons-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setEditor(null); }}><section className="ns-panel ns-addons-modal" role="dialog" aria-modal="true" aria-label={editor.id ? "Edit add-on" : "Add add-on"}><h2>{editor.id ? "Edit Add-on" : "Add New Add-on"}</h2>{selectedGroup && <p className="ns-addons-hint">{editor.id ? "Editing only the selected branch." : `Creating for all ${selectedGroup.hotels.length} branches of ${selectedGroup.name}.`}</p>}<form className="ns-form" onSubmit={submit}>
      <label>Add-on Name<input required maxLength={150} placeholder="e.g. Extra Mattress" value={form.addon_name} onChange={(e) => update("addon_name", e.target.value)} /></label>
      <label>Price (PKR)<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} /></label>
      <label>Charge Type<select value={form.charge_type} onChange={(e) => update("charge_type", e.target.value)}><option value="per_stay">Per stay</option><option value="per_night">Per night</option><option value="per_guest_per_night">Per guest / night</option></select></label>
      <label>Status<select value={form.status} onChange={(e) => update("status", e.target.value)}><option value="YES">Active</option><option value="NO">Inactive</option></select></label>
      <label>Display Order<input type="number" min="0" max="100000" value={form.sort_order} onChange={(e) => update("sort_order", e.target.value)} /></label>
      <label className="ns-addons-checkbox"><input type="checkbox" checked={form.website_enabled} onChange={(e) => update("website_enabled", e.target.checked)} /> Show on Customer Website</label>
      <label className="ns-full">Description<textarea rows={3} maxLength={500} value={form.description} onChange={(e) => update("description", e.target.value)} /></label>
      <div className="ns-form-actions"><button type="button" className="ns-cancel" disabled={saving} onClick={() => setEditor(null)}>Cancel</button><button type="submit" className="ns-btn" disabled={saving}>{saving ? "Saving..." : "Save Add-on"}</button></div>
    </form></section></div>}
  </div>;
}
