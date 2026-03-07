import { useState } from "react";
import { Card } from "../components/ui/Card";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    { q: "What is Docura?", a: "Docura is an AI-powered resume builder and document platform. It helps you create professional resumes using AI assistance, review existing resumes, and manage documents with built-in PDF tools." },
    { q: "Is Docura free to use?", a: "Yes! Docura offers a free plan with 5 AI generations and 2 resume downloads per month. For unlimited access, you can upgrade to our Pro plan." },
    { q: "How does the AI Resume Generator work?", a: "Simply describe your role (e.g., 'Frontend developer with React experience') and our AI will generate a professional summary, relevant skills, work experience, and project descriptions tailored to your profile." },
    { q: "What resume templates are available?", a: "We offer 4 professionally designed templates: Modern Minimal, Professional Corporate, Developer Portfolio, and Creative Designer. You can switch between templates at any time before downloading." },
    { q: "Can I review my existing resume?", a: "Yes! Upload your resume PDF to our Resume Review feature. Our AI will analyze it for ATS compatibility, content quality, formatting, and provide a score out of 10 with detailed improvement suggestions." },
    { q: "What file formats can I export?", a: "You can download your resume as a high-quality PDF. We also support DOCX export. PDF export uses a professional rendering engine to ensure pixel-perfect output." },
    { q: "Is my data secure?", a: "Absolutely. Passwords are encrypted with bcrypt, authentication uses JWT tokens, and all data is transmitted over HTTPS. We don't sell your data and documents uploaded for processing are deleted automatically." },
    { q: "What PDF tools are available?", a: "Our PDF tools include: Text to PDF conversion, PDF to Text extraction, PDF merging (combine multiple PDFs), and PDF splitting (split into individual pages)." },
    { q: "How does the AI Chat Assistant work?", a: "The AI Chat Assistant reads your current resume data and provides contextual suggestions. You can ask it to improve sections, add skills, rewrite experience descriptions, or get tailored advice." },
    { q: "Can I create multiple resumes?", a: "Yes! You can create and manage multiple resumes from your dashboard. Each resume can use a different template and contain different content, perfect for tailoring applications to different roles." },
    { q: "What is the Template From Image feature?", a: "You can upload an image of a resume template you like, and our AI will analyze the layout and recreate a similar HTML template that you can fill with your own data." },
    { q: "How do I cancel my subscription?", a: "You can cancel your Pro subscription at any time from your account settings. Your data will be retained but features will revert to the free plan limits." },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);

    return (
        <Card className="overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-sm font-medium text-white pr-4">{q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
                </div>
            )}
        </Card>
    );
}

export default function FAQ() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 relative">
            <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-12 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                    <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
                <p className="text-gray-400 text-sm mt-2">Everything you need to know about Docura</p>
            </div>

            <div className="space-y-3 relative z-10">
                {faqs.map((faq, i) => (
                    <FaqItem key={i} {...faq} />
                ))}
            </div>
        </div>
    );
}
