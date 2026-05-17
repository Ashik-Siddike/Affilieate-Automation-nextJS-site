import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter">
              WHIT <span className="text-amber-500">LOGIC</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link href="/#reviews" className="text-slate-300 hover:text-white font-medium transition-colors">
              Watch Reviews
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              href="/#reviews" 
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2 rounded-md font-bold text-sm transition-colors shadow-sm"
            >
              Latest Gear
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
