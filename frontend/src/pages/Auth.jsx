import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

function Auth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("signin");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (mode === "signin") {
                await loginUser(email, password);
                navigate("/profile");
            } else {
                await registerUser(username, email, password);
                setMessage("Account created successfully. Please sign in.");
                setMode("signin");
                setUsername("");
                setPassword("");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-wrapper">
                <div className="auth-info">
                    <span className="auth-badge">Vinyl Store</span>
                    <h1>Build your record collection.</h1>
                    <p>
                        Sign in or create an account to manage your orders, profile, and favourite records.
                    </p>
                </div>

                <div className="auth-card">
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={mode === "signin" ? "active" : ""}
                            onClick={() => {
                                setMode("signin");
                                setError("");
                                setMessage("");
                            }}
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            className={mode === "signup" ? "active" : ""}
                            onClick={() => {
                                setMode("signup");
                                setError("");
                                setMessage("");
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2>{mode === "signin" ? "Welcome Back" : "Create Account"}</h2>
                    <p className="auth-subtitle">
                        {mode === "signin"
                            ? "Access your profile and order history."
                            : "Join Vinyl Store and start collecting."}
                    </p>

                    {error && <p className="auth-error">{error}</p>}
                    {message && <p className="auth-success">{message}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {mode === "signup" && (
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : mode === "signin"
                                    ? "Sign In"
                                    : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Auth;