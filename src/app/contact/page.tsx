import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Whit Logic',
  description: 'Get in touch with the Whit Logic team.',
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', minHeight: '60vh' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>Contact Us</h1>
      <div className="prose-content" style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <p>We'd love to hear from you! Whether you have a question about a specific watch, a suggestion for a future review, or a business inquiry, feel free to reach out.</p>
        <h2>Get in Touch</h2>
        <p>Email us at: <strong style={{ color: '#f59e0b' }}>contact@whitlogic.com</strong></p>
        <p>We aim to respond to all inquiries within 24-48 hours.</p>
        <h2>Social Media</h2>
        <p>You can also connect with us on our social media platforms for the latest updates, quick questions, and community discussions.</p>
        <ul>
          <li><strong>Facebook:</strong> @whitlogic</li>
          <li><strong>Twitter/X:</strong> @whitlogic</li>
          <li><strong>Instagram:</strong> @whitlogic</li>
        </ul>
      </div>
    </div>
  );
}
