import { useState } from "react";
import { checkoutOrder } from "../services/api";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart } = useCart();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    card_number: "",
    expiry_date: "",
    card_holder: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 🔥 Combine address fields (important)
      const fullAddress = `${form.address}, ${form.city}, ${form.state}, ${form.zip}`;

      const payload = {
        address: fullAddress,
        card_number: form.card_number,
        card_holder: form.card_holder,
        expiry_date: form.expiry_date,
      };

      const res = await checkoutOrder(payload, token);

      alert("✅ Order placed! ID: " + res.order_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(cart);

  return (
    <div className="grid grid-cols-2 min-h-screen bg-[var(--color-bg)]">
      {/* LEFT SIDE */}
      <div className="p-[2.5rem] bg-[var(--color-secondary)] border border-[var(--color-primary)]">
        <h2 className="text-2xl font-bold m-[1.5rem]">Checkout</h2>

        {/* CONTACT */}
        <input
          name="email"
          placeholder="Email"
          className="input mx-[1.5rem] w-[310px] h-[30px]"
          onChange={handleChange}
        />

        {/* DELIVERY */}
        <div className="grid grid-cols-2 gap-[2rem] m-[1.5rem]">
          <input
            name="firstName"
            placeholder="First name"
            className="input h-[30px]"
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last name"
            className="input h-[30px]"
            onChange={handleChange}
          />
        </div>

        <input
          name="address"
          placeholder="Address"
          className="input mx-[1.5rem] w-[310px] h-[30px]"
          onChange={handleChange}
        />
        <div className="grid grid-cols-3 gap-[2rem] m-[1.5rem]">
          <input
            name="city"
            placeholder="City"
            className="input h-[30px]"
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            className="input h-[30px]"
            onChange={handleChange}
          />
          <input
            name="zip"
            placeholder="ZIP"
            className="input"
            onChange={handleChange}
          />
        </div>

        {/* PAYMENT */}
        <h2 className="m-[1.5rem] font-semibold">Payment</h2>

        <input
          name="card_number"
          placeholder="Card number"
          className="input mt-[0.5rem]"
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4 mt-[0.5rem]">
          <input
            name="expiry_date"
            placeholder="MM/YY"
            className="input"
            onChange={handleChange}
          />
          <input
            name="card_holder"
            placeholder="Name on card"
            className="input"
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleCheckout}
          className="bg-black text-white w-full py-[0.75rem] mt-[1.5rem]"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {/* RIGHT SIDE (ORDER SUMMARY) */}
      <div className="bg-gray-100 p-[2.5rem]">
        <h3 className="font-bold mb-[1rem]">Order Summary</h3>

        {cart?.items?.map((item) => (
          <div key={item.id} className="flex justify-between mb-[0.5rem]">
            <span>
              {item.record?.title || item.title || "Unknown Item"} x{" "}
              {item.quantity}
            </span>
            <span>
              $
              {item.record?.price
                ? item.record.price * item.quantity
                : item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="border-t mt-[1rem] pt-[1rem] font-bold">
          Total: ${cart?.total}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
