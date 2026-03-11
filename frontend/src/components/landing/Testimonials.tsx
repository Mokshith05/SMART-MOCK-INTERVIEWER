import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        content: "This tool is a game-changer. The way it follows up on my answers with deep-dive technical questions felt exactly like a FAANG interview.",
        author: "Sarah J.",
        role: "Senior Frontend Engineer",
        avatar: "https://i.pravatar.cc/150?img=43",
    },
    {
        content: "I used to get extremely nervous speaking out loud during system design rounds. Practicing here completely eliminated my anxiety.",
        author: "David Chen",
        role: "Backend Developer",
        avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
        content: "The feedback analytics were brutal but honest. It picked up on the fact that I wasn't explaining edge cases, which helped me land my next role.",
        author: "Elena Rodriguez",
        role: "Full Stack Engineer",
        avatar: "https://i.pravatar.cc/150?img=5",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-slate-900 border-t border-slate-800 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                        Trusted by Engineers
                    </h2>
                    <p className="text-slate-400 text-lg">
                        See how developers are using our AI interviewer to secure roles at top tech companies.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 shadow-sm"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                                ))}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-slate-800"
                                />
                                <div>
                                    <h4 className="text-white text-sm font-medium">{testimonial.author}</h4>
                                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
