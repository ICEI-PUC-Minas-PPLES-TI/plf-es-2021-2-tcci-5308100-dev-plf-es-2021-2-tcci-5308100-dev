import SpinLoading from '@Components/loading/SpinLoading';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { BaseControllerProps } from './types';

const { Group } = Form;

// React.FunctionComponent<BaseControllerProps>
// <T>(props: BaseControllerProps<T>) => JSX.Element
const BaseController: <T>(props: BaseControllerProps<T>) => JSX.Element = ({
  className,
  checkError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  isLoading,
  render,
}) => {
  const checkIfHasError = (checkError?: Record<any, unknown>) =>
    checkError === undefined ? '' : checkError[name] ? 'has-error' : ''; /* 'has-success' */

  return (
    <Group className={`mb-3 has-label ${className || ''} ${checkIfHasError(checkError)}`}>
      {label && (
        <label className='label-with-loading d-flex'>
          {label}
          {isRequired && <span className='star'>*</span>}
          {isLoading && (
            <span className='spin-loading-wrapper ms-2'>
              <SpinLoading size='20px' radius='3px' alignItems='flex-start' />
            </span>
          )}
        </label>
      )}
      <Controller
        name={name as any}
        control={control}
        defaultValue={defaultValue as any}
        render={({ field: { onChange, value, ref } }) => render({ onChange, value, ref })}
      />
    </Group>
  );
};

export default BaseController;
