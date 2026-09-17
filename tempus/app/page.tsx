'use client';

import { useEffect, useState, useCallback } from 'react';
import { Icons } from './components/Icons';
import { Toast } from './components/Toast';
import { BuyEmailDialog } from './components/BuyEmailDialog';
import CardNav from './components/cardNav';
import type { CardNavItem } from './components/cardNav';
import Image from 'next/image';
import './styles/blackmail-theme.css';
import axios from 'axios';
import { set } from 'mongoose';


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
    question: 'What is BlackMail and how does it work?',
    answer: 'BlackMail is a fast and secure disposable temporary email service that instantly generates a temporary email address for you—no sign-up required. Easily use our temp mail generator to receive emails for website registrations, online verifications, or testing services while keeping your real inbox safe from spam and unwanted messages.'
  },
  {
    question: 'How is BlackMail different from regular email services?',
    answer: 'BlackMail provides disposable email addresses that automatically expire, protecting your privacy and preventing spam. Unlike regular email services, no registration is required and addresses are temporary.'
  },
  {
    question: 'Is BlackMail anonymous and secure?',
    answer: 'Yes, BlackMail is completely anonymous and secure. We don\'t collect any personal information and all emails are automatically deleted after expiration.'
  },
  {
    question: 'How long do temporary emails last?',
    answer: 'Temporary emails last for 10 minutes by default, but you can extend this time or delete them earlier if needed. Premium users get longer duration options.'
  },
  {
    question: 'Can I use BlackMail for important accounts?',
    answer: 'We recommend using BlackMail only for temporary purposes like testing, verification, or avoiding spam. For important accounts, use a permanent email service.'
  }
];

