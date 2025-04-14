import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

type NavbarProps = {
  children: React.ReactNode;
  onCartClick: () => void;
  cartItemsCount: number;
}

export default function Navbar({ children, onCartClick, cartItemsCount }: NavbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all")
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchParams]);
  
  const handleCategory = async (category: string) => {
    try {
      // const data = await fetchData();
      router.push(`/?category=${category}`);
      console.log(selectedCategory);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 sm:px-4 py-2 rounded-lg">
                <h3 className="text-white font-bold text-sm sm:text-base">ALMAZ STORE</h3>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </form>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={onCartClick}
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCartIcon className="text-gray-600 h-5 w-5 sm:h-6 sm:w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <Link href="/login" className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors">
                <PersonOutlineIcon className="text-gray-600 h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </div>
          </div>

          {/* For mobile */}
          <div className="sm:hidden pb-3">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-16 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 p-4 max-w-7xl mx-auto">
        <aside className="col-span-4 sm:col-span-1">
          <div className="sticky top-20">
            <h4 className="font-semibold text-gray-900 mb-4">Collections</h4>
            <div className="flex sm:block overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-2 sm:mx-0">
              {["All", "Clothing", "Vehicle", "Electronics"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategory(category)}
                  className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg text-sm sm:text-base w-auto sm:w-full mb-0 sm:mb-2 mx-2 sm:mx-0 ${
                    selectedCategory === category.toLowerCase()
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="col-span-4 sm:col-span-5 lg:col-span-7">
          {children}
        </div>
      </div>
    </div>
  );
}

// async function fetchData() {
//   const res = await fetch(`${process.env.BASE_URL}/category`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch categories");
//   }
//   return res.json();
// }
