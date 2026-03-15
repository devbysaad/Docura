import useResumeStore from "../store/resumeStore";
import { getTemplateById } from "../templates";

export default function ResumePreview() {
    const { resumeData, selectedTemplate } = useResumeStore();
    const template = getTemplateById(selectedTemplate);
    const TemplateComponent = template.component;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">Live Preview</h3>
                <span className="text-xs text-gray-500">{template.name}</span>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div
                    className="bg-white shadow-lg mx-auto"
                    style={{
                        width: "210mm",
                        minHeight: "297mm",
                        transform: "scale(0.6)",
                        transformOrigin: "top center",
                    }}
                >
                    <TemplateComponent data={resumeData} />
                </div>
            </div>
        </div>
    );
}
