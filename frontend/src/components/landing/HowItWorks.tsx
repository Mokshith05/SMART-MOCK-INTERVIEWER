import React from "react";
import { motion } from "framer-motion";
import { Upload, Play, MessageSquare, Award } from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Upload Resume",
        description: "Provide your resume to let the AI tailor the questions to your specific experience and purported skill level.",
        icon: Upload,
    },
    {
        id: "02",
        title: "Start AI Interview",
        description: "Enter the virtual interview room. The AI will speak your first question aloud, simulating a real conversation.",
        icon: Play,
    },
    {
        id: "03",
        title: "Answer Questions",
        description: "Think out loud. Speak directly into your microphone, and our system transcribes and evaluates your response.",
        icon: MessageSquare,
    },
    {
        id: "04",
        title: "Get Feedback Report",
        description: "Receive an instant breakdown of your strengths, weaknesses, and a final score to prepare you for the real deal.",
        icon: Award,
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-900 border-y border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4"
                    >
                        How it works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg"
                    >
                        A simple, four-step process designed to feel exactly like a real technical screening.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />

                    <div className="grid md:grid-cols-4 gap-12 md:gap-8 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-24 h-24 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center mb-4 group-hover:border-indigo-500/50 transition-colors duration-300">
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center border-4 border-slate-900">
                                                {step.id}
                                            </div>
                                            <Icon className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
