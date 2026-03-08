import { useState } from "react";
import { generateResumeAi } from "../api/ai";
import useResumeStore from "../store/resumeStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Input";
import { Wand2, ArrowRight, Sparkles, CheckCircle, Zap } from "lucide-react";
import toast from "react-hot-toast";

const examples = [
    "Frontend developer with 3 years of React experience",
    "Data scientist specializing in machine learning and Python",
    "Full-stack engineer with Node.js and AWS expertise",
    "UX designer with 5 years of experience in SaaS products",
];

export default function AiGenerator() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setResumeData } = useResumeStore();
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!description.trim()) return toast.error("Please enter a description");
        setLoading(true);
        try {
            const data = await generateResumeAi(description);
            setResult(data);
            toast.success("Resume content generated!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!result) return;
        setResumeData({
            basics: { fullName: "", profession: description, email: "", phone: "", location: "", portfolioUrl: "", summary: result.summary || "" },
            skills: result.skills || [],
            experience: result.experience || [],
            projects: result.projects || [],
            education: [],
        });
        toast.success("Applied to resume builder!");
        navigate("/builder");
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-900/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> AI-Powered
                </div>
                <h1 className="text-3xl font-bold text-white">AI Resume Generator</h1>
                <p className="text-gray-400 text-sm mt-2">Describe your role and let AI create your resume content</p>
            </div>

            <div className="space-y-6 relative z-10">
                <Card glow className="p-6">
                    <Textarea
                        rows={4}
                        placeholder="e.g. Senior frontend developer with 5 years of React and TypeScript experience, specializing in fintech products..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-base"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                        {examples.map((ex) => (
                            <button
                                key={ex}
                                onClick={() => setDescription(ex)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                    <Button variant="primary" className="w-full mt-6" onClick={handleGenerate} disabled={loading}>
                        {loading ? (
                            <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Generating...</>
                        ) : (
                            <><Wand2 className="w-4 h-4" /> Generate Resume Content</>
                        )}
                    </Button>
                </Card>

                {result && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <Card className="p-6">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400" /> Professional Summary
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-cyan-400" /> Suggested Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.skills?.map((s, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">{s}</span>
                                ))}
                            </div>
                        </Card>

                        {result.experience?.length > 0 && (
                            <Card className="p-6">
                                <h3 className="text-sm font-semibold text-white mb-3">Experience</h3>
                                {result.experience.map((exp, i) => (
                                    <div key={i} className="mb-3 last:mb-0">
                                        <p className="text-sm font-medium text-gray-200">{exp.role} — {exp.company}</p>
                                        <p className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</p>
                                        <p className="text-xs text-gray-400 mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </Card>
                        )}

                        {result.projects?.length > 0 && (
                            <Card className="p-6">
                                <h3 className="text-sm font-semibold text-white mb-3">Projects</h3>
                                {result.projects.map((p, i) => (
                                    <div key={i} className="mb-3 last:mb-0">
                                        <p className="text-sm font-medium text-gray-200">{p.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{p.summary}</p>
                                    </div>
                                ))}
                            </Card>
                        )}

                        <Button variant="primary" className="w-full" onClick={handleApply}>
                            Apply to Resume Builder <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
