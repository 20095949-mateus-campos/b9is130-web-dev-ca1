import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";

function MyOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message || "Could not load orders");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    function formatDate(dateValue) {
        if (!dateValue) return "No date";

        return new Date(dateValue).toLocaleDateString("en-IE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function formatPrice(value) {
        return `€${Number(value || 0).toFixed(2)}`;
    }

    if (loading) {
        return (
            <section className="page-container">
                <p className="muted-text">Loading orders...</p>
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
                <p>Order History</p>
                <h1>My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div className="profile-card">
                    <h2>No orders yet</h2>
                    <p className="muted-text">
                        Your orders will appear here after checkout.
                    </p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div>
                                <h2>ORD-{order.id}</h2>
                                <p>{formatDate(order.created_at)}</p>
                            </div>

                            <div>
                                <p className="muted-text">Items</p>
                                <strong>{order.items?.length || 0} records</strong>
                            </div>

                            <div>
                                <p className="muted-text">Total</p>
                                <strong>{formatPrice(order.total_price)}</strong>
                            </div>

                            <span
                                className={`order-status ${(
                                    order.status || "processing"
                                ).toLowerCase()}`}
                            >
                                {order.status || "Processing"}
                            </span>

                            <Link
                                to={`/orders/${order.id}`}
                                className="secondary-btn order-link-btn"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MyOrders;