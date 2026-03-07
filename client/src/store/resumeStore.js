import { create } from "zustand";

const defaultResumeData = {
    basics: { fullName: "", profession: "", email: "", phone: "", location: "", summary: "" },
    skills: [],
    experience: [],
    projects: [],
    education: [],
};

const useResumeStore = create((set, get) => ({
    resumeData: { ...defaultResumeData },
    currentStep: 1,
    totalSteps: 5,
    selectedTemplate: "modern-minimal",
    currentResumeId: null,
    isDraft: true,

    setBasics: (basics) =>
        set((s) => ({ resumeData: { ...s.resumeData, basics } })),

    setSkills: (skills) =>
        set((s) => ({ resumeData: { ...s.resumeData, skills } })),

    setExperience: (experience) =>
        set((s) => ({ resumeData: { ...s.resumeData, experience } })),

    setProjects: (projects) =>
        set((s) => ({ resumeData: { ...s.resumeData, projects } })),

    setEducation: (education) =>
        set((s) => ({ resumeData: { ...s.resumeData, education } })),

    setResumeData: (data) =>
        set({ resumeData: { ...defaultResumeData, ...data } }),

    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
    prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

    setTemplate: (templateId) => set({ selectedTemplate: templateId }),

    setCurrentResumeId: (id) => set({ currentResumeId: id }),

    resetResume: () =>
        set({
            resumeData: { ...defaultResumeData },
            currentStep: 1,
            selectedTemplate: "modern-minimal",
            currentResumeId: null,
            isDraft: true,
        }),
}));

export default useResumeStore;
