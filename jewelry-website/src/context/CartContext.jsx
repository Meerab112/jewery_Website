import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id || null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  // FETCH
  const fetchCart = useCallback(async (userId) => {
    const uid = userId || getUserId();
    if (!uid) return;
    setCartLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${uid}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // ADD — always reads userId from localStorage
  const addToCart = async (productId, quantity = 1) => {
    const userId = getUserId();
    if (!userId) return { success: false, error: "User not logged in" };
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await res.json();
      if (data.success) await fetchCart(userId);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // REMOVE
  const removeFromCart = async (cartId) => {
    const userId = getUserId();
    const previousItems = cartItems;
    const updated = cartItems.filter(
      (item) => (item.cart_id || item.cartId) !== cartId,
    );
    setCartItems(updated);
    setCartCount(updated.reduce((s, i) => s + i.quantity, 0));

    try {
      const res = await fetch(
        `http://localhost:5000/api/cart/remove/${cartId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!data.success) {
        setCartItems(previousItems);
        setCartCount(previousItems.reduce((s, i) => s + i.quantity, 0));
        return { success: false, error: data.error };
      }
      return { success: true };
    } catch (err) {
      setCartItems(previousItems);
      setCartCount(previousItems.reduce((s, i) => s + i.quantity, 0));
      return { success: false, error: err.message };
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return removeFromCart(cartId);
    const previousItems = cartItems;
    const updated = cartItems.map((item) =>
      (item.cart_id || item.cartId) === cartId
        ? { ...item, quantity: newQty }
        : item,
    );
    setCartItems(updated);
    setCartCount(updated.reduce((s, i) => s + i.quantity, 0));

    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, quantity: newQty }),
      });
      const data = await res.json();
      if (!data.success) {
        setCartItems(previousItems);
        setCartCount(previousItems.reduce((s, i) => s + i.quantity, 0));
        return { success: false, error: data.error };
      }
      return { success: true };
    } catch (err) {
      setCartItems(previousItems);
      setCartCount(previousItems.reduce((s, i) => s + i.quantity, 0));
      return { success: false, error: err.message };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
