export default function ScanPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scan Coupon</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          {/* Camera component will be added here */}
          <p className="text-gray-500">Camera preview will appear here</p>
        </div>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Take Photo
        </button>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">or</p>
        <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
          Upload from device
        </button>
      </div>
    </div>
  );
}
