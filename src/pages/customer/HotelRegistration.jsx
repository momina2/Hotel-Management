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

// const API_URL = import.meta.env.VITE_API_URL || "/Hotel/api";

// export default function HotelRegistration() {
//   const [form, setForm] = useState({
//     hotelName: "",
//     hotelOwner: "",
//     contact: "",
//     email: "",
//     address: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const update = (event) =>
//     setForm((previous) => ({
//       ...previous,
//       [event.target.name]: event.target.value,
//     }));

//   async function submit(event) {
//     event.preventDefault();
//     setError("");
//     const contact = form.contact.replace(/[\s()-]/g, "");
//     if (!/^(?:\+92|0)3\d{9}$/.test(contact)) {
//       setError(
//         "Please enter a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX).",
//       );
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/hotel-registration.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, contact }),
//       });
//       const data = await response.json();
//       if (!response.ok || !data.success)
//         throw new Error(data.message || "Unable to submit request.");
//       setSuccess(true);
//       setForm({ hotelName: "", hotelOwner: "", contact: "", email: "" });
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
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
//           Join NorthernStays and connect your property with travelers exploring
//           Northern Pakistan. Submit a request and our team will review it.
//         </p>
//       </section>
//       <section className="hotel-reg-card" aria-labelledby="hotel-reg-title">
//         {success ? (
//           <div className="hotel-reg-success" role="status">
//             <CheckCircle2 size={54} />
//             <h2>Request Submitted!</h2>
//             <p>
//               Your hotel registration request has been received. Our team will
//               review it and contact you after approval.
//             </p>
//             <button type="button" onClick={() => setSuccess(false)}>
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
//                 <Building2 size={16} /> Hotel Name
//               </label>
//               <input
//                 id="hotelName"
//                 name="hotelName"
//                 value={form.hotelName}
//                 onChange={update}
//                 placeholder="Enter hotel name"
//                 maxLength={150}
//                 required
//               />
//               <label htmlFor="hotelOwner">
//                 <UserRound size={16} /> Hotel Owner
//               </label>
//               <input
//                 id="hotelOwner"
//                 name="hotelOwner"
//                 value={form.hotelOwner}
//                 onChange={update}
//                 placeholder="Owner's full name"
//                 maxLength={120}
//                 required
//               />
//               <label htmlFor="contact">
//                 <Phone size={16} /> Contact
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
//               />
//               <label htmlFor="email">
//                 <Mail size={16} /> Email
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
//               />

//               <div className="registration-field">
//                 <label htmlFor="hotelAddress">Hotel Address *</label>
//                 <textarea
//                   id="hotelAddress"
//                   name="address"
//                   placeholder="Enter complete hotel address"
//                   value={form.address}
//                   onChange={(e) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       address: e.target.value,
//                     }))
//                   }
//                   rows={3}
//                   required
//                 />
//               </div>
//               {error && (
//                 <p className="hotel-reg-error" role="alert">
//                   {error}
//                 </p>
//               )}
//               <button type="submit" disabled={loading}>
//                 {loading ? "Submitting..." : "Submit Demo Request"}{" "}
//                 {!loading && <ArrowRight size={18} />}
//               </button>
//               <p className="hotel-reg-note">
//                 Submitting this form does not create an account. Login access is
//                 provided only after admin approval.
//               </p>
//             </form>
//           </>
//         )}
//       </section>
//     </main>
//   );
// }






import { useState } from "react";
import {
  Building2,
  UserRound,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "./hotel-registration.css";

const API_URL = "https://coreops.pk/Hotel/api";

const initialForm = {
  hotelName: "",
  hotelOwner: "",
  contact: "",
  email: "",
  address: "",
};

export default function HotelRegistration() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  async function submit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const contact = form.contact.replace(/[\s()-]/g, "");

    if (!/^(?:\+92|0)3\d{9}$/.test(contact)) {
      setError(
        "Please enter a valid Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX)."
      );
      return;
    }

    if (!form.hotelName.trim()) {
      setError("Hotel name is required.");
      return;
    }

    if (!form.hotelOwner.trim()) {
      setError("Hotel owner name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!form.address.trim()) {
      setError("Hotel address is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/sendDemo.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelName: form.hotelName.trim(),
          hotelOwner: form.hotelOwner.trim(),
          contact,
          email: form.email.trim().toLowerCase(),
          address: form.address.trim(),
        }),
      });

      const raw = await response.text();

      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Invalid API response:", raw);

        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message || "Unable to submit registration request."
        );
      }

      setSuccess(true);
      setForm({ ...initialForm });
      setError("");
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
          Join NorthernStays and connect your property with travelers
          exploring Northern Pakistan. Submit a request and our team
          will review it.
        </p>
      </section>

      <section
        className="hotel-reg-card"
        aria-labelledby="hotel-reg-title"
      >
        {success ? (
          <div className="hotel-reg-success" role="status">
            <CheckCircle2 size={54} />

            <h2>Request Submitted!</h2>

            <p>
              Your hotel registration request has been received.
              Our team will review it and contact you after approval.
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
                  Fill in the details below to request a partner account.
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
              >
                {loading
                  ? "Submitting..."
                  : "Submit Demo Request"}

                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="hotel-reg-note">
                Submitting this form does not create an account.
                Login access is provided only after admin approval.
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
