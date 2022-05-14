import { RecompenseStatus, RecompenseType } from '../models/Recompense';
import * as yup from 'yup';
import { assigner, validateHandler, ValidatorBaseSchema, ValidatorResult } from './validator.base';

type BaseRecompenseDTO = {
  name: string;
  instructions: string;
  type: RecompenseType;
  code?: string;
  status: RecompenseStatus;
};

export type CreateRecompenseDTO = BaseRecompenseDTO & {};

export type UpdateRecompenseDTO = BaseRecompenseDTO & {
  id: number;
};

const validatorBase: yup.SchemaOf<BaseRecompenseDTO> = yup.object().shape({
  name: yup.string().required(),
  instructions: yup.string().max(2000).required(),

  code: yup.string().when('type', {
    is: RecompenseType.DISCOUNT_COUPON,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),

  type: yup.mixed<RecompenseType>().oneOf(Object.values(RecompenseType)).required(),
  status: yup.mixed<RecompenseStatus>().oneOf(Object.values(RecompenseStatus)).required(),
});

export const createRecompenseValidator: (body: any) => Promise<ValidatorResult<CreateRecompenseDTO>> = async (body) => {
  const dto = assigner<CreateRecompenseDTO>(body, {
    name: null,
    instructions: null,
    type: null,
    code: null,
    status: null,
  });

  const validator: yup.SchemaOf<CreateRecompenseDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};

export const updateRecompenseValidator: (body: any) => Promise<ValidatorResult<UpdateRecompenseDTO>> = async (body) => {
  const dto = assigner<UpdateRecompenseDTO>(body, {
    id: null,
    name: null,
    instructions: null,
    type: null,
    code: null,
    status: null,
  });

  const validator: yup.SchemaOf<UpdateRecompenseDTO> = validatorBase.concat(
    yup.object().shape({
      id: yup.number().required(),
    })
  );

  return await validateHandler(validator, dto);
};
