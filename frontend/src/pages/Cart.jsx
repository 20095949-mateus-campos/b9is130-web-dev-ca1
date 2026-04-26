import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaArrowLeft } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cart?.total || 0;

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 bg-[var(--color-bg)]">
        <Link
          to="/"
          className="flex items-center gap-[10px] mx-[10rem] mt-[10px]
                                no-underline hover:opacity-70 transition duration-200 cursor-pointer"
        >
          <FaArrowLeft /> Home
        </Link>

        <h1 className="text-[2rem] font-semibold mx-[10rem]">Your cart</h1>

        <div className="grid grid-cols-[2fr_1fr_0.7fr] border-b mx-[10rem] py-[15px] text-[15px]">
          <p>PRODUCT</p>
          <p className="text-left">QUANTITY</p>
          <p className="text-right">TOTAL</p>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center mt-[4rem]">
            <p className="text-[18px] font-[600] mb-[1rem]">
              Your cart is empty
            </p>
            <Link
              to="/"
              className="text-[20px] underline hover:opacity-70 transition duration-200 cursor-pointer"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_0.7fr] items-center mx-[10rem] py-[2rem] border-b"
            >
              <div className="flex gap-4">
                <img
                  src={item.cover_image}
                  className="w-[140px] aspect-square object-cover"
                />
                <div>
                  <p className="font-[700] mx-[25px] mt-[20px]">
                    {item.title}
                  </p>
                  <p className="text-[15px] mx-[25px]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-left gap-3">
                <div className="px-[15px] py-[10px] border border-[var(--color-primary)] rounded-[5px]">
                  <button
                    className={`px-[15px] text-[20px] bg-transparent border-none outline-none ${
                      item.quantity === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={item.quantity === 1}
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className="px-[15px] text-[20px] bg-transparent border-none outline-none cursor-pointer"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className=" mx-[15px] bg-transparent border-none outline-none cursor-pointer"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to remove this product?"
                    );

                    if (!confirmDelete) return;

                    try {
                      await removeFromCart(item.id);
                      alert("Item removed from cart");
                    } catch (err) {
                      alert("Failed to remove item");
                    }
                  }}
                >
                  <RiDeleteBin6Line className="text-[#c91414] text-[20px]" />
                </button>
              </div>

              <p className="text-right font-[700]">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))
        )}

        <div className="mx-[10rem] mt-[10px] flex justify-end">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-[var(--color-primary)] text-[var(--color-text-bright)] px-[2rem] py-[1rem] cursor-pointer"
          >
            CHECKOUT • €{total.toFixed(2)}
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;