import { API_BASE } from "../../api/client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const API = `${API_BASE}/login.php`;
export default function ChangePassword() {
    const navigate = useNavigate(); const location = useLocation();
    const [expired, setExpired] = useState(!!location.state?.expired);
    const [current, setCurrent] = useState(""); const [next, setNext] = useState(""); const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false); const [error, setError] = useState("");
    useEffect(() => { let alive = true; fetch(API, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "check_session" }) }).then(r => r.json().then(d => ({ ok: r.ok, data: d }))).then(({ ok, data }) => { if (!alive) return; if (!ok || !data.authenticated) navigate("/admin/login", { replace: true }); else if (!data.password_change_required) navigate("/admin/bookings", { replace: true }); else setExpired(!!data.password_expired); }).catch(() => { if (alive) setError("Unable to check your session."); }); return () => { alive = false; }; }, [navigate]);
    const submit = async e => {
        e.preventDefault(); setError(""); if (next !== confirm) { setError("New passwords do not match."); return; } setLoading(true);
        try { const r = await fetch(API, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "change_password", current_password: current, new_password: next, confirm_password: confirm }) }); const d = await r.json().catch(() => ({})); if (!r.ok || !d.success) throw new Error(d.message || "Unable to change password"); navigate("/admin/login", { replace: true, state: { passwordUpdated: true } }); } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    const input = { display: "block", width: "100%", boxSizing: "border-box", padding: 12, margin: "8px 0 18px", border: "1px solid #cbd8d3", borderRadius: 8 };
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f8f5", padding: 20 }}><form onSubmit={submit} style={{ width: "100%", maxWidth: 440, padding: 32, background: "white", borderRadius: 16, boxShadow: "0 10px 35px #123a2b12" }}>
        <h1 style={{ color: "#143d32" }}>Change Password</h1><p>{expired ? "Your password has expired. Please change your password." : "Please change your temporary password before continuing."}</p>
        <label>Current Password<input style={input} type="password" autoComplete="current-password" required value={current} onChange={e => setCurrent(e.target.value)} /></label>
        <label>New Password<input style={input} type="password" autoComplete="new-password" minLength={6} maxLength={128} required value={next} onChange={e => setNext(e.target.value)} /></label>
        <label>Confirm New Password<input style={input} type="password" autoComplete="new-password" minLength={6} required value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
        <p style={{ fontSize: 13, color: "#52635c" }}>Use at least 6 characters.</p>
        {error && <p role="alert" style={{ color: "#b42b2b" }}>{error}</p>}
        <button disabled={loading} type="submit" style={{ width: "100%", padding: 14, background: "#153d32", color: "white", border: 0, borderRadius: 8 }}>{loading ? "Updating..." : "Change Password"}</button>
    </form></main>;
}
