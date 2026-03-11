import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 bg-slate-950 overflow-hidden">
            {/* Dynamic Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-slate-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
                        Your Next Interview <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Starts Here.
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Stop guessing what they'll ask. Start practicing in a realistic, high-pressure environment with our AI interviewer today.
                    </p>

                    <button
                        onClick={() => navigate("/interview/setup")}
                        className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-base font-bold text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <span>Start Practicing Now</span>
                        <div className="rounded-full bg-slate-100 p-1 group-hover:bg-indigo-100 transition-colors">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>

                    <p className="mt-6 text-sm text-slate-500">No credit card required. Free local inference.</p>
                </motion.div>
            </div>
        </section>
    );
}
