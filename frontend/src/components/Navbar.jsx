import { useState, useEffect } from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import WishlistSidebar from "./WishlistSidebar";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { cart } = useCart();
  
  // Calculate total items for the badge (from Version B)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ESC key handler for Wishlist (from Version A)
  useEffect(() => {
    if (!wishlistOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setWishlistOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [wishlistOpen]);

  return (
    <>
      <nav className="w-full bg-[var(--color-secondary)] z-[80] shadow-sm custom-navbar">
        {/* Shipping Bar (Unified Styles) */}
        <div className="bg-[var(--color-accent)] text-[var(--color-soft)] text-sm overflow-hidden">
          <div className="whitespace-nowrap animate-marquee-smooth py-2">
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
            <span className="mx-12">✈ Free Shipping on Orders over €50 in Ireland</span>
          </div>
        </div>

        {/* Main Nav Section */}
        <div className="max-w-7xl mx-auto px-12 pt-6 pb-5 flex items-center justify-between">
          <Link to="/" className="w-[220px] text-[2rem] font-semibold text-[var(--color-text)] no-underline">
            Vinyl Store
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[670px] mx-10">
            <div className="flex items-center border border-[var(--color-primary)] rounded-[12px] px-6 h-[50px] focus-within:border-[var(--color-accent)]">
              <input
                type="text"
                placeholder="Search products"
                className="w-full bg-transparent outline-none border-none text-[15px] text-[var(--color-text)]"
              />
              <FiSearch className="text-[var(--color-primary)] text-[24px] cursor-pointer" />
            </div>
          </div>

          {/* Icon Section */}
          <div className="w-[220px] flex justify-end items-center gap-10 text-[26px] text-[var(--color-text)]">
            <Link to="/auth" className="hover:text-[var(--color-accent)] transition">
              <FiUser />
            </Link>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="bg-transparent border-none outline-none cursor-pointer hover:text-[var(--color-accent)] transition"
            >
              <FiHeart />
            </button>

            {/* Cart Link with Count Badge (from Version B) */}
            <Link to="/cart" className="relative hover:text-[var(--color-accent)] transition">
              <FiShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-[var(--color-accent)] text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Quick Nav (The sub-menu from Version B) */}
        <div className="flex justify-center gap-12 pb-4 text-sm border-t border-gray-100 pt-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/auth" className="hover:underline">Account</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/orders" className="hover:underline">My Orders</Link>
        </div>
      </nav>

      {/* Sidebar Drawer Logic */}
      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;