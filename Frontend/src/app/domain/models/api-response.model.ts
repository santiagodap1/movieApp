export interface ApiResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
