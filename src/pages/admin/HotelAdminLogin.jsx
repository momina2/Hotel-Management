// import { useState } from "react";

// import { useNavigate } from "react-router-dom";

// import {

//   Building2,

//   Mail,

//   LockKeyhole,

//   Eye,

//   EyeOff,

//   ArrowRight,

//   ShieldCheck,

//   ArrowLeft,

//   Loader2,

// } from "lucide-react";

// import "../../styles/hotel-admin-login.css";



// const LOGIN_API = "https://coreops.pk/Hotel/api/login.php";



// export default function HotelAdminLogin() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [otp, setOtp] = useState("");

//   const [step, setStep] = useState("login");

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");



//   const request = async (payload) => {

//     const response = await fetch(LOGIN_API, {

//       method: "POST",

//       credentials: "include",

//       headers: { "Content-Type": "application/json" },

//       body: JSON.stringify(payload),

//     });

//     let data;
//     try {
//       data = await response.json();
//     } catch {
//       throw new Error("Server returned an invalid response. Please try again.");
//     }

//     if (!response.ok || !data.success) {

//       throw new Error(data.message || "Something went wrong.");

//     }

//     return data;

//   };



//   const handleLogin = async (event) => {

//     event.preventDefault();

//     if (loading) return;

//     setError("");

//     setSuccess("");

//     setLoading(true);

//     try {

//       const data = await request({

//         action: "login",

//         email: email.trim(),

//         password,

//       });

//       if (data.otp_required) {

//         setStep("otp");

//         setOtp("");

//         setPassword("");

//         setSuccess("Verification code sent to your registered email.");

//       } else if (data.otp_required === false && data.user) {
//         const role = String(data.user.hotel_role || data.user.user_type || "").toLowerCase();
//         const isAdmin = role === "admin" || role === "hotel_admin";
//         if (!isAdmin && (!Number(data.user.hotel_id) || !data.user.hotel_code)) {
//           throw new Error("No valid hotel assignment returned. Contact your administrator.");
//         }
//         setPassword("");
//         navigate(data.password_change_required ? "/admin/change-password" : (isAdmin ? "/admin/dashboard" : "/admin/bookings"), {
//           replace: true,
//           state: { expired: !!data.password_expired, hotelName: data.user.hotel_name || "", hotelCode: data.user.hotel_code || "" },
//         });
//       } else {
//         setError("Unexpected login response.");
//       }

//     } catch (err) {

//       setError(err.message || "Login failed.");

//     } finally {

//       setLoading(false);

//     }

//   };



//   const handleVerifyOTP = async (event) => {

//     event.preventDefault();

//     if (loading || otp.length !== 6) return;

//     setError("");

//     setLoading(true);

//     try {

//       const data = await request({ action: "verify_otp", otp });

//       if (data.success && data.otp_required === false) {
//         const role = String(
//           data.user?.hotel_role || data.user?.user_type || ""
//         ).toLowerCase();
//         const isAdmin = role === "admin" || role === "hotel_admin";
//         const hotelId = Number(data.user?.hotel_id || 0);

//         if (!isAdmin && (
//           !Number.isInteger(hotelId) ||
//           hotelId <= 0 ||
//           !data.user?.hotel_code
//         )) {
//           throw new Error(
//             "No valid hotel assignment returned. Contact your administrator."
//           );
//         }

//         navigate(isAdmin ? "/admin/dashboard" : "/admin/bookings", {
//           replace: true,
//           state: {
//             hotelName: data.user?.hotel_name || "",
//             hotelCode: data.user?.hotel_code || "",
//           },
//         });
//       } else {

//         setError("Unexpected verification response.");

//       }

//     } catch (err) {

//       setError(err.message || "Verification failed.");

//     } finally {

//       setLoading(false);

//     }

//   };



//   const handleBack = () => {

//     setStep("login");

//     setOtp("");

//     setPassword("");

//     setError("");

