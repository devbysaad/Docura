import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthGuard from "./components/layout/AuthGuard";
import AiChatPanel from "./components/AiChatPanel";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import AiGenerator from "./pages/AiGenerator";
import ResumeReview from "./pages/ResumeReview";
import TemplateFromImage from "./pages/TemplateFromImage";
import PdfTools from "./pages/PdfTools";
import Pricing from "./pages/Pricing";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import CoverLetter from "./pages/CoverLetter";
import PublicResume from "./pages/PublicResume";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-950 flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/builder" element={<ResumeBuilder />} />
                        <Route path="/builder/:id" element={<ResumeBuilder />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/terms" element={<TermsAndConditions />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/pdf-tools" element={<PdfTools />} />
                        <Route path="/r/:slug" element={<PublicResume />} />

                        {/* Protected routes */}
                        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                        <Route path="/ai-generator" element={<AuthGuard><AiGenerator /></AuthGuard>} />
                        <Route path="/resume-review" element={<AuthGuard><ResumeReview /></AuthGuard>} />
                        <Route path="/template-from-image" element={<AuthGuard><TemplateFromImage /></AuthGuard>} />
                        <Route path="/cover-letter" element={<AuthGuard><CoverLetter /></AuthGuard>} />
                    </Routes>
                </main>
                <Footer />
                <AiChatPanel />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "rgba(17, 17, 27, 0.95)",
                            color: "#e5e7eb",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                        },
                    }}
                />
            </div>
        </BrowserRouter>
    );
}

export default App;
