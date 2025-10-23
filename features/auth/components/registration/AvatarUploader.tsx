import React, { useState, ChangeEvent, useRef } from 'react';
import Icon from '../../../../components/Icon';
import CameraCapture from '../../../../components/CameraCapture';

interface AvatarUploaderProps {
  onAvatarChange: (base64: string) => void;
  currentAvatar?: string;
  initialPreview?: string | null;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onAvatarChange, currentAvatar, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview !== undefined ? initialPreview : currentAvatar || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onAvatarChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = (base64: string) => {
    setPreview(base64);
    onAvatarChange(base64);
    setIsCameraOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-32 w-32 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 overflow-hidden group">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <Icon name="user-circle" className="w-20 h-20" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="photo" className="w-8 h-8 text-white" />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        <div className="flex gap-4">
            <button type="button" onClick={handleUploadClick} className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                <Icon name="arrow-down-tray" className="w-4 h-4" />
                <span>Upload</span>
            </button>
            <button type="button" onClick={() => setIsCameraOpen(true)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                <Icon name="camera" className="w-4 h-4"/>
                <span>Take Photo</span>
            </button>
        </div>
      </div>
      {isCameraOpen && (
        <CameraCapture 
            onCapture={handleCapture}
            onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
};

export default AvatarUploader;
