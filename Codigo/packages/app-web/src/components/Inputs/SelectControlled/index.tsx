import './styles.css';
import Select, { createFilter, MultiValue } from 'react-select';
import { SelectControlledOption, SelectControlledProps } from '~/components/Inputs/BaseController/types';
import BaseController from '../BaseController';

const SelectControlled: <T extends SelectControlledOption, U>(props: SelectControlledProps<T, U>) => JSX.Element = ({
  options,
  isDisabled,
  placeholder,
  onBlur,
  isMulti,
  formatOptionLabel,
  filterOptions,
  isDoubleLine,
  isClearable,
  ...rest
}) => {
  return (
    <BaseController
      {...rest}
      render={({ ref, value, onChange }) => (
        <Select
          ref={ref}
          openMenuOnFocus
          isClearable={isClearable}
          className={`react-select-container ${isDoubleLine ? 'double-line' : ''}`}
          classNamePrefix='react-select'
          value={
            isMulti
              ? value
                ? options.filter((o) => value.includes(o.value))
                : []
              : options.find((o) => o.value === value) || null
          }
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
            } else {
              onChange(undefined);
            }
          }}
          options={options}
          onBlur={onBlur}
          loadingMessage={() => 'Carregando...'}
          noOptionsMessage={() => ''}
          isMulti={isMulti}
          closeMenuOnSelect={!isMulti}
          formatOptionLabel={formatOptionLabel}
          filterOption={filterOptions ? createFilter(filterOptions) : undefined}
        />
      )}
    />
  );
};

export default SelectControlled;
