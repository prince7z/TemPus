'use client';

import { useEffect, useState, useCallback } from 'react';
import { Icons } from './components/Icons';
import { ThemeToggle } from './components/ThemeToggle';
import { Dialog } from './components/Dialog';
import { PremiumDialog } from './components/PremiumDialog';
import { Toast } from './components/Toast';
import CardSwap, { Card } from './components/CardSwap';
import CardNav, { CardNavItem } from './components/cardNav';
import { BlackMailLogo } from './components/BlackMailLogo';
import axios from 'axios';


interface Email {
  id: string;
  email: string;
  token: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  cover: string | null;
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What is TempusMail and how does it work?',
    answer: 'TempusMail is a fast and secure disposable temporary email service that instantly generates a temporary email address for you—no sign-up required. Easily use our temp mail generator to receive emails for website registrations, online verifications, or testing services while keeping your real inbox safe from spam and unwanted messages.'
  },
  {
    question: 'How is TempusMail different from regular email services?',
    answer: 'TempusMail provides disposable email addresses that automatically expire, protecting your privacy and preventing spam. Unlike regular email services, no registration is required and addresses are temporary.'
  },
  {
    question: 'Is TempusMail anonymous and secure?',
    answer: 'Yes, TempusMail is completely anonymous and secure. We don\'t collect any personal information and all emails are automatically deleted after expiration.'
  },
  {
    question: 'How long do temporary emails last?',
    answer: 'Temporary emails last for 60 minutes by default, but you can extend this time or delete them earlier if needed. Premium users get longer duration options.'
  },
  {
    question: 'Can I use TempusMail for important accounts?',
    answer: 'We recommend using TempusMail only for temporary purposes like testing, verification, or avoiding spam. For important accounts, use a permanent email service.'
  }
];

