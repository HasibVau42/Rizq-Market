import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { formatPrice } from "../lib/utils";
import { motion } from "framer-motion";

export default function Cart() {
  const { cartItems, removeFromCart, addToCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">Your cart is empty</h2>
        <p className="text-emerald-600/60 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div 
                layout
                key={item.product}
                className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col sm:row items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-emerald-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-emerald-900">{item.name}</h3>
                  <p className="text-emerald-600 font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center border border-emerald-100 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => addToCart({ ...item, qty: Math.max(1, item.qty - 1) })}
                    className="p-2 hover:bg-emerald-50 text-emerald-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-emerald-900">{item.qty}</span>
                  <button 
                    onClick={() => addToCart({ ...item, qty: Math.min(item.stock, item.qty + 1) })}
                    className="p-2 hover:bg-emerald-50 text-emerald-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 sticky top-24">
              <h3 className="text-xl font-bold text-emerald-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-emerald-800/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-emerald-800/60">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-emerald-50 pt-4 flex justify-between text-xl font-bold text-emerald-900">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center group"
              >
                Checkout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-emerald-700/40 mt-6">
                By proceeding, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
