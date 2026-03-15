import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useResumeStore from "../store/resumeStore";
import useAuthStore from "../store/authStore";
import { getResume, createResume, updateResume } from "../api/dashboard";
import { generateResumePdf, generateResumeDocx } from "../api/resume";
import StepIndicator from "../components/StepIndicator";
import BasicInfoForm from "../components/BasicInfoForm";
import SkillsForm from "../components/SkillsForm";
import ExperienceForm from "../components/ExperienceForm";
import ProjectsForm from "../components/ProjectsForm";
import EducationForm from "../components/EducationForm";
import CustomSectionForm from "../components/CustomSectionForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import AiChatPanel from "../components/AiChatPanel";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { MessageSquare, Save, Download, FileText, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const TOTAL_STEPS = 6;
const STEP_LABELS = ["Basics", "Skills", "Experience", "Projects", "Education", "Custom"];

export default function ResumeBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        resumeData, currentStep, selectedTemplate, sectionOrder,
        setBasics, setSkills, setExperience, setProjects, setEducation,
        setStep, nextStep, prevStep, setTemplate, setResumeData, setCurrentResumeId,
        moveSectionUp, moveSectionDown,
    } = useResumeStore();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [showReorder, setShowReorder] = useState(false);

    // Load existing resume if editing
    useEffect(() => {
        if (id && user) {
            loadResume(id);
        }
    }, [id]);

    async function loadResume(resumeId) {
        try {
            const data = await getResume(resumeId);
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
            case 6: return <CustomSectionForm />;
            default: return null;
        }
    };

    const sectionLabels = {
        basics: "Basic Info",
        skills: "Skills",
        experience: "Experience",
        projects: "Projects",
        education: "Education",
        customSections: "Custom Sections",
    };

    return (
        <div className="min-h-screen relative">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        Build Your Resume
                    </h1>
                    <p className="mt-2 text-gray-500 text-sm">
                        Fill in your information, pick a template, and download.
                    </p>
                </header>

                {/* Template selector */}
                <div className="mb-6">
                    <TemplateSelector selected={selectedTemplate} onSelect={setTemplate} />
                </div>

                {/* Section reordering toggle */}
                <div className="flex items-center justify-between mb-4">
                    <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
                    <button
                        onClick={() => setShowReorder(!showReorder)}
                        className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
                    >
                        {showReorder ? "Hide" : "Reorder Sections"}
                    </button>
                </div>

                {/* Section reorder panel */}
                {showReorder && (
                    <Card className="p-4 mb-4">
                        <p className="text-xs text-gray-500 mb-3">Drag sections to change their order in the final resume:</p>
                        <div className="space-y-1">
                            {sectionOrder.map((section, i) => (
                                <div key={section} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                                    <span className="text-sm text-gray-300">{sectionLabels[section] || section}</span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => moveSectionUp(i)}
                                            disabled={i === 0}
                                            className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveSectionDown(i)}
                                            disabled={i === sectionOrder.length - 1}
                                            className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <Card className="p-6 sm:p-8">
                        {renderStep()}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
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
                    </Card>

                    {/* Right: Live Preview */}
                    <div className="hidden lg:block">
                        <Card className="h-[calc(100vh-200px)] sticky top-24 overflow-hidden">
                            <ResumePreview />
                        </Card>
                    </div>
                </div>

                {/* Mobile preview */}
                <div className="lg:hidden mt-6">
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors text-center list-none">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                Toggle Preview
                            </span>
                        </summary>
                        <div className="mt-4">
                            <Card className="overflow-hidden" style={{ height: "500px" }}>
                                <ResumePreview />
                            </Card>
                        </div>
                    </details>
                </div>

                {/* AI Chat toggle */}
                {user && (
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-40"
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
