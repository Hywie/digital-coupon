import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Digital Coupons
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/coupons"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                My Coupons
              </Link>
              <Link
                href="/scan"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Scan Coupon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
