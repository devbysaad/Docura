import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicResume } from "../api/dashboard";
import { getTemplateById } from "../templates";

export default function PublicResume() {
    const { slug } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getPublicResume(slug);
                setResume(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full" />
            </div>
        );
    }

    if (error || !resume) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Resume Not Found</h1>
                    <p className="text-gray-500">{error || "This resume link is invalid or has been disabled."}</p>
                </div>
            </div>
        );
    }

    const template = getTemplateById(resume.templateId);
    const TemplateComponent = template.component;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-[850px] mx-auto">
                <div className="mb-4 text-center">
                    <p className="text-xs text-gray-500">
                        Shared via <span className="font-semibold text-gray-700">Docura</span>
                    </p>
                </div>
                <div className="bg-white shadow-xl mx-auto">
                    <TemplateComponent data={resume.data} />
                </div>
            </div>
        </div>
    );
}
