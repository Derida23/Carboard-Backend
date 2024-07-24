import { ApiResponse, MetaResponse } from './api-response';

export function buildResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    message,
    data,
    statusCode: 200,
  };
}
export function buildResponseMeta<T>(message: string, data: T, meta: MetaResponse ): ApiResponse<T> {
  return {
    message,
    data,
    meta,
    statusCode: 200,
  };
}