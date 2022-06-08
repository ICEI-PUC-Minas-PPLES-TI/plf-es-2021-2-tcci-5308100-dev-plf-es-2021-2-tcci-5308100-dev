import { Variant } from '@GlobalTypes';
import React from 'react';

interface AlertProps {
  title: string;
  text: string;
  variant: Variant;
  isShow?: boolean;
}

const Alert: React.FunctionComponent<AlertProps> = ({ title, text, variant, isShow }) => {
  return (
    <div className={`alert alert-${variant} ${isShow === undefined ? '' : isShow ? 'd-block' : 'd-none'}`} role='alert'>
      <b>{title}</b> {text}
    </div>
  );
};

export default Alert;
