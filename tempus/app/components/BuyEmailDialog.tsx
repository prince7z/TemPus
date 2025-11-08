import React from 'react';
import { Icons } from './Icons';

interface BuyEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  id: string;
  token: string;
  email: string;
}

export const BuyEmailDialog: React.FC<BuyEmailDialogProps> = ({ 
  isOpen, 
  onClose, 
  password,
  id,
  token,
  email
}) => {
  if (!isOpen) return null;

  const handleCopyCredentials = () => {
    const credentials = `Email: ${email}\nPassword: ${password}\nID: ${id}\nToken: ${token}`;
    navigator.clipboard.writeText(credentials);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Your Permanent Email Credentials</h2>
          <button className="dialog-close" onClick={onClose} aria-label="Close dialog">
            <Icons.X />
          </button>
        </div>
        
        <div className="dialog-content">
          <div className="dialog-email-display">
            <span className="dialog-email">{email}</span>
          </div>
          
          <div className="dialog-credentials">
            <div className="credential-item">
              <span className="credential-label">Password:</span>
              <span className="credential-value">{password}</span>
            </div>
            <div className="credential-item">
              <span className="credential-label">ID:</span>
              <span className="credential-value">{id}</span>
            </div>
            <div className="credential-item">
              <span className="credential-label">Token:</span>
              <span className="credential-value">{token}</span>
            </div>
          </div>
          
          <div className="dialog-info">
            <p><strong>This email is FREE and permanent!</strong></p>
            <ul>
              <li>No expiration time</li>
              <li>Full access credentials provided</li>
              <li>Keep these credentials safe</li>
            </ul>
          </div>
        </div>
        
        <div className="dialog-actions">
          <button 
            className="dialog-btn dialog-btn-cancel" 
            onClick={handleCopyCredentials}
          >
             Copy Credentials
          </button>
          <button 
            className="dialog-btn dialog-btn-confirm" 
            onClick={() => window.open("https://www.buymeacoffee.com/prince7z", "_blank")}
          >
             Buy Me a Coffee! 
          </button>
        </div>
      </div>
    </div>
  );
};
