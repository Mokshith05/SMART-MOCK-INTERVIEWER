import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { DemoPreview } from "../components/landing/DemoPreview";
import { Testimonials } from "../components/landing/Testimonials";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

export function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <DemoPreview />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
