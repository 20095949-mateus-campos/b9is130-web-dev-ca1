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
      const fullAddress = `${form.address}, ${form.city}, ${form.state}, ${form.zip}`;

      const payload = {
        address: fullAddress,
        card_number: form.card_number.replace(/\s/g, ""),
        card_holder: form.card_holder,
        expiry_date: form.expiry_date,
      };
      console.log(payload)

      const res = await checkoutOrder(payload, token);
      alert("Your order has been placed successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const itemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="grid grid-cols-2 min-h-screen bg-[var(--color-bg)]">
      {/* LEFT SIDE */}
      <div className="p-[2.5rem] bg-[var(--color-secondary)] border border-[var(--color-primary)]">
        <h2 className="text-2xl font-bold m-[1.5rem]">Checkout</h2>

        <input
          name="email"
          placeholder="Email"
          className="input mx-[1.5rem] w-[310px] h-[30px]"
          onChange={handleChange}
        />

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

        <div className="mx-[1.5rem] border rounded-md overflow-hidden bg-white">
          <div className="flex items-center justify-between px-[1rem] py-[0.75rem] bg-gray-100 border-b">
            <div className="flex items-center gap-[0.5rem]">
              <input type="radio" checked readOnly />
              <span className="font-medium">Credit card</span>
            </div>
          </div>

          <div className="p-[1rem] space-y-[0.75rem]">
            <input
              name="card_number"
              placeholder="1234 5678 9012 3456"
              value={form.card_number}
              maxLength={19}
              inputMode="numeric"
              className="w-full border rounded px-[0.75rem] py-[0.5rem]"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                value = value.substring(0, 16);

                value = value.replace(/(.{4})/g, "$1 ").trim();

                setForm({ ...form, card_number: value });
              }}
            />

            <div className="grid grid-cols-2 gap-[0.75rem]">
              <input
                name="expiry_date"
                placeholder="MM / YY"
                className="border rounded px-[0.75rem] py-[0.5rem]"
                onChange={handleChange}
              />
              <input
                name="card_holder"
                placeholder="Name on card"
                className="border rounded px-[0.75rem] py-[0.5rem]"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-[0.5rem] text-sm">
              <input type="checkbox" defaultChecked />
              <span>Use shipping address as billing address</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full max-w-[650px] mx-auto mt-[1.5rem] block bg-[var(--color-primary)] text-[var(--color-secondary)] py-[0.9rem] rounded-[6px] text-[0.95rem] 
                     font-medium transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gray-100 p-[2.5rem]">
        <h3 className="font-semibold mb-[1.5rem]">Order Summary</h3>

        <div className="space-y-[1rem]">
          {cart?.items?.map((item, index) => {
            const title = item.record?.title || item.title || "Item";
            const price = item.record?.price || item.price || 0;

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-[0.75rem]">
                  <div className="relative w-[90px] h-[90px] bg-[var(--color-secondary)] rounded-[10px] border-[var(--color-secondary)] flex items-center justify-center">
                    <img
                      src={item.cover_image || "/placeholder.png"}
                      className="w-full h-full p-[5px] object-cover rounded"
                    />

                    <span className="absolute -top-[10px] -right-[10px] bg-[var(--color-primary)] text-[var(--color-secondary)] text-[10px] w-[20px] h-[20px] flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>

                  <span className="text-sm max-w-[180px]">{title}</span>
                </div>

                <span className="text-sm">
                  ${(price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="mt-[2rem] border-t pt-[1rem] space-y-[0.5rem] text-sm">
          <div className="flex justify-between">
            <span>Subtotal · {itemCount} items</span>
            <span>${cart?.total?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>
              {form.address ? "Calculated at next step" : "Enter address"}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-[0.5rem]">
            <span>Total</span>
            <span>${cart?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
