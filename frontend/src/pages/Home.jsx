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
    <div className="bg-[var(--color-bg)] pt-[10px]">
      {/* TITLE */}
        <h1 className="text-[2.5rem] font-semibold px-[2.5rem]">
          Featured Records
        </h1>
        <div className="w-[10rem] h-[3px] bg-[var(--color-accent)] mb-6 rounded-full mb-[1rem] mx-[2.5rem]" />

      {/* SCROLL SECTION */}
      <div className="relative group">
        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 bg-[var(--color-primary)] 
                    text-[var(--color-secondary)] w-[55px] h-[55px] flex items-center justify-center
                    rounded-full shadow-lg border-none opacity-0 group-hover:opacity-100 transition
                    z-[10] cursor-pointer"
        >
          <IoIosArrowBack size={26} />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-[var(--color-secondary)]
                    w-[55px] h-[55px] border-none flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100
                    transition z-[10] cursor-pointer"
        >
          <IoIosArrowForward size={26} />
        </button>

        {/* CARDS ROW */}
        <div
          ref={scrollRef}
          className="
            flex gap-6 px-[1.5rem]
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
