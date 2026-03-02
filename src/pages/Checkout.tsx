import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatPrice } from "../lib/utils";
import { ShieldCheck, CreditCard, Truck, Loader2 } from "lucide-react";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    senderNumber: "",
    method: "bKash",
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place an order");
      return navigate("/login");
    }

    if (paymentMethod === "Manual" && (!paymentDetails.transactionId || !paymentDetails.senderNumber)) {
      toast.error("Please provide payment transaction details");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        paymentDetails: paymentMethod === "Manual" ? paymentDetails : null,
        totalPrice,
      };

      await axios.post("/api/orders", orderData);
      
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-50/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-12">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900">Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Street Address</label>
                  <input 
                    required
                    type="text" 
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="House no, Road no, Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">City</label>
                  <input 
                    required
                    type="text" 
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Postal Code</label>
                  <input 
                    required
                    type="text" 
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-50 hover:border-emerald-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-emerald-600' : 'border-emerald-300'}`}>
                      {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">Cash on Delivery</p>
                      <p className="text-xs text-emerald-600/60">Pay when you receive</p>
                    </div>
                  </div>
                </label>

                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'Manual' ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-50 hover:border-emerald-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Manual" 
                    checked={paymentMethod === 'Manual'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Manual' ? 'border-emerald-600' : 'border-emerald-300'}`}>
                      {paymentMethod === 'Manual' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">Manual Payment</p>
                      <p className="text-xs text-emerald-600/60">bKash, Nagad, or Rocket</p>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === "Manual" && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-6">
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-2">Payment Instructions:</h3>
                    <p className="text-sm text-emerald-800/70">Please send the total amount to any of the following numbers using the "Send Money" option:</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><span className="font-bold">bKash:</span> {import.meta.env.VITE_BKASH_NUMBER || "01XXXXXXXXX"}</p>
                      <p><span className="font-bold">Nagad:</span> {import.meta.env.VITE_NAGAD_NUMBER || "01XXXXXXXXX"}</p>
                      <p><span className="font-bold">Rocket:</span> {import.meta.env.VITE_ROCKET_NUMBER || "01XXXXXXXXX"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-emerald-900 mb-2">Payment Method Used</label>
                      <select 
                        value={paymentDetails.method}
                        onChange={(e) => setPaymentDetails({...paymentDetails, method: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-900 mb-2">Sender Number</label>
                      <input 
                        type="text" 
                        required
                        value={paymentDetails.senderNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, senderNumber: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-emerald-900 mb-2">Transaction ID</label>
                      <input 
                        type="text" 
                        required
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="TRX123456789"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 sticky top-24">
              <h3 className="text-xl font-bold text-emerald-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <span className="text-emerald-800/60">{item.name} x {item.qty}</span>
                    <span className="font-bold text-emerald-900">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-emerald-50 pt-4 flex justify-between text-xl font-bold text-emerald-900 mb-8">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Place Order"}
              </button>

              <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-emerald-700/40">
                <ShieldCheck className="w-4 h-4" />
                <span>Your data is protected by Shariah principles</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
