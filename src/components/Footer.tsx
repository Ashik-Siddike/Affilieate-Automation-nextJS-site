import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Link href="/" className="text-2xl font-black text-white tracking-tighter mb-4">
          WHIT <span className="text-amber-500">LOGIC</span>
        </Link>
        <p className="text-slate-400 text-sm text-center max-w-xl mb-6">
          Your trusted source for budget tactical and sports watch reviews. We independently test and analyze the best gear for your outdoor adventures.
        </p>
        <div className="text-slate-500 text-xs text-center border-t border-slate-800 w-full pt-8">
          <p className="mb-2">
            *Whit Logic is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>
          <p>&copy; {year} Whit Logic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
