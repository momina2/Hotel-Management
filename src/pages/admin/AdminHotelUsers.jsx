import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, RefreshCw, UserPlus, Trash2 } from "lucide-react";
import "./hotel-users.css";

const API = "https://coreops.pk/Hotel/api/hotel_users.php";

async function request(payload) {
  const response = await fetch(API, {
    method: payload ? "POST" : "GET",
    credentials: "include",
    cache: "no-store",
    headers: payload ? { "Content-Type": "application/json" } : {},
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export default function AdminHotelUsers() {
  const [data, setData] = useState({ users: [], hotels: [], assignments: [] });
  const [userId, setUserId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "", confirm_password: "", status: "YES" });
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
      setData({
        users: Array.isArray(result.users) ? result.users : [],
        hotels: Array.isArray(result.hotels) ? result.hotels : [],
        assignments: Array.isArray(result.assignments) ? result.assignments : [],
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeAssignments = useMemo(
    () => data.assignments.filter((a) => String(a.status).toUpperCase() === "YES"),
    [data.assignments]
  );

  const filtered = useMemo(() => activeAssignments.filter((a) => {
    const text = `${a.user_name || ""} ${a.user_email || ""} ${a.hotel_name || ""} ${a.hotel_code || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  }), [activeAssignments, search]);

  const toggleHotel = (id) => {
    const value = String(id);
    setSelectedHotels((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const createUser = async (event) => {
    event.preventDefault();
    if (!selectedHotels.length) { setError("Select at least one hotel for the new user."); return; }
    setSaving(true); setError(""); setNotice("");
    try {
      await request({ action: "create_user", ...newUser, hotel_ids: selectedHotels.map(Number) });
      setNotice("Hotel User created. They can log in using email and password.");
      setNewUser({ name: "", email: "", phone: "", password: "", confirm_password: "", status: "YES" });
      setShowCreate(false); setSelectedHotels([]);
      await load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const assign = async (event) => {
    event.preventDefault();
    if (!userId || selectedHotels.length === 0) {
      setError("Select a staff member and at least one hotel.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      for (const hotel_id of selectedHotels) {
        await request({ action: "assign", user_id: Number(userId), hotel_id: Number(hotel_id) });
      }
      setNotice("Hotel assignment(s) saved successfully.");
      setSelectedHotels([]);
      setUserId("");
      await load();
    } catch (e) {
      setError(`${e.message}. Any earlier assignments may already have been saved; refresh to review.`);
    } finally {
      setSaving(false);
    }
  };

  const revoke = async (assignment) => {
    if (!window.confirm(`Remove ${assignment.user_name} from ${assignment.hotel_name}?`)) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await request({ action: "revoke", id: Number(assignment.id) });
      setNotice("Hotel access removed.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ns-hotel-users">
      <div className="ns-hu-header">
        <div>
          <span className="ns-hu-eyebrow">STAFF & BRANCH ACCESS</span>
          <h1>Hotel Users Management</h1>
          <p>Assign multiple staff members to one hotel, or one staff member to multiple branches.</p>
        </div>
        <div className="ns-hu-header-actions">
          <button className="ns-hu-secondary" type="button" onClick={() => setShowCreate((v) => !v)}><UserPlus size={16} /> {showCreate ? "Close Form" : "+ Add Hotel User"}</button>
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
          {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel'], ['password', 'Password', 'password'], ['confirm_password', 'Confirm Password', 'password']].map(([field, label, type]) => (
            <div key={field}><label htmlFor={'ns-new-' + field}>{label}</label>
              <input id={'ns-new-' + field} required type={type} minLength={field.includes('password') ? 10 : undefined} value={newUser[field]} onChange={e => setNewUser(prev => ({ ...prev, [field]: e.target.value }))} />
            </div>
          ))}
          <div><label htmlFor="ns-new-status">Status</label><select id="ns-new-status" value={newUser.status} onChange={e => setNewUser(prev => ({ ...prev, status: e.target.value }))}><option value="YES">Active</option><option value="NO">Inactive</option></select></div>
        </div>
        <label>Assign Hotel / Branch</label>
        <div className="ns-hu-hotels">{data.hotels.map(h => <label key={h.id} className="ns-hu-hotel"><input type="checkbox" checked={selectedHotels.includes(String(h.id))} onChange={() => toggleHotel(h.id)} /><span><strong>{h.hotel_name}</strong><small>{h.hotel_code}</small></span></label>)}</div>
        <div className="ns-hu-actions"><button type="submit" disabled={saving || !selectedHotels.length}>{saving ? 'Saving...' : 'Create Hotel User'}</button></div>
      </form>}
      <form className="ns-hu-card" onSubmit={assign}>
        <h2><UserPlus size={19} /> Assign Hotel User</h2>
        <label htmlFor="ns-staff">Select Staff Member</label>
        <select id="ns-staff" value={userId} onChange={(e) => setUserId(e.target.value)} disabled={saving}>
          <option value="">Select user</option>
          {data.users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
          ))}
        </select>
        <label>Assign Hotel / Branch (select one or more)</label>
        <div className="ns-hu-hotels">
          {data.hotels.map((h) => (
            <label key={h.id} className="ns-hu-hotel">
              <input type="checkbox" checked={selectedHotels.includes(String(h.id))}
                onChange={() => toggleHotel(h.id)} disabled={saving} />
              <span><strong>{h.hotel_name}</strong><small>{h.hotel_code || `Hotel #${h.id}`}</small></span>
            </label>
          ))}
          {!loading && data.hotels.length === 0 && <p>No managed hotels available for assignment.</p>}
        </div>
        <div className="ns-hu-actions">
          <button type="submit" disabled={saving || !userId || !selectedHotels.length}>
            {saving ? "Saving..." : `Assign to ${selectedHotels.length || 0} Hotel(s)`}
          </button>
        </div>
      </form>

      <section className="ns-hu-card">
        <div className="ns-hu-table-head">
          <h2>Assigned Hotel Users</h2>
          <input aria-label="Search assignments" placeholder="Search staff, email or hotel..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="ns-hu-table-scroll">
          <table>
            <thead><tr><th>Staff</th><th>Hotel / Branch</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.user_name}</strong><small>{a.user_email}</small></td>
                  <td><strong>{a.hotel_name}</strong><small>{a.hotel_code}</small></td>
                  <td><span className="ns-hu-status">Active</span></td>
                  <td><button type="button" className="ns-hu-revoke" disabled={saving}
                    onClick={() => revoke(a)}><Trash2 size={15} /> Remove</button></td>
                </tr>
              ))}
              {!loading && filtered.length === 0 &&
                <tr><td colSpan={4} className="ns-hu-empty">No matching assignments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
