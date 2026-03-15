import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0F0F0F] border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                <FileText className="w-4 h-4 text-black" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                Docu<span className="text-accent">ra</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            AI-powered resume builder. Create stunning resumes in minutes.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/builder" className="text-sm text-gray-500 hover:text-accent transition-colors">Resume Builder</Link></li>
                            <li><Link to="/ai-generator" className="text-sm text-gray-500 hover:text-accent transition-colors">AI Generator</Link></li>
                            <li><Link to="/cover-letter" className="text-sm text-gray-500 hover:text-accent transition-colors">Cover Letter</Link></li>
                            <li><Link to="/resume-review" className="text-sm text-gray-500 hover:text-accent transition-colors">Resume Review</Link></li>
                            <li><Link to="/pdf-tools" className="text-sm text-gray-500 hover:text-accent transition-colors">PDF Tools</Link></li>
                            <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-accent transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/about" className="text-sm text-gray-500 hover:text-accent transition-colors">About</Link></li>
                            <li><Link to="/contact" className="text-sm text-gray-500 hover:text-accent transition-colors">Contact</Link></li>
                            <li><Link to="/faq" className="text-sm text-gray-500 hover:text-accent transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/terms" className="text-sm text-gray-500 hover:text-accent transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-accent transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">© {new Date().getFullYear()} Docura. All rights reserved.</p>
                    <p className="text-xs text-gray-600">
                        Built with <span className="text-accent">♥</span> for professionals
                    </p>
                </div>
            </div>
        </footer>
    );
}