const navItems: CardNavItem[] = [
  {
    label: "Features",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)",
    links: [
      { label: "Temporary Email", href: "/policy",  ariaLabel: "Learn about temporary email" },
      { label: "Auto Delete", href: "/policy", ariaLabel: "Auto delete feature" },
      { label: "Privacy Protection", href: "/policy", ariaLabel: "Privacy protection" },
      { label: "API Access", href: "/policy", ariaLabel: "API access" }
    ]
  },
  {
    label: "Support",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)", 
    links: [
      { label: "Help Center", href: "/policy", ariaLabel: "Visit help center" },
      { label: "Contact Us", href: "https://linkedin.com/in/Prince7z", ariaLabel: "Contact support" },
      { label: "FAQ", href: "#FAQ", ariaLabel: "Frequently asked questions" },
      { label: "Live Chat", href: "https://linkedin.com/in/Prince7z", ariaLabel: "Start live chat" }
    ]
  },
  {
    label: "Company",
    bgColor: "var(--bg-primary)",
    textColor: "var(--text-primary)",
    links: [
      { label: "About Us", href: "/policy", ariaLabel: "About BlackMail" },
      { label: "Privacy Policy", href: "/policy", ariaLabel: "Privacy policy" },
      { label: "Terms of Service", href: "/policy", ariaLabel: "Terms of service" },
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
  const [pass, setPass] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [id, setId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const[usermail,setUsermail]=useState<string>('');
  const[contactMessage,setContactMessage]=useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [usersub,setUsersub]=useState<string>('');

  // Load theme from localStorage on mount

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

 
const handleContactSubmit = async () => {
  try {
    const res = await axios.post('/api/contact', {
      username: username,
      usermail: usermail,
      usersub: usersub,
      contactMessage: contactMessage
    });

    if (res.status === 200) {
      showToastMessage('Message sent successfully!');
    }

  } catch (error) {
    showToastMessage('Failed to send message. Please try again.');
  }
};
  

 

  // Show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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

  

  const buyEmail = async () => {
    if (!email) {
      showToastMessage('Please generate an email first!');
      return;
    }
    
    try {
      const res = await axios.put('/api/temp', {
        email: email,
        action: 'buy'
      });
      
      if (res.data.error) {
        showToastMessage(res.data.error);
      } else {
        const data =res.data.ownResult;
        setPass(data.password);
        setId(data.id);
        setToken(data.token);
        showToastMessage('Permanent email activated - FREE!');
        setIsBuyDialogOpen(true);
      }
    } catch (error) {
      showToastMessage('Failed to get permanent email. Please try again.');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation with integrated actions */}
      <div className="nav-wrapper">
        <CardNav
          logo="/logo_Nav.png"
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
                       Get Permanent Email 
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

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="message-modal-overlay" onClick={() => setSelectedMessage(null)}>
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
              <div className="message-modal-header">
                <button className="back-btn" onClick={() => setSelectedMessage(null)}>
                  ← BACK TO LIST
                </button>
                <div className="message-modal-actions">
                  <button className="message-action-btn" onClick={() => setSelectedMessage(null)}>
                    Delete
                  </button>
                  <button className="message-action-btn">
                    Source
                  </button>
                </div>
              </div>
              
              <div className="message-modal-content">
                <div className="message-sender-info">
                  <div className="sender-avatar-large">
                    <Icons.User />
                  </div>
                  <div className="sender-details">
                    <div className="sender-email">{selectedMessage.from}</div>
                    <div className="message-date-full">
                      Date: {selectedMessage.date}
                    </div>
                  </div>
                </div>
                
                <div className="message-subject-full">
                  <strong>Subject:</strong> {selectedMessage.subject}
                </div>
                
                
                <div className="message-content">
                                  <div className="message-subject-full">
                  <strong>Body:</strong> <div className="message-body" dangerouslySetInnerHTML={{ __html: selectedMessage.body }}>
                </div>
                </div>
                  </div>
              </div>
            </div>
          </div>
        )}

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
              <div className="blog-grid">
                {blogPosts.slice(0, 6).map((post) => (
                  <a key={post.id} href={`/blog/${post.id}`} className="blog-card-grid">
                    {post.cover && (
                      <div className="blog-cover-grid">
                        <img src={post.cover} alt={post.title} />
                      </div>
                    )}
                    <div className="blog-content-grid">
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
                ))}
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
            
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); handleContactSubmit(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" onChange={(e) => setUsername(e.target.value)} id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" onChange={(e) => setUsermail(e.target.value)} id="email" name="email" required />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" onChange={(e) => setUsersub(e.target.value)} id="subject" name="subject" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea onChange={(e) => setContactMessage(e.target.value)} id="message" name="message" rows={5} required></textarea>
              </div>
              
              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
            
            <div className="contact-info">
              <div className="contact-item">
                <Icons.Mail />
                <span>princesahu17125@gmail.com</span>
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
            <Image 
              src="/logo.png" 
              alt="BlackMail Logo" 
              width={130} 
              height={39}
              className="footer-logo"
              priority
            />
            <p className="footer-description">
              Fast and secure disposable temporary email service. Protect your privacy and keep your inbox spam-free.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="/policy">Features</a></li>
              <li><a href="/policy">Pricing</a></li>
              <li><a href="/policy">API Documentation</a></li>
              <li><a href="/policy">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="https://linkedin.com/in/princesahu7z" target="_blank" rel="noopener noreferrer">Help Center</a></li>
              <li><a href="https://linkedin.com/in/princesahu7z" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><a href="/policy">Terms of Service</a></li>
              <li><a href="/policy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Stay Connected</h4>
            <div className="social-links">
              <a href="https://x.com/PrinceSahu69495" aria-label="Twitter">
                <Icons.X />
              </a>
              <a href="https://github.com/Prince7z" aria-label="GitHub">
                <Icons.GitHub />
              </a>
              <a href="https://linkedin.com/in/princesahu7z" aria-label="LinkedIn">
                <Icons.MessageCircle />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BlackMail. All rights reserved.</p>
        </div>
      </footer>

      {/* Toast */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* Buy Email Dialog */}
      <BuyEmailDialog
        isOpen={isBuyDialogOpen}
        onClose={() => setIsBuyDialogOpen(false)}
        email={email}
        password={pass}
        id={id}
        token={token}
      />
    </div>
  );
}