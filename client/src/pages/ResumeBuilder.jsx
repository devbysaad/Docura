import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useResumeStore from "../store/resumeStore";
import useAuthStore from "../store/authStore";
import { getResumeById, createResume, updateResume } from "../api/dashboard";
import { generateResumePdf, generateResumeDocx } from "../api/resume";
import StepIndicator from "../components/StepIndicator";
import BasicInfoForm from "../components/BasicInfoForm";
import SkillsForm from "../components/SkillsForm";
import ExperienceForm from "../components/ExperienceForm";
import ProjectsForm from "../components/ProjectsForm";
import EducationForm from "../components/EducationForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import AiChatPanel from "../components/AiChatPanel";
import { Button } from "../components/ui/Button";
import { MessageSquare, Save, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";

const TOTAL_STEPS = 5;

export default function ResumeBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        resumeData, currentStep, selectedTemplate,
        setBasics, setSkills, setExperience, setProjects, setEducation,
        setStep, nextStep, prevStep, setTemplate, setResumeData, setCurrentResumeId
    } = useResumeStore();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [chatOpen, setChatOpen] = useState(false);

    // Load existing resume if editing
    useEffect(() => {
        if (id && user) {
            loadResume(id);
        }
    }, [id]);

    async function loadResume(resumeId) {
        try {
            const data = await getResumeById(resumeId);
            setResumeData(data.data);
            setTemplate(data.templateId);
            setCurrentResumeId(data.id);
        } catch (err) {
            toast.error("Failed to load resume");
        }
    }

    const handleSave = async () => {
        if (!user) return toast.error("Please sign in to save");
        setSaving(true);
        try {
            const payload = {
                title: resumeData.basics.fullName
                    ? `${resumeData.basics.fullName} — ${resumeData.basics.profession || "Resume"}`
                    : "Untitled Resume",
                data: resumeData,
                templateId: selectedTemplate,
            };

            if (id) {
                await updateResume(id, payload);
                toast.success("Resume updated!");
            } else {
                const result = await createResume(payload);
                setCurrentResumeId(result.id);
                toast.success("Resume saved!");
                navigate(`/builder/${result.id}`, { replace: true });
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async (format = "pdf") => {
        setError("");
        setLoading(true);
        try {
            let blob;
            let ext;
            if (format === "docx") {
                blob = await generateResumeDocx(resumeData);
                ext = "docx";
            } else {
                blob = await generateResumePdf(resumeData);
                ext = "pdf";
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(resumeData.basics.fullName || "resume").replace(/\s+/g, "_")}_resume.${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success(`Resume downloaded as ${ext.toUpperCase()}!`);
        } catch (err) {
            setError(err.message || "Failed to generate file.");
            toast.error("Download failed");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <BasicInfoForm data={resumeData.basics} onChange={setBasics} />;
            case 2: return <SkillsForm data={resumeData.skills} onChange={setSkills} />;
            case 3: return <ExperienceForm data={resumeData.experience} onChange={setExperience} />;
            case 4: return <ProjectsForm data={resumeData.projects} onChange={setProjects} />;
            case 5: return <EducationForm data={resumeData.education} onChange={setEducation} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-violet-900/15 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Build Your <span className="text-violet-400">Resume</span>
                    </h1>
                    <p className="mt-2 text-gray-400 text-sm">
                        Fill in your information, pick a template, and download.
                    </p>
                </header>

                {/* Template selector */}
                <div className="mb-6">
                    <TemplateSelector selected={selectedTemplate} onSelect={setTemplate} />
                </div>

                {/* Step indicator */}
                <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Left: Form */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                        {renderStep()}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                ← Back
                            </Button>

                            <div className="flex gap-2">
                                {user && (
                                    <Button variant="default" onClick={handleSave} disabled={saving}>
                                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                                    </Button>
                                )}

                                {currentStep < TOTAL_STEPS ? (
                                    <Button variant="primary" onClick={nextStep}>
                                        Next →
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="primary" onClick={() => handleDownload("pdf")} disabled={loading}>
                                            <Download className="w-4 h-4" />
                                            {loading ? "Generating..." : "PDF"}
                                        </Button>
                                        <Button variant="outline" onClick={() => handleDownload("docx")} disabled={loading}>
                                            <FileText className="w-4 h-4" /> DOCX
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Preview */}
                    <div className="hidden lg:block">
                        <ResumePreview data={resumeData} templateId={selectedTemplate} />
                    </div>
                </div>

                {/* Mobile preview */}
                <div className="lg:hidden mt-6">
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-400 hover:text-violet-400 transition-colors text-center list-none">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                Toggle Preview
                            </span>
                        </summary>
                        <div className="mt-4">
                            <ResumePreview data={resumeData} templateId={selectedTemplate} />
                        </div>
                    </details>
                </div>

                {/* AI Chat toggle */}
                {user && (
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-2xl shadow-violet-500/30 hover:scale-105 transition-transform z-40"
                    >
                        <MessageSquare className="w-6 h-6" />
                    </button>
                )}

                <AiChatPanel
                    resumeData={resumeData}
                    isOpen={chatOpen}
                    onClose={() => setChatOpen(false)}
                />
            </div>
        </div>
    );
}
