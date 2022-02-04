export interface ToastMessengerInterface {
  type: string;
  message: string;
  icon?: string;
  timeout?: number;
}

export interface ToastInterface {
  message: string;
  icon?: string;
  timeout?: number;
}

export type ToastMessenger = (params: ToastInterface) => void;
