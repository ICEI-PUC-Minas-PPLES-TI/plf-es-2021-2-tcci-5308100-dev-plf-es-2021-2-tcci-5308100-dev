import SpinLoading from '@Components/loading/SpinLoading';
import { DateTimeControlledProps } from '~/components/Inputs/BaseController/types';
import moment from 'moment';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import ReactDatetime from 'react-datetime';
import { Controller } from 'react-hook-form';
import InputMask from 'react-number-format';
import BaseController from '../BaseController';

const { Group, Control } = Form;


const DateTimeControlled: <T>(props: DateTimeControlledProps<T>) => JSX.Element = ({ withTime = false, isDisabled, outputFormat, ...rest }) => {
  return (
    <BaseController
      {...rest}
      render={({ ref, value, onChange }) => (
        <ReactDatetime
          renderInput={(props) => (
            // TODO: CORRIGIR
            <InputMask
              getInputRef={ref}
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
          value={value}
          onChange={(e) => {
            onChange(e || undefined);
          }}
        />
      )}
    />
  );
};

export default DateTimeControlled;
