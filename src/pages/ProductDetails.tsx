import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";
import { toast } from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setActiveImage(data.images[0]);
      } catch (error) {
        console.error(error);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-emerald-900 font-bold">Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty,
      stock: product.stock
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-emerald-50 border border-emerald-100">
              <img 
                src={activeImage || "https://picsum.photos/800/800"} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">{product.category?.name}</span>
              <h1 className="text-4xl font-bold text-emerald-900 mt-2 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-emerald-700/60 text-sm">({product.numReviews} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-emerald-900">{formatPrice(product.price)}</p>
            </div>

            <p className="text-emerald-800/70 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="space-y-4 pt-6 border-t border-emerald-50">
              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-emerald-100 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-2 hover:bg-emerald-50 text-emerald-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-bold text-emerald-900">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-4 py-2 hover:bg-emerald-50 text-emerald-900 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-emerald-600 font-medium">
                  {product.stock > 0 ? `${product.stock} items in stock` : "Out of stock"}
                </span>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
                <button className="p-4 rounded-2xl border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center space-x-2 text-sm text-emerald-800/60">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-emerald-800/60">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-emerald-800/60">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
