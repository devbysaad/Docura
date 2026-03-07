import { useState, useRef, useEffect } from "react";
import { chatWithAi } from "../api/ai";
import { Button } from "./ui/Button";
import { MessageSquare, Send, X, Sparkles, Bot, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AiChatPanel({ resumeData, isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your Docura AI assistant. I can help improve your resume, suggest skills, rewrite sections, and more. What would you like help with?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEnd = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const data = await chatWithAi(input, resumeData, history);
            setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        } catch (err) {
            toast.error(err.message);
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden" style={{ height: "500px" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gray-900/90">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">AI Assistant</h4>
                        <p className="text-xs text-gray-500">Resume helper</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bot className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-purple-500/20 text-gray-200"
                                : "bg-white/5 text-gray-300"
                            }`}>
                            {msg.content}
                        </div>
                        {msg.role === "user" && (
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div className="bg-white/5 rounded-xl px-3 py-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for resume help..."
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        disabled={loading}
                    />
                    <Button size="icon" variant="primary" onClick={handleSend} disabled={loading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
