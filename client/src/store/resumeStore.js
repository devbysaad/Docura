import { create } from "zustand";

const defaultResumeData = {
    basics: { fullName: "", profession: "", email: "", phone: "", location: "", portfolioUrl: "", summary: "" },
    skills: [],
    experience: [],
    projects: [],
    education: [],
    customSections: [],
};

const defaultSectionOrder = ["basics", "skills", "experience", "projects", "education", "customSections"];

const useResumeStore = create((set, get) => ({
    resumeData: { ...defaultResumeData },
    currentStep: 1,
    totalSteps: 6,
    selectedTemplate: "modern-minimal",
    currentResumeId: null,
    isDraft: true,
    sectionOrder: [...defaultSectionOrder],

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

    setCustomSections: (customSections) =>
        set((s) => ({ resumeData: { ...s.resumeData, customSections } })),

    addCustomSection: (section) =>
        set((s) => ({
            resumeData: {
                ...s.resumeData,
                customSections: [...(s.resumeData.customSections || []), section],
            },
        })),

    removeCustomSection: (index) =>
        set((s) => ({
            resumeData: {
                ...s.resumeData,
                customSections: s.resumeData.customSections.filter((_, i) => i !== index),
            },
        })),

    updateCustomSection: (index, updated) =>
        set((s) => ({
            resumeData: {
                ...s.resumeData,
                customSections: s.resumeData.customSections.map((sec, i) => (i === index ? updated : sec)),
            },
        })),

    setResumeData: (data) =>
        set({ resumeData: { ...defaultResumeData, ...data } }),

    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
    prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

    setTemplate: (templateId) => set({ selectedTemplate: templateId }),

    setCurrentResumeId: (id) => set({ currentResumeId: id }),

    setSectionOrder: (order) => set({ sectionOrder: order }),

    moveSectionUp: (index) =>
        set((s) => {
            if (index <= 0) return s;
            const order = [...s.sectionOrder];
            [order[index - 1], order[index]] = [order[index], order[index - 1]];
            return { sectionOrder: order };
        }),

    moveSectionDown: (index) =>
        set((s) => {
            if (index >= s.sectionOrder.length - 1) return s;
            const order = [...s.sectionOrder];
            [order[index], order[index + 1]] = [order[index + 1], order[index]];
            return { sectionOrder: order };
        }),

    resetResume: () =>
        set({
            resumeData: { ...defaultResumeData },
            currentStep: 1,
            selectedTemplate: "modern-minimal",
            currentResumeId: null,
            isDraft: true,
            sectionOrder: [...defaultSectionOrder],
        }),
}));

export default useResumeStore;
