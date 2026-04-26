function Profile() {
    const savedUser = JSON.parse(localStorage.getItem("demoUser"));

    const user = savedUser || {
        username: "Demo User",
        email: "user@example.com",
        role: "Customer",
    };

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

                    <span className="status-badge">Active Customer</span>
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