
export type ApiResponse<T> = {
  message: string;
  data?: T | T[];
  meta?: MetaResponse;
  statusCode: number;
}

export type MetaResponse = {
  total: number;
  page: number;
  per_page: number;
}