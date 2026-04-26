import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const API_URL = "http://localhost:8000";

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], total: 0 });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setCart({ items: [], total: 0 });
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (record_id, quantity) => {
    if (!token) return;

    try {
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ record_id, quantity }),
      });

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (record_id, quantity) => {
    if (!token) return;

    try {
      await fetch(`${API_URL}/cart/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ record_id, quantity }),
      });

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (record_id) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter(
        (item) => item.id !== record_id
      );

      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    });

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/cart/remove/${record_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchCart();
    } catch (err) {
      console.error(err);
      await fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        token,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}