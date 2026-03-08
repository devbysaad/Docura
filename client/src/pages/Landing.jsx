import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FileText, Wand2, MessageSquare, Search, Wrench, Layout, ArrowRight, Sparkles, Zap, Star } from "lucide-react";

const features = [
    { icon: FileText, title: "Resume Builder", desc: "Multi-step form with live preview. 5 sections, drag & drop.", color: "bg-violet-600" },
    { icon: Layout, title: "4+ Templates", desc: "Modern Minimal, Corporate, Developer, Creative Designer.", color: "bg-cyan-600" },
    { icon: Wand2, title: "AI Generator", desc: "Type your role — get a full resume with skills & projects.", color: "bg-violet-600" },
    { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask for improvements, rewrites, and tailored suggestions.", color: "bg-cyan-600" },
    { icon: Search, title: "Resume Review", desc: "Upload your PDF — get ATS score, feedback & keywords.", color: "bg-violet-600" },
    { icon: Wrench, title: "PDF Tools", desc: "Merge, split, convert. Text→PDF, PDF→Text, and more.", color: "bg-cyan-600" },
];

const stats = [
    { value: "10K+", label: "Resumes Created" },
    { value: "95%", label: "ATS Pass Rate" },
    { value: "4.9", label: "User Rating" },
    { value: "50+", label: "Templates" },
];

export default function Landing() {
    return (
        <div className="relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/15 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-900/15 blur-[150px] pointer-events-none" />

            {/* Hero */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-8 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    AI-Powered Resume Platform
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
                    Build Resumes That{" "}
                    <span className="text-violet-400">Get You Hired</span>
                </h1>

                <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Create stunning, ATS-optimized resumes with AI assistance. Choose from professional templates, get instant feedback, and export in PDF or DOCX.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link to="/register">
                        <Button variant="primary" size="lg">
                            Start Building Free <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link to="/builder">
                        <Button variant="outline" size="lg">
                            Try Builder <Zap className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl font-bold text-cyan-400">{s.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">
                        Everything You Need to <span className="text-violet-400">Stand Out</span>
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                        From AI-powered content generation to professional templates and PDF tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <Card key={f.title} className="p-6 group hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                            <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">
                        How It <span className="text-cyan-400">Works</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: "01", title: "Fill Your Details", desc: "Enter your information in our guided multi-step builder. Or let AI generate it for you." },
                        { step: "02", title: "Pick a Template", desc: "Choose from our professional templates. Preview in real-time as you type." },
                        { step: "03", title: "Download & Apply", desc: "Export as high-quality PDF or DOCX. ATS-optimized and ready to send." },
                    ].map((item) => (
                        <div key={item.step} className="relative text-center">
                            <div className="text-6xl font-black text-white/5 mb-4">{item.step}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
                <Card glow className="p-10 sm:p-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Build Your Perfect Resume?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Join thousands of professionals who got their dream jobs with Docura.
                    </p>
                    <Link to="/register">
                        <Button variant="primary" size="lg">
                            Get Started — It's Free <Star className="w-4 h-4" />
                        </Button>
                    </Link>
                </Card>
            </section>
        </div>
    );
}
