import { useState } from "react";
import { generateResumePdf } from "../api/resume";
import StepIndicator from "../components/StepIndicator";
import BasicInfoForm from "../components/BasicInfoForm";
import SkillsForm from "../components/SkillsForm";
import ExperienceForm from "../components/ExperienceForm";
import ProjectsForm from "../components/ProjectsForm";
import ResumePreview from "../components/ResumePreview";

const TOTAL_STEPS = 4;

export default function ResumeBuilder() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [basics, setBasics] = useState({ fullName: "", profession: "", summary: "" });
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState([]);
    const [projects, setProjects] = useState([]);

    const resumeData = { basics, skills, experience, projects };

    const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const handleDownload = async () => {
        setError("");
        setLoading(true);
        try {
            const blob = await generateResumePdf(resumeData);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(basics.fullName || "resume").replace(/\s+/g, "_")}_resume.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message || "Failed to generate PDF.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicInfoForm data={basics} onChange={setBasics} />;
            case 2:
                return <SkillsForm data={skills} onChange={setSkills} />;
            case 3:
                return <ExperienceForm data={experience} onChange={setExperience} />;
            case 4:
                return <ProjectsForm data={projects} onChange={setProjects} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-blue-700/15 blur-[140px] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-pink-700/10 blur-[120px] pointer-events-none" />

            {/* Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-4 backdrop-blur-sm">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Resume Builder
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        Build Your{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            Resume
                        </span>
                    </h1>
                    <p className="mt-2 text-gray-400 text-sm max-w-lg mx-auto">
                        Fill in your information step by step and download a beautifully formatted PDF resume.
                    </p>
                </header>

                {/* Step indicator */}
                <StepIndicator currentStep={step} />

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/5">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-50 -z-10" />

                        {renderStep()}

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                            <button
                                type="button"
                                onClick={back}
                                disabled={step === 1}
                                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← Back
                            </button>

                            <div className="flex gap-3">
                                {step < TOTAL_STEPS ? (
                                    <button
                                        type="button"
                                        onClick={next}
                                        className="relative px-6 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />
                                        <span className="relative">Next →</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={loading}
                                        className="relative px-6 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />
                                        <span className="relative flex items-center gap-2">
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Generating…
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                                                    </svg>
                                                    Download Resume
                                                </>
                                            )}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Preview */}
                    <div className="hidden lg:block">
                        <ResumePreview data={resumeData} />
                    </div>
                </div>

                {/* Mobile preview toggle */}
                <div className="lg:hidden mt-6">
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-400 hover:text-purple-400 transition-colors text-center list-none">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Toggle Preview
                            </span>
                        </summary>
                        <div className="mt-4">
                            <ResumePreview data={resumeData} />
                        </div>
                    </details>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-600">
                    Powered by <span className="text-gray-400 font-medium">pdf-lib</span> &middot; A4 format &middot; Professional layout
                </p>
            </div>
        </div>
    );
}
