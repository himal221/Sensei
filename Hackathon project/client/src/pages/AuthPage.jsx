import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Connection to server failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] bg-mesh relative overflow-hidden">
      <div className="absolute top-10 left-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
          <Zap className="text-black w-5 h-5" fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight font-outfit text-white">Pathfinder AI</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-panel p-10 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 font-outfit">
              {mode === 'register' ? 'Join Pathfinder' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400 font-light">
              Your AI-powered career roadmap starts here.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-cyan-500 transition-all outline-none text-white focus:bg-white/[0.05]"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-cyan-500 transition-all outline-none text-white focus:bg-white/[0.05]"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-cyan-500 transition-all outline-none text-white focus:bg-white/[0.05]"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm font-medium mt-2 p-3 bg-red-400/10 rounded-xl border border-red-400/20">{error}</p>}

            <button 
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-5 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 mt-8 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? 'Authenticating...' : (mode === 'register' ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-400 font-light">
              {mode === 'register' ? 'Been here before?' : 'New to the platform?'} 
              <Link 
                to={mode === 'register' ? '/login' : '/register'}
                className="text-cyan-400 hover:text-cyan-300 ml-2 font-bold transition-colors"
              >
                {mode === 'register' ? 'Log in' : 'Create an account'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
