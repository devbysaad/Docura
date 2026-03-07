import { useState } from "react";
import { generatePdf } from "../api/pdf";

export default function TextEditor() {
    const [text, setText] = useState("");
    const [fileName, setFileName] = useState("document");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError("Please enter some text first.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const blob = await generatePdf(text);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName || "document"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
                {/* Glow accent */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-60 -z-10" />

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Text to PDF
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your text below and download it as a beautifully formatted PDF.
                    </p>
                </div>

                {/* Textarea */}
                <textarea
                    id="text-editor"
                    rows={12}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing your content here..."
                    className="w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-500 p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />

                {/* File name input */}
                <div className="mt-5 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <label
                            htmlFor="file-name"
                            className="block text-xs font-medium text-gray-400 mb-1.5 ml-1"
                        >
                            File Name
                        </label>
                        <div className="flex items-center rounded-xl bg-gray-900/60 border border-white/10 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500/50 transition-all duration-300 overflow-hidden">
                            <input
                                id="file-name"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="document"
                                className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 text-sm px-4 py-2.5 focus:outline-none"
                            />
                            <span className="text-gray-500 text-sm pr-4 select-none">.pdf</span>
                        </div>
                    </div>

                    {/* Generate button */}
                    <div className="flex items-end">
                        <button
                            id="generate-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="relative group w-full sm:w-auto px-8 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {/* Button gradient background */}
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 transition-opacity duration-300 group-hover:opacity-90" />
                            {/* Shine effect */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full" />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                                            />
                                        </svg>
                                        Generate PDF
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom note */}
            <p className="mt-6 text-center text-xs text-gray-600">
                Powered by{" "}
                <span className="text-gray-400 font-medium">pdf-lib</span> &middot; A4
                format &middot; Helvetica font
            </p>
        </div>
    );
}
