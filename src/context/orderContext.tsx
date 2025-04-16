"use client";
import { createContext, useState } from 'react'

type CartItem = {
    name: string,
    price: number,
    quantity: number,
    imageUrl: string,
}

type CartContextType = {
    cartItems: CartItem[],
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
}

const CartContext =  createContext<CartContextType | undefined>(undefined);

export function OrderProvider({children}: {children: React.ReactNode}) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
        {children}
    </CartContext.Provider>
  )
}

export default CartContext;