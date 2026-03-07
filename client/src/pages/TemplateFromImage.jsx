import { useState } from "react";
import { templateFromImageAi } from "../api/ai";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Image, Upload, Eye, Code, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TemplateFromImage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("preview");

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return toast.error("Please upload an image");
        setLoading(true);
        try {
            const data = await templateFromImageAi(file);
            setResult(data);
            toast.success("Template created!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative">
            <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 mb-4">
                    <Image className="w-3.5 h-3.5" /> AI Template Creator
                </div>
                <h1 className="text-3xl font-bold text-white">Template From Image</h1>
                <p className="text-gray-400 text-sm mt-2">Upload a resume image and AI will recreate the template</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                {/* Upload side */}
                <Card glow className="p-6 space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${preview ? "border-violet-500/30" : "border-white/10 hover:border-violet-500/30"
                            }`}
                        onClick={() => document.getElementById("template-upload").click()}
                    >
                        <input
                            id="template-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {preview ? (
                            <img src={preview} alt="Template" className="max-h-80 mx-auto rounded-lg" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Upload a resume template image</p>
                                <p className="text-xs text-gray-600 mt-1">JPG, PNG, or WebP</p>
                            </>
                        )}
                    </div>

                    <Button variant="primary" className="w-full" onClick={handleAnalyze} disabled={loading || !file}>
                        {loading ? (
                            <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing...</>
                        ) : (
                            <><Wand2 className="w-4 h-4" /> Create Template</>
                        )}
                    </Button>
                </Card>

                {/* Result */}
                <Card className="p-6">
                    {result ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-sm font-semibold text-white">{result.templateName || "Generated Template"}</h3>
                            </div>
                            <p className="text-xs text-gray-400">{result.description}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "preview" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab("code")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "code" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    <Code className="w-3.5 h-3.5 inline mr-1" /> Code
                                </button>
                            </div>

                            {activeTab === "preview" ? (
                                <div className="bg-white rounded-lg p-4 max-h-[500px] overflow-auto">
                                    <div dangerouslySetInnerHTML={{ __html: result.html }} />
                                    {result.css && <style>{result.css}</style>}
                                </div>
                            ) : (
                                <pre className="bg-gray-900/80 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-[500px] whitespace-pre-wrap">
                                    {result.html}
                                    {result.css && `\n\n/* CSS */\n${result.css}`}
                                </pre>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center py-16">
                            <div>
                                <Image className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Upload an image and click "Create Template"</p>
                                <p className="text-xs text-gray-600 mt-1">AI will analyze the layout and recreate it</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
