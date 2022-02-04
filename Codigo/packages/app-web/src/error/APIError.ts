import { ApiResponse } from "@sec/common";

export class APIError extends Error {
  constructor(message: string, payload: ApiResponse<any> | null = null) {
    super(message);
    this.payload = payload;
  }

  payload: ApiResponse<any> | null;
}
