import React from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="w-full">
      {/* TOP BAR */}
      <div className="bg-[var(--color-accent)] text-[var(--color-soft)] text-sm overflow-hidden">
        <div className="whitespace-nowrap animate-marquee-smooth py-2">
          <span className="mx-12">
            ✈ Free Shipping on Orders over €50 in Ireland
          </span>
          <span className="mx-12">
            ✈ Free Shipping on Orders over €50 in Ireland
          </span>
          <span className="mx-12">
            ✈ Free Shipping on Orders over €50 in Ireland
          </span>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="bg-[var(--color-secondary)] max-w-7xl mx-auto px-12 pt-6 pb-5 flex items-center justify-between">
        {/* LOGO */}
        <div className="w-[200px] text-[2rem] ml-[20px] font-semibold text-[var(--color-text)]">
          Vinyl Store
        </div>

        {/* SEARCH */}
        <div className="w-[670px]">
          <div
            className="
            flex items-center
            border border-[var(--color-primary)] m-[10px]
            rounded-[12px]
            px-6 h-[50px]
            transition
            focus-within:border-[var(--color-accent)]
          "
          >
            <input
              type="text"
              placeholder="Search products"
              className="
                w-full ml-[10px]
                bg-transparent
                outline-none
                border-none
                text-[15px]
                text-[var(--color-text)]
                placeholder-[var(--color-text-muted)]
              "
            />

            <FiSearch className="text-[var(--color-primary)] text-lg mr-[10px] cursor-pointer" />
          </div>
        </div>

        {/* ICONS */}
        <div className="w-[200px] mr-[20px] flex justify-end items-center gap-14 text-[22px] text-[var(--color-text)] pr-4">
          <div className="p-[10px] cursor-pointer hover:text-[var(--color-accent)] transition">
            <FiUser />
          </div>

          <div className="p-[10px] cursor-pointer hover:text-[var(--color-accent)] transition">
            <FiHeart />
          </div>

          <Link
            to="/cart"
            className="relative p-[10px] hover:text-[var(--color-accent)] transition"
          >
            <FiShoppingCart />

            {totalItems > 0 && (
              <span
                className="
                absolute -top-[10px] -right-[10px]
                bg-[var(--color-accent)]
                text-[var(--color-secondary)] text-[10px]
                px-[10px] py-[1px]
                rounded-full
                font-medium animate-bounce
              "
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
