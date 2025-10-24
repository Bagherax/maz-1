import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import AvatarUploader from '../../auth/components/registration/AvatarUploader';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface AvatarUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AvatarUpdateModal: React.FC<AvatarUpdateModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserAvatar } = useAuth();
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        if (newAvatar) {
            setIsSaving(true);
            try {
                // The updateUserAvatar function will handle refreshing the user state
                await updateUserAvatar(user.id, newAvatar);
            } catch (error) {
                console.error("Failed to update avatar", error);
                alert("Failed to update avatar.");
            } finally {
                setIsSaving(false);
                onClose();
            }
        } else {
            onClose(); // Close if no new avatar was selected
        }
    };

    return (
         <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center mb-6">Update Profile Picture</h2>
                <AvatarUploader 
                    onAvatarChange={setNewAvatar}
                    currentAvatar={user.avatar}
                    // Pass null to reset preview when modal opens, unless newAvatar is already set
                    initialPreview={newAvatar} 
                />
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={!newAvatar || isSaving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 flex justify-center items-center min-w-[80px] min-h-[40px]"
                    >
                        {isSaving ? <LoadingSpinner size="sm" /> : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarUpdateModal;