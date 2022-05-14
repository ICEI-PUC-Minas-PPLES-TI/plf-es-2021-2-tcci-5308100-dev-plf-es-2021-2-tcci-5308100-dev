import { Control } from 'react-hook-form';
import { NumberFormatProps } from 'react-number-format';
import { Moment } from 'moment';
import { CSSProperties, FocusEventHandler } from 'react';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { Modify } from '@sec/common';

export interface FormControlled<T> {
  label?: string | JSX.Element;
  control: Control<T, object>;
  name: keyof T;
  defaultValue: string | number | Date | object | undefined;
}

export interface BaseControllerProps<T> extends FormInputControlled<T> {
  render: (props: { onChange: any; value: any; ref: any }) => JSX.Element;
}

export interface CheckBoxControlledProps<T> extends Modify<FormControlled<T>, { defaultValue: boolean | undefined }> {
  removeTopSpace?: boolean;
}

export type InputControlledProps<T> = FormInputControlled<T> &
  (InputControlledNumber | InputControlledDate | InputControlledText | InputControlledGeneric) & {
    isDisabled?: boolean;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    placeholder?: string;
    inputStyle?: CSSProperties;
    autoComplete?: ('current-password' | 'username' | 'new-password') | string;
    maxLength?: number | undefined;
  };

export interface InputControlledNumber {
  type: 'number';
  defaultValue: number | undefined;
}

export interface InputControlledDate {
  type: 'date' | 'month';
  defaultValue: Moment | Date | undefined;
}

export interface InputControlledText {
  type: 'text' | 'email' | 'password';
  defaultValue: string | undefined;
}

export interface InputControlledGeneric {
  type:
    | 'button'
    | 'color'
    | 'file'
    | 'hidden'
    | 'image'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';
  defaultValue: string | number | Date | object | undefined;
}

export interface FormInputControlled<T> extends FormControlled<T> {
  /** @deprecated */
  hasError?: boolean;
  checkError?: Record<string, unknown>;
  isLoading?: boolean;
  isRequired?: boolean;
  className?: string;
}

export interface InputMaskControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  isMoneyMask?: boolean;
  isNumberMask?: boolean;
  isDisabled?: boolean;
  defaultValue: string | number | undefined;
}

export interface MaskCEPControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  defaultValue: string | undefined;
}

export interface MaskCNPJControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  defaultValue: string | undefined;
}

export interface MaskCPFControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  defaultValue: string | undefined;
}

export interface MoneyMaskControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  defaultValue: number | undefined;
}

export interface MaskPhoneControlledProps<T>
  extends FormInputControlled<T>,
    Modify<NumberFormatProps, { name: keyof T }> {
  defaultValue: string | undefined;
}

export type SelectControlledProps<T extends SelectControlledOption, U> = FormInputControlled<U> &
  (SelectControlledSingle<T> | SelectControlledMultiple<T>) & {
    options: T[];
    isDisabled?: boolean;
    onBlur?: FocusEventHandler;
    formatOptionLabel?: (option: T) => JSX.Element;
    filterOptions?: {
      readonly ignoreCase?: boolean;
      readonly ignoreAccents?: boolean;
      readonly stringify?: (option: FilterOptionOption<T>) => string;
      readonly trim?: boolean;
      readonly matchFrom?: 'any' | 'start';
    };
    placeholder?: string;
    isDoubleLine?: boolean;
    isClearable?: boolean;
  };

export interface SelectControlledSingle<T extends SelectControlledOption> {
  isMulti?: false;
  defaultValue: T['value'] | undefined;
}

export interface SelectControlledMultiple<T extends SelectControlledOption> {
  isMulti: true;
  defaultValue: T['value'][] | undefined;
}

export interface SelectControlledOption {
  value: string | number | boolean | object;
  label: string;
  isDisabled?: boolean;
}

export interface TextAreaControlledProps<T> extends FormInputControlled<T> {
  height: string;
  isDisabled?: boolean;
  defaultValue: string | undefined;
  maxLength?: number;
}

export interface DateTimeControlledProps<T> extends FormInputControlled<T> {
  withTime?: boolean;
  defaultValue: Date | Moment | undefined;
  isDisabled?: boolean;
  outputFormat?: string;
}
