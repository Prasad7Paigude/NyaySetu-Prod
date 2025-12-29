"use client";

import React, { useState, useEffect } from "react";
import { IconFileText, IconAlertCircle, IconSquareRoundedX, IconArrowLeft } from "@tabler/icons-react";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import DashNavbar from "@/components/navbar/DashNavbar";
import FooterComponent from "@/components/footer/FooterComponent";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface AffidavitData {
    name: string;
    father_name: string;
    mother_name: string;
    spouse_name: string;
    dob: string;
    address: string;
    residence_from: string;
    place: string;
    date: string;
}

interface RTIData {
    applicant_name: string;
    guardian_name: string;
    address: string;
    phone: string;
    mobile: string;
    fee_amount: string;
    payment_mode: string;
    payment_date: string;
    favoring: string;
    photocopy_amount: string;
    num_pages: string;
    cd_amount: string;
    bpl_status: string;
    bpl_certificate: string;
    date: string;
}

export default function DraftGenerationPage() {
    const documentTypes = [
        "Right to Information (RTI)",
        "Affidavit"
    ];

    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Affidavit form state
    const [formData, setFormData] = useState<AffidavitData>({
        name: '',
        father_name: '',
        mother_name: '',
        spouse_name: '',
        dob: '',
        address: '',
        residence_from: '',
        place: '',
        date: new Date().toLocaleDateString('en-IN'),
    });

    // RTI form state
    const [rtiData, setRtiData] = useState<RTIData>({
        applicant_name: '',
        guardian_name: '',
        address: '',
        phone: '',
        mobile: '',
        fee_amount: '',
        payment_mode: '',
        payment_date: new Date().toLocaleDateString('en-IN'),
        favoring: '',
        photocopy_amount: '',
        num_pages: '',
        cd_amount: '',
        bpl_status: 'No',
        bpl_certificate: '',
        date: new Date().toLocaleDateString('en-IN'),
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const loadingStates = [
        { text: "Select Document Type" },
        { text: "Upload Information" },
        { text: "Tap Submit Button" },
        { text: "Wait for AI to process" },
        { text: "AI has processed your document" },
        { text: "Download or get on Email" },
    ];

    const handleDocumentSelect = (type: string) => {
        if (type === "Affidavit" || type === "Right to Information (RTI)") {
            setSelectedDocument(type);
        } else {
            // For other document types, show coming soon or handle differently
            alert("This document type is coming soon!");
        }
    };

    const handleBackToSelection = () => {
        setSelectedDocument(null);
        setError(null);
        setSuccessMessage(null);
        setFormData({
            name: '',
            father_name: '',
            mother_name: '',
            spouse_name: '',
            dob: '',
            address: '',
            residence_from: '',
            place: '',
            date: new Date().toLocaleDateString('en-IN'),
        });
        setRtiData({
            applicant_name: '',
            guardian_name: '',
            address: '',
            phone: '',
            mobile: '',
            fee_amount: '',
            payment_mode: '',
            payment_date: new Date().toLocaleDateString('en-IN'),
            favoring: '',
            photocopy_amount: '',
            num_pages: '',
            cd_amount: '',
            bpl_status: 'No',
            bpl_certificate: '',
            date: new Date().toLocaleDateString('en-IN'),
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRTIInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRtiData(prev => ({ ...prev, [name]: value }));
    };

    const handleAffidavitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/generate-affidavit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to generate PDF' }));
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `NyaySetu_Affidavit_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Show success message
            setSuccessMessage('🎉 Affidavit generated successfully! Check your downloads.');

            // Reset form after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);

        } catch (err) {
            console.error('Error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRTISubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/generate-rti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rtiData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to generate RTI PDF' }));
                throw new Error(errorData.error || 'Failed to generate RTI PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `NyaySetu_RTI_Application_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Show success message
            setSuccessMessage('🎉 RTI Application generated successfully! Check your downloads.');

            // Reset form after 5 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);

        } catch (err) {
            console.error('Error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    // Show loading state while checking auth
    if (isPending) {
        return (
            <div className="min-h-screen w-full bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show login prompt
    if (!session) {
        return (
            <div className="min-h-screen w-full bg-background flex flex-col">
                <NavbarComponent />

                <div className="flex-1 flex flex-col items-center justify-center p-4 pt-32 pb-20">
                    <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-6">

                        <div className="bg-muted p-4 rounded-2xl shadow-sm">
                            <IconFileText className="w-8 h-8 text-primary" stroke={2} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Draft Generator
                        </h1>

                        <div className="space-y-2">
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mx-auto">
                                Generate professional legal documents automatically with AI assistance.
                                Select a document type to get started.
                            </p>
                            <p className="text-red-500 font-medium text-sm flex items-center justify-center gap-2">
                                <IconAlertCircle className="w-4 h-4" />
                                This is a demo version. Generated documents should be reviewed by a legal professional.
                            </p>
                        </div>

                        {/* Login Required Card */}
                        <div className="w-full bg-card rounded-2xl shadow-2xl overflow-hidden border border-border mt-8">
                            <div className="bg-primary/5 dark:bg-primary/10 p-4 border-b border-border flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                <div className="ml-4 text-xs text-muted-foreground font-mono">Authentication Required</div>
                            </div>

                            <div className="p-8 md:p-12 text-center space-y-6">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                                    <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                        🔒 Login Required
                                    </p>
                                    <p className="text-yellow-700 dark:text-yellow-300">
                                        Please log in or sign up to use the Legal Draft Generator feature.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/login">
                                        <Button className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-xl">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="px-8 py-6 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg rounded-xl">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <FooterComponent />
            </div>
        );
    }

    // Authenticated user - show full functionality
    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            <DashNavbar />

            <div className="flex-1 flex flex-col items-center p-4 pt-32 pb-20">
                <AnimatePresence mode="wait">
                    {!selectedDocument ? (
                        // Document Selection View
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-3xl flex flex-col items-center text-center space-y-6"
                        >
                            <div className="bg-muted p-4 rounded-2xl shadow-sm">
                                <IconFileText className="w-8 h-8 text-primary" stroke={2} />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                                Draft Generator
                            </h1>

                            <div className="space-y-2">
                                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mx-auto">
                                    Generate professional legal documents automatically with AI assistance.
                                    Select a document type to get started.
                                </p>
                                <p className="text-red-500 font-medium text-sm flex items-center justify-center gap-2">
                                    <IconAlertCircle className="w-4 h-4" />
                                    This is a demo version. Generated documents should be reviewed by a legal professional.
                                </p>
                            </div>

                            <div className="w-full bg-card rounded-2xl shadow-2xl overflow-hidden border border-border mt-8">
                                <div className="bg-primary/5 dark:bg-primary/10 p-4 border-b border-border flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                    <div className="ml-4 text-xs text-muted-foreground font-mono">Legal Draft Generator</div>
                                </div>

                                <div className="p-8 md:p-12 text-center space-y-8">
                                    <div className="text-left space-y-1">
                                        <h2 className="text-xl font-semibold text-primary/80">Step 1) Select Document Type</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Choose the type of legal document you want to generate
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto">
                                        {documentTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => handleDocumentSelect(type)}
                                                className="w-full py-4 px-6 rounded-xl border border-input bg-background/50 hover:bg-muted/50 text-foreground font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center text-base md:text-lg group hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-8 text-left border-t border-border/50">
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            <span className="font-bold text-primary/80">Disclaimer:</span> The documents generated by this tool are for informational purposes only and do not constitute legal advice. Always consult with a qualified attorney before using any legal document. NyaySetu is not responsible for any consequences arising from the use of generated documents.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* MultiStepLoader Component */}
                            <div className="w-full flex flex-col items-center space-y-4 mt-8">
                                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />

                                <button
                                    onClick={() => setLoading(true)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-accent dark:hover:bg-accent/90 dark:text-accent-foreground font-medium transition-all duration-200 h-12 rounded-xl px-8 flex items-center justify-center shadow-md hover:shadow-lg gap-2 group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h.01" />
                                    </svg>
                                    Need Help? View Step-by-Step Guide
                                </button>

                                {loading && (
                                    <button
                                        className="fixed top-24 right-4 text-foreground hover:text-red-500 z-[120] transition-colors"
                                        onClick={() => setLoading(false)}
                                        title="Close guide"
                                    >
                                        <IconSquareRoundedX className="h-10 w-10" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : selectedDocument === "Affidavit" ? (
                        // Affidavit Form View
                        <motion.div
                            key="affidavit-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-5xl"
                        >
                            {/* Back Button */}
                            <button
                                onClick={handleBackToSelection}
                                className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to Document Selection</span>
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                    Affidavit Generator
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    Generate professional affidavit documents instantly. Fill in your details and download a formatted PDF.
                                </p>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg mb-6 shadow-md"
                                >
                                    <p className="font-medium text-center">{successMessage}</p>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-6 shadow-md"
                                >
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm">{error}</p>
                                </motion.div>
                            )}

                            {/* Form */}
                            <MagicCard
                                className="p-8 md:p-10 rounded-xl"
                                gradientColor={mounted && resolvedTheme === 'dark' ? '#223542' : '#D8E2EB'}
                            >
                                <form onSubmit={handleAffidavitSubmit} className="space-y-8">
                                    {/* Personal Information Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <UserIcon />
                                            Personal Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Father's Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="father_name"
                                                    value={formData.father_name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter father's name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Mother's Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="mother_name"
                                                    value={formData.mother_name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter mother's name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Spouse Name <span className="text-muted-foreground text-xs">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="spouse_name"
                                                    value={formData.spouse_name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter spouse name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Date of Birth <span className="text-muted-foreground text-xs">(DD/MM/YYYY)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="15/08/1990"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <HomeIcon />
                                            Address Details
                                        </h2>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Complete Address <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none resize-none"
                                                    placeholder="Enter your complete address with city and pincode"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                                        Resident Since <span className="text-muted-foreground text-xs">(Year)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="residence_from"
                                                        value={formData.residence_from}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                        placeholder="2020"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                                        Place <span className="text-muted-foreground text-xs">(City)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="place"
                                                        value={formData.place}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                        placeholder="Mumbai"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                                        Date <span className="text-muted-foreground text-xs">(DD/MM/YYYY)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                        placeholder="29/12/2025"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isGenerating}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {isGenerating ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Generating Your Affidavit...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2 text-lg">
                                                    <DocumentIcon />
                                                    Generate Affidavit PDF
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Information Note */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-6">
                                        <div className="flex gap-3">
                                            <InfoIcon />
                                            <div className="flex-1">
                                                <p className="text-sm text-foreground font-semibold mb-2">Important Information</p>
                                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                                    <li>Fields marked with <span className="text-red-500 font-semibold">*</span> are mandatory</li>
                                                    <li>The PDF will be automatically downloaded to your device</li>
                                                    <li>Ensure all information is accurate before generating</li>
                                                    <li>Generated documents are for legal purposes</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </MagicCard>
                        </motion.div>
                    ) : selectedDocument === "Right to Information (RTI)" ? (
                        // RTI Form View
                        <motion.div
                            key="rti-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-5xl"
                        >
                            {/* Back Button */}
                            <button
                                onClick={handleBackToSelection}
                                className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to Document Selection</span>
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                    RTI Application Generator
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    Generate professional Right to Information applications. Fill in your details and download a formatted PDF.
                                </p>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg mb-6 shadow-md"
                                >
                                    <p className="font-medium text-center">{successMessage}</p>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-6 shadow-md"
                                >
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm">{error}</p>
                                </motion.div>
                            )}

                            {/* Form */}
                            <MagicCard
                                className="p-8 md:p-10 rounded-xl"
                                gradientColor={mounted && resolvedTheme === 'dark' ? '#223542' : '#D8E2EB'}
                            >
                                <form onSubmit={handleRTISubmit} className="space-y-8">
                                    {/* Applicant Details Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <UserIcon />
                                            Applicant Details
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Applicant Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="applicant_name"
                                                    value={rtiData.applicant_name}
                                                    onChange={handleRTIInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Father's/Guardian's Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="guardian_name"
                                                    value={rtiData.guardian_name}
                                                    onChange={handleRTIInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Enter guardian's name"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Address <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={rtiData.address}
                                                    onChange={handleRTIInputChange}
                                                    required
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none resize-none"
                                                    placeholder="Enter your complete address"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={rtiData.phone}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Landline number"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Mobile Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={rtiData.mobile}
                                                    onChange={handleRTIInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="10-digit mobile number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fee Details Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <CurrencyIcon />
                                            Fee Details
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Fee Amount (₹)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fee_amount"
                                                    value={rtiData.fee_amount}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="10"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Payment Mode
                                                </label>
                                                <select
                                                    name="payment_mode"
                                                    value={rtiData.payment_mode}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                >
                                                    <option value="">Select mode</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="DD">Demand Draft</option>
                                                    <option value="IPO">Indian Postal Order</option>
                                                    <option value="Online">Online</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Payment Date
                                                </label>
                                                <input
                                                    type="text"
                                                    name="payment_date"
                                                    value={rtiData.payment_date}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="DD/MM/YYYY"
                                                />
                                            </div>

                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    In Favor Of
                                                </label>
                                                <select
                                                    name="favoring"
                                                    value={rtiData.favoring}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                >
                                                    <option value="">Select authority</option>
                                                    <option value="Municipal Corporation">Municipal Corporation</option>
                                                    <option value="Public Information Officer">Public Information Officer</option>
                                                    <option value="Chief Information Commissioner">Chief Information Commissioner</option>
                                                    <option value="State Public Information Officer">State Public Information Officer</option>
                                                    <option value="Central Public Information Officer">Central Public Information Officer</option>
                                                </select>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Requirements Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                            <DocumentIcon />
                                            Document Requirements
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Photocopy Amount (₹)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="photocopy_amount"
                                                    value={rtiData.photocopy_amount}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="2 per page"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Number of Pages
                                                </label>
                                                <input
                                                    type="text"
                                                    name="num_pages"
                                                    value={rtiData.num_pages}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Number of pages"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    CD/Diskette Amount (₹)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cd_amount"
                                                    value={rtiData.cd_amount}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                    placeholder="Amount if required"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BPL Status Section */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6">
                                            BPL Status
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Below Poverty Line?
                                                </label>
                                                <select
                                                    name="bpl_status"
                                                    value={rtiData.bpl_status}
                                                    onChange={handleRTIInputChange}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Yes">Yes</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    BPL Certificate Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="bpl_certificate"
                                                    value={rtiData.bpl_certificate}
                                                    onChange={handleRTIInputChange}
                                                    disabled={rtiData.bpl_status === 'No'}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                    placeholder="If applicable"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Section */}
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Application Date
                                        </label>
                                        <input
                                            type="text"
                                            name="date"
                                            value={rtiData.date}
                                            onChange={handleRTIInputChange}
                                            className="w-full max-w-xs px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all outline-none"
                                            placeholder="DD/MM/YYYY"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isGenerating}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {isGenerating ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Generating Your RTI Application...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2 text-lg">
                                                    <DocumentIcon />
                                                    Generate RTI Application PDF
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Information Note */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-6">
                                        <div className="flex gap-3">
                                            <InfoIcon />
                                            <div className="flex-1">
                                                <p className="text-sm text-foreground font-semibold mb-2">Important Information</p>
                                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                                    <li>Fields marked with <span className="text-red-500 font-semibold">*</span> are mandatory</li>
                                                    <li>The RTI application fee is typically ₹10 (varies by state)</li>
                                                    <li>BPL cardholders are exempt from fees</li>
                                                    <li>Ensure all information is accurate before submitting</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </MagicCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            <FooterComponent />
        </div>
    );
}

// Icons
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const CurrencyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);
