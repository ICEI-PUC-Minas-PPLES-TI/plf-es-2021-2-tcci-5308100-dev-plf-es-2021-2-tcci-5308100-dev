import * as yup from 'yup';
import { assigner, validateHandler, ValidatorResult } from './validator.base';

export type AcceptChallengeDTO = {
  challengeId: number;
  response: string;
};

export type SendChallengeResponseDTO = {
  challengeAcceptedId: number;
  response: string;
};

export const acceptChallengeValidator: (body: any) => Promise<ValidatorResult<AcceptChallengeDTO>> = async (body) => {
  const dto = assigner<AcceptChallengeDTO>(body, { challengeId: null, response: null });

  const validator: yup.SchemaOf<AcceptChallengeDTO> = yup.object().shape({
    challengeId: yup.number().required(),
    response: yup.string(),
  });

  return await validateHandler(validator, dto);
};

export const sendChallengeResponseValidator: (body: any) => Promise<ValidatorResult<SendChallengeResponseDTO>> = async (
  body
) => {
  const dto = assigner<SendChallengeResponseDTO>(body, { challengeAcceptedId: null, response: null });

  const validator: yup.SchemaOf<SendChallengeResponseDTO> = yup.object().shape({
    challengeAcceptedId: yup.number().required(),
    response: yup.string(),
  });

  return await validateHandler(validator, dto);
};
