import { Card } from "../components/ui/Card";
import { Users, Target, Heart, Zap } from "lucide-react";

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 relative">


            <div className="text-center mb-12 relative z-10">
                <h1 className="text-4xl font-bold text-white">
                    About <span className="text-accent">Docura</span>
                </h1>
                <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                    We're building the future of resume creation with AI-powered tools that help professionals stand out.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
                {[
                    { icon: Target, title: "Our Mission", desc: "To democratize professional resume creation by making AI-powered tools accessible to everyone, regardless of their writing skills or design experience.", color: "bg-accent" },
                    { icon: Heart, title: "Our Values", desc: "We believe in simplicity, privacy, and putting the user first. Every feature we build starts with the question: will this help someone get hired?", color: "bg-accent" },
                    { icon: Zap, title: "Our Technology", desc: "Built with modern technologies including React, Node.js, and Google's Gemini AI. We leverage cutting-edge AI to provide intelligent resume assistance.", color: "bg-accent" },
                    { icon: Users, title: "Our Community", desc: "Trusted by thousands of job seekers worldwide. From fresh graduates to senior executives, Docura helps professionals at every career stage.", color: "bg-accent" },
                ].map((item) => (
                    <Card key={item.title} className="p-6">
                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                            <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
