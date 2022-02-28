import { AdministratorStatus } from '../models/Administrator';
import * as yup from 'yup';
import { assigner, validateHandler, ValidatorBaseSchema, ValidatorResult } from './validator.base';

type BaseAdministratorDTO = {
  nickname: string;
  name: string;
  email: string;
  status: AdministratorStatus;
  password?: string;
  randomPassword: boolean;
};

export type CreateAdministratorDTO = BaseAdministratorDTO;

export type UpdateAdministratorDTO = BaseAdministratorDTO & { id: number };

const validatorBase: yup.SchemaOf<BaseAdministratorDTO> = yup.object().shape({
  nickname: yup.string().required(),
  name: yup.string().required(),
  status: yup.mixed<AdministratorStatus>().oneOf(Object.values(AdministratorStatus)).required(),
  email: yup.string().email().required(),
  password: yup.string(),
  randomPassword: yup.boolean().required(),
});

export const createAdministratorValidator: (body: any) => Promise<ValidatorResult<CreateAdministratorDTO>> = async (body) => {
  const dto = assigner<CreateAdministratorDTO>(body, {
    nickname: null,
    name: null,
    email: null,
    status: null,
    password: null,
    randomPassword: null,
  });

  const validator: yup.SchemaOf<CreateAdministratorDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};

export const updateAdministratorValidator: (body: any) => Promise<ValidatorResult<UpdateAdministratorDTO>> = async (body) => {
  const dto = assigner<UpdateAdministratorDTO>(body, {
    id: null,
    nickname: null,
    name: null,
    email: null,
    status: null,
    password: null,
    randomPassword: null,
  });

  const validator: yup.SchemaOf<UpdateAdministratorDTO> = validatorBase.concat(
    yup.object().shape({
      id: yup.number().required(),
    })
  );

  return await validateHandler(validator, dto);
};
