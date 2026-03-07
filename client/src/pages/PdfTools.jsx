import { useState } from "react";
import { textToPdf, pdfToText, mergePdfs, splitPdf } from "../api/tools";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Input";
import { FileText, Upload, Merge, Scissors, Download, ArrowRight, Wrench } from "lucide-react";
import toast from "react-hot-toast";

const tools = [
    { id: "text-to-pdf", label: "Text → PDF", icon: FileText, desc: "Convert plain text to PDF" },
    { id: "pdf-to-text", label: "PDF → Text", icon: FileText, desc: "Extract text from PDF" },
    { id: "merge", label: "Merge PDFs", icon: Merge, desc: "Combine multiple PDFs" },
    { id: "split", label: "Split PDF", icon: Scissors, desc: "Split PDF into pages" },
];

export default function PdfTools() {
    const [activeTool, setActiveTool] = useState("text-to-pdf");
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const download = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleTextToPdf = async () => {
        if (!text.trim()) return toast.error("Enter some text");
        setLoading(true);
        try {
            const blob = await textToPdf(text);
            download(blob, "document.pdf");
            toast.success("PDF downloaded!");
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handlePdfToText = async () => {
        if (!files.length) return toast.error("Upload a PDF file");
        setLoading(true);
        try {
            const data = await pdfToText(files[0]);
            setResult(data.text);
            toast.success("Text extracted!");
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleMerge = async () => {
        if (files.length < 2) return toast.error("Upload at least 2 PDFs");
        setLoading(true);
        try {
            const blob = await mergePdfs(files);
            download(blob, "merged.pdf");
            toast.success("PDFs merged!");
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleSplit = async () => {
        if (!files.length) return toast.error("Upload a PDF file");
        setLoading(true);
        try {
            const res = await splitPdf(files[0]);
            if (res.type === "blob") {
                download(res.data, "split.pdf");
            } else {
                setResult(`PDF split into ${res.data.pageCount} parts`);
            }
            toast.success("PDF split!");
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleAction = () => {
        switch (activeTool) {
            case "text-to-pdf": return handleTextToPdf();
            case "pdf-to-text": return handlePdfToText();
            case "merge": return handleMerge();
            case "split": return handleSplit();
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 mb-4">
                    <Wrench className="w-3.5 h-3.5" /> Document Utilities
                </div>
                <h1 className="text-3xl font-bold text-white">PDF Tools</h1>
                <p className="text-gray-400 text-sm mt-2">Convert, merge, split, and extract text from PDFs</p>
            </div>

            <div className="relative z-10">
                {/* Tool tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setActiveTool(t.id); setResult(null); setFiles([]); setText(""); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTool === t.id
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                <Card glow className="p-6 space-y-4">
                    <p className="text-sm text-gray-400">{tools.find(t => t.id === activeTool)?.desc}</p>

                    {activeTool === "text-to-pdf" && (
                        <Textarea rows={8} placeholder="Enter your text here..." value={text} onChange={(e) => setText(e.target.value)} />
                    )}

                    {(activeTool === "pdf-to-text" || activeTool === "split") && (
                        <div
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/30 transition-colors"
                            onClick={() => document.getElementById("tool-file").click()}
                        >
                            <input id="tool-file" type="file" accept=".pdf" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                            {files.length > 0 ? (
                                <p className="text-sm text-emerald-400">{files[0].name}</p>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Upload PDF</p>
                                </>
                            )}
                        </div>
                    )}

                    {activeTool === "merge" && (
                        <div
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/30 transition-colors"
                            onClick={() => document.getElementById("tool-files").click()}
                        >
                            <input id="tool-files" type="file" accept=".pdf" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                            {files.length > 0 ? (
                                <p className="text-sm text-emerald-400">{files.length} files selected</p>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Upload 2+ PDFs to merge</p>
                                </>
                            )}
                        </div>
                    )}

                    <Button variant="primary" className="w-full" onClick={handleAction} disabled={loading}>
                        {loading ? (
                            <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                        ) : (
                            <><ArrowRight className="w-4 h-4" /> {activeTool === "text-to-pdf" ? "Convert & Download" : activeTool === "merge" ? "Merge & Download" : activeTool === "split" ? "Split PDF" : "Extract Text"}</>
                        )}
                    </Button>

                    {result && (
                        <Card className="p-4 mt-4 bg-gray-900/50">
                            <h3 className="text-sm font-semibold text-white mb-2">Result</h3>
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap max-h-64 overflow-auto">{result}</pre>
                        </Card>
                    )}
                </Card>
            </div>
        </div>
    );
}
