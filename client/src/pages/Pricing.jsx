import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        desc: "Perfect for getting started",
        icon: Zap,
        color: "bg-gray-600",
        features: [
            { text: "5 AI generations / month", included: true },
            { text: "2 resume downloads / month", included: true },
            { text: "4 resume templates", included: true },
            { text: "Basic PDF tools", included: true },
            { text: "Resume builder", included: true },
            { text: "Unlimited AI generations", included: false },
            { text: "Unlimited downloads", included: false },
            { text: "Priority support", included: false },
        ],
        cta: "Get Started Free",
        ctaVariant: "outline",
    },
    {
        name: "Pro",
        price: "$9",
        period: "/ month",
        desc: "For serious job seekers",
        icon: Crown,
        color: "bg-accent",
        popular: true,
        features: [
            { text: "Unlimited AI generations", included: true },
            { text: "Unlimited downloads", included: true },
            { text: "All resume templates", included: true },
            { text: "All PDF tools", included: true },
            { text: "Resume builder", included: true },
            { text: "AI Chat Assistant", included: true },
            { text: "Resume Review & Score", included: true },
            { text: "Priority support", included: true },
        ],
        cta: "Upgrade to Pro",
        ctaVariant: "primary",
    },
];

export default function Pricing() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 relative">


            <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> Simple Pricing
                </div>
                <h1 className="text-4xl font-bold text-white">
                    Choose Your <span className="text-accent">Plan</span>
                </h1>
                <p className="text-gray-400 mt-3 max-w-lg mx-auto">Start free, upgrade when you need more power.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto relative z-10">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        glow={plan.popular}
                        className={`p-8 relative ${plan.popular ? "border-accent/30 ring-1 ring-accent/20" : ""}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge variant="pro" className="px-3 py-1">Most Popular</Badge>
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center mb-6`}>
                            <plan.icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>

                        <div className="mt-6 mb-8">
                            <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                            <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-sm">
                                    {f.included ? (
                                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                    )}
                                    <span className={f.included ? "text-gray-300" : "text-gray-600"}>{f.text}</span>
                                </li>
                            ))}
                        </ul>

                        <Link to="/register">
                            <Button variant={plan.ctaVariant} className="w-full">
                                {plan.cta}
                            </Button>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
