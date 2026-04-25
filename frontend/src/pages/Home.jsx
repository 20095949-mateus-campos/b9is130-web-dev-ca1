import { useEffect, useState, useRef } from "react";
import { getRecords } from "../services/api";
import RecordCard from "../components/RecordCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Home() {
  const [records, setRecords] = useState([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecords();
      setRecords(data);
    };
    fetchData();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.children[0];
    if (!card) return;

    const gap = 24; // gap-6 (UPDATED)
    const scrollAmount = card.offsetWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount * 2 : scrollAmount * 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
  }, [records]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-16">

      {/* TITLE */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Featured Records
        </h1>
      </div>

      {/* CAROUSEL */}
      <div className="max-w-6xl mx-auto relative group">

        {/* LEFT ARROW */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="
              absolute -left-4 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md
              opacity-0 group-hover:opacity-100
              hover:scale-105 active:scale-95
              transition z-10
            "
          >
            <FaChevronLeft />
          </button>
        )}

        {/* RIGHT ARROW */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="
              absolute -right-4 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md
              opacity-0 group-hover:opacity-100
              hover:scale-105 active:scale-95
              transition z-10
            "
          >
            <FaChevronRight />
          </button>
        )}

        {/* SCROLL AREA */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="
            flex gap-6 px-6 pb-12
            overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            no-scrollbar
          "
        >
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;