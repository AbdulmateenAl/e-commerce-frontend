"use client";
import React, { createContext, useContext, useState } from "react"
import { useCartContext } from "./orderContext";
import { useProductContext } from "./ProductContext";

type NavbarContextType = {
    isCartOpen: boolean,
    setIsCartOpen: (value: boolean) => void,
    onCartClick: () => void,
    cartItemsCount: number,
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    filteredProducts: {
        id: number,
        name: string,
        price: number,
        imageUrl: string,
        category: string
    }[],
    selectedCategory: string,
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>,
    filteredCategory: {
        id: number,
        name: string,
        price: number,
        imageUrl: string,
        category: string
    }[],
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export const useNavbarContext = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbarContext must be used within NavbarProvider")
    }
    return context
}

export const NavbarProvider = ({ children }: {children: React.ReactNode}) => {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ selectedCategory, setSelectedCategory ] = useState("");
    
    const { cartItems } = useCartContext();
    const { products } = useProductContext();

    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredCategory = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const onCartClick = () => {
        setIsCartOpen(true);
    };
    const cartItemsCount = cartItems.length;
    return (
        <NavbarContext.Provider value={{ isCartOpen, setIsCartOpen, onCartClick, cartItemsCount, searchTerm, setSearchTerm, filteredProducts, selectedCategory, setSelectedCategory, filteredCategory }}>
            {children}
        </NavbarContext.Provider>
    )
}