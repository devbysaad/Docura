import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Send, Mail, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 relative">


            <div className="text-center mb-12 relative z-10">
                <h1 className="text-3xl font-bold text-white">Contact Us</h1>
                <p className="text-gray-400 text-sm mt-2">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
                {[
                    { icon: Mail, label: "Email", value: "support@docura.app" },
                    { icon: MapPin, label: "Location", value: "Worldwide (Remote)" },
                    { icon: Clock, label: "Response Time", value: "Within 24 hours" },
                ].map((item) => (
                    <Card key={item.label} className="p-5 text-center">
                        <item.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm text-white font-medium mt-0.5">{item.value}</p>
                    </Card>
                ))}
            </div>

            <Card className="p-8 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input placeholder="Your name" value={form.name} onChange={update("name")} required />
                        <Input type="email" placeholder="Your email" value={form.email} onChange={update("email")} required />
                    </div>
                    <Input placeholder="Subject" value={form.subject} onChange={update("subject")} required />
                    <Textarea rows={5} placeholder="Your message..." value={form.message} onChange={update("message")} required />
                    <Button type="submit" variant="primary" className="w-full">
                        <Send className="w-4 h-4" /> Send Message
                    </Button>
                </form>
            </Card>
        </div>
    );
}
