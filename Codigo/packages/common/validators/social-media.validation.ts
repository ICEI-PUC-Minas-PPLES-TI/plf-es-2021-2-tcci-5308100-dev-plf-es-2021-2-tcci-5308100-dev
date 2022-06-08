import * as yup from 'yup';
import { assigner, validateHandler, ValidatorBaseSchema, ValidatorResult } from './validator.base';
import { PostStatus } from '../models/Post';

export type UpdatePostStatusDTO = {
  id: number;
  status: PostStatus;
};

export const UpdatePostStatusValidator: (body: any) => Promise<ValidatorResult<UpdatePostStatusDTO>> = async (body) => {
  const dto = assigner<UpdatePostStatusDTO>(body, {
    id: null,
    status: null,
  });

  const validator: yup.SchemaOf<UpdatePostStatusDTO> = yup.object().shape({
    id: yup.number().required(),
    status: yup.mixed<PostStatus>().oneOf(Object.values(PostStatus)).required(),
  });

  return await validateHandler(validator, dto);
};
