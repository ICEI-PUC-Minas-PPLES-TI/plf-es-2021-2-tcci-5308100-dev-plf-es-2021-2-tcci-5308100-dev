import { ChallengeStatus } from '../models/Challenge';
import * as yup from 'yup';
import { assigner, validateHandler, ValidatorBaseSchema, ValidatorResult } from './validator.base';

type BaseChallengeDTO = {
  status: ChallengeStatus;
  title: string;
  description: string;
  challengedExplorerId?: number | null;
  recompenseId: number;
};

export type CreateChallengeDTO = BaseChallengeDTO & {};

export type UpdateChallengeDTO = BaseChallengeDTO & {
  id: number;
  coverId: number | undefined;
};

const validatorBase: yup.SchemaOf<BaseChallengeDTO> = yup.object().shape({
  status: yup.mixed<ChallengeStatus>().oneOf(Object.values(ChallengeStatus)).required(),
  title: yup.string().required(),
  description: yup.string().required(),
  challengedExplorerId: yup.number().nullable(),
  recompenseId: yup.number().required(),
});

export const createChallengeValidator: (body: any) => Promise<ValidatorResult<CreateChallengeDTO>> = async (body) => {
  const dto = assigner<CreateChallengeDTO>(body, {
    status: null,
    title: null,
    description: null,
    challengedExplorerId: null,
    recompenseId: null,
  });

  const validator: yup.SchemaOf<CreateChallengeDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};

export const updateChallengeValidator: (body: any) => Promise<ValidatorResult<UpdateChallengeDTO>> = async (body) => {
  const dto = assigner<UpdateChallengeDTO>(body, {
    id: null,
    status: null,
    title: null,
    description: null,
    challengedExplorerId: null,
    recompenseId: null,
    coverId: null,
  });

  const validator: yup.SchemaOf<UpdateChallengeDTO> = validatorBase.concat(
    yup.object().shape({
      id: yup.number().required(),
      coverId: yup.number(),
    })
  );

  return await validateHandler(validator, dto);
};
