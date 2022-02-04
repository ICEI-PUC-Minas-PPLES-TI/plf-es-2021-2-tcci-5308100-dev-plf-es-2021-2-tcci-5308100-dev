import SpinLoading from '@Components/loading/SpinLoading';
import { DateTimeControlledProps } from '@GlobalTypes';
import moment from 'moment';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import ReactDatetime from 'react-datetime';
import { Controller } from 'react-hook-form';
import InputMask from 'react-number-format';

const { Group, Control } = Form;

const DateTimeControlled: React.FunctionComponent<DateTimeControlledProps> = ({
  hasError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  isLoading,
  withTime = false,
  isDisabled,
  ...rest
}) => {
  const inputRef = useRef<ReactDatetime | any>(null);

  return (
    <div className={'input-group has-label ' + (hasError === undefined ? '' : hasError ? 'has-error' : 'has-success')}>
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
        defaultValue={defaultValue ? moment(defaultValue) : undefined}
        // onFocus={() => {
        //   inputRef.current?.focus();
        // }}
        render={({ field: { onChange, value, ref } }) => (
          <ReactDatetime
            // ref={inputRef}
            renderInput={(props) => (
              <InputMask
                ref={ref}
                getInputRef={inputRef}
                {...props}
                className='form-control'
                placeholder='DD/MM/YYYY'
                format={'##/##/####'}
                mask='_'
                disabled={isDisabled}
              />
            )}
            dateFormat={'DD/MM/YYYY'}
            timeFormat={withTime}
            {...rest}
            value={value}
            onChange={(e) => {
              onChange(e || undefined);
            }}
          />
        )}
      />
    </div>
  );
};

export default DateTimeControlled;
