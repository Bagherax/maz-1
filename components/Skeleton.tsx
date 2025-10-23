import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <span
      className={`inline-block bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ${className}`}
      style={style}
    >
      &zwnj; {/* Zero-width non-joiner to give the span some height based on font size */}
    </span>
  );
};

export default Skeleton;
