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
        <div className="max-w-7xl mx-auto px-[2.5rem] py-[1rem] flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-[2rem] ml-[2rem] font-[600] tracking-tight text-[var(--color-text)] no-underline border-none outline-none
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
              rounded-full px-[1.2rem] h-[40px]
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

            <Link to="/auth" className="nav-icon">
              <FiUser />
            </Link>

            <Link to="/wishlist" className="nav-icon">
              <FiHeart />
            </Link>

            <Link to="/cart" className="nav-icon">
              <FiShoppingCart />
            </Link>

          </div>
        </div>

        {/* Quick Nav */}
          <div className="flex justify-center gap-8 pb-4 pt-4 border-t border-gray-200 text-sm font-medium">
            
            <Link to="/" className="text-gray-600 hover:text-black transition">
              Home
            </Link>

            <Link to="/auth" className="text-gray-600 hover:text-black transition">
              Account
            </Link>

            <Link to="/profile" className="text-gray-600 hover:text-black transition">
              Profile
            </Link>

            <Link to="/orders" className="text-gray-600 hover:text-black transition">
              My Orders
            </Link>

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