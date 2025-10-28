export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  timestamp?: string;
  path?: string;
  requestId?: string;
}
