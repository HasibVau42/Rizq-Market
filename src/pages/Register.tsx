import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-emerald-50/30">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-emerald-100/50 p-8 border border-emerald-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <span className="text-white font-bold text-3xl">R</span>
          </div>
          <h2 className="text-3xl font-bold text-emerald-900">Create Account</h2>
          <p className="text-emerald-600/60 mt-2">Join Rizq Market today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="John Doe"
              />
              <User className="absolute left-3 top-3.5 text-emerald-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-3 top-3.5 text-emerald-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3.5 text-emerald-400 w-5 h-5" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-emerald-700/60">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
