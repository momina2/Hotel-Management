// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/hotel-admin-login.css";

// const API = "https://coreops.pk/Hotel/api/login.php";
// export default function HotelUserLogin() {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [otp, setOtp] = useState("");
//     const [step, setStep] = useState("login");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const request = async payload => {
//         const res = await fetch(API, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//         const data = await res.json().catch(() => ({}));
//         if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
//         return data;
//     };
//     const goNext = data => {
//         if (data.password_change_required) { navigate("/admin/change-password", { replace: true, state: { expired: !!data.password_expired } }); return; }
//         const role = String(data.user?.hotel_role || data.user?.user_type || "").toLowerCase();
//         navigate(role === "admin" || role === "hotel_admin" ? "/admin/dashboard" : "/admin/bookings", { replace: true });
//     };
//     const submit = async e => {
//         e.preventDefault(); setLoading(true); setError("");
//         try {
//             const data = step === "login" ? await request({ action: "login", email: email.trim(), password }) : await request({ action: "verify_otp", otp: otp.trim() });
//             if (data.otp_required) { setStep("otp"); setOtp(""); } else goNext(data);
//         } catch (err) { setError(err.message); } finally { setLoading(false); }
//     };
//     const style = { width: "100%", boxSizing: "border-box", padding: 12, margin: "8px 0 18px", border: "1px solid #cbd8d3", borderRadius: 8, fontSize: 15 };
//     return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f8f5", padding: 20 }}>
//         <form onSubmit={submit} style={{ width: "100%", maxWidth: 420, padding: 32, borderRadius: 16, background: "white", boxShadow: "0 10px 35px #123a2b12" }}>
//             <h1 style={{ color: "#143d32" }}>NorthernStays</h1><h2>{step === "otp" ? "Verify OTP" : "Hotel Portal Login"}</h2>
//             {step === "login" ? <><p>Sign in using your registered email and password.</p>
//                 <label htmlFor="ns-email">Email Address</label><input id="ns-email" type="email" autoComplete="username" required style={style} value={email} onChange={e => setEmail(e.target.value)} />
//                 <label htmlFor="ns-pass">Password</label><input id="ns-pass" type="password" autoComplete="current-password" required style={style} value={password} onChange={e => setPassword(e.target.value)} />
//             </> : <><p>Enter the 6-digit OTP sent to <b>{email}</b>. Hotel Users do not require OTP; Hotel Admins do.</p>
//                 <label htmlFor="ns-otp">Verification Code</label><input id="ns-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required style={style} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} />
//             </>}
//             {error && <p role="alert" style={{ color: "#b42b2b" }}>{error}</p>}
//             <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "#153d32", color: "white", border: 0, borderRadius: 8, cursor: "pointer" }}>{loading ? "Please wait..." : step === "otp" ? "Verify & Login" : "Login"}</button>
//             {step === "otp" && <button type="button" onClick={() => { setStep("login"); setOtp(""); setError(""); }} style={{ width: "100%", marginTop: 12, padding: 10, border: 0, background: "transparent" }}>Back to Login</button>}
//         </form>
//     </main>;
// }




import { API_BASE } from "../../api/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import "../../styles/hotel-admin-login.css";

const API = `${API_BASE}/login.php`;

