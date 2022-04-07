import { ButtonVariant } from '@GlobalTypes';
import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';

type ButtonRoundedProps = {
  isBig?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
} & ButtonProps;

const ButtonRounded: React.FunctionComponent<ButtonRoundedProps> = ({
  children,
  isLoading,
  disabled,
  className,
  variant,
  ...props
}) => {
  return (
    <Button
      {...props}
      className={`btn ${variant ? '' : 'btn-success'} rounded-lg ${className}`}
      disabled={disabled ?? isLoading}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Spinner animation='border' size='sm' /> Processando...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonRounded;