const navItems: CardNavItem[] = [
  {
    label: "Features",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)",
    links: [
      { label: "Temporary Email", href: "/features/temp-email", ariaLabel: "Learn about temporary email" },
      { label: "Auto Delete", href: "/features/auto-delete", ariaLabel: "Auto delete feature" },
      { label: "Privacy Protection", href: "/features/privacy", ariaLabel: "Privacy protection" },
      { label: "API Access", href: "/features/api", ariaLabel: "API access" }
    ]
  },
  {
    label: "Support",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)", 
    links: [
      { label: "Help Center", href: "/support/help", ariaLabel: "Visit help center" },
      { label: "Contact Us", href: "/support/contact", ariaLabel: "Contact support" },
      { label: "FAQ", href: "/support/faq", ariaLabel: "Frequently asked questions" },
      { label: "Live Chat", href: "/support/chat", ariaLabel: "Start live chat" }
    ]
  },
  {
    label: "Company",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)",
    links: [
      { label: "About Us", href: "/company/about", ariaLabel: "About BlackMail" },
      { label: "Privacy Policy", href: "/company/privacy", ariaLabel: "Privacy policy" },
      { label: "Terms of Service", href: "/company/terms", ariaLabel: "Terms of service" },
      { label: "Blog", href: "/blog", ariaLabel: "Visit our blog" }
    ]
  }
];

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && email) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && email) {
      deleteEmail();
    }
  }, [timeLeft, email]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate new email
  const generateEmail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/temp');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem('Token', data.token);
      localStorage.setItem('id', data.id);
      setEmail(data.email);
      setTimeLeft(600); 
      setMessages([]); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  // Delete current email
  const deleteEmail = async () => {
    const res = await axios.delete('/api/temp', {
      data: {
        id: localStorage.getItem('id'),
      }
    });
    setEmail('');
    setMessages([]);
    setTimeLeft(600);
    setSelectedMessage(null);
  };

  // Extend email time
  const extendTime = () => {
    if (timeLeft < 1200) { // Max 20 minutes
      setTimeLeft(prev => prev + 600); // Add 30 minutes
      showToastMessage('Time extended by 10 minutes');
    } else {
      showToastMessage('Maximum time limit reached');
    }
  };

  // Check for new messages
  const checkMessages = useCallback(async () => {
    if (!email) return;
    
    try {
      const response = await axios.post(`/api/temp`, { token: localStorage.getItem('Token') });
      const newMessages = await response.data;
      setMessages(newMessages);
    } catch (err) {
      console.error('Failed to check messages:', err);
    }
  }, [email]);

  // Check messages periodically
  useEffect(() => {
    if (email) {
      const interval = setInterval(checkMessages, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [email, checkMessages]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToastMessage('Copied to clipboard!');
  };

  // Handle premium upgrade
  const handleUpgrade = () => {
    setIsPremiumOpen(false);
    showToastMessage('Premium features coming soon!');
  };

  // Show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoadingBlog(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      
      if (!data.error) {
        setBlogPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoadingBlog(false);
    }
  };

  // Fetch blog posts on mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const buyEmail = () => {

    showToastMessage('Buying email feature coming soon!');
  }

  return (
    <div className="app-container">
      {/* Navigation with integrated actions */}
      <div className="nav-wrapper">
        <CardNav
          logo="/blackmail-logo.svg"
          logoAlt="BlackMail Logo"
          items={navItems}
          className="main-nav"
          baseColor="var(--bg-primary)"
          menuColor="var(--bg-primary)"
          buttonBgColor="var(--text-primary)"
          buttonTextColor="var(--bg-primary)"
        />
        
    
      </div>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Email Generation Section */}
        <section className="email-section">
          <div className="email-card">
            <h2>Your Temporary Email Address</h2>
            
            <div className="email-display-area">
              {email ? (
                <>
                  <div className="email-input-wrapper">
                    <input 
                      type="text" 
                      value={email} 
                      readOnly 
                      className="email-input" 
                    />
                    <div className="email-actions">
                      <button
                        onClick={() => copyToClipboard(email)}
                        className="copy-btn"
                      >
                        <Icons.Copy />
                      </button>
                    </div>
                  </div>
                  
                  <div className="timer-display">
                    <Icons.Timer />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  
                  <div className="action-buttons">
                    <button
                      onClick={generateEmail}
                      className="change-btn"
                    >
                      Change
                    </button>
                    <button
                      onClick={deleteEmail}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={extendTime}
                      className="extend-btn"
                    >
                      Extend Time
                    </button>
                    <button
                      onClick={buyEmail}
                      className="buy-btn"
                    >
                      Buy For $2
                    </button>
                  </div>
                  
                  {loading && (
                    <div className="loading-indicator">
                      <span>Loading...</span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={generateEmail}
                  disabled={loading}
                  className="generate-btn"
                >
                  {loading ? 'Generating...' : 'Generate New Email'}
                </button>
              )}
              
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </section>

        {/* Inbox Section */}
        <section className="inbox-section">
        {/* Add a line decreasing for 5 sec and get restart when clicked on refresh icon */}
          <div className="refresh-progress">
            <div 
              className="refresh-progress-bar" 
              style={{ 
          animation: 'shrink 5s linear infinite',
          width: '95%',
          height: '3px',
          marginLeft: '20px',
          backgroundColor: 'var(--text-primary)',
          transformOrigin: 'left'
              }} 
            />
          </div>
          <div className="inbox-card ">
            <div className="inbox-header" style={{ display : "flex"}}>
            <h3 className="inbox-title">Recent Mails</h3>
            <div className="refresh-button">
              <a onClick={checkMessages} style={{ cursor: "pointer", color: 'black' }} aria-label="Refresh messages">
                <Icons.Refresh />
              </a>
            </div>
            </div>
            <div className="inbox-list">
              {messages.length > 0 ? (
                <div className="messages">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className="message" 
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="message-header">
                        <div className="message-sender">
                          <div className="sender-avatar">
                            <Icons.User />
                          </div>
                          <span className="sender">{message.from}</span>
                        </div>
                        <span className="date">{message.date}</span>
                      </div>
                      <h3 className="subject">{message.subject}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-inbox">
                  <div className="empty-inbox-icon">
                    <Icons.Mail />
                  </div>
                  <p>Your inbox is empty</p>
                  <p>Waiting for incoming emails</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Two Column Section: FAQ and Blog */}
        <div className="two-column-section">
          {/* FAQ Section */}
          <div className="faq-column">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span>{activeFaq === index ? '▼' : '▶'}</span>
                </button>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Blog Section */}
          <div className="blog-column">
            <h2>Latest Blog Posts</h2>
            {loadingBlog ? (
              <div className="blog-loading">Loading blog posts...</div>
            ) : blogPosts.length > 0 ? (
              <div className="blog-container">
                <CardSwap
                  cardDistance={60}
                  verticalDistance={70}
                  delay={4000}
                  pauseOnHover={true}
                >
                  {blogPosts.slice(0, 4).map((post) => (
                    <Card key={post.id}>
                      <a href={`/blog/${post.id}`} className="blog-card-small">
                        {post.cover && (
                          <div className="blog-cover-small">
                            <img src={post.cover} alt={post.title} />
                          </div>
                        )}
                        <div className="blog-content-small">
                          <div className="blog-tags">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="blog-tag">{tag}</span>
                            ))}
                          </div>
                          <h3 className="blog-title">{post.title}</h3>
                          <div className="blog-date">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </a>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            ) : (
              <div className="blog-empty">
                <p>No blog posts available</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-card">
            <h2>Get in Touch</h2>
            <p className="contact-description">
              Have questions about BlackMail? Need support? We're here to help!
            </p>
            
            <form className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>
              
              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
            
            <div className="contact-info">
              <div className="contact-item">
                <BlackMailLogo size={20} />
                <span>support@blackmail.com</span>
              </div>
              <div className="contact-item">
                <Icons.MessageCircle />
                <span>Live Chat Available 24/7</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>TempusMail</h4>
            <p className="footer-description">
              Fast and secure disposable temporary email service. Protect your privacy and keep your inbox spam-free.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="/links">Features</a></li>
              <li><a href="/links">Pricing</a></li>
              <li><a href="/links">API Documentation</a></li>
              <li><a href="/links">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/links">Help Center</a></li>
              <li><a href="/links">Contact Us</a></li>
              <li><a href="/links">Terms of Service</a></li>
              <li><a href="/links">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Stay Connected</h4>
            <div className="social-links">
              <a href="/links" aria-label="Twitter">
                <Icons.Twitter />
              </a>
              <a href="/links" aria-label="GitHub">
                <Icons.GitHub />
              </a>
              <a href="/links" aria-label="Discord">
                <Icons.MessageCircle />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TempusMail. All rights reserved.</p>
        </div>
      </footer>

      {/* Message Dialog */}
      <Dialog
        isOpen={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || ""}
      >
        {selectedMessage && (
          <div className="message-dialog-content">
            <div className="message-meta">
              <div className="message-from">
                <strong>From:</strong> {selectedMessage.from}
              </div>
              <div className="message-date">
                <strong>Date:</strong> {selectedMessage.date}
              </div>
            </div>
            <div className="message-body">
              <div 
                dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
              />
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        title="Upgrade to Premium"
      >
        <PremiumDialog onUpgrade={handleUpgrade} />
      </Dialog>

      {/* Toast */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}