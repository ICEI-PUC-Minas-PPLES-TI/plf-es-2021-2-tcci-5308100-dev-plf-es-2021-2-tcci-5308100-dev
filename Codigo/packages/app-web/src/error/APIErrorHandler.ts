import { ToastMessenger } from '@Components/toasts/types';
import { APIError } from './APIError';

export const createAsyncErrorHandler = (
  error: APIError,
  { messageReporter }: { messageReporter: ToastMessenger },
) => {
  if (error.payload) {
    messageReporter({ message: error.message });
  } else {
    messageReporter({
      message: 'Ocorreu um erro inesperado. Por favor, recarregue a página e tente novamente.',
    });
  }
};
