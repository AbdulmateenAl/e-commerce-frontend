"use client";

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

type NavLink = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

const navLinks: NavLink[] = [
  { name: "Dashboard", icon: <DashboardIcon />, href: "/adminpage" },
  { name: "Products", icon: <ShoppingCartIcon />, href: "/adminpage/products" },
  { name: "Orders", icon: <LocalShippingIcon />, href: "/adminpage/orders" },
  { name: "Users", icon: <PeopleRoundedIcon />, href: "/adminpage/users" },
];

export default function AdminNav({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/adminpage" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Admin</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 pt-6">
          <ul className="space-y-1">
            {navLinks.map((nav) => {
              const isActive = pathname === nav.href || 
                (nav.href !== "/adminpage" && pathname.startsWith(nav.href));
              
              return (
                <li key={nav.name}>
                  <Link
                    href={nav.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className={isActive ? "text-blue-600" : "text-gray-400"}>
                      {nav.icon}
                    </span>
                    <span className="font-medium">{nav.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogoutIcon className="text-gray-400" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/adminpage" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Admin</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MenuIcon className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
