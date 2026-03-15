import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            toast.success("Account created! Welcome to Docura.");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">


            <Card className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Start building professional resumes</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                        <Input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                        <Input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            minLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                        Sign in
                    </Link>
                </p>

                <p className="text-center text-xs text-gray-600 mt-4">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" className="text-gray-500 hover:text-accent underline">Terms</Link> and{" "}
                    <Link to="/privacy" className="text-gray-500 hover:text-accent underline">Privacy Policy</Link>.
                </p>
            </Card>
        </div>
    );
}
