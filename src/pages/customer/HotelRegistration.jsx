// import { useState } from "react";
// import {
//   Building2,
//   UserRound,
//   Phone,
//   Mail,
//   ArrowRight,
//   CheckCircle2,
// } from "lucide-react";
// import "./hotel-registration.css";

// const API_URL = "https://coreops.pk/Hotel/api";

// const initialForm = {
//   hotelName: "",
//   hotelOwner: "",
//   contact: "",
//   email: "",
//   address: "",
// };

// export default function HotelRegistration() {
//   const [form, setForm] = useState(initialForm);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const update = (event) => {
//     const { name, value } = event.target;
//     setForm((previous) => ({ ...previous, [name]: value }));
//     if (error) setError("");
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
//       setError("Please enter a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX).");
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

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/sendDemo.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ hotelName, hotelOwner, contact, email, address }),
//       });

//       const raw = await response.text();
//       let data;
//       try {
//         data = JSON.parse(raw);
//       } catch {
//         throw new Error("The server returned an invalid response. Please try again.");
//       }

//       if (!response.ok || data.status !== "success") {
//         if (response.status === 409) {
//           throw new Error(data.message || "A registration request for this hotel is already pending.");
//         }
//         throw new Error(data.message || "Unable to submit registration request.");
//       }

//       setSuccess(true);
//       setForm({ ...initialForm });
//       setError("");
//     } catch (err) {
//       console.error("Hotel registration error:", err);
//       setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="hotel-reg-page">
//       <section className="hotel-reg-intro">
//         <span className="hotel-reg-eyebrow">PARTNER WITH NORTHERNSTAYS</span>
//         <h1>List Your Hotel With Us</h1>
//         <p>
//           Join NorthernStays and connect your property with travelers
//           exploring Northern Pakistan. Submit a request and our team
//           will review it.
//         </p>
//       </section>

//       <section className="hotel-reg-card" aria-labelledby="hotel-reg-title">
//         {success ? (
//           <div className="hotel-reg-success" role="status">
//             <CheckCircle2 size={54} />
//             <h2>Request Submitted!</h2>
//             <p>
//               Your hotel registration request has been received.
//               Our team will review it and contact you after approval.
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
//                 <h2 id="hotel-reg-title">Hotel Registration Request</h2>
//                 <p>Fill in the details below to request a partner account.</p>
//               </div>
//             </div>

//             <form onSubmit={submit} className="hotel-reg-form">
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
//                 <label htmlFor="hotelAddress">Hotel Address *</label>
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

//               {error && (
//                 <p className="hotel-reg-error" role="alert">{error}</p>
//               )}

//               <button type="submit" disabled={loading} aria-busy={loading}>
//                 {loading ? "Submitting..." : "Submit Demo Request"}
//                 {!loading && <ArrowRight size={18} />}
//               </button>

//               <p className="hotel-reg-note">
//                 Submitting this form does not create an account.
//                 Login access is provided only after admin approval.
//               </p>
//             </form>
//           </>
//         )}
//       </section>
//     </main>
//   );
// }





import { useEffect, useRef, useState } from "react";
import {
  Building2,
  UserRound,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  UploadCloud,
} from "lucide-react";
import "./hotel-registration.css";

