import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Code, Layout, BarChart, Database, Shield, 
  Map as MapIcon, ChevronRight, Lock, CheckCircle, Clock 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/roadmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(data.roadmap);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const IconMap = { Code, Layout, BarChart, Database, Shield };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] bg-mesh text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold font-outfit mb-3">Your AI Roadmap</h1>
            <p className="text-slate-400 font-light flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-cyan-500" /> {roadmap?.title}
            </p>
          </div>
          <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">Overall Progress</span>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[15%]" />
              </div>
          </div>
        </header>

        <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 mb-12 glass-panel">
            <h2 className="text-xl font-bold mb-4 font-outfit flex items-center gap-2">
                AI Assessment Summary
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
                {roadmap?.analysis}
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmap?.skills.map((skill, index) => {
            const IconComponent = IconMap[skill.icon] || Code;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => skill.status !== 'locked' && navigate(`/roadmap/skill/${index}`)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  skill.status === 'locked' 
                    ? 'bg-white/[0.01] border-white/5 opacity-50 grayscale' 
                    : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${skill.status === 'completed' ? 'bg-emerald-500/10' : 'bg-cyan-500/10'}`}>
                    <IconComponent className={`w-6 h-6 ${skill.status === 'completed' ? 'text-emerald-400' : 'text-cyan-400'}`} />
                  </div>
                  {skill.status === 'locked' ? (
                    <Lock className="w-5 h-5 text-slate-600" />
                  ) : skill.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2 font-outfit tracking-tight">{skill.title}</h3>
                <p className="text-slate-500 text-sm font-light mb-6 line-clamp-2">
                  {skill.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        {skill.tasks.length} Missions 
                    </span>
                    <div className="flex items-center gap-1 text-cyan-400 font-bold text-sm">
                        Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Status indicator bar */}
                <div className={`absolute bottom-0 left-0 h-1 transition-all ${
                    skill.status === 'completed' ? 'bg-emerald-500 w-full' : 
                    skill.status === 'in-progress' ? 'bg-cyan-500 w-[30%]' : 'bg-white/5 w-0'
                }`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
