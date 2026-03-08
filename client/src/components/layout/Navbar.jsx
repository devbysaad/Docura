import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
    FileText, LayoutDashboard, Wand2, Search,
    Wrench, LogOut, Menu, X, CreditCard, ChevronDown
} from "lucide-react";

const navLinks = [
    { path: "/builder", label: "Builder", icon: FileText },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/ai-generator", label: "AI Generate", icon: Wand2 },
    { path: "/resume-review", label: "Review", icon: Search },
    { path: "/pdf-tools", label: "PDF Tools", icon: Wrench },
];

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setUserMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Docu<span className="text-violet-400">ra</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === path
                                        ? "text-white bg-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                                >
                                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:block text-sm text-gray-300">{user.name}</span>
                                    <Badge variant={user.plan === "pro" ? "pro" : "default"} className="hidden sm:inline-flex">
                                        {user.plan?.toUpperCase()}
                                    </Badge>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 py-1 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-sm font-medium text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link to="/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                                <CreditCard className="w-4 h-4" /> Pricing
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === path
                                        ? "text-white bg-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
