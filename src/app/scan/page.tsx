"use client";

import { useState } from "react";
import { BarcodeScanner } from "@/components/camera/BarcodeScanner";

export default function ScanPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBarcodeDetected = (barcode: string) => {
    setScannedBarcode(barcode);
    // TODO: Proceed to expiry date input
  };

  const handleError = (error: string) => {
    setError(error);
  };

  const handleRetry = () => {
    setScannedBarcode(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Scan Coupon</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {scannedBarcode ? (
          <div className="text-center">
            <p className="text-lg mb-4">Barcode detected!</p>
            <p className="font-mono bg-gray-100 p-2 rounded mb-4">
              {scannedBarcode}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Scan Again
              </button>
              <button
                onClick={() => {
                  // TODO: Navigate to expiry date input
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div>
            <BarcodeScanner
              onBarcodeDetected={handleBarcodeDetected}
              onError={handleError}
            />
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center text-sm text-gray-600">
        <p>Position the barcode within the frame</p>
        <p>Keep the device steady for best results</p>
      </div>
    </div>
  );
}
