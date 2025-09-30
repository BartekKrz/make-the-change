'use client';

import { Link } from '@/i18n/navigation';

import type { ComponentProps } from 'react';

export function LocalizedLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />;
}
