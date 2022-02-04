import { Variant } from '@GlobalTypes';
import { Property } from 'csstype';

export const toCurrency = (value: number | bigint) => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone: string) =>
  phone ? phone.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4') : phone;

export const formatCPF = (cpf: string) =>
  cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4') : cpf;

export const nestedPropByIndex = (
  object: { [index: string]: any },
  index: string,
) => index.split('.').reduce((p, prop) => p[prop], object);

export const hasError = (data: any | Error): data is Error =>
  Object.prototype.toString.call(data) === '[object Error]';

export const getVariantColor = (
  variant: Variant | undefined,
): Property.Color => {
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