const API_URL = "https://coreops.pk/Hotel/api";
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
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

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

  return (
    <main className="hotel-reg-page">
      <section className="hotel-reg-intro">
        <span className="hotel-reg-eyebrow">
          PARTNER WITH NORTHERNSTAYS
        </span>

        <h1>List Your Hotel With Us</h1>

        <p>
          Join NorthernStays and connect your property
          with travelers exploring Northern Pakistan.
          Submit a request and our team will review it.
        </p>
      </section>

      <section
        className="hotel-reg-card"
        aria-labelledby="hotel-reg-title"
      >
        {success ? (
          <div
            className="hotel-reg-success"
            role="status"
          >
            <CheckCircle2 size={54} />

            <h2>Request Submitted!</h2>

            <p>
              Your hotel registration request has been
              received. Our team will review it and
              contact you after approval.
            </p>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setError("");
              }}
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <>
            <div className="hotel-reg-card-heading">
              <Building2 size={27} />

              <div>
                <h2 id="hotel-reg-title">
                  Hotel Registration Request
                </h2>

                <p>
                  Fill in the details below to request
                  a partner account.
                </p>
              </div>
            </div>

            <form
              onSubmit={submit}
              className="hotel-reg-form"
            >
              <label htmlFor="hotelName">
                <Building2 size={16} />
                Hotel Name
              </label>

              <input
                id="hotelName"
                name="hotelName"
                type="text"
                value={form.hotelName}
                onChange={update}
                placeholder="Enter hotel name"
                maxLength={150}
                required
                disabled={loading}
              />

              <label htmlFor="hotelOwner">
                <UserRound size={16} />
                Hotel Owner
              </label>

              <input
                id="hotelOwner"
                name="hotelOwner"
                type="text"
                value={form.hotelOwner}
                onChange={update}
                placeholder="Owner's full name"
                maxLength={120}
                required
                disabled={loading}
              />

              <label htmlFor="contact">
                <Phone size={16} />
                Contact
              </label>

              <input
                id="contact"
                name="contact"
                type="tel"
                value={form.contact}
                onChange={update}
                placeholder="03XXXXXXXXX"
                maxLength={20}
                required
                disabled={loading}
              />

              <label htmlFor="email">
                <Mail size={16} />
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="owner@example.com"
                maxLength={190}
                required
                disabled={loading}
              />

              <div className="registration-field">
                <label htmlFor="hotelAddress">
                  Hotel Address *
                </label>

                <textarea
                  id="hotelAddress"
                  name="address"
                  placeholder="Enter complete hotel address"
                  value={form.address}
                  onChange={update}
                  rows={3}
                  maxLength={1000}
                  required
                  disabled={loading}
                />
              </div>

              <div className="registration-field">
                <label htmlFor="hotelLogo">
                  <ImagePlus size={17} />
                  Hotel Logo *
                </label>

                <label
                  htmlFor="hotelLogo"
                  className="hotel-logo-upload"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    minHeight: 145,
                    padding: 20,
                    border: "2px dashed #cbdcd4",
                    borderRadius: 14,
                    background: "#f8fbf9",
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  {logoPreview ? (
                    <div className="hotel-logo-selected">
                      <img
                        src={logoPreview}
                        alt="Hotel logo preview"
                        style={{
                          width: 76,
                          height: 76,
                          objectFit: "contain",
                          background: "#fff",
                          border: "1px solid #e1e9e4",
                          borderRadius: 12,
                          padding: 6,
                          boxSizing: "border-box",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          minWidth: 0,
                        }}
                      >
                        <strong
                          style={{
                            color: "#173e33",
                            fontSize: 14,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {logo?.name}
                        </strong>

                        <span
                          style={{
                            color: "#788a80",
                            fontSize: 12,
                          }}
                        >
                          Click to change logo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="hotel-logo-placeholder"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 9,
                        textAlign: "center",
                      }}
                    >
                      <UploadCloud
                        size={28}
                        color="#b68a49"
                      />

                      <strong
                        style={{
                          color: "#173e33",
                          fontSize: 14,
                        }}
                      >
                        Click to upload hotel logo
                      </strong>

                      <span
                        style={{
                          color: "#7b8e86",
                          fontSize: 12,
                        }}
                      >
                        PNG, JPG or WebP · Maximum 2 MB
                      </span>
                    </div>
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  id="hotelLogo"
                  type="file"
                  name="logo"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  required
                  disabled={loading}
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    opacity: 0,
                    overflow: "hidden",
                  }}
                />
              </div>

              {error && (
                <p
                  className="hotel-reg-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Demo Request"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>

              <p className="hotel-reg-note">
                Submitting this form does not create an
                account. Login access is provided only
                after admin approval.
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
