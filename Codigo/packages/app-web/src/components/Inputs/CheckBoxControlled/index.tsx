import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { CheckBoxControlledProps } from '~/components/Inputs/BaseController/types';
const { Group, Check } = Form;

const CheckBoxControlled: <T>(props: CheckBoxControlledProps<T>) => JSX.Element = ({
  label,
  name,
  control,
  defaultValue,
  removeTopSpace,
}) => {
  return (
    <div className='input-group has-label' style={{ margin: removeTopSpace ? '-16px 0px 16px' : undefined }}>
      <Controller
        name={name as any}
        control={control}
        defaultValue={defaultValue as any}
        render={({ field: { onChange, value } }) => (
          <div className='form-check'>
            <label className='form-check-label'>
              <input
                className='form-check-input'
                type='checkbox'
                checked={value as boolean}
                onChange={(e: any) => onChange(e.target.checked)}
              />
              {label}
            </label>
          </div>
        )}
      />
    </div>
  );
};

export default CheckBoxControlled;
