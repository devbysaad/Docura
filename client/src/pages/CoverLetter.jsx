import { useState } from "react";
import { generateCoverLetterAi } from "../api/ai";
import useResumeStore from "../store/resumeStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Wand2, Copy, Download, Check } from "lucide-react";
import toast from "react-hot-toast";

const toneOptions = [
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "technical", label: "Technical" },
    { value: "executive", label: "Executive" },
];

export default function CoverLetter() {
    const { resumeData } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [tone, setTone] = useState("formal");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    async function handleGenerate() {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }
        setLoading(true);
        try {
            const data = await generateCoverLetterAi(resumeData, jobDescription, tone);
            setResult(data.coverLetter);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(result);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    }

    function handleDownload() {
        const blob = new Blob([result], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cover-letter.txt";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Cover Letter Generator</h1>
                <p className="text-sm text-gray-500 mt-1">Paste a job description and AI will write a tailored cover letter using your resume data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            rows={12}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                        <div className="flex gap-2">
                            {toneOptions.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tone === t.value
                                        ? "bg-violet-600 text-white"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button variant="primary" onClick={handleGenerate} disabled={loading} className="w-full">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                Generating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2"><Wand2 className="w-4 h-4" /> Generate Cover Letter</span>
                        )}
                    </Button>

                    {!resumeData.basics?.fullName && (
                        <p className="text-xs text-amber-400">Tip: Fill out your resume in the Builder first for better results.</p>
                    )}
                </div>

                {/* Output */}
                <div>
                    <Card className="h-full min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <span className="text-sm font-medium text-white">Generated Cover Letter</span>
                            {result && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={handleCopy}>
                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={handleDownload}>
                                        <Download className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            {result ? (
                                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                                    Your cover letter will appear here
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
