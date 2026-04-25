import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

function RecordCard({ record }) {
  return (
    <div className="w-[280px] flex-shrink-0 snap-start mr-[20px]">
      <div
        className="
          bg-[var(--color-secondary)]
          shadow-sm
          hover:shadow-lg
          transition duration-300
          overflow-hidden
        "
      >
        {/* IMAGE */}
        <div className="relative group p-[20px]">
          <Link to={`/record/${record.id}`}>
            <button
              className="
              absolute top-8 right-8 z-20
              p-2 
              opacity-0 group-hover:opacity-100
              transition
            "
            >
              <FaHeart className="hover:text-[#AC7C58]" />
            </button>

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
        <div className="pl-[20px]">
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
