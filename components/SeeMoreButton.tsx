
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const SeeMoreButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => {
  const { t } = useLocalization();
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's main click event
    onClick(e);
  };
  return (
    <button onClick={handleClick} className="absolute bottom-2 right-2 border text-gray-50 duration-300 group cursor-pointer overflow-hidden h-10 w-28 rounded-md bg-neutral-800 p-2 font-extrabold hover:bg-sky-700 opacity-0 group-hover:opacity-100 transition-opacity z-20">
      <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150 duration-700 right-12 top-12 bg-yellow-500"></div>
      <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-12 h-12 rounded-full group-hover:scale-150 duration-700 right-20 -top-6 bg-orange-500"></div>
      <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-8 h-8 rounded-full group-hover:scale-150 duration-700 right-32 top-6 bg-pink-500"></div>
      <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-4 h-4 rounded-full group-hover:scale-150 duration-700 right-2 top-12 bg-red-600"></div>
      <p className="z-10 absolute bottom-2 left-2 text-sm">{t('general.see_more')}</p>
    </button>
  );
};

export default SeeMoreButton;