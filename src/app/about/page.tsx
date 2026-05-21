import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Whit Logic',
  description: 'Learn about Whit Logic, your trusted source for independent budget tactical and sports watch reviews.',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px', minHeight: '60vh' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>About Whit Logic</h1>
      <div className="prose-content" style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <p>Welcome to <strong>Whit Logic</strong>, the ultimate destination for enthusiasts who appreciate tough, reliable, and affordable timepieces.</p>
        <h2>Our Mission</h2>
        <p>Our mission is simple: to test, analyze, and report on the best budget tactical and sports watches available today. We believe that you don't need to spend thousands of dollars to get a watch that can withstand extreme conditions, outdoor adventures, and intense military training.</p>
        <h2>What We Do</h2>
        <p>We purchase and vigorously test watches from popular budget brands like SKMEI, CURREN, and SMAEL. Our expert team evaluates each watch based on durability, water resistance, functionality, and overall value for money. When you read a review on Whit Logic, you can be confident that it is based on real-world testing.</p>
        <h2>Why Trust Us?</h2>
        <p>We are completely independent. We do not accept sponsorships from watch manufacturers to guarantee positive reviews. Our affiliate links help keep the site running, but our opinions are entirely our own. If a watch is terrible, we will tell you.</p>
      </div>
    </div>
  );
}
