import { Injectable } from '@nestjs/common';
import { ApiResponse } from '@sec/common';

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
      ...(process.env.NODE_ENV === 'development'
        ? { error: error }
        : undefined),
      payload: null,
    });
  }

  apiResponseSuccessOrFail(params: {
    success: boolean;
    onSuccess: { message: string; payload: any };
    onFail: { message: string; payload?: any };
  }) {
    return params.success
      ? this.apiResponseSuccess({
          message: params.onSuccess.message,
          payload: params.onSuccess.payload,
        })
      : this.apiResponseFail({
          message: params.onFail.message,
          payload: params.onFail.payload,
        });
  }

  apiResponseSuccess({ message, payload }: { message: string; payload: any }) {
    return this.apiResponse({
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
}
