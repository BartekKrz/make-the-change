// Export all types
export * from './user';
export * from './project';
export * from './order';

// Common types utilisés partout
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PaginationParams = {
  page: number;
  limit: number;
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Types pour les filtres communs
export type DateRange = {
  from: Date;
  to: Date;
}

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
}
