import { Injectable } from '@nestjs/common';
import { ApiResponse } from '@sec/common';
import { webcrypto } from 'crypto';

@Injectable()
export class UtilsService {
  apiResponse<T>(params: ApiResponse<T>): Record<string, unknown> {
    return {
      ...params,
    };
  }

  apiResponseInvalidBody(error: Error) {
    return this.apiResponse<null>({
      status: 'FAIL',
      message: 'O formulário possui dados inválidos.',
      ...(process.env.NODE_ENV === 'DEVELOPMENT'
        ? { error: error }
        : undefined),
      payload: null,
    });
  }

  apiResponseSuccessOrFail<T>(params: {
    success: boolean;
    onSuccess: { message: string; payload: T };
    onFail: { message: string; payload?: any };
  }) {
    return params.success
      ? this.apiResponseSuccess<T>({
          message: params.onSuccess.message,
          payload: params.onSuccess.payload,
        })
      : this.apiResponseFail({
          message: params.onFail.message,
          payload: params.onFail.payload,
        });
  }

  apiResponseSuccess<T>({ message, payload }: { message: string; payload: T }) {
    return this.apiResponse<T>({
      status: 'SUCCESS',
      message,
      payload,
    });
  }

  apiResponseFail({ message, payload }: { message: string; payload?: any }) {
    return this.apiResponse({
      status: 'FAIL',
      message,
      payload,
    });
  }

  apiResponseWarning({ message, payload }: { message: string; payload?: any }) {
    return this.apiResponse({
      status: 'WARNING',
      message,
      payload,
    });
  }

  generateRandomString(length = 8): string {
    return (webcrypto as any)
      .getRandomValues(new Uint32Array(Math.ceil(length / 6)))
      .reduce((acc, word) => acc + word.toString(36), '')
      .slice(0, length);
  }
}
