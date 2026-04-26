import { Link, useParams } from "react-router-dom";

function OrderDetails() {
    const { id } = useParams();

    const order = {
        id: id || "ORD-1001",
        date: "26 April 2026",
        status: "Processing",
        total: "€45.00",
        delivery: "Estimated delivery in 3–5 working days",
        address: "Dublin, Ireland",
        items: [
            {
                title: "Dark Side of the Moon",
                artist: "Pink Floyd",
                quantity: 1,
                price: "€25.00",
            },
            {
                title: "Abbey Road",
                artist: "The Beatles",
                quantity: 1,
                price: "€20.00",
            },
        ],
    };

    return (
        <section className="page-container">
            <div className="page-header">
                <p>Order Details</p>
                <h1>{order.id}</h1>
            </div>

            <div className="order-details-layout">
                <div className="order-details-card">
                    <div className="order-details-top">
                        <div>
                            <h2>Order Summary</h2>
                            <p className="muted-text">Placed on {order.date}</p>
                        </div>

                        <span className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="order-items">
                        {order.items.map((item, index) => (
                            <div className="order-item-row" key={index}>
                                <div>
                                    <strong>{item.title}</strong>
                                    <p className="muted-text">{item.artist}</p>
                                </div>

                                <p>Qty: {item.quantity}</p>
                                <strong>{item.price}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="order-total-row">
                        <span>Total Paid</span>
                        <strong>{order.total}</strong>
                    </div>
                </div>

                <div className="order-details-card">
                    <h2>Delivery Information</h2>

                    <div className="profile-row">
                        <span>Status</span>
                        <strong>{order.delivery}</strong>
                    </div>

                    <div className="profile-row">
                        <span>Address</span>
                        <strong>{order.address}</strong>
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