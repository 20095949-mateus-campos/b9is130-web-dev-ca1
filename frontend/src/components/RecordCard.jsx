import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function RecordCard({ record }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(record.id);

  return (
    <div className="w-[280px] flex-shrink-0 snap-start border-2 border-[var(--color-primary)] mx-[20px]">
      <div className="bg-[var(--color-secondary)] shadow-sm hover:shadow-lg transition duration-300 overflow-hidden">

        {/* IMAGE */}
        <div className="relative group p-[20px]">

          {/* WISHLIST ICON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(record);
            }}
            className="
              absolute top-[1.2rem] right-[1.2rem] z-20
              text-[18px] bg-[var(--color-secondary)] border-none outline-none cursor-pointer
              opacity-0 group-hover:opacity-100
              transition
              hover:scale-110
            "
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/* IMAGE LINK */}
          <Link to={`/record/${record.id}`}>
            <img
              src={record.cover_image}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300";
              }}
              alt={record.title}
              className="w-full aspect-square object-cover"
            />
          </Link>
        </div>

        {/* CONTENT */}
        <div className="px-[20px] pb-[20px]">
          <p className="text-[15px] font-semibold text-gray-900">
            {record.title}
          </p>

          <p className="text-[11px] uppercase tracking-widest text-gray-600">
            {record.artist}
          </p>

          <p className="text-[22px] font-extrabold text-black">
            From €{record.price}
          </p>
        </div>

      </div>
    </div>
  );
}

export default RecordCard;