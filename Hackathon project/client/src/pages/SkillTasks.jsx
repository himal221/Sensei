import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ChevronLeft, ExternalLink, PlayCircle, 
  CheckCircle2, Circle, GraduationCap, Zap, ArrowRight 
} from 'lucide-react';

const SkillTasks = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkillData();
    }, [skillId]);

    const fetchSkillData = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/roadmap', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSkill(data.roadmap.skills[skillId]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050505]" />;

    return (
        <div className="min-h-screen bg-[#050505] bg-mesh text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Roadmap
                </button>

                <div className="flex items-center gap-6 mb-12">
                    <div className="p-5 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                        <Zap className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold font-outfit tracking-tight">{skill?.title}</h1>
                        <p className="text-slate-400 font-light mt-2">{skill?.description}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {skill?.tasks.map((task, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-panel p-8 group hover:bg-white/[0.03] transition-all relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold font-outfit">{task.title}</h3>
                                    </div>
                                    <p className="text-slate-400 font-light leading-relaxed">
                                        {task.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3 mt-6">
                                        {task.resources.map((res, ridx) => (
                                            <a 
                                              key={ridx} 
                                              href={res} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 text-xs font-bold transition-all text-slate-300 hover:text-cyan-400"
                                            >
                                                <ExternalLink className="w-3 h-3" /> External Resource {ridx + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    {task.completed ? (
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                            <CheckCircle2 className="w-4 h-4" /> Mastery Achieved
                                        </div>
                                    ) : (
                                        <button 
                                          onClick={() => navigate(`/roadmap/skill/${skillId}/task/${idx}/quiz`)}
                                          className="flex items-center gap-3 bg-white text-black font-bold px-6 py-3 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all shadow-xl shadow-white/5"
                                        >
                                            Claim Mastery <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Decorative background number */}
                            <span className="absolute -bottom-10 -right-4 text-[120px] font-bold text-white/[0.02] select-none pointer-events-none italic">
                                0{idx + 1}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillTasks;
