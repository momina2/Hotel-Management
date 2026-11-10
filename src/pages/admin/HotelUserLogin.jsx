
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/hotel-admin-login.css";

const API_URL = "https://coreops.pk/Hotel/api/login.php";

export default function HotelUserLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const request = async (payload) => {
        const res = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await request({
                action: "login",
                email: email.trim(),
                password,
            });

            if (data.otp_required) {
                setStep("otp");
            } else {
                navigate("/admin/bookings", { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await request({
                action: "verify_otp",
                otp: otp.trim(),
            });

            const role = (
                data.user?.hotel_role ||
                data.user?.user_type ||
                ""
            ).toLowerCase();

            if (role === "hotel_admin" || role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/admin/bookings", { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        padding: 12,
        margin: "8px 0 20px",
        border: "1px solid #cbd8d3",
        borderRadius: 8,
        fontSize: 15,
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "#f6f8f5",
                padding: 20,
            }}
        >
            <form
                onSubmit={step === "login" ? submitLogin : submitOtp}
                style={{
                    width: "100%",
                    maxWidth: 420,
                    padding: 32,
                    borderRadius: 16,
                    background: "white",
                    boxShadow: "0 10px 35px #123a2b12",
                }}
            >
                <h1 style={{ color: "#143d32", fontSize: 27 }}>
                    NorthernStays
                </h1>

                <h2>
                    {step === "login"
                        ? "Hotel User Login"
                        : "Verify OTP"}
                </h2>

                {step === "login" ? (
                    <>
                        <p>Sign in using your registered email and password.</p>

                        <label htmlFor="staff-email">
                            Email Address
                        </label>
                        <input
                            id="staff-email"
                            type="email"
                            required
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />

                        <label htmlFor="staff-pass">
                            Password
                        </label>
                        <input
                            id="staff-pass"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </>
                ) : (
                    <>
                        <p>
                            A 6-digit verification code has been sent to{" "}
                            <strong>{email}</strong>.
                        </p>

                        <label htmlFor="staff-otp">
                            Verification Code
                        </label>
                        <input
                            id="staff-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            pattern="[0-9]{6}"
                            required
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                            style={inputStyle}
                        />
                    </>
                )}

                {error && (
                    <p role="alert" style={{ color: "#b42b2b" }}>
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    style={{
                        width: "100%",
                        padding: 14,
                        background: "#153d32",
                        color: "white",
                        border: 0,
                        borderRadius: 8,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading
                        ? "Please wait..."
                        : step === "login"
                            ? "Login"
                            : "Verify & Login"}
                </button>

                {step === "otp" && (
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            setStep("login");
                            setOtp("");
                            setError("");
                        }}
                        style={{
                            width: "100%",
                            marginTop: 12,
                            padding: 10,
                            background: "transparent",
                            border: "none",
                            color: "#153d32",
                            cursor: "pointer",
                        }}
                    >
                        Back to Login
                    </button>
                )}
            </form>
        </div>
    );
}
