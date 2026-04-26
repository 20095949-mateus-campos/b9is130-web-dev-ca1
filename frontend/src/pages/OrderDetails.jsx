import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/api";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrderDetails() {
            try {
                const data = await getOrderById(id);
                setOrder(data);
            } catch (err) {
                setError(err.message || "Could not load order details");
            } finally {
                setLoading(false);
            }
        }

        loadOrderDetails();
    }, [id]);

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
                <p className="muted-text">Loading order details...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-container">
                <div className="profile-card">
                    <h2>Order not available</h2>
                    <p className="muted-text">{error}</p>

                    <button className="secondary-btn" onClick={() => navigate("/orders")}>
                        Back to Orders
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="page-container">
            <div className="page-header">
                <p>Order Details</p>
                <h1>ORD-{order.id}</h1>
            </div>

            <div className="order-details-layout">
                <div className="order-details-card">
                    <div className="order-details-top">
                        <div>
                            <h2>Order Summary</h2>
                            <p className="muted-text">Placed on {formatDate(order.created_at)}</p>
                        </div>

                        <span className={`order-status ${(order.status || "processing").toLowerCase()}`}>
                            {order.status || "Processing"}
                        </span>
                    </div>

                    <div className="order-items">
                        {order.items?.map((item, index) => (
                            <div className="order-item-row" key={index}>
                                <div>
                                    <strong>{item.record_title || `Record #${item.record_id}`}</strong>
                                    <p className="muted-text">Record ID: {item.record_id}</p>
                                </div>

                                <p>Qty: {item.quantity}</p>
                                <strong>{formatPrice(item.unit_price)}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="order-total-row">
                        <span>Total Paid</span>
                        <strong>{formatPrice(order.total_price)}</strong>
                    </div>
                </div>

                <div className="order-details-card">
                    <h2>Delivery Information</h2>

                    <div className="profile-row">
                        <span>Status</span>
                        <strong>
                            {order.status === "shipped"
                                ? "Your order has been shipped"
                                : "Your order is being processed"}
                        </strong>
                    </div>

                    <div className="profile-row">
                        <span>Delivery</span>
                        <strong>Estimated 3–5 working days</strong>
                    </div>

                    <Link to="/orders" className="secondary-btn order-back-btn">
                        Back to Orders
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default OrderDetails;