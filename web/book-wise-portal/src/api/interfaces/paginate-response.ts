export interface PaginateResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
