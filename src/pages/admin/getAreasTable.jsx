import { useEffect, useState } from "react";

const API = "https://coreops.pk/Hotel/api/getAreas.php";

export default function AdminAreasTable() {
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityId, setCityId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        async function loadAreas() {
            setLoading(true);
            setError("");
            try {
                const url = new URL(API);
                if (cityId) url.searchParams.set("city_id", cityId);
                const response = await fetch(url.toString(), {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                    signal: controller.signal,
                });
                const data = await response.json();
                if (!response.ok || !data.success) throw new Error(data.message || "Failed to load areas");
                setCities(Array.isArray(data.cities) ? data.cities : []);
                setAreas(Array.isArray(data.areas) ? data.areas : []);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadAreas();
        return () => controller.abort();
    }, [cityId]);

    return (
        <section style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
            <h2>Area Management</h2>
            <label htmlFor="city-filter">Filter by City</label>
            <select id="city-filter" value={cityId} onChange={(e) => setCityId(e.target.value)}
                style={{ display: "block", width: "100%", maxWidth: 340, padding: 12, margin: "10px 0 20px" }}>
                <option value="">All Cities</option>
                {cities.map((city) => (
                    <option key={city.id} value={String(city.id)}>{city.city_name}</option>
                ))}
            </select>
            {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead><tr><th>Area Name</th><th>City Name</th><th>Status</th></tr></thead>
                    <tbody>
                        {areas.map((area) => (
                            <tr key={area.id}>
                                <td style={{ padding: 12 }}>{area.area_name}</td>
                                <td style={{ padding: 12 }}>{area.city_name}</td>
                                <td style={{ padding: 12 }}>{area.status}</td>
                            </tr>
                        ))}
                        {!loading && !error && areas.length === 0 && (
                            <tr><td colSpan={3} style={{ padding: 24, textAlign: "center" }}>No areas found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p>{loading ? "Loading areas..." : `${areas.length} area(s) found`}</p>
        </section>
    );
}
