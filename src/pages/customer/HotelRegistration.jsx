




// import { useEffect, useRef, useState } from "react";
// import {
//   Building2,
//   UserRound,
//   Phone,
//   Mail,
//   ArrowRight,
//   CheckCircle2,
//   ImagePlus,
//   UploadCloud,
// } from "lucide-react";
// import "./hotel-registration.css";

// const API_URL = "https://coreops.pk/Hotel/api";
// const MAX_LOGO_SIZE = 2 * 1024 * 1024;

// const ALLOWED_LOGO_TYPES = [
//   "image/png",
//   "image/jpeg",
//   "image/webp",
// ];

// const initialForm = {
//   hotelName: "",
//   hotelOwner: "",
//   contact: "",
//   email: "",
//   address: "",
// };

// export default function HotelRegistration() {
//   const [form, setForm] = useState(initialForm);
//   const [logo, setLogo] = useState(null);
//   const [logoPreview, setLogoPreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (!logo) {
//       setLogoPreview("");
//       return;
//     }

//     const previewUrl = URL.createObjectURL(logo);
//     setLogoPreview(previewUrl);

//     return () => URL.revokeObjectURL(previewUrl);
//   }, [logo]);

//   const update = (event) => {
//     const { name, value } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     if (error) setError("");
//   };

//   const handleLogoChange = (event) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       setLogo(null);
//       return;
//     }

//     if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
//       setError(
//         "Only PNG, JPG and WebP logo images are allowed."
//       );
//       setLogo(null);
//       event.target.value = "";
//       return;
//     }

//     if (file.size > MAX_LOGO_SIZE) {
//       setError(
//         "Hotel logo must not exceed 2 MB."
//       );
//       setLogo(null);
//       event.target.value = "";
//       return;
//     }

//     setLogo(file);
//     setError("");
//   };

//   const resetForm = () => {
//     setForm({ ...initialForm });
//     setLogo(null);
//     setLogoPreview("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   async function submit(event) {
//     event.preventDefault();

//     if (loading) return;

//     setError("");
//     setSuccess(false);

//     const hotelName = form.hotelName.trim();
//     const hotelOwner = form.hotelOwner.trim();
//     const contact = form.contact.replace(/[\s()-]/g, "");
//     const email = form.email.trim().toLowerCase();
//     const address = form.address.trim();

//     if (!hotelName) {
//       setError("Hotel name is required.");
//       return;
//     }

//     if (!hotelOwner) {
//       setError("Hotel owner name is required.");
//       return;
//     }

