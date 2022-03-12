import axios, { AxiosError } from 'axios';
import { ToastFunction } from '~/context/ToastContext';
import { APIError } from './APIError';

export const defaultErrorHandler = (error: APIError | AxiosError | Error | unknown, messageReporter: (data: ToastFunction) => void) => {
  if (error instanceof APIError) {
    //TODO: ZIP Error
    messageReporter({ message: error.message });
  } else if (axios.isAxiosError(error) && error.response?.data.message) {
    messageReporter({ message: error.response?.data.message });
  } else {
    messageReporter({
      message: 'Ocorreu um erro inesperado. Por favor, recarregue a página e tente novamente.',
    });
  }
};
