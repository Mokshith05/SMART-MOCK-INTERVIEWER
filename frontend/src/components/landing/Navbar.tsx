import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20 py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-white">
                        Smart Interviewer
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">
                        Features
                    </button>
                    <button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors">
                        How it Works
                    </button>
                    <button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition-colors">
                        Testimonials
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/interview/setup")}
                        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            </nav>
        </header>
    );
}
