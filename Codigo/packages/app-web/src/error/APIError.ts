import { ApiResponse } from '@sec/common';

export class APIError extends Error {
  constructor(message: string, payload: ApiResponse<any>, headers: any) {
    super(message);
    this.payload = payload;
    this.headers = headers;
  }

  payload: ApiResponse<any>;
  headers: any;
}
