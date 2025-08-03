'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    } else if (pathname !== '/login' && pathname !== '/register') {
      window.location.href = '/login';
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
              DevNetwork
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
                  Feed
                </Link>
                <Link href={`/profile/${userId}`} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
