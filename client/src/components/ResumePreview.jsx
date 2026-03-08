import { getTemplateById } from "../templates";

export default function ResumePreview({ data, templateId = "modern-minimal" }) {
    const template = getTemplateById(templateId);
    const TemplateComponent = template.component;

    return (
        <div className="sticky top-24">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400">Live Preview</h3>
                <span className="text-xs text-gray-600">{template.name}</span>
            </div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/5">
                <div className="overflow-y-auto max-h-[75vh] rounded-2xl" style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "153.8%", height: "153.8%" }}>
                    <TemplateComponent data={data} />
                </div>
            </div>
        </div>
    );
}
