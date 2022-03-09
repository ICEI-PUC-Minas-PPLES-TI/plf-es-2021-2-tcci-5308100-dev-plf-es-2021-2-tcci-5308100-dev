import SpinLoading from '@Components/loading/SpinLoading';
import { InputMaskControlledProps } from '~/components/Inputs/BaseController/types';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import BaseController from '../BaseController';

const { Group, Control } = Form;

const InputMaskControlled: <T>(props: InputMaskControlledProps<T>) => JSX.Element = ({ isMoneyMask, isNumberMask, isDisabled, name, ...rest }) => {
  return (
    <BaseController
      {...rest}
      name={name}
      render={({ ref, value, onChange }) => (
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
  );
};

export default InputMaskControlled;
