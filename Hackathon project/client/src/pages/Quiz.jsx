import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ChevronLeft, Award, XCircle, CheckCircle, 
  ArrowRight, RefreshCcw, BarChart3, HelpCircle, 
  Check, X, AlertCircle
} from 'lucide-react';

const Quiz = () => {
    const { skillId, taskId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]); // Store all answers
    const [loading, setLoading] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        startQuiz();
    }, [skillId, taskId]);

    const startQuiz = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Refresh questions every time to ensure they are unique
            const { data } = await axios.get(`http://localhost:5000/api/roadmap/quiz/refresh/${skillId}/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuiz(data.quiz);
            
            // Get task title from local storage or fetch roadmap for title
            const { data: roadmapData } = await axios.get('http://localhost:5000/api/roadmap', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTaskTitle(roadmapData.roadmap.skills[skillId].tasks[taskId].title);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const handleNext = () => {
        const updatedAnswers = [...userAnswers, selectedOption];
        setUserAnswers(updatedAnswers);
        
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            calculateAndFinish(updatedAnswers);
        }
    };

    const calculateAndFinish = async (answers) => {
        const score = answers.reduce((acc, ans, idx) => {
            return ans === quiz[idx].correctAnswer ? acc + 1 : acc;
        }, 0);

        setShowResults(true);

        if (score > 3) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/roadmap/complete/${skillId}/${taskId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
            <p className="text-slate-400 font-bold animate-pulse">Generating dynamic challenges...</p>
        </div>
    );

    if (!quiz || quiz.length === 0) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-slate-400 font-bold">Failed to load quiz. AI was unable to generate content.</p>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-white text-black font-bold rounded-xl">Back to Dashboard</button>
        </div>
    );

    const score = userAnswers.reduce((acc, ans, idx) => {
        return ans === quiz[idx]?.correctAnswer ? acc + 1 : acc;
    }, 0);
    const passed = score > 3;

    if (showResults) {
        return (
            <div className="min-h-screen bg-[#050505] bg-mesh text-white p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-12 pb-20">
                    {/* Header Score Card */}
                    <div className="glass-panel p-10 text-center relative overflow-hidden">
                        <div className={`absolute top-0 inset-x-0 h-2 ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className="flex flex-col items-center gap-4">
                            {passed ? (
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <Award className="w-8 h-8 text-emerald-400" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <XCircle className="w-8 h-8 text-red-400" />
                                </div>
                            )}
                            <h2 className="text-4xl font-bold font-outfit">
                                {passed ? 'Mastery Verified!' : 'Revision Needed'}
                            </h2>
                            <p className="text-slate-400 mb-4 max-w-md mx-auto">
                                {passed 
                                    ? `Incredible! You scored ${score}/5. You've officially mastered ${taskTitle}.` 
                                    : `You scored ${score}/5. You need at least 4/5 correct to claim mastery.`}
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => navigate(`/roadmap/skill/${skillId}`)}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all ${passed ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-300 border border-white/10'}`}
                                >
                                    {passed ? 'Continue Path' : 'Back to Missions'}
                                </button>
                                {!passed && (
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                                    >
                                        Try Again <RefreshCcw className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-outfit flex items-center gap-2 mb-8">
                            Detailed Performance Analysis
                        </h3>
                        {quiz.map((q, idx) => {
                            const isCorrect = userAnswers[idx] === q.correctAnswer;
                            return (
                                <div key={idx} className={`p-8 glass-panel border ${isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                                    <div className="flex justify-between items-start gap-4 mb-6">
                                        <h4 className="text-lg font-medium leading-relaxed">
                                            <span className="text-slate-500 mr-2">Q{idx+1}.</span> {q.question}
                                        </h4>
                                        {isCorrect ? (
                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                                                <Check className="w-3 h-3" /> Correct
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 flex items-center gap-1.5 shrink-0">
                                                <X className="w-3 h-3" /> Incorrect
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3 mb-8">
                                        {q.options.map((opt, oidx) => {
                                            const isUserChoice = userAnswers[idx] === oidx;
                                            const isCorrectChoice = q.correctAnswer === oidx;
                                            let boarderClass = 'border-white/5 bg-white/[0.01]';
                                            if (isUserChoice && !isCorrect) boarderClass = 'border-red-500/40 bg-red-500/5';
                                            if (isCorrectChoice) boarderClass = 'border-emerald-500/40 bg-emerald-500/5';

                                            return (
                                                <div key={oidx} className={`p-4 rounded-xl border flex items-center justify-between text-sm ${boarderClass}`}>
                                                    <span className={isCorrectChoice ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{opt}</span>
                                                    {isCorrectChoice && <Check className="w-4 h-4 text-emerald-400" />}
                                                    {isUserChoice && !isCorrect && <X className="w-4 h-4 text-red-400" />}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-2xl flex gap-3">
                                        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase font-bold tracking-widest text-cyan-500">Explanation</p>
                                            <p className="text-slate-400 text-sm italic">{q.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] bg-mesh text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-500 mb-2 block">Skill Intelligence</span>
                        <h1 className="text-3xl font-bold font-outfit">{taskTitle}</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-white font-outfit">{currentQuestion + 1}</span>
                        <span className="text-slate-600 text-lg uppercase font-bold ml-1">/ {quiz.length}</span>
                    </div>
                </div>

                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-12">
                    <motion.div 
                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion) / quiz.length) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <h2 className="text-2xl font-medium leading-relaxed font-outfit">
                            {quiz[currentQuestion]?.question}
                        </h2>

                        <div className="space-y-3">
                            {quiz[currentQuestion]?.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                                        selectedOption === idx 
                                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-xl shadow-cyan-500/10' 
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400'
                                    }`}
                                >
                                    <span className="font-medium">{option}</span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedOption === idx ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                                    }`}>
                                        {selectedOption === idx && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={selectedOption === null}
                            onClick={handleNext}
                            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-2 disabled:opacity-30 mt-8 group active:scale-[0.98]"
                        >
                            {currentQuestion === quiz.length - 1 ? 'Evaluate Knowledge' : 'Submit & Continue'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Quiz;
