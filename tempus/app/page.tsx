'use client';

import { useEffect, useState, useCallback } from 'react';
import { Icons } from './components/Icons';
import { ThemeToggle } from './components/ThemeToggle';
import { Dialog } from './components/Dialog';
import { PremiumDialog } from './components/PremiumDialog';
import { Toast } from './components/Toast';

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
  content: string;
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
    question: 'When should I use TempusMail instead of my real email?',
    answer: 'Use TempusMail when signing up for temporary services, downloading files, testing applications, or whenever you want to protect your real email from potential spam.'
  },
  {
    question: 'How long does an email stay in my TempusMail inbox?',
    answer: 'Emails in your TempusMail inbox are available for 24 hours from the time of creation. After this period, both the email address and all messages are permanently deleted.'
  }
];

export default function Home() {
  const [email, setEmail] = useState<Email | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [expiryTime, setExpiryTime] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);

  useEffect(() => {
    if (email && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            deleteEmail();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [email, timeLeft]);

  // Generate new email
  const generateEmail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/temp');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setEmail(data);
      setMessages([]);
      setTimeLeft(600); // Reset timer to 10 minutes
      
      // Set expiry time to 24 hours from now
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setExpiryTime(expiry.toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  // Copy email to clipboard
  const copyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email.email);
    }
  };

  // Delete current email
  const deleteEmail = () => {
    setEmail(null);
    setMessages([]);
    setExpiryTime('');
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: email.token,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh messages
  useEffect(() => {
    if (email) {
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    setIsPremiumOpen(false);
    setToastMessage('Coming Soon!');
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

  return (
    <div>
      <header className="header">
        <div className="logo">
          <Icons.Mail />
          <span>TempusMail</span>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="premium-button"
            onClick={() => setIsPremiumOpen(true)}
            aria-haspopup="dialog"
          >
            Premium
          </button>
        </div>
      </header>

      <div className="container">
        {/* Email Box */}
        <div className="email-box">
          <h2>Your Temporary Email Address</h2>
          {email ? (
            <>
              <div className="email-address">
                <span>{email.email}</span>
                <button onClick={copyEmail} className="button button-secondary">
                  <Icons.Copy />
                </button>
              </div>
              <div className="expiry-info">
                <span>Expires at: {expiryTime}</span>
                <div className="timer">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="button-group">
                <button onClick={fetchMessages} className="button button-secondary">
                  <Icons.Refresh />
                  <span>Refresh</span>
                </button>
                <button onClick={deleteEmail} className="button button-secondary">
                  Delete
                </button>
                <button onClick={generateEmail} className="button button-secondary">
                  Change
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={generateEmail}
              disabled={loading}
              className="button button-primary"
            >
              {loading ? 'Generating...' : 'Generate New Email'}
            </button>
          )}
          
          {error && (
            <p className="error">{error}</p>
          )}
        </div>

        {/* Inbox */}
        <div className="inbox">
          <div className="inbox-header">
            <h2>INBOX</h2>
            {email && (
              <button onClick={fetchMessages} className="button button-secondary">
                Refresh
              </button>
            )}
          </div>
          
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

       
        {/* FAQ Section */}
        <div className="faq-section">
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
        <div className="blog-section">
          <h2>Latest from Our Blog</h2>
          {loadingBlog ? (
            <div className="blog-loading">Loading blog posts...</div>
          ) : (
            <div className="blog-grid" >
              {blogPosts.slice(0, 6).map((post) => (
                <a key={post.id} href={`/blog/${post.id}`} className="blog-card">
                  {post.cover && (
                    <div className="blog-cover">
                      <img src={post.cover} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-content">
                    <div className="blog-tags">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                    <h3 className="blog-title">{post.title}</h3>
                    <div className="blog-date">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>


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
              <h4>Company</h4>
              <ul>
                <li><a href="/links">About Us</a></li>
                <li><a href="/links">Blog</a></li>
                <li><a href="/links">Careers</a></li>
                <li><a href="/links">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/links">Privacy Policy</a></li>
                <li><a href="/links">Terms of Service</a></li>
                <li><a href="/links">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icons.GitHub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Icons.Twitter />
            </a>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TempusMail. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Message Dialog */}
      <Dialog
        isOpen={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || ""}
      >
        {selectedMessage && (
          <div className="message-full">
            <div className="message-sender">
              <div className="sender-avatar">
                <Icons.User />
              </div>
              <div>
                <div className="sender">{selectedMessage.from}</div>
                <div className="date">{selectedMessage.date}</div>
              </div>
            </div>
            <div className="message-content">
              {selectedMessage.content}
            </div>
          </div>
        )}
      </Dialog>

      {/* Premium Dialog */}
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
