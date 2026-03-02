import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Rizq Market</span>
            </Link>
            <p className="text-emerald-200/70 leading-relaxed">
              Premium Islamic lifestyle products curated for the modern Muslim. Quality, ethics, and tradition in every purchase.
            </p>
            <div className="flex space-x-4">
              {/* Social icons could go here */}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-amber-400">Shop</h4>
            <ul className="space-y-4 text-emerald-200/80">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=attar" className="hover:text-white transition-colors">Premium Attar</Link></li>
              <li><Link to="/shop?category=clothing" className="hover:text-white transition-colors">Modest Wear</Link></li>
              <li><Link to="/shop?category=books" className="hover:text-white transition-colors">Islamic Books</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-amber-400">Support</h4>
            <ul className="space-y-4 text-emerald-200/80">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-amber-400">Newsletter</h4>
            <p className="text-emerald-200/70 mb-4 text-sm">Join our community for exclusive offers and Islamic insights.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-emerald-900 border border-emerald-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button className="bg-emerald-600 px-4 py-2 rounded-r-lg hover:bg-emerald-700 transition-colors">Join</button>
            </form>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-8 flex flex-col md:row justify-between items-center text-sm text-emerald-200/40">
          <p>© 2024 Rizq Market. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
