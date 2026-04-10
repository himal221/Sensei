import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white bg-mesh">
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-outfit">Pathfinder AI</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all shadow-lg shadow-white/5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-10 tracking-widest uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Career Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] text-gradient font-outfit"
        >
          Your Career, <br /> 
          <span className="text-cyan-400">Engineered</span> by AI.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-slate-400 mb-12 max-w-2xl font-light leading-relaxed"
        >
          An agentic AI mentor that analyzes your code, activity, and goals to forge a precision roadmap to your dream company.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <button 
            onClick={() => navigate('/register')}
            className="group flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-5 rounded-2xl font-bold transition-all shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Analyzing My Career
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <button className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all backdrop-blur-md">
            View Roadmap Demo
          </button>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full">
          <FeatureCard 
            icon={<Target className="w-7 h-7 text-cyan-400" />}
            title="Gap Intel"
            desc="Deep audit of your current stack vs industry requirements."
            delay={0.6}
          />
          <FeatureCard 
            icon={<BookOpen className="w-7 h-7 text-blue-400" />}
            title="Skill Mission"
            desc="Interactive tiles with curated learning missions and micro-tasks."
            delay={0.7}
          />
          <FeatureCard 
            icon={<Zap className="w-7 h-7 text-purple-400" />}
            title="Agentic Flux"
            desc="AI that tracks your GitHub commits and updates your path in real-time."
            delay={0.8}
          />
        </div>
      </main>

      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="p-10 glass-panel text-left hover:bg-white/[0.04] transition-all group cursor-default"
  >
    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-cyan-500/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 font-outfit">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
  </motion.div>
);

export default LandingPage;