//     if (!/^(?:\+92|0)3\d{9}$/.test(contact)) {
//       setError(
//         "Please enter a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX)."
//       );
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     if (!address) {
//       setError("Hotel address is required.");
//       return;
//     }

//     if (!logo) {
//       setError("Please upload your hotel logo.");
//       return;
//     }

//     if (!ALLOWED_LOGO_TYPES.includes(logo.type)) {
//       setError(
//         "Only PNG, JPG and WebP logo images are allowed."
//       );
//       return;
//     }

//     if (logo.size > MAX_LOGO_SIZE) {
//       setError("Hotel logo must not exceed 2 MB.");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("hotelName", hotelName);
//     formData.append("hotelOwner", hotelOwner);
//     formData.append("contact", contact);
//     formData.append("email", email);
//     formData.append("address", address);
//     formData.append("logo", logo, logo.name);

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${API_URL}/sendDemo.php`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const raw = await response.text();

//       let data;

//       try {
//         data = JSON.parse(raw);
//       } catch {
//         throw new Error(
//           "The server returned an invalid response. Please try again."
//         );
//       }

//       if (!response.ok || data.status !== "success") {
//         if (response.status === 409) {
//           throw new Error(
//             data.message ||
//             "A registration request for this hotel is already pending."
//           );
//         }

//         throw new Error(
//           data.message ||
//           "Unable to submit registration request."
//         );
//       }

//       resetForm();
//       setError("");
//       setSuccess(true);
//     } catch (err) {
//       console.error("Hotel registration error:", err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="hotel-reg-page">
//       <section className="hotel-reg-intro">
//         <span className="hotel-reg-eyebrow">
//           PARTNER WITH NORTHERNSTAYS
//         </span>

//         <h1>List Your Hotel With Us</h1>

//         <p>
//           Join NorthernStays and connect your property
//           with travelers exploring Northern Pakistan.
//           Submit a request and our team will review it.
//         </p>
//       </section>

//       <section
//         className="hotel-reg-card"
//         aria-labelledby="hotel-reg-title"
//       >
//         {success ? (
//           <div
//             className="hotel-reg-success"
//             role="status"
//           >
//             <CheckCircle2 size={54} />

//             <h2>Request Submitted!</h2>

//             <p>
//               Your hotel registration request has been
//               received. Our team will review it and
//               contact you after approval.
//             </p>

//             <button
//               type="button"
//               onClick={() => {
//                 setSuccess(false);
//                 setError("");
//               }}
//             >
//               Submit Another Request
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="hotel-reg-card-heading">
//               <Building2 size={27} />

//               <div>
//                 <h2 id="hotel-reg-title">
//                   Hotel Registration Request
//                 </h2>

//                 <p>
//                   Fill in the details below to request
//                   a partner account.
//                 </p>
//               </div>
//             </div>

//             <form
//               onSubmit={submit}
//               className="hotel-reg-form"
//             >
//               <label htmlFor="hotelName">
//                 <Building2 size={16} />
//                 Hotel Name
//               </label>

//               <input
//                 id="hotelName"
//                 name="hotelName"
//                 type="text"
//                 value={form.hotelName}
//                 onChange={update}
//                 placeholder="Enter hotel name"
//                 maxLength={150}
//                 required
//                 disabled={loading}
//               />

//               <label htmlFor="hotelOwner">
//                 <UserRound size={16} />
//                 Hotel Owner
//               </label>

//               <input
//                 id="hotelOwner"
//                 name="hotelOwner"
//                 type="text"
//                 value={form.hotelOwner}
//                 onChange={update}
//                 placeholder="Owner's full name"
//                 maxLength={120}
//                 required
//                 disabled={loading}
//               />

//               <label htmlFor="contact">
//                 <Phone size={16} />
//                 Contact
//               </label>

//               <input
//                 id="contact"
//                 name="contact"
//                 type="tel"
//                 value={form.contact}
//                 onChange={update}
//                 placeholder="03XXXXXXXXX"
//                 maxLength={20}
//                 required
//                 disabled={loading}
//               />

//               <label htmlFor="email">
//                 <Mail size={16} />
//                 Email
//               </label>

//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={update}
//                 placeholder="owner@example.com"
//                 maxLength={190}
//                 required
//                 disabled={loading}
//               />

//               <div className="registration-field">
//                 <label htmlFor="hotelAddress">
//                   Hotel Address *
//                 </label>

//                 <textarea
//                   id="hotelAddress"
//                   name="address"
//                   placeholder="Enter complete hotel address"
//                   value={form.address}
//                   onChange={update}
//                   rows={3}
//                   maxLength={1000}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="registration-field">
//                 <label htmlFor="hotelLogo">
//                   <ImagePlus size={17} />
//                   Hotel Logo *
//                 </label>

//                 <label
//                   htmlFor="hotelLogo"
//                   className="hotel-logo-upload"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "100%",
//                     minHeight: 145,
//                     padding: 20,
//                     border: "2px dashed #cbdcd4",
//                     borderRadius: 14,
//                     background: "#f8fbf9",
//                     cursor: loading
//                       ? "not-allowed"
//                       : "pointer",
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   {logoPreview ? (
//                     <div className="hotel-logo-selected">
//                       <img
//                         src={logoPreview}
//                         alt="Hotel logo preview"
//                         style={{
//                           width: 76,
//                           height: 76,
//                           objectFit: "contain",
//                           background: "#fff",
//                           border: "1px solid #e1e9e4",
//                           borderRadius: 12,
//                           padding: 6,
//                           boxSizing: "border-box",
//                         }}
//                       />

//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 6,
//                           minWidth: 0,
//                         }}
//                       >
//                         <strong
//                           style={{
//                             color: "#173e33",
//                             fontSize: 14,
//                             overflowWrap: "anywhere",
//                           }}
//                         >
//                           {logo?.name}
//                         </strong>

//                         <span
//                           style={{
//                             color: "#788a80",
//                             fontSize: 12,
//                           }}
//                         >
//                           Click to change logo
//                         </span>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className="hotel-logo-placeholder"
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 9,
//                         textAlign: "center",
//                       }}
//                     >
//                       <UploadCloud
//                         size={28}
//                         color="#b68a49"
//                       />

//                       <strong
//                         style={{
//                           color: "#173e33",
//                           fontSize: 14,
//                         }}
//                       >
//                         Click to upload hotel logo
//                       </strong>

//                       <span
//                         style={{
//                           color: "#7b8e86",
//                           fontSize: 12,
//                         }}
//                       >
//                         PNG, JPG or WebP · Maximum 2 MB
//                       </span>
//                     </div>
//                   )}
//                 </label>

//                 <input
//                   ref={fileInputRef}
//                   id="hotelLogo"
//                   type="file"
//                   name="logo"
//                   accept="image/png,image/jpeg,image/webp"
//                   onChange={handleLogoChange}
//                   required
//                   disabled={loading}
//                   style={{
//                     position: "absolute",
//                     width: 1,
//                     height: 1,
//                     opacity: 0,
//                     overflow: "hidden",
//                   }}
//                 />
//               </div>

//               {error && (
//                 <p
//                   className="hotel-reg-error"
//                   role="alert"
//                 >
//                   {error}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 aria-busy={loading}
//               >
//                 {loading
//                   ? "Submitting..."
//                   : "Submit Demo Request"}

//                 {!loading && (
//                   <ArrowRight size={18} />
//                 )}
//               </button>

//               <p className="hotel-reg-note">
//                 Submitting this form does not create an
//                 account. Login access is provided only
//                 after admin approval.
//               </p>
//             </form>
//           </>
//         )}
//       </section>
//     </main>
//   );
// }











import { API_BASE } from "../../api/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  UserRound,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  UploadCloud,
  MapPin,
  X,
  Info,
  AlertCircle,
  Globe2,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import "./hotel-registration.css";

const API_URL = API_BASE;
const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const initialForm = {
  hotelName: "",
  hotelOwner: "",
  contact: "",
  email: "",
  address: "",
};

export default function HotelRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => navigate("/", { replace: true }), 2000);
    return () => window.clearTimeout(timer);
  }, [success, navigate]);

  useEffect(() => {
    if (!logo) {
      setLogoPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(logo);
    setLogoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [logo]);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setLogo(null);
      return;
    }

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setError(
        "Only PNG, JPG and WebP logo images are allowed."
      );
      setLogo(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setError(
        "Hotel logo must not exceed 2 MB."
      );
      setLogo(null);
      event.target.value = "";
      return;
    }

    setLogo(file);
    setError("");
  };

  const resetForm = () => {
    setForm({ ...initialForm });
    setLogo(null);
    setLogoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function submit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess(false);

    const hotelName = form.hotelName.trim();
    const hotelOwner = form.hotelOwner.trim();
    const contact = form.contact.replace(/[\s()-]/g, "");
    const email = form.email.trim().toLowerCase();
    const address = form.address.trim();

    if (!hotelName) {
      setError("Hotel name is required.");
      return;
    }

    if (!hotelOwner) {
      setError("Hotel owner name is required.");
      return;
    }

    if (!/^(?:\+92|0)3\d{9}$/.test(contact)) {
      setError(
        "Please enter a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX)."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!address) {
      setError("Hotel address is required.");
      return;
    }

    if (!logo) {
      setError("Please upload your hotel logo.");
      return;
    }

    if (!ALLOWED_LOGO_TYPES.includes(logo.type)) {
      setError(
        "Only PNG, JPG and WebP logo images are allowed."
      );
      return;
    }

    if (logo.size > MAX_LOGO_SIZE) {
      setError("Hotel logo must not exceed 2 MB.");
      return;
    }

    const formData = new FormData();

    formData.append("hotelName", hotelName);
    formData.append("hotelOwner", hotelOwner);
    formData.append("contact", contact);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("logo", logo, logo.name);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/sendDemo.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const raw = await response.text();

      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      if (!response.ok || data.status !== "success") {
        if (response.status === 409) {
          throw new Error(
            data.message ||
            "A registration request for this hotel is already pending."
          );
        }

        throw new Error(
          data.message ||
          "Unable to submit registration request."
        );
      }

      resetForm();
      setError("");
      setSuccess(true);
    } catch (err) {
      console.error("Hotel registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (loading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) handleLogoChange({ target: { files: [file], value: "" } });
  };

  const removeLogo = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes) =>
    bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return (
    <main className="nsreg-page">
      <div className="nsreg-container">
        <section className="nsreg-intro">
          <span className="nsreg-eyebrow">Partner with NorthernStays</span>
          <h1>List your hotel with us</h1>
          <p className="nsreg-lead">
            Connect your property with travellers exploring Northern Pakistan.
            Send a request and our team will review it.
          </p>

          <ul className="nsreg-benefits">
            <li>
              <span><Globe2 size={18} /></span>
              <div>
                <strong>Reach more travellers</strong>
                <small>Your rooms appear in destination and area searches across the site.</small>
              </div>
            </li>
            <li>
              <span><LayoutDashboard size={18} /></span>
              <div>
                <strong>One dashboard for everything</strong>
                <small>Manage rooms, prices, add-ons, staff and bookings in one place.</small>
              </div>
            </li>
            <li>
              <span><ShieldCheck size={18} /></span>
              <div>
                <strong>Verified partners only</strong>
                <small>Every hotel is reviewed by our team before going live.</small>
              </div>
            </li>
          </ul>

          <div className="nsreg-steps">
            <h2>How it works</h2>
            <ol>
              <li><b>1</b><span>Submit this request</span></li>
              <li><b>2</b><span>Our team reviews your details</span></li>
              <li><b>3</b><span>Get your login after approval</span></li>
            </ol>
          </div>
        </section>

        <section className="nsreg-card" aria-labelledby="nsreg-title">
          {success ? (
            <div className="nsreg-success" role="status">
              <span className="nsreg-success-icon"><CheckCircle2 size={36} /></span>
              <h2>Request submitted</h2>
              <p>
                Thanks! Your hotel registration request has been received.
                Our team will review it and contact you after approval.
              </p>
              <small>Taking you to the homepage…</small>
              <button type="button" className="nsreg-btn-outline" onClick={() => navigate("/", { replace: true })}>
                Go to homepage now
              </button>
            </div>
          ) : (
            <>
              <header className="nsreg-card-head">
                <h2 id="nsreg-title">Hotel registration request</h2>
                <p>All fields are required. It only takes a minute.</p>
              </header>

              <form onSubmit={submit} className="nsreg-form" noValidate>
                <fieldset disabled={loading}>
                  <legend>Property</legend>

                  <div className="nsreg-field">
                    <label htmlFor="hotelName">Hotel name</label>
                    <div className="nsreg-input">
                      <Building2 size={17} />
                      <input id="hotelName" name="hotelName" type="text" value={form.hotelName} onChange={update}
                        placeholder="e.g. Mountain View Lodge" maxLength={150} autoComplete="organization" required />
                    </div>
                  </div>

                  <div className="nsreg-field">
                    <label htmlFor="hotelAddress">Hotel address</label>
                    <div className="nsreg-input is-textarea">
                      <MapPin size={17} />
                      <textarea id="hotelAddress" name="address" value={form.address} onChange={update}
                        placeholder="Street, area, city" rows={3} maxLength={1000} autoComplete="street-address" required />
                    </div>
                  </div>

                  <div className="nsreg-field">
                    <span className="nsreg-label" id="hotelLogo-label">Hotel logo</span>
                    <label
                      htmlFor="hotelLogo"
                      className={`nsreg-upload ${dragging ? "is-dragging" : ""} ${logoPreview ? "has-file" : ""}`}
                      aria-labelledby="hotelLogo-label"
                      onDragOver={(event) => { event.preventDefault(); if (!loading) setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                    >
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Hotel logo preview" />
                          <span className="nsreg-upload-text">
                            <strong>{logo?.name}</strong>
                            <small>{logo ? formatSize(logo.size) : ""} · Click to replace</small>
                          </span>
                          <button type="button" className="nsreg-remove" onClick={removeLogo} aria-label="Remove logo">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="nsreg-upload-icon"><UploadCloud size={22} /></span>
                          <span className="nsreg-upload-text is-center">
                            <strong><u>Click to upload</u> or drag and drop</strong>
                            <small>PNG, JPG or WebP · up to 2 MB</small>
                          </span>
                        </>
                      )}
                    </label>
                    <input ref={fileInputRef} id="hotelLogo" type="file" name="logo"
                      accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="nsreg-file" />
                  </div>
                </fieldset>

                <fieldset disabled={loading}>
                  <legend>Contact person</legend>

                  <div className="nsreg-field">
                    <label htmlFor="hotelOwner">Owner's full name</label>
                    <div className="nsreg-input">
                      <UserRound size={17} />
                      <input id="hotelOwner" name="hotelOwner" type="text" value={form.hotelOwner} onChange={update}
                        placeholder="Full name" maxLength={120} autoComplete="name" required />
                    </div>
                  </div>

                  <div className="nsreg-grid">
                    <div className="nsreg-field">
                      <label htmlFor="contact">Mobile number</label>
                      <div className="nsreg-input">
                        <Phone size={17} />
                        <input id="contact" name="contact" type="tel" value={form.contact} onChange={update}
                          placeholder="03XX XXXXXXX" maxLength={20} autoComplete="tel" inputMode="tel" required />
                      </div>
                    </div>
                    <div className="nsreg-field">
                      <label htmlFor="email">Email</label>
                      <div className="nsreg-input">
                        <Mail size={17} />
                        <input id="email" name="email" type="email" value={form.email} onChange={update}
                          placeholder="you@hotel.com" maxLength={190} autoComplete="email" required />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {error && (
                  <p className="nsreg-error" role="alert"><AlertCircle size={16} /> {error}</p>
                )}

                <button type="submit" className="nsreg-submit" disabled={loading} aria-busy={loading}>
                  {loading ? <><span className="nsreg-spinner" /> Submitting…</> : <>Submit request <ArrowRight size={18} /></>}
                </button>

                <p className="nsreg-note">
                  <Info size={14} />
                  This doesn't create an account yet. You'll receive login access after admin approval.
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
