'use client';

import type { FC } from 'react';

const AdminLoading: FC = () => (
  <div className="animate-pulse p-8">
    <div className="mb-6 h-6 w-44 rounded bg-gray-200" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="h-64 rounded bg-gray-100" />
      <div className="h-64 rounded bg-gray-100" />
    </div>
  </div>
);

export default AdminLoading;
