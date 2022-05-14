import { BackgroundVariant, GenericFileType, Variant } from '@GlobalTypes';
import { Property } from 'csstype';
import { ChallengeAccepted, ChallengeAcceptedStatus, Indexable, SavedFile } from '@sec/common';
import { NewFile } from '@Components/Inputs/FileDropzone/types';

export const nestedPropByIndex = (object: { [index: string]: any }, index: string) =>
  index.split('.').reduce((p, prop) => p[prop], object);

export const hasError = (data: any | Error): data is Error => Object.prototype.toString.call(data) === '[object Error]';

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

export const appendFormData: (formData: FormData, data: Indexable<any>, parentKey?: string) => void = (
  formData,
  data,
  parentKey?
) => {
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

export const transformNewFile = (file: unknown & File): NewFile => ({
  urlPath: URL.createObjectURL(file),
  isNew: true,
  name: file.name,
  file: file,
});

export const mapSavedFileToGenericFile = (savedFile: SavedFile): GenericFileType => ({
  ...savedFile,
  urlPath: savedFile.urlPath,
});

export const getBackgroundColorClass = (variant: BackgroundVariant) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary';
    case 'secondary':
      return 'bg-secondary';
    case 'success':
      return 'bg-success';
    case 'danger':
      return 'bg-danger';
    case 'warning':
      return 'bg-warning';
    case 'info':
      return 'bg-info';
    case 'light':
      return 'bg-light';
    case 'dark':
      return 'bg-dark';

    default:
      return '';
  }
};

export const sortAcceptChallengeByStatus = () => {
  const priority: { [key in ChallengeAcceptedStatus]: number } = {
    UNDER_REVIEW: 2,
    PENDING: 3,
    COMPLETE: 1,
  };

  return ({ status: statusA }: ChallengeAccepted, { status: statusB }: ChallengeAccepted) =>
    priority[statusA] - priority[statusB];
};

/**
 * Gera um número aleatório entre "min" e "max" (Exclusivo)
 * @param min Inclusivo
 * @param max Exclusivo
 * @returns
 */
export const generateRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const html = (string: any, ...value: any[]) => String.raw(string, ...value);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const css = (string: any, ...value: any[]) => String.raw(string, ...value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffleArray = <T>(arrayAux: T[]) => {
  const array = [...arrayAux];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateBackgroundById = (id: number) => {
  const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
  // const colors = [
  //   'primary-gradient',
  //   'gold-gradient',
  //   'red-gradient',
  //   'orange-gradient',
  //   'blue-gradient',
  //   'green-gradient',
  // ];
  return colors[id % (colors.length || 1)];
};
