import ModernMinimal from "./ModernMinimal";
import ProfessionalCorporate from "./ProfessionalCorporate";
import DeveloperPortfolio from "./DeveloperPortfolio";
import CreativeDesigner from "./CreativeDesigner";
import ExecutiveProfessional from "./ExecutiveProfessional";
import ATSFriendly from "./ATSFriendly";

export const templates = [
    {
        id: "modern-minimal",
        name: "Modern Minimal",
        description: "Clean single-column layout with subtle accents",
        component: ModernMinimal,
        color: "from-gray-500 to-gray-600",
        preview: "bg-white",
    },
    {
        id: "professional-corporate",
        name: "Professional Corporate",
        description: "Two-column layout with dark header",
        component: ProfessionalCorporate,
        color: "from-slate-600 to-slate-800",
        preview: "bg-slate-100",
    },
    {
        id: "developer-portfolio",
        name: "Developer Portfolio",
        description: "Terminal-inspired dark theme for developers",
        component: DeveloperPortfolio,
        color: "from-emerald-500 to-green-600",
        preview: "bg-gray-900",
    },
    {
        id: "creative-designer",
        name: "Creative Designer",
        description: "Bold gradient header with creative layout",
        component: CreativeDesigner,
        color: "from-violet-500 to-pink-500",
        preview: "bg-violet-50",
    },
    {
        id: "executive-professional",
        name: "Executive Professional",
        description: "Traditional serif layout for senior roles",
        component: ExecutiveProfessional,
        color: "from-amber-600 to-amber-800",
        preview: "bg-white",
    },
    {
        id: "ats-friendly",
        name: "ATS Friendly",
        description: "Plain, parser-optimized layout for applicant tracking systems",
        component: ATSFriendly,
        color: "from-gray-600 to-gray-700",
        preview: "bg-white",
    },
];

export function getTemplateById(id) {
    return templates.find((t) => t.id === id) || templates[0];
}
