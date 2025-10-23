import React, { useState } from 'react';
import { Ad, Comment } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useAuth } from '../../../../hooks/useAuth';
import Icon from '../../../../components/Icon';

interface CommentSystemProps {
  ad: Ad;
}

const CommentForm: React.FC<{
  adId: string;
  parentId?: string;
  onCommentPosted: () => void;
}> = ({ adId, parentId, onCommentPosted }) => {
  const { t } = useLocalization();
  const { addComment, addReplyToComment } = useMarketplace();
  const { promptLoginIfGuest } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptLoginIfGuest({ type: 'ad', id: adId })) return;

    if (text.trim()) {
      if (parentId) {
        addReplyToComment(adId, parentId, text);
      } else {
        addComment(adId, text);
      }
      setText('');
      onCommentPosted();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 rtl:space-x-reverse mt-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
        placeholder={t('social.add_comment_placeholder')}
        required
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
        {parentId ? t('social.reply') : t('social.add_comment_button')}
      </button>
    </form>
  );
};

const CommentItem: React.FC<{ adId: string, comment: Comment, level?: number }> = ({ adId, comment, level = 0 }) => {
  const { t } = useLocalization();
  const { deleteComment } = useMarketplace();
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={`flex items-start space-x-3 rtl:space-x-reverse ${level > 0 ? 'ms-8' : ''}`}>
      <img className="h-10 w-10 rounded-full" src={comment.author.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${comment.author.name}`} alt={comment.author.name} />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{comment.author.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{comment.text}</p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 mt-1">
          <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:underline">{t('social.reply')}</button>
           {currentUser?.isAdmin && (
            <button 
              onClick={() => deleteComment(adId, comment.id)}
              title={t('moderation.delete_comment')} 
              className="text-gray-400 hover:text-red-500 ripple rounded-full p-1"
            >
              <Icon name="trash" className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showReplyForm && <CommentForm adId={adId} parentId={comment.id} onCommentPosted={() => setShowReplyForm(false)} />}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => <CommentItem key={reply.id} adId={adId} comment={reply} level={level + 1} />)}
          </div>
        )}
      </div>
    </div>
  );
};


const CommentSystem: React.FC<CommentSystemProps> = ({ ad }) => {
  const { t } = useLocalization();
  return (
    <div className="space-y-6">
      <CommentForm adId={ad.id} onCommentPosted={() => {}} />

      {/* Existing comments */}
      <div className="space-y-4 pt-4 border-t dark:border-gray-700">
        {ad.comments.length > 0 ? (
          ad.comments.map(comment => (
            <CommentItem key={comment.id} adId={ad.id} comment={comment} />
          ))
        ) : (
          <p className="text-gray-500">{t('social.no_comments')}</p>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;