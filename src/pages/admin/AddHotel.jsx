import { API_BASE, apiFetch } from "../../api/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";

const API = `${API_BASE}/hotel_profile.php`;

const initialForm = {
    hotel_name: "",
    city_id: "",
    area_id: "",
    address: "",
    contact_number: "",
    contact_person_name: "",
    latitude: "",
    longitude: "",
    email: "",
    description: "",
    status: "YES",
};

async function hotelRequest(action, fields = {}, signal) {
    const response = await apiFetch(API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...fields }),
        signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

export default function AddHotel() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [existingPicture, setExistingPicture] = useState("");

    const [form, setForm] = useState(initialForm);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pictureFile, setPictureFile] = useState(null);
    const [picturePreview, setPicturePreview] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadLocations() {
            try {
                const result = await hotelRequest(
                    "get",
                    isEditing ? { hotel_id: Number(id) } : {},
                    controller.signal
                );

                if (!controller.signal.aborted) {
                    setCities(result.cities || []);
                    setAreas(result.areas || []);
                    if (isEditing) {
                        const hotel = result.hotel;
                        if (!hotel || String(hotel.id) !== String(id)) {
                            throw new Error("Selected hotel was not returned by the API.");
                        }
                        setForm(Object.fromEntries(Object.keys(initialForm).map(key => [
                            key, hotel[key] == null ? initialForm[key] : String(hotel[key])
                        ])));
                        setExistingPicture(hotel.picture_url || hotel.picture || hotel.image_url || "");
                    }
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unable to load locations.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadLocations();
        return () => controller.abort();
    }, [id, isEditing]);

    const filteredAreas = useMemo(
        () =>
            areas.filter(
                (area) => String(area.city_id) === form.city_id
            ),
        [areas, form.city_id]
    );

    useEffect(() => {
        if (!pictureFile) { setPicturePreview(""); return; }
        const url = URL.createObjectURL(pictureFile);
        setPicturePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [pictureFile]);

    function handlePictureChange(event) {
        const file = event.target.files?.[0];
        if (!file) { setPictureFile(null); return; }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setError('Picture must be JPG, PNG or WebP and no larger than 5 MB.');
            event.target.value = '';
            return;
        }
        setError('');
        setPictureFile(file);
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => {
            if (name === "city_id") {
                return {
                    ...previous,
                    city_id: value,
                    area_id: "",
                };
            }

            return { ...previous, [name]: value };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return;

        setError("");

        if (!form.hotel_name.trim()) {
            setError("Hotel name is required.");
            return;
        }

        if (!form.city_id || !form.area_id) {
            setError("Please select a city and area.");
            return;
        }

        if (form.latitude !== '' && (!Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) {
            setError('Latitude must be between -90 and 90.'); return;
        }
        if (form.longitude !== '' && (!Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) {
            setError('Longitude must be between -180 and 180.'); return;
        }
        setSaving(true);

        try {
            const payload = new FormData();
            payload.append('action', isEditing ? 'update' : 'create');
            if (isEditing) payload.append('hotel_id', String(id));
            Object.entries(form).forEach(([key, value]) => {
                payload.append(key, value == null ? '' : String(value).trim());
            });
            if (pictureFile) {
                payload.append('picture', pictureFile, pictureFile.name);
                payload.append('picture_expected', '1');
            }
            const response = await apiFetch(API, {
                method: 'POST',
                credentials: 'include',
                body: payload, // Browser sets multipart/form-data boundary automatically.
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to save hotel.');
            }
            navigate("/admin/hotels", {
                replace: true,
            });
        } catch (err) {
            setError(err.message || "Unable to save hotel.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <div className="ns-heading">
                <div>
                    <span>PROPERTY MANAGEMENT</span>
                    <h1>{isEditing ? "Edit Hotel" : "Add New Hotel"}</h1>
                    <p>
                        {isEditing ? "Update this hotel’s saved details." : "Register a new hotel under your company."}
                    </p>
                </div>

                <Link className="ns-cancel" to="/admin/hotels">
                    <ArrowLeft size={17} /> Back to Hotels
                </Link>
            </div>

            <section className="ns-panel">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <Building2 size={26} />
                    <div>
                        <h2 style={{ margin: 0 }}>Hotel Information</h2>
                        <p className="ns-note">
                            Enter the property's basic details.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading cities and areas...</p>
                ) : (
                    <form className="ns-form" onSubmit={handleSubmit}>
                        <label className="ns-full">
                            Hotel Name *
                            <input
                                name="hotel_name"
                                value={form.hotel_name}
                                onChange={handleChange}
                                placeholder="Enter hotel name"
                                maxLength={200}
                                required
                            />
                        </label>

                        <label>
                            City *
                            <select
                                name="city_id"
                                value={form.city_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Area *
                            <select
                                name="area_id"
                                value={form.area_id}
                                onChange={handleChange}
                                disabled={!form.city_id}
                                required
                            >
                                <option value="">Select Area</option>
                                {filteredAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.area_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="ns-full">
                            Hotel Address
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Complete hotel address"
                            />
                        </label>

                        <label>
                            Hotel Latitude
                            <input name="latitude" type="number" step="any" min="-90" max="90"
                                value={form.latitude} onChange={handleChange} placeholder="e.g. 35.9208" />
                        </label>
                        <label>
                            Hotel Longitude
                            <input name="longitude" type="number" step="any" min="-180" max="180"
                                value={form.longitude} onChange={handleChange} placeholder="e.g. 74.3086" />
                        </label>
                        <label className="ns-full">
                            Contact Person Name
                            <input name="contact_person_name" value={form.contact_person_name}
                                onChange={handleChange} placeholder="Enter contact person's full name" maxLength={150} />
                        </label>

                        <label>
                            Contact Number
                            <input
                                name="contact_number"
                                type="tel"
                                value={form.contact_number}
                                onChange={handleChange}
                                placeholder="03XX XXXXXXX"
                                maxLength={30}
                            />
                        </label>

                        <label>
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="hotel@example.com"
                                maxLength={150}
                            />
                        </label>

                        <label>
                            Status
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="YES">Active</option>
                                <option value="NO">Inactive</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </label>

                        <label className="ns-full">
                            Description
                            <textarea
                                name="description"
                                rows={5}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your hotel..."
                            />
                        </label>

                        <label className="ns-full">
                            Hotel Picture (JPG, PNG or WebP, max 5 MB)
                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePictureChange} />
                            {(picturePreview || existingPicture) && (
                                <img src={picturePreview || (existingPicture.startsWith("http") ? existingPicture : new URL(existingPicture, "https://coreops.pk").href)} alt="Hotel" style={{ display: "block", width: 180, maxHeight: 140, objectFit: "cover", borderRadius: 10, marginTop: 10 }} />
                            )}
                        </label>
                        {picturePreview && (
                            <div className="ns-full" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <img src={picturePreview} alt="Hotel preview" style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 10 }} />
                                <button type="button" onClick={() => setPictureFile(null)}>Remove picture</button>
                            </div>
                        )}

                        {error && (
                            <p
                                role="alert"
                                className="ns-room-error ns-full"
                            >
                                {error}
                            </p>
                        )}

                        <div className="ns-form-actions ns-full">
                            <Link
                                to="/admin/hotels"
                                className="ns-cancel"
                            >
                                Cancel
                            </Link>

                            <button
                                className="ns-btn"
                                type="submit"
                                disabled={saving}
                            >
                                <Save size={17} />
                                {saving ? "Saving Hotel..." : "Save Hotel"}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </>
    );
}
