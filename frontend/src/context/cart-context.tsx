"use client";

import { basketApi } from "@/lib/api";
import type { Product, ShoppingCart, ShoppingCartItem } from "@/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface CartContextType {
  cart: ShoppingCart | null;
  isLoading: boolean;
  userName: string;
  setUserName: (name: string) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_USER = "guest";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserNameState] = useState(DEFAULT_USER);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("eshop-username", name);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await basketApi.getBasket(userName);
      setCart(data);
    } catch {
      // If basket doesn't exist, create one
      try {
        const data = await basketApi.createBasket(userName, []);
        setCart(data);
      } catch {
        setCart({ userName, items: [], total: 0 });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    // Load username from localStorage
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("eshop-username");
      if (savedUser) {
        setUserNameState(savedUser);
      }
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (
      product: Product,
      quantity: number = 1,
      color: string = "Default",
    ) => {
      try {
        setIsLoading(true);
        const item: ShoppingCartItem = {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          color,
        };
        await basketApi.addItem(userName, item);
        await refreshCart();
        toast.success(`${product.name} ajouté au panier`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Erreur lors de l'ajout au panier");
      } finally {
        setIsLoading(false);
      }
    },
    [userName, refreshCart],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        setIsLoading(true);
        await basketApi.removeItem(userName, productId);
        await refreshCart();
        toast.success("Article retiré du panier");
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Erreur lors de la suppression");
      } finally {
        setIsLoading(false);
      }
    },
    [userName, refreshCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setIsLoading(true);
        if (quantity <= 0) {
          await basketApi.removeItem(userName, productId);
        } else {
          await basketApi.updateItemQuantity(userName, productId, quantity);
        }
        await refreshCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Erreur lors de la mise à jour");
      } finally {
        setIsLoading(false);
      }
    },
    [userName, refreshCart],
  );

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      await basketApi.deleteBasket(userName);
      setCart({ userName, items: [], total: 0 });
      toast.success("Panier vidé");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Erreur lors de la suppression du panier");
    } finally {
      setIsLoading(false);
    }
  }, [userName]);

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.totalAfterDiscount ?? cart?.total ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        userName,
        setUserName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
