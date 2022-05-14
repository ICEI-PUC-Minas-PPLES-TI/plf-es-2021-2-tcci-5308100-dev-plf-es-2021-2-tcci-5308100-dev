import { SocialMediaParamStatus, SocialMediaParamType } from '../models/SocialMediaParam';
import * as yup from 'yup';
import { assigner, validateHandler, ValidatorBaseSchema, ValidatorResult } from './validator.base';

type BaseSocialMediaParamDTO = {
  param: string;
  type: SocialMediaParamType;
  status: SocialMediaParamStatus;
  approveAll: boolean;
  socialMediaIds: number[];
};

export type CreateSocialMediaParamDTO = BaseSocialMediaParamDTO & {};

export type UpdateSocialMediaParamDTO = BaseSocialMediaParamDTO & {
  id: number;
};

const validatorBase: yup.SchemaOf<BaseSocialMediaParamDTO> = yup.object().shape({
  param: yup.string().required(),
  approveAll: yup.boolean().required(),
  socialMediaIds: yup.array(yup.number().required()).min(1).required(),
  type: yup.mixed<SocialMediaParamType>().oneOf(Object.values(SocialMediaParamType)).required(),
  status: yup.mixed<SocialMediaParamStatus>().oneOf(Object.values(SocialMediaParamStatus)).required(),
});

export const createSocialMediaParamValidator: (
  body: any
) => Promise<ValidatorResult<CreateSocialMediaParamDTO>> = async (body) => {
  const dto = assigner<CreateSocialMediaParamDTO>(body, {
    type: null,
    status: null,
    param: null,
    approveAll: null,
    socialMediaIds: null,
  });

  const validator: yup.SchemaOf<CreateSocialMediaParamDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};

export const updateSocialMediaParamValidator: (
  body: any
) => Promise<ValidatorResult<UpdateSocialMediaParamDTO>> = async (body) => {
  const dto = assigner<UpdateSocialMediaParamDTO>(body, {
    id: null,
    type: null,
    status: null,
    param: null,
    approveAll: null,
    socialMediaIds: null,
  });

  const validator: yup.SchemaOf<UpdateSocialMediaParamDTO> = validatorBase.concat(
    yup.object().shape({
      id: yup.number().required(),
    })
  );

  return await validateHandler(validator, dto);
};
