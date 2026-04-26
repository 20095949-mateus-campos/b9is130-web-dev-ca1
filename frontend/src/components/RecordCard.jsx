import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { addToWishlistAPI, removeFromWishlistAPI, getWishlist } from "../services/api";

function RecordCard({ record }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(record.id);

  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 8;
    const rotateX = -((y - midY) / midY) * 8;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
    });
  };

  return (
    <div className="w-[300px] flex-shrink-0 snap-start mx-[20px]">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className="bg-[var(--color-secondary)] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden will-change-transform"
      >
        <div className="relative group p-[20px]">
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              try {
                if (liked) {
                  await removeFromWishlistAPI(record.id);
                } else {
                  await addToWishlistAPI(record.id);
                }

                toggleWishlist(record); // keep local UI in sync
              } catch (err) {
                console.error(err);
                alert("Wishlist action failed");
              }
            }}
            className="absolute top-[1.4rem] right-[1.4rem] z-20 text-[18px] 
                      bg-[var(--color-secondary)] cursor-pointer border-none 
                      opacity-0 group-hover:opacity-100 transition hover:scale-110"
          >
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>

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

        <div className="px-[20px] pb-[20px]">
          <p className="text-[20px] font-[600] text-[var(--color-text)]">
            {record.title}
          </p>

          <p className="text-[15px] mt-[10px] uppercase tracking-widest text-[var(--color-text)]">
            {record.artist}
          </p>

          <p className="text-[20px] font-[800] mt-[10px] text-[var(--color-text)]">
            From €{record.price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecordCard;