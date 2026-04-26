import { useState, useEffect, useRef } from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import WishlistSidebar from "./WishlistSidebar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (cart.length === 0) return;
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [cart]);

  useEffect(() => {
    if (!wishlistOpen) return;
    const handleEsc = (e) => e.key === "Escape" && setWishlistOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [wishlistOpen]);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  console.log("items:", cart?.items);
  console.log("first item:", cart?.items?.[0]);

  return (
    <>
      <nav className="w-full bg-[var(--color-secondary)] shadow-sm z-[80]">
        <div className="bg-[var(--color-accent)] text-[var(--color-soft)] text-sm overflow-hidden">
          <div className="whitespace-nowrap animate-marquee-smooth py-2 opacity-90">
            <span className="mx-12">
              ✈ Free Shipping on Orders over €50 in Ireland
            </span>
            <span className="mx-12">
              ✈ Free Shipping on Orders over €50 in Ireland
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-[2.5rem] py-[1rem] flex items-center justify-between">
          <Link
            to="/"
            className="text-[2rem] ml-[2rem] font-[600] tracking-tight text-[var(--color-text)] no-underline border-none outline-none hover:no-underline focus:no-underline"
          >
            Trackora
          </Link>

          <div className="flex-1 max-w-[600px]">
            <div className="flex items-center bg-white/60 backdrop-blur-md border border-[var(--color-primary)] rounded-full px-[1.2rem] h-[40px] shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-accent)] transition">
              <FiSearch className="text-gray-500 text-[18px] mr-3" />
              <input
                type="text"
                placeholder="Search vinyl, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-transparent outline-none border-none text-[14px] placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="nav-icon"
              >
                <FiUser />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-[0.5rem] w-[160px] bg-[var(--color-primary)] border rounded-[6px] shadow-md z-[100]">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/auth"
                        className="block px-[1rem] py-[0.6rem] text-sm hover:underline no-underline text-[var(--color-text-bright)]"
                        onClick={() => setUserOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-[1rem] py-[0.6rem] text-sm hover:underline no-underline text-[var(--color-text-bright)] no-underline"
                        onClick={() => setUserOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="block px-[1rem] py-[0.6rem] text-sm hover:underline no-underline text-[var(--color-text-bright)]"
                        onClick={() => setUserOpen(false)}
                      >
                        Login
                      </Link>

                      <Link
                        to="/auth"
                        className="block px-[1rem] py-[0.6rem] text-sm hover:underline no-underline text-[var(--color-text-bright)]"
                        onClick={() => setUserOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setWishlistOpen(true)} className="nav-icon">
              <FiHeart />
            </button>

            <Link
              to="/cart"
              className={`nav-icon relative ${animate ? "cart-bounce" : ""}`}
            >
              <FiShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-[5px] -right-[5px] bg-[var(--color-primary)] text-[var(--color-secondary)] text-[10px] font-semibold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
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
