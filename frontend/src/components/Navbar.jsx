import { useState, useEffect } from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import WishlistSidebar from "./WishlistSidebar";

const Navbar = () => {
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    if (!wishlistOpen) return;
    const handleEsc = (e) => e.key === "Escape" && setWishlistOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [wishlistOpen]);

  return (
    <>
      <nav className="w-full bg-[var(--color-secondary)] shadow-sm z-[80]">

        {/* TOP BAR */}
        <div className="bg-[var(--color-accent)] text-[var(--color-soft)] text-sm overflow-hidden">
          <div className="whitespace-nowrap animate-marquee-smooth py-2 opacity-90">
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="max-w-7xl mx-auto px-[2.5rem] py-[1.2rem] flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-[3rem] ml-[2rem] font-[600] tracking-tight text-[var(--color-text)] no-underline border-none outline-none
                      hover:no-underline focus:no-underline"
          >
            Trackora
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-[600px]">
            <div className="
              flex items-center 
              bg-white/60 backdrop-blur-md
              border border-[var(--color-primary)]
              rounded-full px-[1.2rem] h-[48px] mt-[1rem]
              shadow-sm
              focus-within:ring-2 focus-within:ring-[var(--color-accent)]
              transition
            ">
              <FiSearch className="text-gray-500 text-[18px] mr-3" />

              <input
                type="text"
                placeholder="Search vinyl, artists..."
                className="
                  w-full bg-transparent outline-none border-none
                  text-[14px]
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-4">

            <button className="nav-icon">
              <FiUser />
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              className="nav-icon"
            >
              <FiHeart />
            </button>

            <Link to="/cart" className="nav-icon">
              <FiShoppingCart />
            </Link>

          </div>
        </div>
      </nav>

      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;