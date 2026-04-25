import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RecordDetail from "./pages/RecordDetail";
import { Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record/:id" element={<RecordDetail />} />
          <Route path="/cart" element={<Cart />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;
