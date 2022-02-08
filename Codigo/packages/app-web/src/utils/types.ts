import { SavedFile, UserType } from '@sec/common';
import { Control } from 'react-hook-form';
import { NumberFormatProps } from 'react-number-format';
import { Moment } from 'moment';
import { CSSProperties, FocusEventHandler } from 'react';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

export type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface RouteSettings {
  path: string;
  allowedUsers: UserType[];
  label: string;
  iconClass: string;
  component: React.FunctionComponent;
  show: boolean;
  hasNavMenu: boolean;
  bgClass?: string;
  tabHeader?: string | ((params: any) => string);
}

export interface FormControlled {
  label?: string | JSX.Element;
  control: Control<any, object>;
  name: string;
  defaultValue: string | number | Date | object | undefined;
}

export type InputControlledProps = FormInputControlled &
  (InputControlledNumber | InputControlledDate | InputControlledText | InputControlledGeneric) & {
    isDisabled?: boolean;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    placeholder?: string;
    inputStyle?: CSSProperties;
  };

export interface InputControlledNumber {
  type: 'number';
  defaultValue: number | undefined;
}

export interface InputControlledDate {
  type: 'date';
  defaultValue: Moment | string | undefined;
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
    | 'month'
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

export interface FormInputControlled extends FormControlled {
  hasError?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
}

export interface InputMaskControlledProps extends FormInputControlled, NumberFormatProps {
  isMoneyMask?: boolean;
  isNumberMask?: boolean;
  isDisabled?: boolean;
  defaultValue: string | number | undefined;
  name: string;
}

export interface MaskCEPControlledProps extends FormInputControlled, NumberFormatProps {
  defaultValue: string | undefined;
  name: string;
}

export interface MaskCNPJControlledProps extends FormInputControlled, NumberFormatProps {
  defaultValue: string | undefined;
  name: string;
}

export interface MaskCPFControlledProps extends FormInputControlled, NumberFormatProps {
  defaultValue: string | undefined;
  name: string;
}

export interface MoneyMaskControlledProps extends FormInputControlled, NumberFormatProps {
  defaultValue: number | undefined;
  name: string;
}

export interface MaskPhoneControlledProps extends FormInputControlled, NumberFormatProps {
  defaultValue: string | undefined;
  name: string;
}

export type SelectControlledProps<T extends SelectControlledOption> = FormInputControlled &
  (SelectControlledSingle<T> | SelectControlledMultiple<T>) & {
    options: T[];
    isDisabled?: boolean;
    onBlur?: FocusEventHandler;
    formatOptionLabel?: (option: T) => JSX.Element;
    filterOptions: (option: FilterOptionOption<T>, inputValue: string) => boolean;
    placeholder?: string;
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
}

export interface TextAreaControlledProps extends FormInputControlled {
  height: string;
  disabled?: boolean;
  defaultValue: string | number | Date | object | undefined;
}

export interface DateTimeControlledProps extends FormInputControlled {
  withTime?: boolean;
  defaultValue: Date | Moment | undefined;
  isDisabled?: boolean;
  outputFormat?: string;
}

export interface FileCustomInterface {
  name: string;
  path: string;
  isNew: boolean;
}

export type FileCustom<T> = T extends true
  ? { file: File } & FileCustomInterface
  : ({ file: File } & FileCustomInterface) | (SavedFile & FileCustomInterface);

export interface FileDropzoneProps {
  files: FileCustom<false>[];
  onAcceptFile: (file: FileCustom<true>[]) => void;
  onRemoveFile: (file: FileCustom<false>) => void;
}