//     setSuccess("");

//   };



//   return (

//     <div className="hotel-login">

//       <aside className="hotel-login-brand">

//         <div className="hotel-login-logo">

//           <div className="hotel-login-logo-icon">

//             <Building2 size={26} />

//           </div>

//           <div>

//             <h1>NorthernStays</h1>

//             <p>Hotel Management</p>

//           </div>

//         </div>



//         <div className="hotel-login-brand-content">

//           <span className="hotel-login-tag">Hotel Administration Portal</span>

//           <h2>

//             Hospitality,

//             <br />

//             managed

//             <br />

//             <span>beautifully.</span>

//           </h2>

//           <p>

//             Your dedicated workspace for managing hotel operations, reservations

//             and guest experiences.

//           </p>

//           <div className="hotel-login-security">

//             <ShieldCheck size={20} />

//             <span>Secure access for authorized hotel administrators</span>

//           </div>

//         </div>

//         <p className="hotel-login-copyright">

//           © {new Date().getFullYear()} NorthernStays. All rights reserved.

//         </p>

//       </aside>



//       <main className="hotel-login-right">

//         <div className="hotel-login-form-container">

//           <div className="hotel-login-mobile-logo">

//             <div className="hotel-login-logo-icon">

//               <Building2 size={24} />

//             </div>

//             <div>

//               <h1>NorthernStays</h1>

//               <p>Hotel Management</p>

//             </div>

//           </div>



//           {step === "login" ? (

//             <>

//               <div className="hotel-login-heading">

//                 <span className="hotel-login-eyebrow">Admin Portal</span>

//                 <h2>Welcome back</h2>

//                 <p>Sign in to access your hotel management dashboard.</p>

//               </div>

//               <form className="hotel-login-form" onSubmit={handleLogin}>

//                 <div className="hotel-login-field">

//                   <label htmlFor="hotel-admin-email">Email Address</label>

//                   <div className="hotel-login-input-wrap">

//                     <Mail size={19} />

//                     <input

//                       id="hotel-admin-email"

//                       className="hotel-login-input"

//                       type="email"

//                       required

//                       autoComplete="username"

//                       value={email}

//                       onChange={(e) => setEmail(e.target.value)}

//                       placeholder="admin@yourhotel.com"

//                     />

//                   </div>

//                 </div>

//                 <div className="hotel-login-field">

//                   <label htmlFor="hotel-admin-password">Password</label>

//                   <div className="hotel-login-input-wrap">

//                     <LockKeyhole size={19} />

//                     <input

//                       id="hotel-admin-password"

//                       className="hotel-login-input has-toggle"

//                       type={showPassword ? "text" : "password"}

//                       required

//                       autoComplete="current-password"

//                       value={password}

//                       onChange={(e) => setPassword(e.target.value)}

//                       placeholder="Enter your password"

//                     />

//                     <button

//                       type="button"

//                       className="hotel-login-password-toggle"

//                       onClick={() => setShowPassword((value) => !value)}

//                       aria-label={

//                         showPassword ? "Hide password" : "Show password"

//                       }

//                     >

//                       {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}

//                     </button>

//                   </div>

//                 </div>

//                 {error && (

//                   <div role="alert" className="hotel-login-error">

//                     {error}

//                   </div>

//                 )}

//                 <button

//                   type="submit"

//                   className="hotel-login-submit"

//                   disabled={loading}

//                 >

//                   {loading ? (

//                     <>

//                       <Loader2 size={19} className="hotel-login-spinner" />{" "}

//                       Signing in...

//                     </>

//                   ) : (

//                     <>

//                       Sign In to Dashboard <ArrowRight size={19} />

//                     </>

//                   )}

//                 </button>

//               </form>

//               <button type="button" className="hotel-otp-back" onClick={() => navigate("/admin/forgot-password")}>Forgot Password?</button>

//             </>

//           ) : (

//             <>

//               <button

//                 type="button"

