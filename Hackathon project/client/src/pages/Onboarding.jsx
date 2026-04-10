import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Briefcase, GitBranch, GraduationCap, Building2, Search, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        studentType: '',
        githubProfile: '',
        academicYear: '',
        currentKnowledge: '',
        dreamCompany: '',
        dreamRole: ''
    });
    const [ghStats, setGhStats] = useState(null);
    const [ghLoading, setGhLoading] = useState(false);

    const fetchGithubStats = async (username) => {
        if (!username || username.length < 3) return;
        setGhLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data: res } = await axios.get(`http://localhost:5000/api/roadmap/github/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGhStats(res.stats);
        } catch (error) {
            setGhStats(null);
        } finally {
            setGhLoading(false);
        }
    };

    // Debounce GitHub fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.githubProfile && data.studentType === 'CSE') {
                fetchGithubStats(data.githubProfile);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [data.githubProfile]);

    const handleComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/roadmap/generate', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Generation Error:', error);
            alert('Failed to generate roadmap. Please check if server is running.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] bg-mesh text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Step Indicator */}
            <div className="absolute top-0 w-full h-1.5 bg-white/5">
                <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />
            </div>

            <main className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-10"
                        >
                            <div className="text-center">
                                <h2 className="text-5xl font-bold mb-4 font-outfit text-white tracking-tight">Your Specialty.</h2>
                                <p className="text-slate-400 font-light text-lg">Define your focus area for custom AI mentoring.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <SelectionCard 
                                    icon={<Code className="w-8 h-8 text-cyan-400" />}
                                    title="Computer Science & Engineering"
                                    desc="Software pipelines, deep algorithms, and system design."
                                    active={data.studentType === 'CSE'}
                                    onClick={() => setData({...data, studentType: 'CSE'})}
                                />
                                <SelectionCard 
                                    icon={<Briefcase className="w-8 h-8 text-purple-400" />}
                                    title="Core & Management"
                                    desc="Marketing, Design, Finance, or Core Engineering fields."
                                    active={data.studentType === 'NON-CSE'}
                                    onClick={() => setData({...data, studentType: 'NON-CSE'})}
                                />
                            </div>

                            <button 
                                disabled={!data.studentType}
                                onClick={() => setStep(2)}
                                className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-[0.98]"
                            >
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            <div>
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white flex items-center gap-1 text-sm font-bold mb-4 transition-colors uppercase tracking-widest">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <h2 className="text-4xl font-bold mb-2 font-outfit">Current Standing.</h2>
                                <p className="text-slate-400 font-light">Let the agent audit your present expertise level.</p>
                            </div>

                            <div className="space-y-6">
                                {data.studentType === 'CSE' && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-cyan-400" /> GitHub Handle
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. linustorvalds"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 focus:border-cyan-500 transition-all outline-none text-white focus:bg-white/[0.05]"
                                            value={data.githubProfile}
                                            onChange={(e) => setData({...data, githubProfile: e.target.value})}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-blue-400" /> Academic Phase
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                                            <button 
                                                key={year}
                                                className={`py-3 rounded-xl border transition-all text-sm font-bold ${data.academicYear === year ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                                onClick={() => setData({...data, academicYear: year})}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Search className="w-4 h-4 text-purple-400" /> Skill Stack
                                    </label>
                                    <textarea 
                                        placeholder="e.g. React, Python, AWS, Docker..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 focus:border-cyan-500 transition-all outline-none h-32 resize-none text-white focus:bg-white/[0.05]"
                                        value={data.currentKnowledge}
                                        onChange={(e) => setData({...data, currentKnowledge: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={!data.academicYear}
                                onClick={() => setStep(3)}
                                className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-30 active:scale-[0.98]"
                            >
                                Continue Path
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="text-center">
                                <h2 className="text-5xl font-bold mb-4 font-outfit">The Endgame.</h2>
                                <p className="text-slate-400 font-light">Where is Pathfinder AI taking you?</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-cyan-400" /> Target Corporation
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. NVIDIA, OpenAI, Google"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 focus:border-cyan-500 transition-all outline-none text-white text-lg font-medium"
                                        value={data.dreamCompany}
                                        onChange={(e) => setData({...data, dreamCompany: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-400" /> Desired Meta-Role
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. AI Researcher, Lead SDE"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 focus:border-cyan-500 transition-all outline-none text-white text-lg font-medium"
                                        value={data.dreamRole}
                                        onChange={(e) => setData({...data, dreamRole: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleComplete}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-6 rounded-2xl hover:brightness-110 transition-all shadow-2xl shadow-cyan-500/20 text-lg flex items-center justify-center gap-3 animate-pulse"
                            >
                                Generate AI Roadmap <Zap className="w-6 h-6 fill-white" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const SelectionCard = ({ icon, title, desc, active, onClick }) => (
    <div 
        onClick={onClick}
        className={`p-8 rounded-3xl border transition-all cursor-pointer flex items-center gap-6 ${
            active ? 'bg-white/[0.05] border-cyan-500 shadow-2xl shadow-cyan-500/10 scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
        }`}
    >
        <div className={`p-4 rounded-2xl transition-colors ${active ? 'bg-cyan-500/20' : 'bg-white/5'}`}>{icon}</div>
        <div>
            <h4 className="font-bold text-xl font-outfit">{title}</h4>
            <p className="text-slate-500 text-sm font-light mt-1">{desc}</p>
        </div>
    </div>
);

export default Onboarding;
