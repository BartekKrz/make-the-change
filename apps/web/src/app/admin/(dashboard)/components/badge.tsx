import { FC, PropsWithChildren } from "react";

type BadgeProps = {
  color?: 'gray' | 'green' | 'blue' | 'red' | 'yellow'
}

export const Badge: FC<PropsWithChildren & BadgeProps> = ({ children, color = 'gray' }) => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colors[color]}`}>{children}</span>
  )
};
