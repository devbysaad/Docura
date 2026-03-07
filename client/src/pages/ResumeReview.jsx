import { useState } from "react";
import { reviewResumeAi } from "../api/ai";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Search, Upload, FileText, Target, AlertTriangle, CheckCircle, TrendingUp, Star } from "lucide-react";
import toast from "react-hot-toast";

function ScoreCircle({ score, label }) {
    const pct = (score / 10) * 100;
    const color = score >= 8 ? "text-emerald-400" : score >= 5 ? "text-amber-400" : "text-red-400";
    return (
        <div className="text-center">
            <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className={color} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${color}`}>{score}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">{label}</p>
        </div>
    );
}

export default function ResumeReview() {
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleReview = async () => {
        if (!file) return toast.error("Please upload a PDF resume");
        setLoading(true);
        try {
            const data = await reviewResumeAi(file, jobDesc);
            setResult(data);
            toast.success("Review complete!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
            <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 mb-4">
                    <Search className="w-3.5 h-3.5" /> AI Resume Analysis
                </div>
                <h1 className="text-3xl font-bold text-white">Resume Review</h1>
                <p className="text-gray-400 text-sm mt-2">Get AI-powered feedback on your resume with ATS scoring</p>
            </div>

            <div className="space-y-6 relative z-10">
                <Card glow className="p-6">
                    {/* File upload */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 hover:border-purple-500/30"
                            }`}
                        onClick={() => document.getElementById("resume-upload").click()}
                    >
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-400">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Click to upload your resume PDF</p>
                                <p className="text-xs text-gray-600 mt-1">PDF format, max 20MB</p>
                            </>
                        )}
                    </div>

                    <Textarea
                        label="Job Description (optional)"
                        rows={4}
                        placeholder="Paste the job description here for targeted feedback..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className="mt-4"
                    />

                    <Button variant="primary" className="w-full mt-6" onClick={handleReview} disabled={loading}>
                        {loading ? (
                            <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing...</>
                        ) : (
                            <><Search className="w-4 h-4" /> Analyze Resume</>
                        )}
                    </Button>
                </Card>

                {result && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Scores */}
                        <Card className="p-6">
                            <div className="flex items-center justify-around flex-wrap gap-4">
                                <ScoreCircle score={result.score} label="Overall" />
                                <ScoreCircle score={result.atsCompatibility?.score || 0} label="ATS Score" />
                                <ScoreCircle score={result.formatting?.score || 0} label="Formatting" />
                                <ScoreCircle score={result.content?.score || 0} label="Content" />
                            </div>
                        </Card>

                        {/* Overall */}
                        <Card className="p-6">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-amber-400" /> Overall Assessment
                            </h3>
                            <p className="text-sm text-gray-300">{result.overall}</p>
                        </Card>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-5">
                                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-4 h-4" /> Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {result.strengths?.map((s, i) => (
                                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                            <Card className="p-5">
                                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4" /> Weaknesses
                                </h3>
                                <ul className="space-y-2">
                                    {result.weaknesses?.map((w, i) => (
                                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span> {w}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        {/* Missing Keywords */}
                        {result.missingKeywords?.length > 0 && (
                            <Card className="p-5">
                                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4" /> Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((k, i) => (
                                        <Badge key={i} variant="warning">{k}</Badge>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Suggestions */}
                        <Card className="p-5">
                            <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4" /> Improvement Suggestions
                            </h3>
                            <ol className="space-y-2">
                                {result.suggestions?.map((s, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                        <span className="text-blue-400 font-bold">{i + 1}.</span> {s}
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
