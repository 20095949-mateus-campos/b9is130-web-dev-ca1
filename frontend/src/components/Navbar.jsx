import React from "react";
import { FiUser, FiHeart, FiShoppingCart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="site-navbar">
      <div className="top-shipping-bar">
        <div className="shipping-marquee">
          <span>✈ Free Shipping on Orders over €50 in Ireland</span>
          <span>✈ Free Shipping on Orders over €50 in Ireland</span>
          <span>✈ Free Shipping on Orders over €50 in Ireland</span>
        </div>
      </div>

      <div className="main-nav">
        <Link to="/" className="nav-logo">
          Vinyl Store
        </Link>

        <div className="nav-search">
          <input type="text" placeholder="Search products" />
          <FiSearch className="search-icon" />
        </div>

        <div className="nav-icons">
          <Link to="/auth" title="Account" className="nav-icon-link">
            <FiUser />
          </Link>

          <Link to="/orders" title="My Orders" className="nav-icon-link">
            <FiHeart />
          </Link>

          <Link to="/cart" title="Cart" className="nav-icon-link cart-link">
            <FiShoppingCart />

            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/" className="quick-nav-link">
          Home
        </Link>

        <Link to="/auth" className="quick-nav-link">
          Account
        </Link>

        <Link to="/profile" className="quick-nav-link">
          Profile
        </Link>

        <Link to="/orders" className="quick-nav-link">
          My Orders
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;