'use client';
import { useEffect } from 'react';
import './policy.css';

export default function PolicyPage() {
    useEffect(() => {
        // Handle hash navigation
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    return (
        <div className="policy-page">
            <div className="policy-container">
                {/* Navigation */}
                <nav className="policy-nav">
                    <h2>Quick Navigation</h2>
                    <ul>
                        <li><a href="#disclaimer">Legal Disclaimer</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#support">Support</a></li>
                        <li><a href="#company">Company</a></li>
                        <li><a href="#legal">Legal Framework</a></li>
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="policy-content">
                    {/* Header */}
                    <header className="policy-header">
                        <h1>BlackMail - Policies & Information</h1>
                        <p className="subtitle">Temporary Email Service for Educational Purposes</p>
                    </header>

                    {/* Legal Disclaimer Section */}
                    <section id="disclaimer" className="policy-section">
                        <h2><span className="icon-warning">⚠</span> Legal Disclaimer & Educational Purpose</h2>
                        <div className="disclaimer-box">
                            <h3>IMPORTANT NOTICE</h3>
                            <p>
                                <strong>BlackMail</strong> is developed and provided <strong>STRICTLY FOR EDUCATIONAL PURPOSES ONLY</strong>. 
                                By accessing or using this service, you acknowledge and agree to the following terms:
                            </p>
                            <ul>
                                <li><strong>Educational Use:</strong> This platform is designed for learning, testing, and educational demonstrations only.</li>
                                <li><strong>Use at Your Own Risk:</strong> You use this service entirely at your own risk. We make no warranties or guarantees about the service's availability, security, or functionality.</li>
                                <li><strong>No Liability:</strong> The creators, developers, and maintainers of TemPus are NOT responsible for any misuse, illegal activities, damages, or consequences arising from the use of this service.</li>
                                <li><strong>Prohibited Activities:</strong> Using this service for any illegal, fraudulent, malicious, or harmful activities is STRICTLY PROHIBITED and may result in legal action.</li>
                                <li><strong>No Criminal Activity:</strong> Any attempt to use this service for criminal purposes, including but not limited to fraud, identity theft, spam, phishing, or violation of any laws, is forbidden.</li>
                                <li><strong>Compliance:</strong> Users must comply with all applicable local, state, national, and international laws and regulations.</li>
                            </ul>
                            <p className="warning-text">
                                <span className="icon-warning">⚠</span> <strong>WARNING:</strong> We reserve the right to report any suspected illegal activity to appropriate law enforcement authorities.
                            </p>
                        </div>
                    </section>

                    {/* Legal Framework Section */}
                    <section id="legal" className="policy-section">
                        <h2><span className="icon-legal">§</span> Legal Framework & Compliance</h2>
                        
                        <div className="legal-subsection">
                            <h3>Indian Constitution & IT Laws</h3>
                            <div className="law-card">
                                <h4>Information Technology Act, 2000</h4>
                                <ul>
                                    <li><strong>Section 43:</strong> Penalty for damage to computer systems - Unauthorized access, downloading, or data theft is punishable with compensation up to ₹1 crore.</li>
                                    <li><strong>Section 66:</strong> Computer-related offenses - Hacking and other cyber crimes are punishable with imprisonment up to 3 years and/or fine up to ₹5 lakhs.</li>
                                    <li><strong>Section 66C:</strong> Identity theft - Using another person's identity online is punishable with imprisonment up to 3 years and/or fine up to ₹1 lakh.</li>
                                    <li><strong>Section 66D:</strong> Cheating by personation using computer resources - Punishable with imprisonment up to 3 years and/or fine up to ₹1 lakh.</li>
                                    <li><strong>Section 67:</strong> Publishing obscene information - Imprisonment up to 3 years and fine up to ₹5 lakhs.</li>
                                </ul>
                            </div>

                            <div className="law-card">
                                <h4>Indian Penal Code (IPC) Relevant Sections</h4>
                                <ul>
                                    <li><strong>Section 292:</strong> Sale of obscene material - Imprisonment up to 2 years and/or fine.</li>
                                    <li><strong>Section 419:</strong> Cheating by personation - Imprisonment up to 3 years and/or fine.</li>
                                    <li><strong>Section 420:</strong> Cheating and dishonestly inducing delivery of property - Imprisonment up to 7 years and fine.</li>
                                    <li><strong>Section 463-465:</strong> Forgery and using forged documents - Imprisonment up to 2-10 years depending on severity.</li>
                                    <li><strong>Section 499-500:</strong> Defamation - Imprisonment up to 2 years and/or fine.</li>
                                </ul>
                            </div>

                          

                            <div className="law-card">
                                <h4>Data Protection & Privacy</h4>
                                <ul>
                                    <li><strong>Digital Personal Data Protection Act, 2023:</strong> Governs processing of digital personal data with penalties for non-compliance.</li>
                                    <li><strong>Right to Privacy:</strong> Recognized as a fundamental right under Article 21 of the Indian Constitution.</li>
                                    <li><strong>Reasonable Security Practices (IT Act Rule 8):</strong> Organizations must implement security measures to protect sensitive personal data.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="legal-subsection">
                            <h3>International Compliance</h3>
                            <ul>
                                <li><strong>GDPR (EU):</strong> General Data Protection Regulation for European users</li>
                                <li><strong>CCPA (California):</strong> California Consumer Privacy Act</li>
                                <li><strong>CAN-SPAM Act:</strong> Email marketing and anti-spam regulations</li>
                                <li><strong>DMCA:</strong> Digital Millennium Copyright Act</li>
                            </ul>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="policy-section">
                        <h2><span className="icon-features">★</span> Features</h2>
                        
                        <div className="feature-grid">
                            <div className="feature-card">
                                <h3><span className="icon-email">✉</span> Temporary Email Service</h3>
                                <p>
                                    Generate instant disposable email addresses without any registration. Perfect for:
                                </p>
                                <ul>
                                    <li>Testing email functionality in applications</li>
                                    <li>Avoiding spam in your primary inbox</li>
                                    <li>Quick sign-ups for trial services</li>
                                    <li>Educational projects and demonstrations</li>
                                    <li>Development and testing environments</li>
                                </ul>
                                <p className="note"><span className="icon-time">⏱</span> Valid for a limited time period</p>
                            </div>

                            <div className="feature-card">
                                <h3><span className="icon-delete">×</span> Auto-Delete Messages</h3>
                                <p>
                                    All emails are automatically deleted after a specified time period to ensure:
                                </p>
                                <ul>
                                    <li>Zero data retention policy</li>
                                    <li>Enhanced privacy protection</li>
                                    <li>No permanent storage of sensitive information</li>
                                    <li>Automatic cleanup of old messages</li>
                                    <li>Reduced server storage requirements</li>
                                </ul>
                                <p className="note"><span className="icon-refresh">↻</span> Messages are permanently deleted and cannot be recovered</p>
                            </div>

                            <div className="feature-card">
                                <h3><span className="icon-lock">🔒</span> Privacy Protection</h3>
                                <p>
                                    Your privacy is our priority. We implement:
                                </p>
                                <ul>
                                    <li>No personal information collection</li>
                                    <li>No registration or login required</li>
                                    <li>No tracking or analytics cookies</li>
                                    <li>Anonymous email generation</li>
                                    <li>Secure HTTPS connections</li>
                                    <li>No IP logging or user profiling</li>
                                </ul>
                                <p className="note"><span className="icon-shield">⛨</span> Built with privacy-first architecture</p>
                            </div>

                            <div className="feature-card">
                                <h3><span className="icon-api">{ }</span> API Access</h3>
                                <p>
                                    Integrate temporary email functionality into your applications:
                                </p>
                                <ul>
                                    <li>RESTful API endpoints</li>
                                    <li>Create and manage temporary emails programmatically</li>
                                    <li>Retrieve messages via API calls</li>
                                    <li>Perfect for automated testing</li>
                                    <li>Developer-friendly documentation</li>
                                </ul>
                                <p className="note"><span className="icon-code">{ }</span> API available for educational and testing purposes</p>
                            </div>
                        </div>
                    </section>

                    {/* Support Section */}
                    <section id="support" className="policy-section">
                        <h2><span className="icon-help">?</span> Support</h2>
                        
                        <div className="support-grid">
                            <div className="support-card">
                                <h3><span className="icon-question">?</span> FAQ (Frequently Asked Questions)</h3>
                                <div className="faq-item">
                                    <h4>Q: How long do temporary emails last?</h4>
                                    <p>A: Temporary emails are active for a limited time period. Messages are automatically deleted to maintain privacy and security.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: Can I recover deleted messages?</h4>
                                    <p>A: No, once messages are deleted, they cannot be recovered. This is by design to ensure privacy.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: Is this service really free?</h4>
                                    <p>A: Yes, TemPus is provided free of charge for educational purposes.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: Can I use this for business purposes?</h4>
                                    <p>A: No, this service is strictly for educational and testing purposes only.</p>
                                </div>
                            </div>

                            <div className="support-card">
                                <h3><span className="icon-book">≡</span> Help Center</h3>
                                <ul>
                                    <li><strong>Getting Started:</strong> Learn how to generate your first temporary email</li>
                                    <li><strong>Using the Interface:</strong> Navigate through the platform efficiently</li>
                                    <li><strong>Troubleshooting:</strong> Common issues and solutions</li>
                                    <li><strong>Best Practices:</strong> Tips for effective usage</li>
                                    <li><strong>API Documentation:</strong> Technical guides for developers</li>
                                </ul>
                            </div>

                            <div className="support-card">
                                <h3><span className="icon-contact">✆</span> Contact Us</h3>
                                <p>Need assistance? Reach out to us:</p>
                                <ul>
                                    <li><strong>Email:</strong> <a href="mailto:princesahu17125@gmail.com">princesahu17125@gmail.com</a></li>
                                    <li><strong>GitHub:</strong> <a href="https://github.com/prince7z" target="_blank" rel="noopener noreferrer">Report issues and contribute</a></li>
                                    <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
                                </ul>
                                <p className="note"><span className="icon-warning">⚠</span> For legal concerns or abuse reports, please use the dedicated reporting channel</p>
                            </div>

                            <div className="support-card">
                                <h3><span className="icon-chat">💬</span> Live Chat</h3>
                                <p>Connect with our support team in real-time:</p>
                                <ul>
                                    <li>Quick answers to your questions</li>
                                    <li>Technical support for developers</li>
                                    <li>General inquiries</li>
                                </ul>
                                <button className="chat-button">Start Live Chat</button>
                                <p className="note"><span className="icon-clock">○</span> Available during business hours (9 AM - 6 PM IST)</p>
                            </div>
                        </div>
                    </section>

                    {/* Company Section */}
                    <section id="company" className="policy-section">
                        <h2><span className="icon-company">▣</span> Company</h2>
                        
                        <div className="company-subsection">
                            <h3>Privacy Policies</h3>
                            <div className="policy-card">
                                <h4>What Information We Collect</h4>
                                <ul>
                                    <li>Temporary email addresses generated by users</li>
                                    <li>Incoming email messages (stored temporarily)</li>
                                    <li>Minimal technical data required for service operation</li>
                                </ul>
                                
                                <h4>What We DON'T Collect</h4>
                                <ul>
                                    <li>No personal identification information</li>
                                    <li>No IP addresses or browsing history</li>
                                    <li>No cookies for tracking purposes</li>
                                    <li>No user accounts or registration data</li>
                                </ul>

                                <h4>Data Retention</h4>
                                <p>
                                    All emails and temporary addresses are automatically deleted after the expiration period. 
                                    We do not retain any user data beyond what is necessary for immediate service functionality.
                                </p>
                            </div>
                        </div>

                        <div className="company-subsection">
                            <h3>Terms of Service</h3>
                            <div className="policy-card">
                                <h4>Acceptable Use</h4>
                                <ul>
                                    <li><span className="icon-check">✓</span> Educational and learning purposes</li>
                                    <li><span className="icon-check">✓</span> Software testing and development</li>
                                    <li><span className="icon-check">✓</span> Temporary communication needs</li>
                                    <li><span className="icon-check">✓</span> Privacy protection for legitimate purposes</li>
                                </ul>

                                <h4>Prohibited Use</h4>
                                <ul>
                                    <li><span className="icon-cross">×</span> Illegal activities of any kind</li>
                                    <li><span className="icon-cross">×</span> Spam, phishing, or fraudulent schemes</li>
                                    <li><span className="icon-cross">×</span> Identity theft or impersonation</li>
                                    <li><span className="icon-cross">×</span> Harassment, abuse, or threats</li>
                                    <li><span className="icon-cross">×</span> Distribution of malware or harmful content</li>
                                    <li><span className="icon-cross">×</span> Violation of any laws or regulations</li>
                                    <li><span className="icon-cross">×</span> Commercial use without authorization</li>
                                </ul>

                                <h4>Service Limitations</h4>
                                <ul>
                                    <li>Service provided "as is" without warranties</li>
                                    <li>No guarantee of uptime or availability</li>
                                    <li>We reserve the right to terminate service at any time</li>
                                    <li>Rate limiting may apply to prevent abuse</li>
                                </ul>
                            </div>
                        </div>

                        <div className="company-subsection">
                            <h3><span className="icon-blog">≣</span> Blog</h3>
                            <p>Stay updated with our latest articles on:</p>
                            <ul>
                                <li>Email privacy and security best practices</li>
                                <li>Updates and new features</li>
                                <li>Educational content about temporary email services</li>
                                <li>Technical tutorials and guides</li>
                            </ul>
                            <a href="/blog" className="blog-link">Visit Our Blog <span className="icon-arrow">→</span></a>
                        </div>

                        <div className="company-subsection">
                            <h3>About BlackMail</h3>
                            <p>
                                BlackMail is an educational project aimed at demonstrating temporary email service functionality. 
                                Our mission is to provide a learning platform for developers and students interested in 
                                understanding email systems, privacy protection, and web application development.
                            </p>
                            <p className="goals-title">
                                <strong>Project Goals:</strong>
                            </p>
                            <ul>
                                <li>Promote digital privacy awareness</li>
                                <li>Provide practical learning resources</li>
                                <li>Demonstrate secure web application architecture</li>
                                <li>Foster responsible technology usage</li>
                            </ul>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="policy-footer">
                        <div className="footer-content">
                            <p>
                                <strong>Last Updated:</strong> November 9, 2025
                            </p>
                            <p>
                                By using BlackMail, you acknowledge that you have read, understood, and agree to be bound by 
                                these policies. If you do not agree with any part of these policies, please discontinue use 
                                of the service immediately.
                            </p>
                            <p className="copyright">
                                © 2025 Blackmail. Educational Project. All Rights Reserved.
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}