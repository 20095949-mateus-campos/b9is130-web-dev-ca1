import { useState, useEffect } from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import WishlistSidebar from "./WishlistSidebar";

const Navbar = () => {
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    if (!wishlistOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setWishlistOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [wishlistOpen]);

  return (
    <>
      <nav className="w-full bg-[var(--color-secondary)] z-[80]">
        <div className="bg-[var(--color-accent)] text-[var(--color-soft)] text-sm overflow-hidden">
          <div className="whitespace-nowrap animate-marquee-smooth py-2">
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-12 pt-6 pb-5 flex items-center justify-between">
          <Link
            to="/"
            className="w-[220px] text-[2rem] font-semibold text-[var(--color-text)] no-underline"
          >
            Vinyl Store
          </Link>

          <div className="flex-1 max-w-[670px] mx-10">
            <div className="flex items-center border border-[var(--color-primary)] rounded-[12px] px-6 h-[50px] focus-within:border-[var(--color-accent)]">
              <input
                type="text"
                placeholder="Search products"
                className="w-full bg-transparent outline-none border-none text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              />

              <FiSearch className="text-[var(--color-primary)] text-[24px] cursor-pointer" />
            </div>
          </div>

          <div className="w-[220px] flex justify-end items-center gap-10 text-[26px] text-[var(--color-text)]">
            <button className="bg-transparent border-none outline-none cursor-pointer hover:text-[var(--color-accent)] transition">
              <FiUser />
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              className="bg-transparent border-none outline-none cursor-pointer hover:text-[var(--color-accent)] transition"
            >
              <FiHeart />
            </button>

            <Link
              to="/cart"
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition"
            >
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