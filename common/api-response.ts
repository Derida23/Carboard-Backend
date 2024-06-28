
export type ApiResponse<T> = {
  message: string;
  data?: T | T[];
  statusCode: number;
}