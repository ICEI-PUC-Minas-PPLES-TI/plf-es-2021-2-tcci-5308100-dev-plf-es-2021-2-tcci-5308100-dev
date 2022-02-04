import React, { CSSProperties, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ToastInterface, ToastMessengerInterface } from './types';

enum Types {
  AlertInfo = 'alert-info',
  AlertSuccess = 'alert-success',
  AlertWarning = 'alert-warning',
  AlertDanger = 'alert-danger',
}

const AlertNotification: React.FunctionComponent<ToastMessengerInterface> = (props) => {
  const size = 26;
  const viewBox = `0 0 ${size} ${size}`;
  const center = size * 0.5;
  const raio = size * 0.4;
  const raioCalc = 2 * Math.PI * raio;

  const time = props.timeout ? props.timeout : 5;

  const [style, setStyle] = useState<CSSProperties>({ opacity: '0', top: '0px' });
  const [strokeDasharray, setStrokeDasharray] = useState<CSSProperties>({ strokeDasharray: `${raioCalc} ${raioCalc}` });

  useEffect(() => {
    showNotification();
    props.timeout !== 0 && setTimeout(hideNotification, time * 1000 + 100);
  }, []);

  const showNotification = () => {
    setStyle({ opacity: '1', top: '20px' });
    props.timeout !== 0 && setTimeout(() => {
      setStrokeDasharray({ strokeDasharray: `${raioCalc * ((time - 1) / time)} ${raioCalc}` });
      timer(time - 1);
    }, 100);
  };

  const hideNotification = () => {
    setStyle({ opacity: '0', top: '0px' });
    setTimeout(() => {
      setStyle({ display: 'none' });
    }, 500);
  };

  const timer = (count: number) =>
    new Promise((res) => {
      const counter = setInterval(() => {
        count = count - 1;
        setStrokeDasharray({ strokeDasharray: `${raioCalc * (count / time)} ${raioCalc}` });

        if (count < 0) {
          clearInterval(counter);
          setStrokeDasharray({ strokeDasharray: `0 ${raioCalc}`, display: 'none' });
          res('');
          return;
        }
      }, 1000);
    });

  return (
    <div
      data-notify="container"
      className={`col-sm-8 col-md-6 col-lg-4 alert alert-with-icon ${props.type}`}
      role="alert"
      data-notify-position="top-right"
      style={{
        display: 'inline-block',
        margin: '0px auto',
        position: 'fixed',
        transition: 'all 0.5s ease-in-out 0s',
        zIndex: 2000,
        right: '20px',
        ...style,
      }}
    >
      <div className="base-timer">
        <svg className="base-timer-svg" viewBox={viewBox} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <circle className="base-timer-path-elapsed" cx={center} cy={center} r={raio} />
          <circle className="base-timer-path-elapsed-2" cx={center} cy={center} r={raio} style={{ ...strokeDasharray }} />
        </svg>
        <span className="base-timer-label" style={{ cursor: 'pointer' }}>
          <i className="fas fa-times" onClick={hideNotification} />
        </span>
      </div>
      <span data-notify="icon" className={props.icon ? props.icon : 'nc-icon nc-bell-55'}></span> <span data-notify="title"></span>
      <span data-notify="message" style={{ display: 'block', width: '93%' }}>
        {props.message}
      </span>
      <a href="#" target="_blank" data-notify="url"></a>
    </div>
  );
};

const showAlert = (props: ToastMessengerInterface) => {
  const alertContainer = document.createElement('div');
  document.body.appendChild(alertContainer);
  ReactDOM.render(<AlertNotification {...props} />, alertContainer);
    setTimeout(
      () => {
        document.body.removeChild(alertContainer);
      },
      props.timeout === 0 ? 60000 : props.timeout ? props.timeout * 1000 + 600 : 6000
    );
};

const showAlertInfo = (data: ToastInterface) => {
  showAlert({ ...data, type: Types.AlertInfo });
  return undefined
};
const showAlertSuccess = (data: ToastInterface) => {
  showAlert({ ...data, type: Types.AlertSuccess });
  return undefined
};
const showAlertWarning = (data: ToastInterface) => {
  showAlert({ ...data, type: Types.AlertWarning });
  return undefined
};
const showAlertDanger = (data: ToastInterface) => {
  showAlert({ ...data, type: Types.AlertDanger });
  return undefined
};

export { showAlertInfo, showAlertSuccess, showAlertWarning, showAlertDanger };
