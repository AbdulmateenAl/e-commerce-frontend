"use client";
import { createContext, useContext, useState } from 'react'

type CartItem = {
    id?: number,
    name: string,
    price: number,
    quantity: number,
    imageUrl: string
}

type CartContextType = {
    cartItems: CartItem[],
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
}

const CartContext =  createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within the layout")
  }
  return context
}

export function OrderProvider({children}: {children: React.ReactNode}) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
        {children}
    </CartContext.Provider>
  )
}

export default CartContext;