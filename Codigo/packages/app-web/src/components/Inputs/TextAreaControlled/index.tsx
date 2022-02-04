import { TextAreaControlledProps } from '@GlobalTypes';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
const { Group, Control } = Form;

const TextAreaControlled: React.FunctionComponent<TextAreaControlledProps> = ({
  hasError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  isLoading,
  height,
  disabled,
  ...rest
}) => {
  return (
    <Group className={'has-label ' + (hasError === undefined ? '' : hasError ? 'has-error' : 'has-success')}>
      <label>
        {label}
        {isRequired && <span className='star'>*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Control {...rest} as='textarea' disabled={disabled} style={{ height }} value={value} onChange={onChange} />
        )}
      />
    </Group>
  );
};

export default TextAreaControlled;
