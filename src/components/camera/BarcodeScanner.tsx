"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  Result,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onError?: (error: string) => void;
}

export function BarcodeScanner({
  onBarcodeDetected,
  onError,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize the barcode reader optimized for ISBN-13 (EAN-13 format)
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]); // Set format to EAN_13 only
    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    const startScanning = async () => {
      try {
        // Check for camera permissions first
        const permission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        if (permission.state === "denied") {
          throw new Error(
            "Camera access was denied. Please enable camera access in your browser settings."
          );
        }

        // Start scanning
        if (videoRef.current) {
          setIsScanning(true);
          await reader.decodeFromConstraints(
            {
              video: {
                facingMode: "environment",
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                aspectRatio: { ideal: 1.777777778 },
                // Ask for highest quality and focus
                frameRate: { ideal: 30, min: 15 },
              },
            },
            videoRef.current,
            (result: Result | null, error: Error | undefined) => {
              if (result) {
                const barcodeText = result.getText();
                alert(barcodeText);
                // Validate ISBN-13 format (13 digits)
                if (barcodeText.length === 13 && /^\d+$/.test(barcodeText)) {
                  onBarcodeDetected(barcodeText);
                  // Pause scanning after successful detection
                  setIsScanning(false);
                  reader.reset();
                } else {
                  // Not a valid ISBN-13
                  setError("Invalid coupon barcode format. Please try again.");
                  onError?.("Invalid coupon barcode format. Please try again.");
                }
              }
              if (
                error &&
                error?.message?.includes(
                  "No MultiFormat Readers were able to detect the code"
                )
              ) {
                // Ignore "no barcode found" errors as they're expected during scanning
                return;
              }
              if (error) {
                setError(error.message);
                onError?.(error.message);
              }
            }
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to start barcode scanner";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    startScanning();

    // Cleanup
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
        setIsScanning(false);
      }
    };
  }, [onBarcodeDetected, onError]);

  if (error) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full aspect-video rounded-lg" />
      {isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="border-2 border-blue-500 rounded-lg w-48 h-24 mb-4">
            <div className="w-full h-full relative">
              {/* Corner markers for better alignment */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500" />
              {/* Scanning animation line */}
              <div className="absolute w-full h-0.5 bg-blue-500 animate-scan" />
            </div>
          </div>
          <div className="text-sm text-white bg-black/50 px-4 py-2 rounded-lg text-center">
            <p className="mb-1">Position the coupon barcode within the frame</p>
            <p className="text-xs opacity-75">Looking for 13-digit barcode</p>
            <p className="text-xs opacity-75 mt-1">
              Hold camera steady and close to barcode
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
