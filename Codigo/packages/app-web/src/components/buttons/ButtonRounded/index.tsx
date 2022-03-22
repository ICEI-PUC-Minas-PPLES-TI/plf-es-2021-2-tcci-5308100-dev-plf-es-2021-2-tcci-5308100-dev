import React, { ButtonHTMLAttributes } from 'react';

type ButtonRoundedProps = { isBig?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonRounded: React.FunctionComponent<ButtonRoundedProps> = ({ children }) => {
  return <button className='btn  btn-success rounded-lg'>{children}</button>;
};
