"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

export function Barcode({
  value,
  width = 2,
  height = 100,
  displayValue = true,
}: BarcodeProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format: "EAN13",
          width,
          height,
          displayValue,
          font: "monospace",
          fontSize: 16,
          margin: 10,
          background: "#f9fafb", // Matches bg-gray-50
        });
      } catch (error) {
        console.error("Failed to generate barcode:", error);
      }
    }
  }, [value, width, height, displayValue]);

  return <svg ref={barcodeRef} className="w-full" />;
}
