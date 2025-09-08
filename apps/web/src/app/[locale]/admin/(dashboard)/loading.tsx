'use client'

import type { FC } from "react";

 const AdminLoading: FC = () => (
  <div className="p-8 animate-pulse">
    <div className="h-6 w-44 bg-gray-200 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-64 bg-gray-100 rounded" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>
  </div>
);

export default AdminLoading
