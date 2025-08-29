import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        Digitize Your Paper Coupons
      </h1>
      <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl">
        Never forget or lose your paper coupons again. Capture, store, and easily access your coupons right from your phone.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Link
          href="/scan"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Scan New Coupon
        </Link>
        <Link
          href="/coupons"
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View My Coupons
        </Link>
      </div>
    </div>
  );
}
