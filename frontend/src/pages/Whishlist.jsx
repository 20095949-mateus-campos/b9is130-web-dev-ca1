import { Link } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <Link to="/" className="flex items-center gap-2 mb-8 underline">
        <FaArrowLeft /> Continue shopping
      </Link>

      {wishlist.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-[18px] font-[600] mb-4">
            Your wishlist is empty
          </p>
          <Link to="/" className="underline">
            Browse records
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[var(--color-border)] p-5 hover:shadow-md transition"
            >
              <Link to={`/record/${item.id}`}>
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full aspect-square object-cover mb-4"
                />
              </Link>

              <p className="font-semibold text-[15px]">{item.title}</p>
              <p className="text-[12px] uppercase text-gray-600">
                {item.artist}
              </p>
              <p className="font-bold text-[18px] mt-2 mb-4">
                €{item.price}
              </p>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="flex items-center gap-2 text-red-500 bg-transparent border-none"
              >
                <FaHeart /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;