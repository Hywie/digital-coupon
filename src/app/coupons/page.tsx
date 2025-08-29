export default function CouponsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Coupons</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search coupons..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="used">Used</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example coupon card - will be mapped over actual data */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4"></div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">Sample Coupon</h3>
              <p className="text-sm text-gray-600">Expires: Dec 31, 2025</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active
            </span>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Show Barcode
          </button>
        </div>
      </div>
    </div>
  );
}
