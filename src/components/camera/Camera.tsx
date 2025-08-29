"use client";

import { useRef, useEffect, useState } from "react";

interface CameraProps {
  onCapture: (imageData: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const getStream = async () => {
    try {
      // First check if the browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support camera access");
      }

      // Check camera permission status
      const permission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      if (permission.state === "denied") {
        throw new Error(
          "Camera access was denied. Please enable camera access in your browser settings and refresh the page."
        );
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setMediaStream(stream);

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to access camera. Please ensure you have granted camera permissions in your browser settings."
        );
      }
      console.error("Error accessing media devices.", err);
    }
  };

  useEffect(() => {
    getStream();
  }, []);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL and pass to parent
        const imageData = canvas.toDataURL("image/jpeg");
        onCapture(imageData);
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-2">Requesting camera access...</p>
        <p className="text-sm text-gray-500">
          Please allow access when prompted
        </p>
        <button
          onClick={getStream}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Refresh Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-video rounded-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 border-2 border-dashed border-gray-400 pointer-events-none" />
      <button
        onClick={captureImage}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        Take Photo
      </button>
    </div>
  );
}
