// Export all types
export * from './user';
export * from './project';
export * from './order';

// Common types utilisés partout
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
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
export interface DateRange {
  from: Date;
  to: Date;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
