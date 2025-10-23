import React, { useState } from 'react';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';

interface RatingReviewSystemProps {
  ad: Ad;
}

const heartRatingCSS = `
.rating {
  display: flex;
  flex-direction: row-reverse;
  justify-content: start;
  gap: 4px;
}
.rating:not(:checked) > input {
  display: none;
}
.rating:not(:checked) > label {
  cursor: pointer;
  font-size: 20px;
}
.rating:not(:checked) > label > svg {
  fill: #666;
  transition:
    fill 0.3s ease,
    transform 0.3s ease;
}
.rating > input:checked ~ label > svg {
  transform: scale(1.1);
}
.rating:not(:checked) > label:hover ~ label > svg,
.rating:not(:checked) > label:hover > svg {
  transform: scale(1.05);
}
#heart1:checked ~ label > svg { fill: #ff0000; }
#heart2:checked ~ label > svg { fill: #ff4d00; }
#heart3:checked ~ label > svg { fill: #ff9900; }
#heart4:checked ~ label > svg { fill: #ccff00; }
#heart5:checked ~ label > svg { fill: #66ff00; }
#heart6:checked ~ label > svg { fill: #00ff4d; }
#heart7:checked ~ label > svg { fill: #00ff99; }
#heart8:checked ~ label > svg { fill: #00ccff; }
#heart9:checked ~ label > svg { fill: #0059ff; }
#heart10:checked ~ label > svg { fill: #9900ff; }

#heart1:hover ~ label > svg, #heart1:hover > svg { fill: #e60000 !important; }
#heart2:hover ~ label > svg, #heart2:hover > svg { fill: #e64400 !important; }
#heart3:hover ~ label > svg, #heart3:hover > svg { fill: #e68a00 !important; }
#heart4:hover ~ label > svg, #heart4:hover > svg { fill: #b8e600 !important; }
#heart5:hover ~ label > svg, #heart5:hover > svg { fill: #5ce600 !important; }
#heart6:hover ~ label > svg, #heart6:hover > svg { fill: #00e644 !important; }
#heart7:hover ~ label > svg, #heart7:hover > svg { fill: #00e68a !important; }
#heart8:hover ~ label > svg, #heart8:hover > svg { fill: #00b8e6 !important; }
#heart9:hover ~ label > svg, #heart9:hover > svg { fill: #005ce6 !important; }
#heart10:hover ~ label > svg, #heart10:hover > svg { fill: #8a00e6 !important; }
`;

const HeartRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const hearts = Array.from({ length: 10 }, (_, i) => 10 - i); // [10, 9, ..., 1]

    return (
        <>
            <style>{heartRatingCSS}</style>
            <div className="rating">
                {hearts.map(value => (
                    <React.Fragment key={value}>
                        <input
                            value={value}
                            name="rate"
                            id={`heart${value}`}
                            type="radio"
                            checked={rating === value}
                            onChange={() => setRating(value)}
                        />
                        <label htmlFor={`heart${value}`} title={`${value}/10`}>
                            <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                            </svg>
                        </label>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};


const RatingReviewSystem: React.FC<RatingReviewSystemProps> = ({ ad }) => {
  const { t } = useLocalization();
  const { addReview } = useMarketplace();
  const { promptLoginIfGuest } = useAuth();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptLoginIfGuest({ type: 'ad', id: ad.id })) return;

    if (rating > 0 && text.trim()) {
      addReview(ad.id, rating, text); // rating is 1-10
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      {!submitted && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg dark:border-gray-700 space-y-4">
          <h3 className="font-semibold">{t('social.rate_this_ad')}</h3>
          <div>
            <label className="block text-sm font-medium mb-1">{t('social.your_rating')}</label>
            <HeartRating rating={rating} setRating={setRating} />
          </div>
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium mb-1">{t('social.your_review')}</label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder={t('social.add_comment_placeholder')}
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={rating === 0 || !text.trim()}>
            {t('social.submit_review')}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {ad.reviews.length > 0 ? (
          ad.reviews.map(review => (
            <div key={review.id} className="flex items-start space-x-3 rtl:space-x-reverse border-b pb-4 dark:border-gray-700">
              <img className="h-10 w-10 rounded-full" src={review.author.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${review.author.name}`} alt={review.author.name} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{review.author.name}</span>
                  {review.rating && (
                     <div className="flex items-center font-bold text-amber-500">
                        <span>{review.rating.toFixed(1)}</span>
                        <Icon name="heart" className="w-4 h-4 ms-1 fill-current" />
                     </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.text}</p>
              </div>
            </div>
          ))
        ) : (
          !submitted && <p className="text-gray-500">{t('social.no_reviews')}</p>
        )}
      </div>
    </div>
  );
};

export default RatingReviewSystem;