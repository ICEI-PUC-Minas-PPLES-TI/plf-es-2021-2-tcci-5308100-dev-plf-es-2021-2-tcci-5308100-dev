import { InputControlledProps } from '@GlobalTypes';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import SpinLoading from '~/components/loading/SpinLoading';
const { Group, Control } = Form;

const InputControlled: React.FunctionComponent<InputControlledProps> = ({
  hasError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  type,
  isLoading,
  isDisabled,
  onBlur,
  inputStyle,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | any>(null);

  return (
    <Group className={'has-label ' + (hasError === undefined ? '' : hasError ? 'has-error' : ''/* 'has-success' */)}>
      {label && (
        <label className='label-with-loading'>
          {label}
          {isRequired && <span className='star'>*</span>}
          {isLoading && (
            <span className='spin-loading-wrapper'>
              <SpinLoading size='20px' radius='3px' alignItems='flex-start' />
            </span>
          )}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        // onFocus={() => {
        //   inputRef.current.focus();
        // }}
        render={({ field: { onChange, value, ref } }) => (
          <Control
            {...rest}
            ref={ref}
            type={type}
            value={value}
            disabled={isDisabled}
            style={inputStyle}
            onChange={(e) => {
              const value = e.target.value;
              if (type === 'number') onChange(value === '' ? undefined : +value);
              onChange(value);
            }}
            onBlur={onBlur}
          />
        )}
      />
    </Group>
  );
};

export default InputControlled;
