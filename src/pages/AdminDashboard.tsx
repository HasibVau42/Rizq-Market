import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Plus, Package, Users, ShoppingCart, TrendingUp, Edit, Trash2, Loader2, ChevronRight } from "lucide-react";
import { formatPrice } from "../lib/utils";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
    featured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, orderRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/categories"),
          axios.get("/api/orders/all")
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setOrders(orderRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      setOrders(orders.map((o: any) => o._id === orderId ? { ...o, status } : o));
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (user?.role !== "admin") return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/products", newProduct);
      setProducts([...products, data] as any);
      setShowModal(false);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="bg-emerald-50/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-900">Admin Dashboard</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 w-fit mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-emerald-800/60 text-sm font-medium">Total Sales</p>
            <h3 className="text-2xl font-bold text-emerald-900">{formatPrice(125400)}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 w-fit mb-4">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <p className="text-emerald-800/60 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-emerald-900">48</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 w-fit mb-4">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-emerald-800/60 text-sm font-medium">Products</p>
            <h3 className="text-2xl font-bold text-emerald-900">{products.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-emerald-800/60 text-sm font-medium">Customers</p>
            <h3 className="text-2xl font-bold text-emerald-900">124</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-100'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-100'}`}
          >
            Orders
          </button>
        </div>

        {activeTab === "products" ? (
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <h2 className="text-xl font-bold text-emerald-900">Manage Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-emerald-50/50 text-emerald-900 font-bold text-sm">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-50">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="font-bold text-emerald-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-emerald-700">{product.category?.name}</td>
                      <td className="px-6 py-4 font-bold text-emerald-900">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <h2 className="text-xl font-bold text-emerald-900">Manage Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-emerald-50/50 text-emerald-900 font-bold text-sm">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Payment Info</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-emerald-600">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-emerald-900">{order.shippingAddress.address}</p>
                        <p className="text-xs text-emerald-600/60">{order.shippingAddress.city}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-emerald-900">{order.paymentMethod}</p>
                        {order.paymentMethod === "Manual" && order.paymentDetails && (
                          <div className="text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded-lg mt-1">
                            <p>Method: {order.paymentDetails.method}</p>
                            <p>From: {order.paymentDetails.senderNumber}</p>
                            <p>TrxID: {order.paymentDetails.transactionId}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-900">{formatPrice(order.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold outline-none border-none cursor-pointer ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-8 border-b border-emerald-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="text-emerald-400 hover:text-emerald-600">✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-emerald-900 mb-2">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Price (BDT)</label>
                <input 
                  required
                  type="number" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Stock</label>
                <input 
                  required
                  type="number" 
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-emerald-900 mb-2">Category</label>
                <select 
                  required
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-emerald-900 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 rounded-xl font-bold text-emerald-600 hover:bg-emerald-50 transition-all">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
