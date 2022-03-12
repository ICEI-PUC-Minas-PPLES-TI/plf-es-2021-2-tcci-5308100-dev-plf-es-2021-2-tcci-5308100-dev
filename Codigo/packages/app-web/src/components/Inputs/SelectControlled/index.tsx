import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import Select, { createFilter, MultiValue, components } from 'react-select';
import { Form } from 'react-bootstrap';
import SpinLoading from '~/components/loading/SpinLoading';
import { SelectControlledOption, SelectControlledProps } from '@GlobalTypes';

const { Group, Control } = Form;

// const SelectControlled: React.FunctionComponent<SelectControlledProps> = ({
const SelectControlled: <T extends SelectControlledOption>(props: SelectControlledProps<T>) => JSX.Element = ({
  hasError,
  label,
  isRequired,
  name,
  control,
  defaultValue,
  isLoading,
  options,
  isDisabled,
  placeholder,
  onBlur,
  isMulti,
  formatOptionLabel,
  filterOptions,
  ...rest
}) => {
  const selectRef = useRef<HTMLDivElement | any>(null);
  const emptyOption: SelectControlledOption = { value: '', label: '' };
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
        render={({ field: { onChange, value, ref } }) => (
          <Select
            {...rest}
            ref={ref}
            openMenuOnFocus
            className='react-select-container'
            classNamePrefix='react-select'
            value={isMulti ? (value ? options.filter((o) => value.includes(o.value)) : []) : options.find((o) => o.value === value) || null}
            isDisabled={isDisabled}
            placeholder={placeholder || ''}
            onChange={(e: SelectControlledOption | MultiValue<SelectControlledOption> | null) => {
              if (e) {
                if (isMulti) {
                  const event = e as SelectControlledOption[];
                  onChange(event?.map((o) => o.value));
                } else {
                  const event = e as SelectControlledOption;
                  onChange(event?.value);
                }
              }
            }}
            options={options}
            onBlur={onBlur}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => ''}
            isMulti={isMulti}
            closeMenuOnSelect={!isMulti}
            formatOptionLabel={formatOptionLabel}
            filterOption={filterOptions}
            // components={{
            //   Input: ({ autoComplete, ...props }) => <components.Input {...props} autoComplete="off" />,
            // }}
          />
        )}
      />
    </Group>
  );
};

export default SelectControlled;
