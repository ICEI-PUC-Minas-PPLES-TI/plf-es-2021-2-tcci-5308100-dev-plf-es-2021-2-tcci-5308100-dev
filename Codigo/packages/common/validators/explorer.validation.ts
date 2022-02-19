import { assigner, validateHandler, ValidatorResult } from './validator.base';
import * as yup from 'yup';
import { ExplorerStatus, Explorer } from '../models/Explorer';

type BaseExplorerDTO = {};

export type CreateExplorerDTO = BaseExplorerDTO;

export type UpdateExplorerDTO = BaseExplorerDTO & { id: number; status: ExplorerStatus };

const validatorBase = {};

export const createExplorerValidator: (body: any) => Promise<ValidatorResult<CreateExplorerDTO>> = async (body) => {
  const dto = assigner<CreateExplorerDTO>(body, {});

  const validator: yup.SchemaOf<CreateExplorerDTO> = yup.object().shape({
    ...validatorBase,
  });

  return await validateHandler(validator, dto);
};

export const updateExplorerValidator: (body: any) => Promise<ValidatorResult<UpdateExplorerDTO>> = async (body) => {
  const dto = assigner<UpdateExplorerDTO>(body, { id: null, status: null });

  const validator: yup.SchemaOf<UpdateExplorerDTO> = yup.object().shape({
    id: yup.number().required(),
    status: yup.mixed<ExplorerStatus>().oneOf(Object.values(ExplorerStatus)),
    ...validatorBase,
  });

  return await validateHandler(validator, dto);
};

export type ActiveExplorersParams = { explorerIds: number[] };
export type ActiveExplorersPayload = { explorers: Explorer[] };

export type BanExplorersParams = { explorerIds: number[] };
export type BanExplorersPayload = { explorers: Explorer[] };
