import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../lib/utils";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1920" 
            alt="Islamic Pattern" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4 block">Bismillahir Rahmanir Rahim</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Ethical Shopping for the <span className="text-emerald-400">Modern Muslim</span>
            </h1>
            <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed">
              "And provide for them from where they do not expect." — At-Talaq 3. 
              Discover premium attars, modest wear, and Islamic essentials.
            </p>
            <div className="flex flex-col sm:row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/shop" className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center justify-center group">
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-emerald-50/50">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-900">100% Halal & Ethical</h3>
                <p className="text-emerald-700/70">Every product is verified for Shariah compliance.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-emerald-50/50">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-900">Fast Delivery</h3>
                <p className="text-emerald-700/70">Nationwide delivery within 2-4 business days.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-emerald-50/50">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-900">Premium Quality</h3>
                <p className="text-emerald-700/70">Handpicked items from trusted artisans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-emerald-900 mb-2">Featured Collection</h2>
              <p className="text-emerald-700/60">Selected essentials for your spiritual journey</p>
            </div>
            <Link to="/shop" className="text-emerald-600 font-bold hover:underline flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <motion.div 
                key={product._id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="h-72 overflow-hidden relative">
                    <img 
                      src={product.images[0] || "https://picsum.photos/400/500"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm">Out of Stock</span>
                      </div>
                    )}
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
        </div>
      </section>
    </div>
  );
}
