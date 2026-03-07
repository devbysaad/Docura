import { Card } from "../components/ui/Card";
import { Lock } from "lucide-react";

const sections = [
    { title: "1. Introduction", content: "Docura (\"we\", \"our\", or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered resume platform (\"Service\"). Please read this policy carefully." },
    { title: "2. Information We Collect", content: "We collect information you provide directly: name, email address, password (hashed), resume data (personal details, work experience, skills, education, projects), uploaded documents (PDFs, images), and AI interaction history (prompts and responses)." },
    { title: "3. Automatically Collected Information", content: "When you access the Service, we automatically collect: IP address, browser type and version, operating system, referring URLs, pages visited, time and date of visits, time spent on pages, and device identifiers." },
    { title: "4. How We Use Your Information", content: "We use collected information to: provide and maintain the Service, process your resume data and generate documents, power AI features (content generation, chat, review), manage your account and subscription, communicate with you about the Service, analyze and improve our Service, and enforce our Terms." },
    { title: "5. Resume Data Processing", content: "Your resume data is processed to provide core Service functionality. Resume content is stored in our database and associated with your account. When you use AI features, relevant resume data may be sent to our AI provider (Google Gemini) for processing. AI-generated content is stored in your AI history." },
    { title: "6. Document Processing", content: "When you upload documents for PDF tools (merge, split, convert, review), these files are temporarily stored on our servers during processing. Documents are automatically deleted after processing is complete, typically within 1 hour. We do not retain copies of processed documents." },
    { title: "7. AI Data Processing", content: "Our AI features are powered by Google's Gemini API. When you use AI features, your prompts and relevant resume data are sent to Google for processing. Google's data handling is governed by their own privacy policies. We store AI interaction history (prompts and responses) in your account for your reference." },
    { title: "8. Data Storage and Security", content: "Your data is stored in secure PostgreSQL databases. Passwords are hashed using bcrypt with 12 rounds of salting. Authentication uses JSON Web Tokens (JWT) with 7-day expiration. All data transmission uses HTTPS encryption. We implement industry-standard security measures to protect your data." },
    { title: "9. Data Sharing", content: "We do not sell your personal information. We may share data with: AI service providers (Google Gemini) for feature functionality, service providers who assist in operating our Service, law enforcement when required by law, and business partners in the event of a merger or acquisition." },
    { title: "10. Cookies and Tracking", content: "We use localStorage to store authentication tokens and user preferences. We do not use third-party tracking cookies. Session data is stored locally in your browser and is not transmitted to third parties for advertising purposes." },
    { title: "11. Data Retention", content: "We retain your account data as long as your account is active. Resume data is retained until you delete it or your account. AI history is retained for up to 12 months. Uploaded documents for processing are deleted within 1 hour of processing. You can request deletion of your data at any time." },
    { title: "12. Your Rights", content: "You have the right to: access your personal data, correct inaccurate data, delete your account and associated data, export your resume data, object to processing of your data, restrict processing of your data, and withdraw consent at any time." },
    { title: "13. Data Portability", content: "You can export your resume data at any time through the dashboard. Resume data can be downloaded as PDF or DOCX format. AI history is accessible through your account dashboard." },
    { title: "14. Children's Privacy", content: "The Service is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If we discover that we have collected data from a child under 16, we will promptly delete it." },
    { title: "15. International Data Transfers", content: "Your data may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfers. We ensure that appropriate safeguards are in place to protect your data during international transfers." },
    { title: "16. Third-Party Links", content: "The Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit." },
    { title: "17. Data Breach Notification", content: "In the event of a data breach that affects your personal information, we will notify affected users within 72 hours of discovering the breach. Notification will be provided via email and/or through the Service." },
    { title: "18. Changes to Privacy Policy", content: "We may update this Privacy Policy from time to time. Material changes will be communicated via email or through a prominent notice on the Service at least 30 days before they take effect." },
    { title: "19. GDPR Compliance", content: "For users in the European Economic Area (EEA), we process data in compliance with GDPR. The legal basis for processing includes: consent, contract performance, legitimate interests, and legal obligations. You may contact our Data Protection Officer for any GDPR-related inquiries." },
    { title: "20. Contact Us", content: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@docura.app. Our Data Protection Officer can be reached at dpo@docura.app." },
];

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 relative">
            <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-12 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                    <Lock className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-gray-500 text-sm mt-2">Last updated: March 2026</p>
            </div>

            <div className="space-y-6 relative z-10">
                {sections.map((s, i) => (
                    <Card key={i} className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">{s.content}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
