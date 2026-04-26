import { useEffect, useState, useRef } from "react";
import { getRecords } from "../services/api";
import RecordCard from "../components/RecordCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Home() {
  const [records, setRecords] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecords();
      setRecords(data);
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.offsetWidth * 0.8; // smoother & responsive

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* TITLE */}
      <div className="max-w-6xl mx-auto px-[2rem] mb-10">
        <h1 className="text-[3rem] font-semibold text-gray-900">
          Featured Records
        </h1>
      </div>

      {/* SCROLL SECTION */}
      <div className="max-w-6xl mx-auto relative group">
        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="
    absolute left-[1.5rem] top-1/2 -translate-y-1/2
    bg-[var(--color-primary)] text-[var(--color-secondary)]
    w-[55px] h-[55px]
    flex items-center justify-center
    rounded-full
    shadow-lg border-none
    opacity-0 group-hover:opacity-100
    transition
    z-[10] cursor-pointer
  "
        >
          <IoIosArrowBack size={26} />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => scroll("right")}
          className="
    absolute right-[1.5rem] top-1/2 -translate-y-1/2
    bg-[var(--color-primary)] text-[var(--color-secondary)]
    w-[55px] h-[55px] border-none
    flex items-center justify-center
    rounded-full
    shadow-lg
    opacity-0 group-hover:opacity-100
    transition
    z-[10] cursor-pointer
  "
        >
          <IoIosArrowForward size={26} />
        </button>

        {/* CARDS ROW */}
        <div
          ref={scrollRef}
          className="
            flex gap-6 px-[1.5rem] pb-[3rem]
            overflow-x-auto scroll-smooth
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
