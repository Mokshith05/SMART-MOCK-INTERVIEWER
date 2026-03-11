import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Play, Sparkles } from "lucide-react";

export function Hero() {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950">
            {/* Background Video (Muted, Looping) */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-20 object-center"
                >
                    <source
                        src="https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Gradients to blend video with background */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Side: Copy & CTAs */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400">Llama 3 Powered AI</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                        >
                            Top Your Next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Tech Interview
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-lg lg:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed"
                        >
                            Practice realistic mock interviews with a highly advanced AI coach. Receive live audible questions, respond with your voice, and get instant, detailed feedback to land your dream job.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => navigate("/interview/setup")}
                                className="group relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-purple-500/40 active:scale-95"
                            >
                                <span>Start Mock Interview</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                                className="group flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                            >
                                <FileText className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                                <span>Upload Resume</span>
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-10 flex items-center gap-4 text-sm text-slate-400"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-slate-800" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }} />
                                ))}
                            </div>
                            <p>Trusted by <strong className="text-white">1,000+</strong> developers</p>
                        </motion.div>
                    </div>

                    {/* Right Side: Animated Mockup/Video Representation */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative lg:ml-auto w-full max-w-lg hidden md:block perspective-1000"
                    >
                        {/* Glow perfectly behind the panel */}
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-2xl" />

                        <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 ring-1 ring-white/10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">Live Interview</div>
                            </div>

                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-200 mb-1">AI Interviewer</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">Could you explain the difference between processes and threads, and when you would use each in a high-concurrency Node.js application?</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2, duration: 0.5 }}
                                    className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center justify-center h-24 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                            <Play className="w-4 h-4" />
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex gap-1 items-end h-4">
                                                {[40, 70, 40, 90, 60, 30, 80, 50, 20].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [`${h}%`, `${h / 2}%`, `${h}%`] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-1 bg-emerald-500/50 rounded-t-sm"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">Recording Answer...</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 3, duration: 0.5 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-emerald-400">Score: 9/10</span>
                                        <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-900 rounded border border-white/5">Instant Feedback</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Excellent breakdown of the memory isolation differences. Good mention of worker threads in Node.js.</p>
                                </motion.div>

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
