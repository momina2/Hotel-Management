


import { API_BASE, apiFetch } from "../../api/client";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, ImagePlus, RefreshCw, MapPin, ExternalLink } from "lucide-react";
import "./admin.css";

// Hotel profile is resolved by the server from the authenticated session.

const HOTEL_PROFILE_API = `${API_BASE}/hotel_profile.php`;



async function hotelProfileRequest(action, fields = {}, signal) {
  const isMultipart = fields instanceof FormData;
  if (isMultipart) fields.set("action", action);

  const response = await apiFetch(HOTEL_PROFILE_API, {

    method: "POST",

    credentials: "include",

    ...(isMultipart ? {} : { headers: { "Content-Type": "application/json" } }),

    body: isMultipart ? fields : JSON.stringify({ action, ...fields }),

    signal,

  });

  const result = await response.json().catch(() => { throw new Error("Server returned an invalid JSON response."); });

  if (!response.ok || !result.success) {

    throw new Error(result.message || "Unable to load hotel information.");

  }

  return result;

}



function hotelMapsUrl(hotel) {
  if (hotel.latitude === null || hotel.latitude === undefined || String(hotel.latitude).trim() === "" ||
    hotel.longitude === null || hotel.longitude === undefined || String(hotel.longitude).trim() === "") return null;
  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadHotels = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const result = await hotelProfileRequest("get", {}, signal);
      if (signal?.aborted) return;
      setHotels(Array.isArray(result.hotels) ? result.hotels : result.hotel ? [result.hotel] : []);
      setCanManage(Boolean(result.can_manage));
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) setError(err.message || "Unable to load hotels.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadHotels(controller.signal);
    return () => controller.abort();
  }, [loadHotels]);

  const visibleHotels = hotels.filter((hotel) =>
    `${hotel.hotel_code || ""} ${hotel.hotel_name || ""} ${hotel.city_name || ""} ${hotel.area_name || ""} ${hotel.address || ""} ${hotel.status || ""}`
      .toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <div className="ns-heading">
        <div>
          <span>PROPERTY MANAGEMENT</span>
          <h1>Hotel Management</h1>
          <p>View and manage hotels registered under your company.</p>
        </div>
        <Link className="ns-btn" to="/admin/hotels/add">
          <Plus size={17} /> Add Hotel
        </Link>
      </div>
      <section className="ns-panel">
        <div className="ns-hotel-toolbar" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: "100%", boxSizing: "border-box", flexWrap: "wrap", marginBottom: 18 }}>
          <input
            className="ns-search"
            aria-label="Search hotels"
            placeholder="Search hotel name, code, city or area..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ flex: "1 1 280px", width: "auto", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}
          />
          <button type="button" className="ns-hotel-refresh" style={{ flex: "0 0 auto", width: "auto", minWidth: "max-content", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", boxSizing: "border-box", whiteSpace: "nowrap" }} onClick={() => loadHotels()} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
        {error && <p role="alert" className="ns-room-error">{error}</p>}
        {loading ? (
          <p>Loading hotels...</p>
        ) : (
          <div className="ns-table-wrap">
            <table className="ns-table">
              <thead>
                <tr>
                  <th>Picture</th>
                  <th>Hotel Code</th>
                  <th>Hotel Name</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Contact</th>
                  <th>Contact Person</th>
                  <th>Google Maps</th>
                  <th>Status</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visibleHotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{(hotel.picture_url || hotel.picture || hotel.image_url) ? <img className="ns-hotel-thumb" src={String(hotel.picture_url || hotel.picture || hotel.image_url).startsWith("http") ? (hotel.picture_url || hotel.picture || hotel.image_url) : new URL(hotel.picture_url || hotel.picture || hotel.image_url, "https://coreops.pk").href} alt={hotel.hotel_name || "Hotel"} /> : <span className="ns-hotel-no-photo"><ImagePlus size={19} /></span>}</td>
                    <td>{hotel.hotel_code || "—"}</td>
                    <td>
                      <strong>{hotel.hotel_name}</strong>
                      <small>{hotel.address || "No address provided"}</small>
                    </td>
                    <td>{hotel.city_name || "—"}</td>
                    <td>{hotel.area_name || "—"}</td>
                    <td>
                      {hotel.contact_number || "—"}
                      <small>{hotel.email || "—"}</small>
                    </td>
                    <td>{hotel.contact_person_name || "—"}</td>
                    <td>
                      {hotelMapsUrl(hotel) ? (
                        <a href={hotelMapsUrl(hotel)} target="_blank" rel="noopener noreferrer"
                          title={`View ${hotel.hotel_name || "hotel"} on Google Maps`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", color: "#17634f", fontWeight: 600, textDecoration: "none" }}>
                          <MapPin size={16} /> View Map <ExternalLink size={13} />
                        </a>
                      ) : <span style={{ color: "#87948d" }}>Not set</span>}
                    </td>
                    <td><span className="ns-status" data-status={String(hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status).trim().toLowerCase()}>{hotel.status === "YES" ? "Active" : hotel.status === "NO" ? "Inactive" : hotel.status}</span></td>
                    {canManage && (
                      <td>
                        <Link className="ns-cancel" to={`/admin/hotels/${hotel.id}/edit`}>
                          <Pencil size={15} /> Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleHotels.length && (
              <p className="ns-empty">
                {hotels.length ? "No hotels match your search." : "No hotels added yet. Use Add Hotel to register your first property."}
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}



export default AdminHotels;
