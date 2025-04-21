import React, { createContext, useContext, useState } from 'react'

type Product = {
    id: number,
    name: string,
    price: number,
    imageUrl: string,
    category: string
}

type ProductContextType = {
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within ProductProvider")
    }
    return context
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
        {children}
    </ProductContext.Provider>
  )
}
