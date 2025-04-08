"use client";

//import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

const navLinks: NavLink[] = [
  { name: "products", icon: <ShoppingCartIcon />, href: "/adminpage/products" },
  { name: "orders", icon: <CategoryRoundedIcon />, href: "/adminpage/orders" },
  { name: "users", icon: <PeopleRoundedIcon />, href: "/adminpage/users" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-3 ml-0 shadow-md p-2 w-fit h-screen">
      <div className='flex items-center justify-center bg-black w-8 h-8 rounded-full'>
        <h3 className='text-white font-bold'>A</h3>
      </div>
      {navLinks.map((nav) => {
        const isActive = pathname === nav.href || (pathname.startsWith(nav.href) && pathname !== "/");
        return (
          <Link
            key={nav.name}
            href={nav.href}
            className={`p-2 rounded-full hover:bg-gray-200 transition ${isActive ? "bg-gray-300" : ""}`}
          >
            {nav.icon}
          </Link>
        );
      })}
    </nav>
  );
}
