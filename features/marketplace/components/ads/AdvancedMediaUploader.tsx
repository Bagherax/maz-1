import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import Icon from '../../../../components/Icon';
import { useNotification } from '../../../../hooks/useNotification';
import { useLocalization } from '../../../../hooks/useLocalization';

const uploaderCSS = `
.container {
  --transition: 350ms;
  --folder-W: 120px;
  --folder-H: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  height: calc(var(--folder-H) * 1.7);
  position: relative;
  width: 160px;
  margin: 0 auto;
}

.folder {
  position: absolute;
  top: -20px;
  left: calc(50% - 60px);
  animation: float 2.5s infinite ease-in-out;
  transition: transform var(--transition) ease;
}

.folder:hover {
  transform: scale(1.05);
}

.folder .front-side,
.folder .back-side {
  position: absolute;
  transition: transform var(--transition);
  transform-origin: bottom center;
}

.folder .back-side::before,
.folder .back-side::after {
  content: "";
  display: block;
  background-color: white;
  opacity: 0.5;
  z-index: 0;
  width: var(--folder-W);
  height: var(--folder-H);
  position: absolute;
  transform-origin: bottom center;
  border-radius: 15px;
  transition: transform 350ms;
  z-index: 0;
}

.container:hover .back-side::before {
  transform: rotateX(-5deg) skewX(5deg);
}
.container:hover .back-side::after {
  transform: rotateX(-15deg) skewX(12deg);
}

.folder .front-side {
  z-index: 1;
}

.container:hover .front-side {
  transform: rotateX(-40deg) skewX(15deg);
}

.folder .tip {
  background: linear-gradient(135deg, #ff9a56, #ff6f56);
  width: 80px;
  height: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: -10px;
  z-index: 2;
}

.folder .cover {
  background: linear-gradient(135deg, #ffe563, #ffc663);
  width: var(--folder-W);
  height: var(--folder-H);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.custom-file-upload {
  font-size: 1.1em;
  color: #ffffff;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background var(--transition) ease;
  display: inline-block;
  width: 100%;
  padding: 10px 35px;
  position: relative;
}

.custom-file-upload:hover {
  background: rgba(255, 255, 255, 0.4);
}

.custom-file-upload input[type="file"] {
  display: none;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}
`;

export interface MediaItem {
  type: 'image' | 'video';
  url: string; // dataURL
}

interface AdvancedMediaUploaderProps {
  mediaItems: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  maxFiles?: number;
}

const AdvancedMediaUploader: React.FC<AdvancedMediaUploaderProps> = ({
  mediaItems = [],
  onMediaChange,
  maxFiles = 24,
}) => {
  const { addNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentCount = mediaItems.length;
    const availableSlots = maxFiles - currentCount;

    if (files.length > availableSlots) {
      addNotification(`You can only upload ${availableSlots} more file(s). Uploading the first ${availableSlots}.`, 'warning');
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    
    Promise.all(filesToProcess.map(file => {
        return new Promise<MediaItem>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                const type = file.type.startsWith('image/') ? 'image' : 'video' as 'image' | 'video';
                resolve({ type, url });
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    })).then(newItems => {
        onMediaChange([...mediaItems, ...newItems]);
    }).catch(error => {
        console.error("Error reading files:", error);
        addNotification("There was an error processing the files.", "error");
    });
    
    // Reset file input to allow selecting the same file again
    e.target.value = '';
  };
  
  const handleRemoveItem = (index: number) => {
    onMediaChange(mediaItems.filter((_, i) => i !== index));
  };

  return (
    <>
      <style>{uploaderCSS}</style>
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Upload Images & Videos</h4>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{mediaItems.length} / {maxFiles}</span>
        </div>
        
        {mediaItems.length < maxFiles && (
          <div className="container" onClick={() => fileInputRef.current?.click()}>
            <div className="folder">
              <div className="front-side">
                <div className="tip"></div>
                <div className="cover"></div>
              </div>
              <div className="back-side cover"></div>
            </div>
            <label className="custom-file-upload">
              <input 
                ref={fileInputRef} 
                className="title" 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
              />
              Choose files
            </label>
          </div>
        )}

        {mediaItems.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
            {mediaItems.map((item, index) => (
              <div key={index} className="relative group aspect-square">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover rounded-lg shadow" alt="upload preview" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover rounded-lg bg-black shadow" />
                )}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg pointer-events-none">
                    <Icon name="video" className="w-8 h-8 text-white" />
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(index)} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Remove media"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdvancedMediaUploader;