import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listResumes, deleteResume, getUsageStats, getAiHistory } from "../api/dashboard";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
    Plus, FileText, Trash2, Edit, Clock, Wand2,
    Download, BarChart3, Sparkles, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [stats, setStats] = useState(null);
    const [aiHistory, setAiHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [r, s, h] = await Promise.all([listResumes(), getUsageStats(), getAiHistory()]);
            setResumes(r);
            setStats(s);
            setAiHistory(h);
        } catch (err) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this resume?")) return;
        try {
            await deleteResume(id);
            setResumes((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resume deleted");
        } catch (err) {
            toast.error(err.message);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
            <div className="absolute top-[-15%] left-[-8%] w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-[140px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user?.name}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your resumes and AI tools</p>
                </div>
                <Link to="/builder">
                    <Button variant="primary">
                        <Plus className="w-4 h-4" /> New Resume
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 relative z-10">
                    {[
                        { icon: FileText, label: "Resumes", value: stats.resumeCount, color: "text-purple-400" },
                        { icon: Wand2, label: "AI Used", value: `${stats.aiGenerations}/${stats.limits.ai === "unlimited" ? "∞" : stats.limits.ai}`, color: "text-blue-400" },
                        { icon: Download, label: "Downloads", value: `${stats.downloads}/${stats.limits.downloads === "unlimited" ? "∞" : stats.limits.downloads}`, color: "text-emerald-400" },
                        { icon: BarChart3, label: "Plan", value: stats.plan?.toUpperCase(), color: "text-amber-400" },
                    ].map((s) => (
                        <Card key={s.label} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`${s.color}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white">{s.value}</p>
                                    <p className="text-xs text-gray-500">{s.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Resumes */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-400" /> Your Resumes
                    </h2>

                    {resumes.length === 0 ? (
                        <Card className="p-10 text-center">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No resumes yet</h3>
                            <p className="text-sm text-gray-500 mb-6">Create your first resume in minutes</p>
                            <Link to="/builder">
                                <Button variant="primary">
                                    <Plus className="w-4 h-4" /> Create Resume
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {resumes.map((r) => (
                                <Card key={r.id} className="p-4 flex items-center justify-between group hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-white truncate">{r.title}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant={r.isDraft ? "warning" : "success"}>
                                                    {r.isDraft ? "Draft" : "Ready"}
                                                </Badge>
                                                <span className="text-xs text-gray-600">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {new Date(r.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" variant="ghost" onClick={() => navigate(`/builder/${r.id}`)}>
                                            <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* AI History */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" /> AI History
                    </h2>

                    {aiHistory.length === 0 ? (
                        <Card className="p-6 text-center">
                            <Wand2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No AI activity yet</p>
                            <Link to="/ai-generator" className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block">
                                Try AI Generator <ArrowRight className="w-3 h-3 inline" />
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {aiHistory.slice(0, 10).map((h) => (
                                <Card key={h.id} className="p-3">
                                    <div className="flex items-start gap-2">
                                        <Badge variant={h.type === "generate" ? "primary" : h.type === "chat" ? "success" : "warning"} className="flex-shrink-0 mt-0.5">
                                            {h.type}
                                        </Badge>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-400 truncate">{h.prompt}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                {new Date(h.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
