import { ApiResponse } from './api-response';

export function buildResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    message,
    data,
    statusCode: 200,
  };
}