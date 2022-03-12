import { Variant } from '@GlobalTypes';
import { Property } from 'csstype';
import { Indexable } from '@sec/common';

export const nestedPropByIndex = (object: { [index: string]: any }, index: string) => index.split('.').reduce((p, prop) => p[prop], object);

export const hasError = (data: any | Error): data is Error => Object.prototype.toString.call(data) === '[object Error]';

export const getVariantColor = (variant: Variant | undefined): Property.Color => {
  switch (variant) {
    case 'primary':
      return '#447DF7';

    case 'secondary':
      return '#6c757d';

    case 'success':
      return '#87CB16';

    case 'danger':
      return '#FB404B';

    case 'warning':
      return '#FFA534';

    case 'info':
      return '#23CCEF';

    case 'light':
      return '#f8f9fa';

    case 'dark':
      return '#343a40';

    default:
      return '#87CB16';
  }
};

export const copyToClipboard = async (textToCopy: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } else {
      window.open(textToCopy);
      return false;
    }
  } catch (e) {
    return false;
  }
};

export const range: (start: number, end?: number) => number[] = (start, end?) => {
  const arrayRange = [];
  let index = end ? start : 0;
  const range = end || start;

  for (index; index < range; index++) {
    arrayRange.push(index);
  }

  return arrayRange;
};

export const buildFormData: (data: Indexable<any>) => FormData = (data) => {
  const formData = new FormData();
  appendFormData(formData, data, undefined);

  // console.log(formData);
  // for (const pair of formData) {
  //   console.log(`${pair[0]} >> `, pair[1]);
  // }

  return formData;
};

export const appendFormData: (formData: FormData, data: Indexable<any>, parentKey?: string) => void = (formData, data, parentKey?) => {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File) &&
    !(data instanceof Blob) &&
    !(Array.isArray(data) && !data.length)
  ) {
    Object.keys(data).forEach((key) => {
      appendFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value: any = data == null ? '' : data;

    formData.append(parentKey as string, value);
  }
};

// TODO: ZIP Error object
export const zipError = async (error: any) => {
  return null;
};
