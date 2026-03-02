import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-emerald-900 tracking-tight">Rizq Market</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-emerald-800 hover:text-emerald-600 font-medium">Shop</Link>
            <Link to="/categories" className="text-emerald-800 hover:text-emerald-600 font-medium">Categories</Link>
            <Link to="/about" className="text-emerald-800 hover:text-emerald-600 font-medium">About</Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 border border-emerald-100 rounded-full bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-emerald-400 w-5 h-5" />
            </div>
            
            <Link to="/cart" className="relative p-2 text-emerald-800 hover:bg-emerald-50 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-1 text-emerald-800 hover:text-emerald-600 font-medium">
                  <User className="w-5 h-5" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-emerald-800">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-emerald-800">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-50 py-4 px-4 space-y-4 shadow-xl">
          <Link to="/shop" className="block text-emerald-800 font-medium py-2">Shop</Link>
          <Link to="/categories" className="block text-emerald-800 font-medium py-2">Categories</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-emerald-800 font-medium py-2">My Account</Link>
              <button onClick={logout} className="block text-red-600 font-medium py-2">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block bg-emerald-600 text-white text-center py-3 rounded-xl font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
