export type ID = string;
export type Timestamp = string;
export type Currency = number;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export type MembershipTier = 'standard' | 'premium' | 'black' | 'signature';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'active' | 'under_review' | 'suspended';
export type UserRole = 'customer' | 'companion';
