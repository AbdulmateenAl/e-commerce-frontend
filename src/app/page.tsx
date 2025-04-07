"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar"

import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  user: string,
  exp?: number
}

type Product = {
  id?: number,
  name: string,
  price: number
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const expiry = Math.floor(Date.now() / 1000)
  console.log(expiry)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token)

      if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem("token");
        router.push("/login");
        return
      }
      setUser(decodedToken.user)

      fetch(`http://localhost:5000/${decodedToken.user}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data.products)
        console.log(user)
        setProducts(data.products)
      })
    } else {
      router.push("/login");
    }
    
  }, [])
  
  return (
    <div className="p-3">
      <Navbar>
        <div className="grid grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={index} className="shadow-md p-3 border-2 border-gray-400">
              <p className="text-2xl">{product.name}</p>
              <p className="text-md">{product.price}</p>
            </div>
          ))}
        </div>
      </Navbar>
    </div>
  );
}
