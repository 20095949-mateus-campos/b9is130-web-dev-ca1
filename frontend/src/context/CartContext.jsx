import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (item, quantity) => {
        setCart((prev) => {
            const existing = prev.find((p) => p.id === item.id);

            if (existing) {
                return prev.map((p) =>
                    p.id === item.id
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                );
            }

            return [...prev, { ...item, quantity }];
        });
    };

    const updateQuantity = (id, quantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateQuantity, removeItem }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
};
const [cart, setCart] = useState([]);

const addToCart = (record) => {
    setCart((prev) => {
        const existing = prev.find((item) => item.id === record.id);

        if (existing) {
            return prev.map((item) =>
                item.id === record.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }

        return [...prev, { ...record, quantity: 1 }];
    });
};

const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
};

const clearCart = () => {
    setCart([]);
};

return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
        {children}
    </CartContext.Provider>
);

export function useCart() {
    return useContext(CartContext);
}