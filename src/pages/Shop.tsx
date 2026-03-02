import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../lib/utils";
import { motion } from "framer-motion";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/categories")
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter((p: any) => p.category?._id === selectedCategory);

  return (
    <div className="bg-emerald-50/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4 md:mb-0">Our Collection</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-emerald-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900">Categories</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-700 hover:bg-emerald-50'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat._id}>
                    <button 
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === cat._id ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-700 hover:bg-emerald-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white h-96 rounded-3xl animate-pulse border border-emerald-50"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product: any) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={product._id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group"
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="h-64 overflow-hidden relative">
                        <img 
                          src={product.images[0] || "https://picsum.photos/400/500"} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-2 block">{product.category?.name}</span>
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-emerald-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-emerald-900">{formatPrice(product.price)}</span>
                        <button className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
