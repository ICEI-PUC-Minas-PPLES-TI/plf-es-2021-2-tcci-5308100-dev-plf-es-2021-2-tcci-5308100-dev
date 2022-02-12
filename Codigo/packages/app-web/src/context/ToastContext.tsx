import moment from 'moment';
import { createContext, useState } from 'react';
import { Toast } from 'react-bootstrap';

enum ToastVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark',
}

type ToastMessenger = {
  type: ToastVariant;
  title: string;
  timeAgo?: string;
  message: string;
  icon?: string;
  timeout?: number;
};

export type ToastFunction = {
  title?: string;
  timeAgo?: string;
  message: string;
  icon?: string;
  timeout?: number;
};

type ToastContextState = {
  showToastInfo: (data: ToastFunction) => void;
  showToastSuccess: (data: ToastFunction) => void;
  showToastWarning: (data: ToastFunction) => void;
  showToastDanger: (data: ToastFunction) => void;
  showToast: (data: ToastMessenger) => void;
};

type MakerToast = ToastMessenger & { id: string };

const ToastContext = createContext<ToastContextState>({} as ToastContextState);

const ToastProvider: React.FunctionComponent = ({ children }) => {
  const defaultTime = 8;

  const [toasts, setToasts] = useState<{ [index: string]: MakerToast }>({});
  const [states, setStates] = useState<{ [index: string]: boolean }>({});

  const updateState = (id: string, status: boolean, timeout?: number) => {
    setStates({ ...states, [id]: status });

    if (!!timeout && status) {
      setTimeout(() => {
        setToasts(({ [id]: current, ...prev }) => ({ ...prev }));
        setStates(({ [id]: current, ...prev }) => ({ ...prev }));
      }, Number(timeout) * 1000 + 100 || defaultTime * 1000 + 100);
    }
  };

  const createComponent = ({ id, type, icon, title, timeAgo, message, timeout }: MakerToast) => (
    <Toast
      key={`Toast-${id}`}
      className='d-inline-block m-1'
      show={states[id]}
      onClose={() => updateState(id, false)}
      bg={type}
      autohide={timeout !== 0}
      delay={Number(timeout) * 1000 || defaultTime * 1000}
    >
      <Toast.Header>
        <i className={`${icon} me-1 mb-1`}></i>
        <strong className='me-auto'>{title}</strong>
        {timeAgo && <small>{timeAgo}</small>}

        <div
          className='timer'
          style={{
            ['--duration' as any]: timeout || defaultTime,
            ['--size' as any]: 20,
            ['--time-background-color-a' as any]: `rgba(var(--bs-${type}-rgb),var(--bs-bg-opacity))`,
            ['--time-background-color-b' as any]: timeout !== 0 ? '#eee' : '',
            position: 'relative',
            right: '-33px',
          }}
        >
          <div className='mask'></div>
        </div>
      </Toast.Header>
      <Toast.Body className={['success', 'dark'].includes(type) ? 'text-white' : ''}>{message}</Toast.Body>
    </Toast>
  );

  const createToast = (props: ToastMessenger) => {
    const id = moment().format('x');
    updateState(id, true, props.timeout);

    const toast = {
      ...props,
      id: id,
    };

    setToasts({ ...toasts, [id]: toast });
  };
  return (
    <ToastContext.Provider
      value={{
        showToastInfo: (props) => createToast({ title: 'Atenção!', ...props, type: ToastVariant.INFO }),
        showToastSuccess: (props) => createToast({ title: 'Atenção!', ...props, type: ToastVariant.SUCCESS }),
        showToastWarning: (props) => createToast({ title: 'Atenção!', ...props, type: ToastVariant.WARNING }),
        showToastDanger: (props) => createToast({ title: 'Atenção!', icon: 'far fa-bell', ...props, type: ToastVariant.DANGER }),
        showToast: (props) => createToast(props),
      }}
    >
      <>
        <div className='toast-container'>{Object.values(toasts).map((toast) => createComponent(toast))}</div>
        {children}
      </>
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
