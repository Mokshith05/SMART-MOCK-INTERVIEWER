import React from "react";
import { motion } from "framer-motion";

export function DemoPreview() {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Text */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                                Real-time processing,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    human-like interaction
                                </span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                We've built a system that feels like you're talking to a senior engineer. Low-latency edge networking and optimized local LLMs ensure the conversation flows naturally.
                            </p>
                        </motion.div>

                        <motion.ul
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="space-y-4 text-slate-300"
                        >
                            {[
                                "Web Speech API Integration for seamless dictation",
                                "Sub-second Llama 3 response times via Ollama",
                                "ChromaDB embeddings for deep answer evaluation",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span className="text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </motion.ul>
                    </div>

                    {/* Right Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden ring-1 ring-white/10">
                            {/* Browser Header */}
                            <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="ml-4 h-5 w-48 bg-slate-800 rounded-md" />
                            </div>

                            {/* Mockup Body */}
                            <div className="p-6">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 w-1/4 bg-slate-800 rounded" />
                                        <div className="h-16 w-full bg-slate-800/50 border border-slate-700 rounded-lg" />
                                    </div>
                                </div>

                                <div className="flex gap-4 flex-row-reverse mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 shrink-0" />
                                    <div className="space-y-2 w-full flex flex-col items-end">
                                        <div className="h-4 w-1/6 bg-slate-800 rounded" />
                                        <div className="h-24 w-3/4 bg-slate-800 rounded-lg p-3">
                                            <div className="h-2 w-full bg-slate-700 rounded mb-2" />
                                            <div className="h-2 w-full bg-slate-700 rounded mb-2" />
                                            <div className="h-2 w-2/3 bg-slate-700 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
