import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlistAPI } from "../services/api";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlistAPI(id);
      fetchWishlist();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
    {wishlist.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between border-b pb-4"
      >
        {/* LEFT SIDE (image + info) */}
        <div className="flex items-center gap-4">
          <img
            src={item.cover_image || "https://via.placeholder.com/100"}
            className="w-[70px] h-[70px] object-cover rounded-md"
          />

          <div className="flex flex-col">
            <p className="font-semibold text-[15px]">
              {item.title}
            </p>
            <p className="text-sm text-gray-500">
              {item.artist}
            </p>
            <p className="font-bold text-[14px] mt-1">
              €{item.price}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (remove button) */}
        <button
          onClick={() => handleRemove(item.id)}
          className="w-[32px] h-[32px] flex items-center justify-center border rounded-md hover:bg-red-50 hover:text-red-500 transition"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
  );
}

export default Wishlist;