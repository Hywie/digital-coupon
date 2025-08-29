'use client';

import { useState } from 'react';
import { Camera } from '@/components/camera/Camera';

export default function ScanPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    // TODO: Implement barcode scanning and coupon saving
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setCapturedImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scan Coupon</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {capturedImage ? (
          <div>
            <img
              src={capturedImage}
              alt="Captured coupon"
              className="w-full rounded-lg mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retake Photo
              </button>
              <button
                onClick={() => {
                  // TODO: Save coupon
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Coupon
              </button>
            </div>
          </div>
        ) : (
          <Camera onCapture={handleCapture} />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">or</p>
        <label className="cursor-pointer px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
          <span>Upload from device</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}
