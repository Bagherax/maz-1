import React, { useRef, useEffect, useState } from 'react';
import Icon from './Icon';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStream(stream);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions and ensure no other app is using it.");
      }
    };

    enableStream();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[101] flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-black rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-t-lg aspect-video object-cover" />
        {error && <p className="text-red-500 text-center p-4">{error}</p>}
        <div className="p-4 flex justify-center items-center gap-4 bg-gray-900 rounded-b-lg">
            <button
                onClick={handleCapture}
                disabled={!stream}
                aria-label="Capture photo"
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 disabled:opacity-50 transition-transform hover:scale-105"
            >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-black"></div>
            </button>
        </div>
         <button onClick={onClose} aria-label="Close camera" className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
            <Icon name="close" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
