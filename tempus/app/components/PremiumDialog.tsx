"use client";

interface PremiumDialogProps {
  onUpgrade: () => void;
}

export function PremiumDialog({ onUpgrade }: PremiumDialogProps) {
  return (
    <div className="premium-comparison">
      <h2 className="premium-title">Choose Your Plan</h2>
      <p className="premium-subtitle">Upgrade to Premium for advanced features and unlimited access</p>
      
      <div className="comparison-table">
        <div className="comparison-header">
          <div className="feature-column">Features</div>
          <div className="plan-column free">Free Plan</div>
          <div className="plan-column premium">Premium Plan<span className="price">$5/month</span></div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Email Creation</div>
          <div className="feature-value">1 temporary email at a time</div>
          <div className="feature-value highlight">Unlimited temporary emails</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Inbox Access</div>
          <div className="feature-value">Manual refresh every 10s</div>
          <div className="feature-value highlight">Real-time auto-refresh / instant sync</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Message Storage</div>
          <div className="feature-value">Auto-delete after 24 hours</div>
          <div className="feature-value highlight">Keep emails for 30 days</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Custom Domains</div>
          <div className="feature-value">Default domains only</div>
          <div className="feature-value highlight">Choose or connect your own domain</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Bulk Actions</div>
          <div className="feature-value">—</div>
          <div className="feature-value highlight">Create/export 10+ emails at once</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">API Access</div>
          <div className="feature-value">Limited (50 requests/day)</div>
          <div className="feature-value highlight">5,000 requests/day</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Ads & Branding</div>
          <div className="feature-value">"Powered by MailJS" visible</div>
          <div className="feature-value highlight">100% ad-free + white-label option</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Webhooks / Integrations</div>
          <div className="feature-value">—</div>
          <div className="feature-value highlight">Push notifications & webhook integrations</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Support</div>
          <div className="feature-value">Community-based</div>
          <div className="feature-value highlight">Priority support + bug fixes</div>
        </div>

        <div className="comparison-row">
          <div className="feature-name">Analytics / Logs</div>
          <div className="feature-value">—</div>
          <div className="feature-value highlight">Message delivery tracking & history</div>
        </div>

        <div className="comparison-footer">
          <div></div>
          <div></div>
          <div>
            <button className="upgrade-button" onClick={onUpgrade}>
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}