import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaArrowLeft } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";

function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const total =
    cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your cart</h1>

      {/* Continue Shopping */}
      <Link to="/" className="flex items-center gap-2 mb-6 underline">
        <FaArrowLeft /> Continue shopping
      </Link>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-3 border-b mx-[10rem] py-[15px] text-[15px]">
        <p>PRODUCT</p>
        <p className="text-center">QUANTITY</p>
        <p className="text-right">TOTAL</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center mt-[4rem]">
          <p className="text-[18px] font-[600] mb-[1rem]">
            Your cart is empty
          </p>
          <Link to="/" className="underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-3 items-center mx-[10rem] py-[2rem] border-b"
          >
            {/* PRODUCT */}
            <div className="flex gap-4">
              <img
                src={item.cover_image}
                className="w-[110px] aspect-square object-cover"
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

            {/* QUANTITY */}
            <div className="flex justify-center items-center gap-3">
              <div className="px-[20px] py-[10px] border-1 border-[var(--color-primary)] rounded-[5px]">
                <button
                  className={`px-[15px] text-[20px] bg-transparent border-none outline-none ${
                    item.quantity === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={item.quantity === 1}
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      Math.max(1, item.quantity - 1)
                    )
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
                className="px-[15px] bg-transparent border-none outline-none cursor-pointer"
                onClick={() => {
                  setSelectedItemId(item.id);
                  setShowConfirm(true);
                }}
              >
                <RiDeleteBin6Line className="text-[#c91414] text-[20px]" />
              </button>
            </div>

            {/* TOTAL */}
            <p className="text-right font-[700]">
              €{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))
      )}

      {/* CHECKOUT */}
      <div className="mx-[10rem] mt-[2rem] flex justify-end">
        <button
          className="bg-[var(--color-primary)] text-[var(--color-text-bright)] text-[15px] border-none outline-none text-white px-[2rem] py-[1rem]"
        >
          CHECKOUT • €{total.toFixed(2)}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-secondary)] p-8 rounded-[8px] w-[400px] h-[100px] text-center">
            <p className="text-[16px] font-[600] m-[10px]">
              Are you sure you want to remove this product?
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-black text-white px-[1.5rem] py-[0.5rem]"
                onClick={() => {
                  removeItem(selectedItemId);
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>

              <button
                className="border px-[1.5rem] py-[0.5rem]"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;