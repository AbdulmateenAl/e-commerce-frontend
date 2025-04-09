import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar({ children }: { children: React.ReactNode}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  
  const handleCategory = async () => {
    const data = await fetchData();
    console.log(data.category);
    
  }
  
  return (
    <nav className="grid grid-cols-8 gap-4 p-4">
        <header className="flex items-center justify-between col-span-8">
          <div className="bg-black px-4 py-2 rounded-xl">
            <h3 className="text-white font-bold">ALMAZ STORE</h3>
          </div>
          <input
            type="text"
            placeholder="Search for products..."
            className="p-2 border border-gray-400 shadow-md rounded-md text-sm w-1/3"
          />
          <ShoppingCartIcon className="cursor-pointer border-2 p-0.5" fontSize="large" />
        </header>

        <section>
          <h4 className="font-semibold text-sm">Collections</h4>
          <ul className="text-sm space-y-1 cursor-pointer focus:underline">
            <li className="font-medium" onClick={() => handleCategory()}>All</li>
            <li onClick={() => handleCategory()}>Clothings</li>
            <li onClick={() => handleCategory()}>Vehicle</li>
            <li onClick={() => handleCategory()}>Electronics</li>
          </ul>
        </section>

        <div className="col-span-6 grid-flow-row">{children}</div>

        <section className="text-left">
          <h4 className="font-semibold text-sm">Sort by</h4>
          <ul className="text-sm space-y-1 cursor-pointer focus:underline">
            <li>Trending</li>
            <li>Latest arrivals</li>
            <li>Price: Low to High</li>
            <li>Price: High to Low</li>
          </ul>
        </section>
        </nav>
  );
}

async function fetchData() {
  const res = await fetch("http://localhost:5000");
  if (!res.ok) {
    alert("An error occurred while categorizing")
  }
  return res.json()
}
