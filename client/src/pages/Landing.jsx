import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
    FileText, Wand2, Download, Search, Shield, Zap,
    ArrowRight, CheckCircle2, Star, ChevronRight, Mail
} from "lucide-react";

const features = [
    { icon: Wand2, title: "AI-Powered Content", desc: "Generate tailored resume sections using AI that understands your career." },
    { icon: FileText, title: "6 Pro Templates", desc: "Modern Minimal, Corporate, Developer, Creative, Executive, and ATS-friendly." },
    { icon: Search, title: "ATS Score Checker", desc: "Scan your resume for ATS compatibility issues before you apply." },
    { icon: Download, title: "PDF & DOCX Export", desc: "Download in any format. Merge, split, compress, and watermark PDFs." },
    { icon: Mail, title: "Cover Letter AI", desc: "Paste a job description, get a tailored cover letter instantly." },
    { icon: Shield, title: "Privacy First", desc: "Your data stays yours. No selling, no ads, no tracking." },
];

const stats = [
    { value: "6", label: "Resume Templates" },
    { value: "5+", label: "AI Features" },
    { value: "8", label: "PDF Tools" },
    { value: "100%", label: "Free Tier" },
];

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-24 sm:py-32 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
                        <Zap className="w-3.5 h-3.5" />
                        AI-Powered Resume Builder
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        Build resumes that
                        <br />
                        <span className="text-accent">land interviews</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Professional templates, AI content generation, ATS optimization,
                        and powerful PDF tools — all in one place.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/builder">
                            <Button variant="primary" size="lg">
                                Start Building <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 sm:px-6 border-y border-white/[0.06]">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl font-extrabold text-accent">{s.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white">Everything you need</h2>
                        <p className="text-gray-500 mt-3">Tools built for professionals who want to stand out.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <Card key={i} className="p-6 hover:border-accent/20 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-4 sm:px-6 bg-[#141414]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white">Three steps to your resume</h2>
                    </div>

                    <div className="space-y-8">
                        {[
                            { step: "01", title: "Fill in your info", desc: "Add your basics, skills, experience, projects, and education in a guided form." },
                            { step: "02", title: "Pick a template", desc: "Choose from 6 professional templates — from clean ATS-friendly to creative designs." },
                            { step: "03", title: "Download & apply", desc: "Export as PDF or DOCX. Use AI to generate a cover letter tailored to each job." },
                        ].map((s, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                                    {s.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Ready to build your resume?</h2>
                    <p className="text-gray-500 mb-8">Start for free. No credit card required.</p>
                    <Link to="/register">
                        <Button variant="primary" size="lg">
                            Get Started Free <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
