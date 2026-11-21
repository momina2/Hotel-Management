import { API_BASE, apiFetch } from "../../api/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, RefreshCw, UserPlus, Trash2 } from "lucide-react";
import "./hotel-users.css";

const API = `${API_BASE}/hotel_users.php`;

async function request(payload) {
  const response = await apiFetch(API, {
    method: payload ? "POST" : "GET",
    credentials: "include",
    cache: "no-store",
    headers: payload ? { "Content-Type": "application/json" } : {},
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

const branchName = (hotel) => {
  const area = String(hotel.area_name || hotel.branch_name || hotel.branch || "").trim();
  const city = String(hotel.city_name || "").trim();
  if (area && city && area.toLowerCase() !== city.toLowerCase()) return `${area}, ${city}`;
  return area || city || "Branch not specified";
};

export default function AdminHotelUsers() {
  const [data, setData] = useState({ users: [], hotels: [], assignments: [] });
  const [userId, setUserId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", status: "YES" });
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request();
      const loadedUsers = Array.isArray(result.users) ? result.users : [];
      setUserId(previous => loadedUsers.some(u => String(u.id) === String(previous)) ? previous : "");
      setData({
        users: loadedUsers,
        hotels: Array.isArray(result.hotels) ? result.hotels : [],
        assignments: Array.isArray(result.assignments) ? result.assignments : [],
      });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeAssignments = useMemo(() =>
    data.assignments.filter(a => String(a.status).toUpperCase() === "YES"),
    [data.assignments]);

  const assignedHotelIds = useMemo(() => new Set(
    activeAssignments
      .filter(a => String(a.user_id ?? a.hotel_user_pk ?? a.hotel_user_id) === String(userId))
      .map(a => String(a.hotel_id))
  ), [activeAssignments, userId]);

  const assignedByUser = useMemo(() => {
    const map = new Map();
    for (const a of activeAssignments) {
      const uid = String(a.user_id ?? a.hotel_user_pk ?? a.hotel_user_id);
      if (!map.has(uid)) map.set(uid, a);
    }
    return map;
  }, [activeAssignments]);

  const selectedUserAlreadyAssigned = assignedByUser.has(String(userId));

  const selectedUser = useMemo(() => data.users.find(u => String(u.id) === String(userId)), [data.users, userId]);

  const hotelsById = useMemo(() => new Map(data.hotels.map(h => [String(h.id), h])), [data.hotels]);
  const assignmentBranch = a => branchName(hotelsById.get(String(a.hotel_id)) || a);

  const filtered = useMemo(() => activeAssignments.filter(a => {
    const text = `${a.user_name || ""} ${a.user_email || ""} ${a.hotel_name || ""} ${assignmentBranch(a)}`.toLowerCase();
    return text.includes(search.trim().toLowerCase());
  }), [activeAssignments, search, hotelsById]);

  const toggleHotel = (id) => {
    const value = String(id);
    if (!selectedUserAlreadyAssigned) {
      setSelectedHotels(prev => prev.includes(value) ? [] : [value]);
    }
  };

  const createUser = async event => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      await request({ action: "create_user", ...newUser });
      setNotice("Hotel User created. Assign a branch below to email temporary login credentials.");
      setNewUser({ name: "", email: "", phone: "", status: "YES" });
      setShowCreate(false);
      await load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const assign = async event => {
    event.preventDefault();
    const pending = selectedHotels.filter(id => !assignedHotelIds.has(String(id)));
    if (!userId || selectedUserAlreadyAssigned || pending.length !== 1) { setError("Select one unassigned staff member and exactly one hotel."); return; }
    setSaving(true); setError(""); setNotice("");
    try {
      await request({ action: "assign", user_id: Number(userId), hotel_id: Number(pending[0]) });
      setNotice("Hotel assigned. Check the API response for email delivery status.");
      setSelectedHotels([]);
      await load();
    } catch (e) {
      setError(`${e.message}. Any earlier assignments may already have been saved; refresh to review.`);
      await load();
    } finally { setSaving(false); }
  };

  const revoke = async assignment => {
    if (!window.confirm(`Remove ${assignment.user_name} from ${assignment.hotel_name} - ${assignmentBranch(assignment)}?`)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      await request({ action: "revoke", id: Number(assignment.id) });
      setNotice("Hotel access removed.");
      await load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="ns-hotel-users">
      <div className="ns-hu-header">
        <div>
          <span className="ns-hu-eyebrow">STAFF & BRANCH ACCESS</span>
          <h1>Hotel Users Management</h1>
          <p>Assign one branch per staff member. A branch can have multiple staff members.</p>
        </div>
        <div className="ns-hu-header-actions">
          <button className="ns-hu-secondary" type="button" onClick={() => setShowCreate(v => !v)}><UserPlus size={16} /> {showCreate ? "Close Form" : "+ Add Hotel User"}</button>
          <button className="ns-hu-secondary" type="button" onClick={load} disabled={loading || saving}><RefreshCw size={16} /> Refresh</button>
        </div>
      </div>

      {error && <div role="alert" className="ns-hu-alert ns-hu-error">{error}</div>}
      {notice && <div role="status" className="ns-hu-alert ns-hu-success">{notice}</div>}

      <div className="ns-hu-summary">
        <div><Users size={19} /><span>Available Staff</span><strong>{data.users.length}</strong></div>
        <div><span>Managed Hotels</span><strong>{data.hotels.length}</strong></div>
        <div><span>Active Assignments</span><strong>{activeAssignments.length}</strong></div>
      </div>

      {showCreate && <form className="ns-hu-card" onSubmit={createUser}>
        <h2><UserPlus size={19} /> Add New Hotel User</h2>
        <div className="ns-hu-create-grid">
          {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]].map(([field, label, type]) => (
            <div key={field}><label htmlFor={'ns-new-' + field}>{label}</label>
              <input id={'ns-new-' + field} required type={type} value={newUser[field]} onChange={e => setNewUser(prev => ({ ...prev, [field]: e.target.value }))} />
            </div>
          ))}
          <div><label htmlFor="ns-new-status">Status</label><select id="ns-new-status" value={newUser.status} onChange={e => setNewUser(prev => ({ ...prev, status: e.target.value }))}><option value="YES">Active</option><option value="NO">Inactive</option></select></div>
        </div>
        <div className="ns-hu-actions"><button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Hotel User'}</button></div>
      </form>}

      <form className="ns-hu-card" onSubmit={assign}>
        <h2><UserPlus size={19} /> Assign Hotel User</h2>
        <label htmlFor="ns-staff">Select Staff Member</label>
        <select id="ns-staff" value={userId} onChange={e => { setUserId(e.target.value); setSelectedHotels([]); }} disabled={saving}>
          <option value="">Select user</option>
          {data.users.map(u => {
            const assigned = assignedByUser.get(String(u.id));
            const hotel = assigned ? hotelsById.get(String(assigned.hotel_id)) || assigned : null;
            return <option key={u.id} value={u.id} disabled={Boolean(assigned)}>
              {u.name} — {u.email}{assigned ? ` (Assigned: ${hotel.hotel_name || "Hotel"} - ${branchName(hotel)})` : ""}
            </option>;
          })}
        </select>
        <label>Assign Hotel / Branch (select one)</label>
        {selectedUser && <p style={{ margin: "4px 0 12px", color: "#64746f", fontSize: 13 }}>Select exactly one hotel for {selectedUser.name}.</p>}
        <div className="ns-hu-hotels">
          {data.hotels.map(h => {
            const assigned = Boolean(userId) && assignedHotelIds.has(String(h.id));
            return <label key={h.id} className="ns-hu-hotel" style={assigned ? { opacity: 0.55, background: "#f0f2f1", cursor: "not-allowed" } : undefined}>
              <input type="checkbox" checked={assigned || selectedHotels.includes(String(h.id))}
                onChange={() => toggleHotel(h.id)} disabled={saving || !userId || selectedUserAlreadyAssigned || assigned} />
              <span><strong>{h.hotel_name}</strong><small>{branchName(h)}</small>
                {assigned && <small style={{ color: "#64746f", fontWeight: 600 }}>(Assigned: {h.hotel_name} - {branchName(h)})</small>}
              </span>
            </label>;
          })}
          {!loading && data.hotels.length === 0 && <p>No managed hotels available for assignment.</p>}
        </div>
        <div className="ns-hu-actions">
          <button type="submit" disabled={saving || !userId || selectedUserAlreadyAssigned || selectedHotels.length !== 1}>
            {saving ? "Saving..." : `Assign to ${selectedHotels.length} Hotel(s)`}
          </button>
        </div>
      </form>

      <section className="ns-hu-card">
        <div className="ns-hu-table-head">
          <h2>Assigned Hotel Users</h2>
          <input aria-label="Search assignments" placeholder="Search staff, email, hotel or branch..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ns-hu-table-scroll">
          <table>
            <thead><tr><th>Staff</th><th>Hotel / Branch</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(a => <tr key={a.id}>
                <td><strong>{a.user_name}</strong><small>{a.user_email}</small></td>
                <td><strong>{a.hotel_name}</strong><small>{assignmentBranch(a)}</small></td>
                <td><span className="ns-hu-status">Active</span></td>
                <td><button type="button" className="ns-hu-revoke" disabled={saving} onClick={() => revoke(a)}><Trash2 size={15} /> Remove</button></td>
              </tr>)}
              {!loading && filtered.length === 0 && <tr><td colSpan={4} className="ns-hu-empty">No matching assignments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
