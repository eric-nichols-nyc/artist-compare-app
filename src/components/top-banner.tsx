import Link from 'next/link';

export default function TopBanner() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center text-white font-bold rounded">
                V
              </div>
              <span className="font-bold text-lg">VIBERATE Analytics</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Features
              </Link>
              <Link href="#use-cases" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Use Cases
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Pricing
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2"
              >
                Log In
              </Link>
              <Link
                href="/admin/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started For Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 