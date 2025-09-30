'use client';

import type { FC } from 'react';

type ChevronIconProps = {
  className?: string;
};

export const ChevronIcon: FC<ChevronIconProps> = ({ className }) => (
  <div
    className={`ml-4 flex-shrink-0 transition-transform duration-300 group-active:translate-x-0.5 md:group-hover:translate-x-1 ${className}`}
  >
    <svg
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chevronGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <path
        className="opacity-60 transition-opacity duration-300 group-active:opacity-80 md:group-hover:opacity-100"
        d="m9 18 6-6-6-6"
        stroke="url(#chevronGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
);
