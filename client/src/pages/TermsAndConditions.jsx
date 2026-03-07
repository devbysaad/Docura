import { Card } from "../components/ui/Card";
import { Shield, FileText } from "lucide-react";

const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing and using Docura (the \"Service\"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, you must not use the Service. These Terms apply to all visitors, users, and others who access or use the Service." },
    { title: "2. Description of Service", content: "Docura is an AI-powered document and resume platform that provides resume building tools, AI-generated content, document conversion utilities, template management, and related services. The Service is provided on an \"as is\" and \"as available\" basis." },
    { title: "3. User Accounts", content: "To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password." },
    { title: "4. User Content", content: "You retain all rights to any content you submit, post, or display on or through the Service (\"User Content\"). By submitting User Content, you grant Docura a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content solely for the purpose of providing the Service. You represent and warrant that you own or have the necessary rights to all content you submit." },
    { title: "5. Acceptable Use", content: "You agree not to use the Service to: (a) violate any applicable laws or regulations; (b) upload or distribute viruses, malware, or other malicious code; (c) interfere with or disrupt the Service or servers; (d) attempt to gain unauthorized access to other users' accounts; (e) harass, abuse, or harm other users; (f) use automated means to access the Service without permission; (g) generate content that is misleading, defamatory, or fraudulent." },
    { title: "6. AI-Generated Content", content: "The Service uses artificial intelligence to generate resume content, suggestions, and analyses. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. You are solely responsible for reviewing and verifying all AI-generated content before use. Docura does not guarantee the accuracy, completeness, or suitability of AI-generated content for any particular purpose." },
    { title: "7. Subscription Plans and Payments", content: "Docura offers both free and paid subscription plans. Free plans include limited access to AI features and downloads. Paid plans provide unlimited access. Subscription fees are billed in advance on a monthly basis. You may cancel your subscription at any time. Refunds are provided in accordance with our Refund Policy." },
    { title: "8. Free Plan Limitations", content: "The free plan includes: (a) 5 AI generations per month; (b) 2 resume downloads per month; (c) access to basic templates and tools. These limits reset on a monthly basis. We reserve the right to modify free plan limitations at any time with reasonable notice." },
    { title: "9. Intellectual Property", content: "The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Docura and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent." },
    { title: "10. Privacy and Data Protection", content: "Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as detailed in the Privacy Policy. We are committed to protecting your personal information and resume data." },
    { title: "11. Document Processing", content: "When you use our PDF tools and document processing features, your documents may be temporarily stored on our servers for processing purposes. Documents are deleted after processing is complete. We do not retain or analyze the content of processed documents beyond what is necessary to provide the Service." },
    { title: "12. Third-Party Services", content: "The Service may contain links to or integrate with third-party websites or services, including but not limited to Google's Gemini AI API. We are not responsible for the content, privacy policies, or practices of any third-party websites or services." },
    { title: "13. Disclaimer of Warranties", content: "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. DOCURA DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT GUARANTEE THAT RESUMES CREATED WILL RESULT IN EMPLOYMENT OR PASS ALL ATS SYSTEMS." },
    { title: "14. Limitation of Liability", content: "IN NO EVENT SHALL DOCURA, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY." },
    { title: "15. Indemnification", content: "You agree to indemnify and hold harmless Docura and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising from your use of the Service or violation of these Terms." },
    { title: "16. Termination", content: "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms. Upon termination, your right to use the Service will immediately cease." },
    { title: "17. Modifications to Terms", content: "We reserve the right to modify or replace these Terms at any time. Material changes will be notified at least 30 days before taking effect. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms." },
    { title: "18. Governing Law", content: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Docura operates, without regard to its conflict of law provisions." },
    { title: "19. Dispute Resolution", content: "Any disputes arising from these Terms or the Service shall first be attempted to be resolved through informal negotiation. If informal negotiation fails, disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules." },
    { title: "20. Contact Information", content: "If you have any questions about these Terms and Conditions, please contact us at support@docura.app." },
];

export default function TermsAndConditions() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 relative">
            <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-[140px] pointer-events-none" />

            <div className="text-center mb-12 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
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
