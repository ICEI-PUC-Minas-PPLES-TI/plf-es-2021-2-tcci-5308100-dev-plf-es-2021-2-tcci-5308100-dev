/**
 * Ao receber o id de um dado relacionado, não usar o nome literal da relação. Adicionar "Id" no final.
 *    Ex.: Ao invés de recompense, usar recompenseId.
 */

import { ObjectSchema,SchemaOf, BaseSchema } from 'yup';

export type ValidatorBaseSchema<T> = { [key in keyof T]: BaseSchema };

export type ValidationSuccess<T> = {
  success: true;
  dto: T;
  error: undefined;
};

export type ValidationFail = {
  success: false;
  dto: undefined | null;
  error: Error;
};

export type ValidatorResult<T> = ValidationSuccess<T> | ValidationFail;

export const assigner = <T>(source: any, fields: { [key in keyof T]-?: null }): T => {
  const aux = {};

  Object.keys(fields).forEach((field) => {
    aux[field] = source[field];
  });

  return aux as T;
};

export const validateHandler = async <T>(validator: ObjectSchema<any, any>, dto: T): Promise<ValidatorResult<T>> => {
  try {
    await validator.noUnknown().validate(dto);
    return {
      success: true,
      dto: dto,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      dto: undefined,
      error: error,
    };
  }
};
