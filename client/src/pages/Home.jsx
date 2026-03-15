import TextEditor from "../components/TextEditor";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
            {/* Ambient blurred orbs */}


            {/* Title */}
            <header className="mb-10 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-5 backdrop-blur-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Online &amp; Ready
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    PDF <span className="text-accent">Converter</span>
                </h1>
                <p className="mt-3 text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                    Transform your text into a clean, downloadable PDF document in seconds.
                </p>
            </header>

            {/* Editor card */}
            <main className="w-full relative z-10">
                <TextEditor />
            </main>
        </div>
    );
}
