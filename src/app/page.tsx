"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "./components/Navbar"
import { useCartContext } from "@/context/orderContext";

import { jwtDecode } from "jwt-decode";
import { useProductContext } from "@/context/ProductContext";
import { useNavbarContext } from "@/context/NavbarContext";

type DecodedToken = {
  user: string,
  exp?: number
}

type Product = {
  id: number,
  name: string,
  price: number,
  imageUrl: string,
  category: string
}

export default function Home() {
  const { cartItems, setCartItems } = useCartContext();
  const { setProducts } = useProductContext();
  const { isCartOpen, setIsCartOpen, filteredProducts } = useNavbarContext()
  
  const router = useRouter();

  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`)
    .then(res => res.json())
    .then((data) => {
      console.log(data.products)
      setProducts(data.products)
    })

  }, [setProducts])

  const addToCart = async (product: Product) => {

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const checkout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const decodedToken = jwtDecode<DecodedToken>(token);
    if (!decodedToken || decodedToken.exp! < Date.now() / 1000) {
      localStorage.removeItem("token");
      return router.push("/login");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${decodedToken.user}/order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cartItems, total_amount: totalAmount }),
    });

    const result = await response.json();
    console.log(result.message);
  } catch (err) {
    console.error("Checkout error:", err);
  }
};


  const updateQuantity = (productId: number | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    console.log(cartItems);
  };

  const removeFromCart = (productId: number | undefined) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const CartModal = () => {
    if (!isCartOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-indigo-600">₦{(item.price * item.quantity).toLocaleString()}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total:</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={checkout}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-6">
      <Navbar>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 sm:h-64">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
                <p className="text-xl font-bold text-indigo-600 mb-3">₦{product.price.toLocaleString()}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </Navbar>
      <CartModal />
    </div>
  );
}
