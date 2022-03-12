import SpinLoading from '@Components/loading/SpinLoading';
import { InputMaskControlledProps } from '@GlobalTypes';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';

const { Group, Control } = Form;

const InputMaskControlled: React.FunctionComponent<InputMaskControlledProps> = ({
  hasError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  isMoneyMask,
  isNumberMask,
  isLoading,
  isDisabled,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Group className={'has-label ' + (hasError === undefined ? '' : hasError ? 'has-error' : 'has-success')}>
      <label className='label-with-loading'>
        {label}
        {isRequired && <span className='star'>*</span>}
        {isLoading && (
          <span className='spin-loading-wrapper'>
            <SpinLoading size='20px' radius='3px' alignItems='flex-start' />
          </span>
        )}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        // onFocus={() => {
        //   inputRef.current?.focus();
        // }}
        render={({ field: { onChange, value, ref } }) => (
          <NumberFormat
            {...rest}
            disabled={isDisabled}
            className='form-control'
            getInputRef={ref}
            defaultValue={isMoneyMask ? value * 100 : value}
            value={isMoneyMask ? value * 100 : value}
            onValueChange={(e) =>
              isMoneyMask ? onChange(e.floatValue ? e.floatValue / 100 : undefined) : isNumberMask ? onChange(e.floatValue) : onChange(e.value)
            }
          />
        )}
      />
    </Group>
  );
};

export default InputMaskControlled;
