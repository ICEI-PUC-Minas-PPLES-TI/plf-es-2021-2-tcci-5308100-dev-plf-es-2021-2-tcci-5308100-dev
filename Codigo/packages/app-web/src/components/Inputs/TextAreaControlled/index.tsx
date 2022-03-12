import { TextAreaControlledProps } from '~/components/Inputs/BaseController/types';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import BaseController from '../BaseController';
const { Group, Control } = Form;

const TextAreaControlled: <T>(props: TextAreaControlledProps<T>) => JSX.Element = ({ height, isDisabled, ...rest }) => {
  return (
    <BaseController
      {...rest}
      render={({ ref, value, onChange }) => (
        <Control ref={ref} as='textarea' disabled={isDisabled} style={{ height }} value={value} onChange={onChange} />
      )}
    />
  );
};

export default TextAreaControlled;
