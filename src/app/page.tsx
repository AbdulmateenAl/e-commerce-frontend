"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import Navbar from "./components/Navbar"

import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  user: string,
  exp?: number
}

type Product = {
  id?: number,
  name: string,
  price: number,
  imageUrl: string
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "All"); // "All" incase we don,t have a category

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
        console.log(decodedToken.user)
        setProducts(data.products)
      })
    } else {
      router.push("/login");
    }
    
  }, [])
  
  return (
    <div className="p-3">
      <Navbar>
        <div className="grid grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="shadow-md p-3 border-2 border-gray-400">
              <Image src={product.imageUrl} alt={product.name} width={300} height={500}/>
              <p className="text-2xl text-wrap">{product.name}</p>
              <p className="text-md">{product.price}</p>
            </div>
          ))}
        </div>
      </Navbar>
    </div>
  );
}
