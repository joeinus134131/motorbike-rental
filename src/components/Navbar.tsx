"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bike, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Motorbikes", href: "/motorbikes" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/70 backdrop-blur-xl border-b py-2 shadow-sm" : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Bike size={24} />
              </div>
              <span className={`font-black text-2xl tracking-tighter transition-colors drop-shadow-sm ${
                isScrolled ? "text-gray-900" : "text-white drop-shadow-md"
              }`}>
                SEWA<span className="text-primary font-black">MOTOR</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-primary ${
                  isScrolled ? "text-gray-600" : "text-white/90 drop-shadow-sm"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-white hover:bg-primary transition-all shadow-xl shadow-gray-900/10 font-bold text-sm"
                >
                  <LayoutDashboard size={18} />
                  <span>{session.user.role === "ADMIN" ? "Admin" : "Dashboard"}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`p-3 rounded-2xl transition-all ${
                    isScrolled ? "bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50" : "bg-white/10 text-white hover:bg-red-500/20"
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl transition-all font-black text-sm uppercase tracking-tighter shadow-xl ${
                  isScrolled 
                    ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                    : "bg-white text-gray-900 hover:bg-gray-100 shadow-white/10"
                }`}
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b shadow-2xl transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2"
            >
              {link.name}
            </Link>
          ))}
          {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-center"
            >
              Go to {session.user.role === "ADMIN" ? "Admin" : "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-4 bg-primary text-white rounded-2xl font-black text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
