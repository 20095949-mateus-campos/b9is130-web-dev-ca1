import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("signin");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (mode === "signin") {
            localStorage.setItem("demoUser", JSON.stringify({
                username: "Demo User",
                email: email,
                role: "Customer",
            }));

            navigate("/profile");
        } else {
            setMode("signin");
            setPassword("");
            alert("Account created successfully. Please sign in.");
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
                            onClick={() => setMode("signin")}
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            className={mode === "signup" ? "active" : ""}
                            onClick={() => setMode("signup")}
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

                        <button type="submit">
                            {mode === "signin" ? "Sign In" : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Auth;