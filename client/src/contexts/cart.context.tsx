import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./auth.context";
import type { Orchid } from "../types";

interface CartItem {
  id: number;
  name: string;
  url: string;
  price: number;
  quantity: number;
  isNatural: boolean;
}

interface CartContextProps {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (
    orchid: any,
    quantity?: number,
    navigateToLogin?: () => void,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get cart key based on user
  const getCartKey = useCallback((userId?: number | null) => {
    return userId ? `cart_${userId}` : "cart_guest";
  }, []);

  // Load cart from localStorage
  const loadCartFromStorage = useCallback((cartKey: string): CartItem[] => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log(`Loaded cart from ${cartKey}:`, parsedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      }
    } catch (error) {
      console.error(`Error loading cart from ${cartKey}:`, error);
      localStorage.removeItem(cartKey);
    }
    return [];
  }, []);

  // Save cart to localStorage
  const saveCartToStorage = useCallback(
    (cartKey: string, items: CartItem[]) => {
      try {
        localStorage.setItem(cartKey, JSON.stringify(items));
        console.log(`Cart saved to ${cartKey}:`, items);
      } catch (error) {
        console.error(`Error saving cart to ${cartKey}:`, error);
      }
    },
    [],
  );

  // Merge guest cart with user cart
  const mergeGuestCartWithUserCart = useCallback(
    (userId: number) => {
      const guestCartKey = getCartKey(null);
      const userCartKey = getCartKey(userId);

      const guestItems = loadCartFromStorage(guestCartKey);
      const userItems = loadCartFromStorage(userCartKey);

      if (guestItems.length === 0) {
        // No guest items to merge, just load user cart
        return userItems;
      }

      if (userItems.length === 0) {
        // No user cart exists, use guest cart
        saveCartToStorage(userCartKey, guestItems);
        localStorage.removeItem(guestCartKey);
        toast.success(
          `Restored ${guestItems.length} item(s) from your session`,
        );
        return guestItems;
      }

      // Merge both carts
      const mergedItems = [...userItems];
      let mergedCount = 0;

      guestItems.forEach((guestItem: CartItem) => {
        const existingItem = mergedItems.find(
          (item) => item.id === guestItem.id,
        );
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          mergedItems.push(guestItem);
          mergedCount++;
        }
      });

      saveCartToStorage(userCartKey, mergedItems);
      localStorage.removeItem(guestCartKey);

      if (mergedCount > 0) {
        toast.success(`Merged ${mergedCount} new item(s) from your session`);
      }

      return mergedItems;
    },
    [getCartKey, loadCartFromStorage, saveCartToStorage],
  );

  // Initialize cart when auth state changes
  useEffect(() => {
    if (!isInitialized) {
      if (isAuthenticated && user?.id) {
        // User is logged in - merge guest cart with user cart
        const mergedItems = mergeGuestCartWithUserCart(user.id);
        setCartItems(mergedItems);
      } else {
        // Guest user - keep cart empty until they login
        setCartItems([]);
      }
      setIsInitialized(true);
    } else {
      // Cart is already initialized, handle user login/logout
      if (isAuthenticated && user?.id) {
        // User logged in after being a guest
        const mergedItems = mergeGuestCartWithUserCart(user.id);
        setCartItems(mergedItems);
        console.log("Welcome back! Your cart has been restored.");
      } else {
        // User logged out - clear cart completely
        setCartItems([]);
      }
    }
  }, [
    isAuthenticated,
    user?.id,
    isInitialized,
    getCartKey,
    loadCartFromStorage,
    mergeGuestCartWithUserCart,
  ]);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (isInitialized && isAuthenticated && user?.id) {
      const cartKey = getCartKey(user?.id);
      saveCartToStorage(cartKey, cartItems);
    }
  }, [
    cartItems,
    user?.id,
    isInitialized,
    isAuthenticated,
    getCartKey,
    saveCartToStorage,
  ]);

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Generate a price for orchid (since your API doesn't seem to have prices)
  const generatePrice = useCallback((orchid: any) => {
    // Generate price based on some factors
    let basePrice = 25; // Base price

    // Natural orchids are more expensive
    if (orchid.isNatural) {
      basePrice *= 1.5;
    }

    // Add some randomness but keep it consistent per orchid
    const hash: number = String(orchid.id)
      .split("")
      .reduce((a: number, b: string) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);

    const variation = (Math.abs(hash) % 30) + 10; // 10-40 variation
    return parseFloat((basePrice + variation).toFixed(2));
  }, []);

  // Add item to cart
  const addToCart = useCallback(
    (orchid: Orchid, quantity = 1, navigateToLogin?: () => void) => {
      // Check if user is authenticated before allowing add to cart
      if (!isAuthenticated) {
        if (navigateToLogin) {
          navigateToLogin();
        } else {
          toast.error("Please login to add items to cart");
        }
        return;
      }

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === orchid.id);

        if (existingItem) {
          // Update quantity if item already exists
          toast.success(`Updated ${orchid.name} quantity in cart`);
          return prevItems.map((item) =>
            item.id === orchid.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: orchid.id,
            name: orchid.name,
            url: orchid.url,
            price: generatePrice(orchid),
            quantity,
            isNatural: orchid.isNatural,
          };

          toast.success(`Added ${orchid.name} to cart`);
          return [...prevItems, newItem];
        }
      });
    },
    [generatePrice, isAuthenticated],
  );

  // Remove item from cart
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => String(item.id) === id);
      if (item) {
        toast.success(`Removed ${item.name} from cart`);
      }
      return prevItems.filter((item) => String(item.id) !== id);
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(id);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          String(item.id) === id ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    // Also clear from localStorage
    const cartKey = getCartKey(user?.id);
    localStorage.removeItem(cartKey);
    toast.success("Cart cleared");
  }, [getCartKey, user?.id]);

  // Check if item is in cart
  const isInCart = useCallback(
    (id: string) => {
      return cartItems.some((item) => String(item.id) === id);
    },
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
