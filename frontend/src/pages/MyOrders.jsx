import { Link } from "react-router-dom";

function MyOrders() {
    const orders = [
        {
            id: "ORD-1001",
            date: "26 April 2026",
            status: "Processing",
            total: "€45.00",
            items: "2 records",
        },
        {
            id: "ORD-1002",
            date: "20 April 2026",
            status: "Delivered",
            total: "€72.50",
            items: "3 records",
        },
        {
            id: "ORD-1003",
            date: "12 April 2026",
            status: "Cancelled",
            total: "€28.00",
            items: "1 record",
        },
    ];

    return (
        <section className="page-container">
            <div className="page-header">
                <p>Order History</p>
                <h1>My Orders</h1>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <div>
                            <h2>{order.id}</h2>
                            <p>{order.date}</p>
                        </div>

                        <div>
                            <p className="muted-text">Items</p>
                            <strong>{order.items}</strong>
                        </div>

                        <div>
                            <p className="muted-text">Total</p>
                            <strong>{order.total}</strong>
                        </div>

                        <span className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>

                        <Link to={`/orders/${order.id}`} className="secondary-btn order-link-btn">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MyOrders;