import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { FormControlled } from '@GlobalTypes';
const { Group, Check } = Form;

const CheckBoxControlled: React.FunctionComponent<FormControlled> = ({ label, name, control, defaultValue, ...rest }) => {
  const e: ChangeEventHandler = (e) => {};
  return (
    <div className='input-group has-label'>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Check style={{ paddingLeft: 0 }}>
            <Check.Label style={{ textTransform: 'initial' }}>
              <Check.Input type='checkbox' checked={value} onChange={(e: any) => onChange(e.target.checked)} />
              <span className='form-check-sign'></span>
              {label}
            </Check.Label>
          </Check>
        )}
      />
    </div>
  );
};

export default CheckBoxControlled;
