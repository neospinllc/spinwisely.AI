'use client'

import { X, FileText, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function TermsModal({ isOpen, onAccept, onDecline }) {
    const [hasScrolled, setHasScrolled] = useState(false)

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
        if (bottom) {
            setHasScrolled(true)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary-600" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Terms & Conditions
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Version 1.0 • Effective Date: February 11, 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div
                    className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700 dark:text-gray-300"
                    onScroll={handleScroll}
                >
                    {/* Alert Box */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-yellow-900 dark:text-yellow-200">Important Notice</p>
                            <p className="text-yellow-800 dark:text-yellow-300 mt-1">
                                Please read these terms carefully. By clicking "I Accept," you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                            </p>
                        </div>
                    </div>

                    {/* 1. Acceptance of Terms */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                        <p className="text-sm leading-relaxed">
                            By accessing and using SpinWisely AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms & Conditions, you must not access or use the Service.
                        </p>
                    </section>

                    {/* 2. Service Description */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Service Description</h3>
                        <p className="text-sm leading-relaxed">
                            SpinWisely AI is an artificial intelligence-powered knowledge assistant that provides information and guidance based on documents uploaded to the system. The Service uses AI technology to interpret queries and provide responses.
                        </p>
                    </section>

                    {/* 3. Data Collection & Privacy */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Data Collection & Privacy</h3>
                        <div className="text-sm leading-relaxed space-y-2">
                            <p><strong>What We Collect:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Email address and authentication information</li>
                                <li>Chat queries and interaction history</li>
                                <li>Usage data and activity logs</li>
                                <li>Technical information (IP address, browser type, device information)</li>
                            </ul>
                            <p className="mt-3"><strong>How We Use Your Data:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>To provide and improve the Service</li>
                                <li>To analyze usage patterns and enhance user experience</li>
                                <li>To maintain security and prevent abuse</li>
                            </ul>
                            <p className="mt-3">
                                We are committed to protecting your privacy and will not sell your personal information to third parties. Your data is stored securely and handled in accordance with applicable data protection laws.
                            </p>
                        </div>
                    </section>

                    {/* 4. Prohibited Uses */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4. Prohibited Uses</h3>
                        <div className="text-sm leading-relaxed">
                            <p className="mb-2">You agree NOT to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2 text-red-600 dark:text-red-400 font-medium">
                                <li>Record, screen capture, or video capture any interactions with the Service</li>
                                <li>Quote, cite, or attribute responses from the Service in any external publication, research, or commercial work</li>
                                <li>Reproduce, copy, or redistribute content generated by the Service</li>
                                <li>Use the Service for any commercial purpose without prior written authorization</li>
                                <li>Attempt to reverse engineer or extract the underlying knowledge base</li>
                                <li>Use automated tools, bots, or scripts to access the Service</li>
                                <li>Share your account credentials with others</li>
                            </ul>
                            <p className="mt-3 text-gray-700 dark:text-gray-300">
                                Violation of these prohibited uses may result in immediate termination of your access to the Service and potential legal action.
                            </p>
                        </div>
                    </section>

                    {/* 5. Liability Disclaimer */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">5. Disclaimer of Warranties & Limitation of Liability</h3>
                        <div className="text-sm leading-relaxed space-y-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="font-semibold text-red-900 dark:text-red-200">CRITICAL DISCLAIMER:</p>
                            <ul className="space-y-2 text-red-800 dark:text-red-300">
                                <li>
                                    <strong>No Warranties:</strong> The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                                </li>
                                <li>
                                    <strong>No Liability for Misrepresentation:</strong> We are not responsible for any inaccuracies, errors, or misrepresentations in the AI-generated responses. The Service may produce incorrect, incomplete, or misleading information.
                                </li>
                                <li>
                                    <strong>No Professional Advice:</strong> Responses from the Service do not constitute professional, legal, financial, medical, or any other type of professional advice. Consult qualified professionals for specific advice.
                                </li>
                                <li>
                                    <strong>Limitation of Liability:</strong> In no event shall SpinWisely AI, its officers, directors, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 6. User Responsibility */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">6. User Responsibility</h3>
                        <div className="text-sm leading-relaxed space-y-2">
                            <p className="font-semibold">YOU ARE SOLELY RESPONSIBLE FOR:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Verifying all information provided by the Service independently</li>
                                <li>Performing your own analysis and interpretation of any responses</li>
                                <li>Making your own informed decisions based on professional advice</li>
                                <li>Any consequences arising from reliance on the Service</li>
                                <li>Ensuring compliance with applicable laws and regulations in your jurisdiction</li>
                            </ul>
                            <p className="mt-3 font-semibold">
                                The Service is intended ONLY as a guidance tool to assist you in your research and decision-making process. It is not a substitute for professional judgment, expertise, or advice.
                            </p>
                        </div>
                    </section>

                    {/* 7. AI-Generated Content */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">7. AI-Generated Content Notice</h3>
                        <p className="text-sm leading-relaxed">
                            All responses are generated by artificial intelligence and may contain errors, biases, or inaccuracies. The AI may:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm mt-2">
                            <li>Misinterpret your queries</li>
                            <li>Provide outdated or incorrect information</li>
                            <li>Generate plausible-sounding but factually incorrect responses</li>
                            <li>Miss important context or nuances</li>
                        </ul>
                        <p className="text-sm leading-relaxed mt-2">
                            Always validate AI-generated information through authoritative sources before making any decisions.
                        </p>
                    </section>

                    {/* 8. Modifications to Terms */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">8. Modifications to Terms</h3>
                        <p className="text-sm leading-relaxed">
                            We reserve the right to modify these Terms & Conditions at any time. Users will be notified of significant changes and may be required to accept updated terms to continue using the Service.
                        </p>
                    </section>

                    {/* 9. Termination */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">9. Termination</h3>
                        <p className="text-sm leading-relaxed">
                            We reserve the right to terminate or suspend your access to the Service immediately, without prior notice, for any violation of these Terms & Conditions or for any other reason at our sole discretion.
                        </p>
                    </section>

                    {/* 10. Governing Law */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">10. Governing Law</h3>
                        <p className="text-sm leading-relaxed">
                            These Terms & Conditions shall be governed by and construed in accordance with the laws applicable in the jurisdiction where SpinWisely AI operates, without regard to conflict of law provisions.
                        </p>
                    </section>

                    {/* 11. Contact Information */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">11. Contact Information</h3>
                        <p className="text-sm leading-relaxed">
                            For questions about these Terms & Conditions, please contact us at: <a href="mailto:support@spinwisely.ai" className="text-primary-600 hover:underline">support@spinwisely.ai</a>
                        </p>
                    </section>

                    {/* Scroll indicator */}
                    {!hasScrolled && (
                        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-800 via-white/90 dark:via-gray-800/90 to-transparent pt-8 pb-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                ↓ Please scroll to read all terms ↓
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer with Buttons */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex gap-4">
                        <button
                            onClick={onDecline}
                            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            I Decline
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={!hasScrolled}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {hasScrolled ? 'I Accept' : 'Scroll to Continue'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                        By clicking "I Accept," you acknowledge that you have read and agree to these terms
                    </p>
                </div>
            </div>
        </div>
    )
}
