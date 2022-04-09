import * as yup from 'yup';
import { assigner, validateHandler, ValidatorResult } from './validator.base';

type BaseCommentDTO = {
  text: string;
  acceptedChallengeId: number;
};

export type CreateCommentDTO = BaseCommentDTO & {};

export type UpdateCommentDTO = BaseCommentDTO & {};

const validatorBase: yup.SchemaOf<BaseCommentDTO> = yup.object().shape({
  text: yup.string().required(),
  acceptedChallengeId: yup.number().required(),
});

export const createCommentValidator: (body: any) => Promise<ValidatorResult<CreateCommentDTO>> = async (body) => {
  const dto = assigner<CreateCommentDTO>(body, {
    text: null,
    acceptedChallengeId: null,
  });

  const validator: yup.SchemaOf<CreateCommentDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};

export const updateCommentValidator: (body: any) => Promise<ValidatorResult<UpdateCommentDTO>> = async (body) => {
  const dto = assigner<UpdateCommentDTO>(body, {
    text: null,
    acceptedChallengeId: null,
  });

  const validator: yup.SchemaOf<UpdateCommentDTO> = validatorBase.concat(yup.object().shape({}));

  return await validateHandler(validator, dto);
};
