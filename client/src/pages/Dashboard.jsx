import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { listResumes, duplicateResume, deleteResume as deleteResumeApi, togglePublicLink, getUsageStats, getAiHistory } from "../api/dashboard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
    FileText, Plus, Edit, Trash2, Copy, Link as LinkIcon,
    Download, BarChart3, History, ExternalLink, Check
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [stats, setStats] = useState(null);
    const [aiHistory, setAiHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedSlug, setCopiedSlug] = useState(null);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        try {
            const [r, s, h] = await Promise.all([
                listResumes(),
                getUsageStats(),
                getAiHistory(),
            ]);
            setResumes(r);
            setStats(s);
            setAiHistory(h);
        } catch (err) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    async function handleDuplicate(id) {
        try {
            await duplicateResume(id);
            toast.success("Resume duplicated!");
            loadAll();
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this resume?")) return;
        try {
            await deleteResumeApi(id);
            toast.success("Resume deleted");
            loadAll();
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleTogglePublic(id) {
        try {
            const data = await togglePublicLink(id);
            toast.success(data.publicSlug ? "Public link enabled" : "Public link disabled");
            loadAll();
        } catch (err) {
            toast.error(err.message);
        }
    }

    function copyPublicLink(slug) {
        const url = `${window.location.origin}/r/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedSlug(slug);
        toast.success("Link copied!");
        setTimeout(() => setCopiedSlug(null), 2000);
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}.</p>
                </div>
                <Link to="/builder">
                    <Button variant="primary">
                        <Plus className="w-4 h-4" /> New Resume
                    </Button>
                </Link>
            </div>

            {/* Usage Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <p className="text-xs text-gray-500 mb-1">Resumes</p>
                        <p className="text-2xl font-bold text-white">{stats.resumeCount}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs text-gray-500 mb-1">Downloads</p>
                        <p className="text-2xl font-bold text-white">{stats.totalDownloads}</p>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 mb-1">AI Generations</p>
                            <Badge variant={stats.plan === "pro" ? "pro" : "default"}>
                                {stats.plan?.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.aiGenerations}</p>
                        {stats.limits.ai !== "unlimited" && (
                            <div className="mt-2">
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (stats.aiGenerations / stats.limits.ai) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{stats.aiGenerations} / {stats.limits.ai} used</p>
                            </div>
                        )}
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs text-gray-500 mb-1">Plan Downloads</p>
                        <p className="text-2xl font-bold text-white">{stats.downloads}</p>
                        {stats.limits.downloads !== "unlimited" && (
                            <div className="mt-2">
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (stats.downloads / stats.limits.downloads) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{stats.downloads} / {stats.limits.downloads} used</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Resumes Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" /> Your Resumes
                </h2>

                {resumes.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No resumes yet. Create your first one!</p>
                        <Link to="/builder">
                            <Button variant="primary">
                                <Plus className="w-4 h-4" /> Create Resume
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resumes.map((resume) => (
                            <Card key={resume.id} className="p-5 hover:border-accent/20 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white truncate">{resume.title}</h3>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            {new Date(resume.updatedAt).toLocaleDateString()} · v{resume.version}
                                        </p>
                                    </div>
                                    {resume.isDraft && <Badge variant="warning">Draft</Badge>}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                                    <span className="capitalize">{resume.templateId?.replace(/-/g, " ")}</span>
                                    {resume.downloadCount > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Download className="w-3 h-3" /> {resume.downloadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Button size="sm" variant="primary" onClick={() => navigate(`/builder/${resume.id}`)}>
                                        <Edit className="w-3 h-3" /> Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDuplicate(resume.id)} title="Duplicate">
                                        <Copy className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleTogglePublic(resume.id)} title="Toggle public link">
                                        <LinkIcon className="w-3.5 h-3.5" />
                                    </Button>
                                    {resume.publicSlug && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyPublicLink(resume.publicSlug)}
                                            title="Copy public link"
                                        >
                                            {copiedSlug === resume.publicSlug ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            )}
                                        </Button>
                                    )}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(resume.id)} title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* AI History */}
            {aiHistory.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-accent" /> AI History
                    </h2>
                    <Card className="overflow-hidden">
                        <div className="divide-y divide-white/[0.06]">
                            {aiHistory.slice(0, 10).map((item) => (
                                <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <Badge variant="primary">{item.type}</Badge>
                                        <p className="text-sm text-gray-400 truncate">{item.prompt}</p>
                                    </div>
                                    <span className="text-xs text-gray-600 flex-shrink-0 ml-4">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
