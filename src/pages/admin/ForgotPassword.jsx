import { API_BASE } from "../../api/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, LockKeyhole, ShieldCheck, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import "../../styles/hotel-admin-login.css";

const API = `${API_BASE}/forgot_password.php`;
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const request = async (action, extras = {}) => {
    const response = await fetch(API, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, email: email.trim().toLowerCase(), ...extras }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) throw new Error(data.message || "Request failed. Please try again.");
    return data;
  };
  const submit = async (event) => {
    event.preventDefault(); if (loading) return;
    setError(""); setMessage(""); setLoading(true);
    try {
      if (step === "email") {
        const data = await request("request_otp");
        setMessage(data.message); setStep("otp");
      } else if (step === "otp") {
        const data = await request("verify_otp", { otp });
        setResetToken(data.reset_token); setOtp(""); setStep("password"); setMessage("Email verified. Choose a new password.");
      } else {
        if (password !== confirm) throw new Error("New passwords do not match.");
        await request("reset_password", { reset_token: resetToken, new_password: password, confirm_password: confirm });
        setResetToken(""); setPassword(""); setConfirm("");
        navigate("/admin/login", { replace: true, state: { passwordUpdated: true } });
      }
    } catch (err) { setError(err.message || "Something went wrong."); }
    finally { setLoading(false); }
  };
  const back = () => { setError(""); setMessage(""); if (step === "email") navigate("/admin/login"); else { setStep("email"); setResetToken(""); setOtp(""); } };
  return (
    <div className="hotel-login">
      <aside className="hotel-login-brand">
        <div className="hotel-login-logo"><div className="hotel-login-logo-icon"><Building2 size={26} /></div><div><h1>NorthernStays</h1><p>Hotel Management</p></div></div>
        <div className="hotel-login-brand-content"><span className="hotel-login-tag">Hotel Administration Portal</span><h2>Hospitality,<br />managed<br /><span>beautifully.</span></h2><p>Your dedicated workspace for managing hotel operations, reservations and guest experiences.</p><div className="hotel-login-security"><ShieldCheck size={20} /><span>Secure access for authorized hotel administrators</span></div></div>
        <p className="hotel-login-copyright">© {new Date().getFullYear()} NorthernStays. All rights reserved.</p>
      </aside>
      <main className="hotel-login-right"><div className="hotel-login-form-container">
        <div className="hotel-login-mobile-logo"><div className="hotel-login-logo-icon"><Building2 size={24} /></div><div><h1>NorthernStays</h1><p>Hotel Management</p></div></div>
        <button type="button" className="hotel-otp-back" onClick={back}><ArrowLeft size={17} /> Back to {step === "email" ? "login" : "email"}</button>
        <div className="hotel-login-heading"><span className="hotel-login-eyebrow">Account Recovery</span><h2>{step === "email" ? "Forgot password?" : step === "otp" ? "Verify your email" : "Set new password"}</h2><p>{step === "email" ? "Enter your registered Hotel Admin or Hotel User email." : step === "otp" ? `Enter the 6-digit code sent to ${email}. It expires in 5 minutes.` : "Use at least 6 characters."}</p></div>
        <form className="hotel-login-form" onSubmit={submit}>
          {step === "email" && <div className="hotel-login-field"><label htmlFor="reset-email">Registered Email</label><div className="hotel-login-input-wrap"><Mail size={19} /><input id="reset-email" className="hotel-login-input" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourhotel.com" /></div></div>}
          {step === "otp" && <div className="hotel-login-field"><label htmlFor="reset-otp">Verification Code</label><input id="reset-otp" className="hotel-otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></div>}
          {step === "password" && <><div className="hotel-login-field"><label htmlFor="reset-new">New Password</label><div className="hotel-login-input-wrap"><LockKeyhole size={19} /><input id="reset-new" className="hotel-login-input" type="password" autoComplete="new-password" minLength={6} maxLength={128} required value={password} onChange={e => setPassword(e.target.value)} /></div></div><div className="hotel-login-field"><label htmlFor="reset-confirm">Confirm New Password</label><div className="hotel-login-input-wrap"><LockKeyhole size={19} /><input id="reset-confirm" className="hotel-login-input" type="password" autoComplete="new-password" minLength={6} maxLength={128} required value={confirm} onChange={e => setConfirm(e.target.value)} /></div></div></>}
          {message && <div className="hotel-login-success" role="status">{message}</div>}
          {error && <div className="hotel-login-error" role="alert">{error}</div>}
          <button className="hotel-login-submit" type="submit" disabled={loading || (step === "otp" && otp.length !== 6)}>{loading ? <><Loader2 size={19} className="hotel-login-spinner" /> Please wait...</> : <>{step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}<ArrowRight size={19} /></>}</button>
        </form>
        {step === "otp" && <button type="button" className="hotel-otp-back" disabled={loading} onClick={async () => { setError(""); setMessage(""); setLoading(true); try { const d = await request("request_otp"); setMessage(d.message); } catch (e) { setError(e.message); } finally { setLoading(false); } }}>Resend code (60-second cooldown)</button>}
        <div className="hotel-login-bottom"><ShieldCheck size={15} /> Protected Hotel Administrator Access</div>
      </div></main>
    </div>
  );
}
