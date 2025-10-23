import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import Icon from '../../components/Icon';

interface MessageInputProps {
  conversationId: string;
  isBlocked: boolean;
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const MessageInput: React.FC<MessageInputProps> = ({ conversationId, isBlocked }) => {
  const [content, setContent] = useState('');
  const { sendMessage, sendMediaMessage, setTyping } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      return () => {
          if (recordingIntervalRef.current) {
              clearInterval(recordingIntervalRef.current);
          }
      }
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    setTyping(conversationId);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(conversationId, content);
      setContent('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
      const file = e.target.files?.[0];
      if (file) {
          await sendMediaMessage(conversationId, file, type);
      }
  };

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const options = { mimeType: 'audio/webm' };
          const recorder = new MediaRecorder(stream, options);
          mediaRecorderRef.current = recorder;
          
          const audioChunks: Blob[] = [];
          recorder.ondataavailable = (event) => {
              audioChunks.push(event.data);
          };

          recorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: options.mimeType });
              const audioUrl = URL.createObjectURL(audioBlob);

              const audio = new Audio(audioUrl);
              audio.onloadedmetadata = () => {
                const duration = audio.duration;
                const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: options.mimeType });
                
                sendMediaMessage(conversationId, audioFile, 'voice', { duration });
                URL.revokeObjectURL(audioUrl);
              };
              
              stream.getTracks().forEach(track => track.stop());
          };

          recorder.start();
          setIsRecording(true);
          setRecordingTime(0);
          recordingIntervalRef.current = window.setInterval(() => {
              setRecordingTime(prev => prev + 1);
          }, 1000);

      } catch (err) {
          console.error("Error accessing microphone:", err);
          alert("Could not access microphone. Please check permissions.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (recordingIntervalRef.current) {
              clearInterval(recordingIntervalRef.current);
          }
      }
  };

  if (isBlocked) {
      return (
          <div className="p-4 border-t dark:border-gray-700 text-center text-sm text-gray-500">
              You cannot reply to this conversation.
          </div>
      )
  }

  return (
    <div className="p-4 border-t dark:border-gray-700">
      {isRecording ? (
        <div className="flex items-center gap-2">
            <button onClick={stopRecording} className="p-3 bg-red-500 text-white rounded-full"><Icon name="stop-circle" className="w-5 h-5"/></button>
            <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
            </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
            <button type="button" onClick={startRecording} className="p-3 text-gray-500 hover:text-indigo-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon name="microphone" className="w-5 h-5"/>
            </button>
            <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'image')}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, 'file')}
            />
            <button type="button" onClick={() => imageInputRef.current?.click()} className="p-3 text-gray-500 hover:text-indigo-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon name="photo" className="w-5 h-5"/>
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-indigo-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon name="paperclip" className="w-5 h-5"/>
            </button>
            <input
            type="text"
            value={content}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 w-full p-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
            type="submit"
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={!content.trim()}
            >
            <Icon name="paper-airplane" className="w-5 h-5" />
            </button>
        </form>
      )}
    </div>
  );
};

export default MessageInput;