//                 className="hotel-otp-back"

//                 onClick={handleBack}

//               >

//                 <ArrowLeft size={17} /> Back to login

//               </button>

//               <div className="hotel-otp-icon">

//                 <ShieldCheck size={31} />

//               </div>

//               <h2 className="hotel-otp-heading">Verify your identity</h2>

//               <p className="hotel-otp-description">

//                 We've sent a 6-digit verification code to{" "}

//                 <strong>{email}</strong>. The code expires in 5 minutes.

//               </p>

//               {success && (

//                 <div className="hotel-login-success" role="status">

//                   {success}

//                 </div>

//               )}

//               <form className="hotel-login-form" onSubmit={handleVerifyOTP}>

//                 <div className="hotel-login-field">

//                   <label htmlFor="hotel-admin-otp">Verification Code</label>

//                   <input

//                     id="hotel-admin-otp"

//                     className="hotel-otp-input"

//                     type="text"

//                     inputMode="numeric"

//                     autoComplete="one-time-code"

//                     maxLength={6}

//                     required

//                     pattern="[0-9]{6}"

//                     value={otp}

//                     onChange={(e) =>

//                       setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))

//                     }

//                     placeholder="000000"

//                   />

//                 </div>

//                 {error && (

//                   <div role="alert" className="hotel-login-error">

//                     {error}

//                   </div>

//                 )}

//                 <button

//                   type="submit"

//                   className="hotel-login-submit"

//                   disabled={loading || otp.length !== 6}

//                 >

//                   {loading ? (

//                     <>

//                       <Loader2 size={19} className="hotel-login-spinner" />{" "}

//                       Verifying...

//                     </>

//                   ) : (

//                     <>

//                       Verify &amp; Continue <ArrowRight size={19} />

//                     </>

//                   )}

//                 </button>

//               </form>

//             </>

//           )}

//           <div className="hotel-login-bottom">

//             <ShieldCheck size={15} /> Protected Hotel Administrator Access

//           </div>

//         </div>

//       </main>

//     </div>

//   );

// }




import { API_BASE } from "../../api/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import "../../styles/hotel-admin-login.css";

const LOGIN_API = `${API_BASE}/login.php`;

export default function HotelAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const request = async (payload) => {
    let response;
    try {
      response = await fetch(LOGIN_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Could not connect to the login server. Check your connection, CORS settings and browser cookie permissions.");
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Server returned an invalid response (HTTP ${response.status}). Please try again.`);
    }
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
    }
    return data;
  };

  const finishLogin = (data) => {
    if (!data.user) throw new Error("Login response did not include user details.");
    const role = String(data.user.hotel_role || data.user.user_type || "").toLowerCase();
    const isAdmin = role === "admin" || role === "hotel_admin";
    if (!isAdmin && (!Number(data.user.hotel_id) || !data.user.hotel_code)) {
      throw new Error("No valid hotel assignment returned. Contact your administrator.");
    }
    setPassword("");
    navigate(
      data.password_change_required
        ? "/admin/change-password"
        : (isAdmin ? "/admin/dashboard" : "/admin/bookings"),
      {
        replace: true,
        state: {
          expired: !!data.password_expired,
          hotelName: data.user.hotel_name || "",
          hotelCode: data.user.hotel_code || "",
        },
      }
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await request({ action: "login", email: email.trim(), password });
      if (data.otp_required) {
        setStep("otp");
        setOtp("");
        setPassword("");
        setSuccess("Verification code sent to your registered email.");
      } else if (data.otp_required === false && data.user) {
        finishLogin(data);
      } else {
        setError("Unexpected login response.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    if (loading || otp.length !== 6) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await request({ action: "verify_otp", otp: otp.trim() });
      if (data.otp_required === false && data.user) {
        finishLogin(data);
      } else {
        setError("Unexpected verification response.");
      }
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (loading) return;
    setStep("login");
    setOtp("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="hotel-login">
      <aside className="hotel-login-brand">
        <div className="hotel-login-logo">
          <div className="hotel-login-logo-icon"><Building2 size={26} /></div>
          <div><h1>NorthernStays</h1><p>Hotel Management</p></div>
        </div>
        <div className="hotel-login-brand-content">
          <span className="hotel-login-tag">Hotel Administration Portal</span>
          <h2>Hospitality,<br />managed<br /><span>beautifully.</span></h2>
          <p>Your dedicated workspace for managing hotel operations, reservations and guest experiences.</p>
          <div className="hotel-login-security">
            <ShieldCheck size={20} />
            <span>Secure access for authorized hotel administrators</span>
          </div>
        </div>
        <p className="hotel-login-copyright">© {new Date().getFullYear()} NorthernStays. All rights reserved.</p>
      </aside>

      <main className="hotel-login-right">
        <div className="hotel-login-form-container">
          <div className="hotel-login-mobile-logo">
            <div className="hotel-login-logo-icon"><Building2 size={24} /></div>
            <div><h1>NorthernStays</h1><p>Hotel Management</p></div>
          </div>

          {step === "login" ? (
            <>
              <div className="hotel-login-heading">
                <span className="hotel-login-eyebrow">Admin Portal</span>
                <h2>Welcome back</h2>
                <p>Sign in to access your hotel management dashboard.</p>
              </div>
              <form className="hotel-login-form" onSubmit={handleLogin}>
                <div className="hotel-login-field">
                  <label htmlFor="hotel-admin-email">Email Address</label>
                  <div className="hotel-login-input-wrap">
                    <Mail size={19} />
                    <input id="hotel-admin-email" className="hotel-login-input" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourhotel.com" />
                  </div>
                </div>
                <div className="hotel-login-field">
                  <label htmlFor="hotel-admin-password">Password</label>
                  <div className="hotel-login-input-wrap">
                    <LockKeyhole size={19} />
                    <input id="hotel-admin-password" className="hotel-login-input has-toggle" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                    <button type="button" className="hotel-login-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
                {error && <div role="alert" className="hotel-login-error">{error}</div>}
                <button type="submit" className="hotel-login-submit" disabled={loading}>
                  {loading ? <><Loader2 size={19} className="hotel-login-spinner" />{" "}Signing in...</> : <>Sign In to Dashboard <ArrowRight size={19} /></>}
                </button>
              </form>
              <button type="button" className="hotel-otp-back" onClick={() => navigate("/admin/forgot-password")}>Forgot Password?</button>
            </>
          ) : (
            <>
              <button type="button" className="hotel-otp-back" disabled={loading} onClick={handleBack}><ArrowLeft size={17} /> Back to login</button>
              <div className="hotel-otp-icon"><ShieldCheck size={31} /></div>
              <h2 className="hotel-otp-heading">Verify your identity</h2>
              <p className="hotel-otp-description">We've sent a 6-digit verification code to <strong>{email}</strong>. The code expires in 5 minutes.</p>
              {success && <div className="hotel-login-success" role="status">{success}</div>}
              <form className="hotel-login-form" onSubmit={handleVerifyOTP}>
                <div className="hotel-login-field">
                  <label htmlFor="hotel-admin-otp">Verification Code</label>
                  <input id="hotel-admin-otp" className="hotel-otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required pattern="[0-9]{6}" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
                </div>
                {error && <div role="alert" className="hotel-login-error">{error}</div>}
                <button type="submit" className="hotel-login-submit" disabled={loading || otp.length !== 6}>
                  {loading ? <><Loader2 size={19} className="hotel-login-spinner" />{" "}Verifying...</> : <>Verify &amp; Continue <ArrowRight size={19} /></>}
                </button>
              </form>
            </>
          )}
          <div className="hotel-login-bottom"><ShieldCheck size={15} /> Protected Hotel Administrator Access</div>
        </div>
      </main>
    </div>
  );
}
