import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RecordDetail from "./pages/RecordDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Whishlist";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  const [data, setData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_URL}/records`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("API Error:", err));
  }, [API_URL]);

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home records={data} />} />
          <Route path="/record/:id" element={<RecordDetail />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </main>
    </div>
    </>
  );
}

export default App;