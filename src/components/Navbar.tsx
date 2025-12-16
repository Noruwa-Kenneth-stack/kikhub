"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import AdminLoginModal from "./AdminLoginModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  // Fix hydration mismatch – this is the real fix you needed
  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Don't render anything until mounted (prevents wrong auth state on desktop)
  if (!mounted) return null;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo/Logo.png"
                  alt="KIKHUB Logo"
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center text-xl font-medium text-black hover:text-orange-500"
              >
                <Home className="mr-2 h-6 w-6 text-orange-500" />
                Home
              </Link>
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="text-xl font-medium text-gray-700 hover:text-orange-500"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full cursor-pointer p-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center text-lg font-bold">
                        {user?.username?.[0]?.toUpperCase() || "A"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 border-none shadow-xl rounded-xl bg-white"
                  >
                    <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {user?.role}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 h-px bg-gray-200" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 h-px bg-gray-200" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4 " />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-900 hover:bg-blue-800 text-white"
                >
                  Admin Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <Link
                href="/"
                className="block text-lg"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="block text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-900 text-white flex items-center justify-center text-xl font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout} className="w-full">
                    Log out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-blue-900 hover:bg-blue-800"
                >
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}
