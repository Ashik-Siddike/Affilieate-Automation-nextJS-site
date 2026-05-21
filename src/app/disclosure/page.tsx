import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Whit Logic',
  description: 'Affiliate disclosure for Whit Logic.',
};

export default function DisclosurePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', minHeight: '60vh' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>Affiliate Disclosure</h1>
      <div className="prose-content" style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <p>Whit Logic believes in complete transparency with our audience. This disclosure page explains our affiliate relationships and how we fund our website operations.</p>
        <h2>Amazon Associates Program</h2>
        <p>Whit Logic is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.</p>
        <h2>What This Means</h2>
        <p>When you click on an Amazon link on our website and make a purchase, we may earn a small commission from Amazon at <strong>no additional cost to you</strong>. This commission helps us pay for hosting, buy new watches to review, and maintain the high quality of our content.</p>
        <h2>Impartiality</h2>
        <p>Our participation in affiliate programs does not influence our reviews or recommendations. We rigorously test all watches, and if a product is not up to standard, we will state that clearly in our review regardless of any affiliate relationship.</p>
        <p>Thank you for supporting Whit Logic by using our links. Your support allows us to continue providing honest and independent reviews!</p>
      </div>
    </div>
  );
}
