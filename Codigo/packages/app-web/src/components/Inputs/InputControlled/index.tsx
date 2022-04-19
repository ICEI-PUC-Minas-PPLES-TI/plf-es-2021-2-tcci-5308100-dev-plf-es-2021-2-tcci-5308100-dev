import { InputControlledProps } from '~/components/Inputs/BaseController/types';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import SpinLoading from '~/components/loading/SpinLoading';
import BaseController from '../BaseController';
const { Group, Control } = Form;

// <T>(props: InputControlledProps<T>) => JSX.Element
// React.FunctionComponent<InputControlledProps>
const InputControlled: <T>(props: InputControlledProps<T>) => JSX.Element = ({
  type,
  isDisabled,
  onBlur,
  inputStyle,
  placeholder,
  maxLength,
  autoComplete,
  ...rest
}) => {
  return (
    <BaseController
      {...rest}
      render={({ ref, value, onChange }) => (
        <Control
          autoComplete={autoComplete}
          ref={ref}
          type={type}
          value={value}
          disabled={isDisabled}
          style={inputStyle}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.target.value;
            if (type === 'number') onChange(value === '' ? undefined : +value);
            onChange(value);
          }}
          onBlur={onBlur}
          maxLength={maxLength}
        />
      )}
    />
  );
};

export default InputControlled;
