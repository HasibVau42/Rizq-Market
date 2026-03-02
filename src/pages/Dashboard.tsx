import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Package, User, MapPin, ChevronRight, Clock } from "lucide-react";
import { formatPrice } from "../lib/utils";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`/api/orders/myorders/${user._id}`);
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login</div>;

  return (
    <div className="bg-emerald-50/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 font-bold text-3xl">
                {user.name[0]}
              </div>
              <h2 className="text-xl font-bold text-emerald-900">{user.name}</h2>
              <p className="text-emerald-600/60 text-sm">{user.email}</p>
            </div>

            <nav className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 bg-emerald-600 text-white font-bold">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-emerald-800 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-emerald-800 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>Address Book</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-3xl font-bold text-emerald-900">Order History</h1>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-emerald-50"></div>)}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-emerald-100 text-center">
                <Package className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
                <p className="text-emerald-800/60">You haven't placed any orders yet.</p>
                <Link to="/shop" className="text-emerald-600 font-bold mt-4 inline-block hover:underline">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
                    <div className="flex flex-col md:row justify-between items-start md:items-center mb-6 pb-6 border-b border-emerald-50">
                      <div>
                        <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Order ID: {order._id.slice(-8)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-emerald-800/60">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-4">
                          <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xl font-bold text-emerald-900">{formatPrice(order.totalPrice)}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600/60 font-medium">Payment: {order.paymentMethod}</p>
                          {order.paymentMethod === "Manual" && order.paymentDetails && (
                            <p className="text-[10px] text-emerald-500/50">
                              {order.paymentDetails.method} | {order.paymentDetails.transactionId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                      {order.orderItems.map((item: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