async function loginRequest(payload) {
    let res;
    try {
        res = await fetch(API, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new Error("Could not connect to the login server. Check your connection, CORS settings and browser cookie permissions.");
    }
    const data = await res.json().catch(() => null);
    if (!data) throw new Error(`Server returned an invalid response (HTTP ${res.status}).`);
    if (!res.ok || !data.success) throw new Error(data.message || `Login request failed (HTTP ${res.status}).`);
    return data;
}

export default function HotelUserLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const goNext = (data) => {
        if (!data.user) throw new Error("Login response did not include user details.");
        if (data.password_change_required) {
            navigate("/admin/change-password", {
                replace: true,
                state: { expired: !!data.password_expired },
            });
            return;
        }
        const role = String(data.user.hotel_role || data.user.user_type || "").toLowerCase();
        const isAdmin = role === "admin" || role === "hotel_admin";
        if (!isAdmin && (!Number(data.user.hotel_id) || !data.user.hotel_code)) {
            throw new Error("No valid hotel assignment returned. Contact your administrator.");
        }
        navigate(isAdmin ? "/admin/dashboard" : "/admin/bookings", {
            replace: true,
            state: { hotelName: data.user.hotel_name || "", hotelCode: data.user.hotel_code || "" },
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            const data = step === "login"
                ? await loginRequest({ action: "login", email: email.trim(), password })
                : await loginRequest({ action: "verify_otp", otp: otp.trim() });
            if (data.otp_required) {
                setStep("otp");
                setOtp("");
                setPassword("");
            } else {
                setPassword("");
                goNext(data);
            }
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const brandLogo = (
        <>
            <div className="hotel-login-logo-icon"><Building2 size={24} /></div>
            <div><h1>NorthernStays</h1><p>Hotel Management</p></div>
        </>
    );

    return (
        <div className="hotel-login">
            <aside className="hotel-login-brand">
                <div className="hotel-login-logo">{brandLogo}</div>
                <div className="hotel-login-brand-content">
                    <span className="hotel-login-tag">Hotel Staff Portal</span>
                    <h2>Your front desk,<br /><span>always ready.</span></h2>
                    <p>Check reservations, confirm guests and manage check-ins and check-outs from one place.</p>
                    <div className="hotel-login-security"><ShieldCheck size={20} /><span>Secure access for authorized hotel staff</span></div>
                </div>
                <p className="hotel-login-copyright">© {new Date().getFullYear()} NorthernStays. All rights reserved.</p>
            </aside>

            <main className="hotel-login-right">
                <div className="hotel-login-form-container">
                    <div className="hotel-login-mobile-logo">{brandLogo}</div>

                    {step === "otp" && (
                        <button type="button" className="hotel-otp-back" disabled={loading}
                            onClick={() => { setStep("login"); setOtp(""); setError(""); }}>
                            <ArrowLeft size={17} /> Back to login
                        </button>
                    )}

                    <div className="hotel-login-heading">
                        <span className="hotel-login-eyebrow">{step === "otp" ? "Verification" : "Staff sign in"}</span>
                        <h2>{step === "otp" ? "Verify your login" : "Welcome back"}</h2>
                        <p>{step === "otp"
                            ? <>Enter the 6-digit code sent to <strong>{email}</strong>.</>
                            : "Sign in with the email and password your hotel admin gave you."}</p>
                    </div>

                    <form className="hotel-login-form" onSubmit={submit}>
                        {step === "login" ? (
                            <>
                                <div className="hotel-login-field">
                                    <label htmlFor="ns-email">Email address</label>
                                    <div className="hotel-login-input-wrap">
                                        <Mail size={19} />
                                        <input id="ns-email" className="hotel-login-input" type="email" autoComplete="username" required
                                            placeholder="you@yourhotel.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="hotel-login-field">
                                    <label htmlFor="ns-pass">Password</label>
                                    <div className="hotel-login-input-wrap">
                                        <LockKeyhole size={19} />
                                        <input id="ns-pass" className="hotel-login-input has-toggle" type={showPassword ? "text" : "password"}
                                            autoComplete="current-password" required placeholder="Enter your password"
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <button type="button" className="hotel-login-password-toggle"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            onClick={() => setShowPassword((value) => !value)}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="hotel-login-field">
                                <label htmlFor="ns-otp">Verification code</label>
                                <input id="ns-otp" className="hotel-otp-input" inputMode="numeric" autoComplete="one-time-code"
                                    maxLength={6} pattern="[0-9]{6}" required placeholder="000000" value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                            </div>
                        )}

                        {error && <div className="hotel-login-error" role="alert">{error}</div>}

                        <button type="submit" className="hotel-login-submit" disabled={loading || (step === "otp" && otp.length !== 6)}>
                            {loading
                                ? <><Loader2 size={19} className="hotel-login-spinner" /> Please wait…</>
                                : <>{step === "otp" ? "Verify & sign in" : "Sign in"} <ArrowRight size={19} /></>}
                        </button>
                    </form>

                    {step === "login" && (
                        <div className="hotel-login-links">
                            <Link to="/admin/forgot-password">Forgot password?</Link>
                            <span>·</span>
                            <Link to="/admin/login">Hotel admin login</Link>
                        </div>
                    )}

                    <div className="hotel-login-bottom"><ShieldCheck size={15} /> Protected hotel staff access</div>
                </div>
            </main>
        </div>
    );
}
