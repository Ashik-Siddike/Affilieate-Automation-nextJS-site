import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Whit Logic',
  description: 'Privacy Policy for Whit Logic.',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', minHeight: '60vh' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>Privacy Policy</h1>
      <div className="prose-content" style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
        <h2>Introduction</h2>
        <p>At Whit Logic, we are committed to protecting your privacy and ensuring your personal information is handled securely.</p>
        <h2>Information We Collect</h2>
        <p>We may collect personal information such as your name and email address when you voluntarily subscribe to our newsletter or contact us. We also automatically collect non-personally identifiable information through cookies and analytics tools, such as your IP address, browser type, and browsing behavior on our site.</p>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To personalize your user experience and improve our website.</li>
          <li>To send periodic emails (if you subscribe to our newsletter).</li>
          <li>To analyze website traffic and optimize our content.</li>
        </ul>
        <h2>Cookies</h2>
        <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction.</p>
        <h2>Third-Party Disclosure</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>
      </div>
    </div>
  );
}
