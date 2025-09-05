'use client'

import type { FC } from 'react'

type ChevronIconProps = {
  className?: string
}

export const ChevronIcon: FC<ChevronIconProps> = ({className}) => (
  <div className={`flex-shrink-0 ml-4 transition-transform duration-300 md:group-hover:translate-x-1 group-active:translate-x-0.5 ${className}`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chevronGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <path
        d="m9 18 6-6-6-6"
        stroke="url(#chevronGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-60 md:group-hover:opacity-100 group-active:opacity-80 transition-opacity duration-300"
      />
    </svg>
  </div>
)
