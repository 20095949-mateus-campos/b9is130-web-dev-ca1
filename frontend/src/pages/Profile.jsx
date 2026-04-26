import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/api";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getCurrentUser();

                setUser({
                    username: data.username,
                    email: data.email,
                    role: data.is_admin ? "Admin" : "Customer",
                });
            } catch (err) {
                setError(err.message || "Please sign in first");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    const handleLogout = () => {
        logoutUser();
        
        window.location.href = "/auth"; 
    };

    if (loading) {
        return (
            <section className="page-container">
                <p className="muted-text">Loading profile...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-container">
                <div className="profile-card">
                    <h2>Please sign in</h2>
                    <p className="muted-text">{error}</p>
                    <button className="secondary-btn" onClick={() => navigate("/auth")}>
                        Go to Sign In
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="page-container">
            <div className="page-header">
                <p>My Account</p>
                <h1>User Profile</h1>
            </div>

            <div className="profile-layout">
                <div className="profile-card large">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <h2>{user.username}</h2>
                    <p>{user.email}</p>

                    <span className="status-badge">Active {user.role}</span>

                    <br></br>
                    <button 
                        onClick={handleLogout}
                        className="secondary-btn"
                    >
                        Log Out
                    </button>
                </div>

                <div className="profile-card">
                    <h2>Account Details</h2>

                    <div className="profile-row">
                        <span>Name</span>
                        <strong>{user.username}</strong>
                    </div>

                    <div className="profile-row">
                        <span>Email</span>
                        <strong>{user.email}</strong>
                    </div>

                    <div className="profile-row">
                        <span>Role</span>
                        <strong>{user.role}</strong>
                    </div>

                    <button className="secondary-btn">Edit Profile</button>
                </div>

                <div className="profile-card">
                    <h2>Delivery Address</h2>
                    <p className="muted-text">
                        No saved address yet. Add your address during checkout.
                    </p>

                    <button className="secondary-btn">Add Address</button>
                </div>
            </div>
        </section>
    );
}

export default Profile;