import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { GetAllSocialMediaPostsParams, PostStatus } from '@sec/common';
import { postStatusFttr } from '@Utils/formatters';

type FormInput = GetAllSocialMediaPostsParams;

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: GetAllSocialMediaPostsParams;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  status: yup.array<PostStatus[]>(yup.mixed<PostStatus>().oneOf(Object.values(PostStatus)).required()).required(),
});

const ModalFilter: FunctionComponent<ModalFilterProps> = ({ modalRef, onSubmit, defaultValues }) => {
  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = (params: FormInput) => {
    onSubmit(params);
    modalRef.current?.closeModal();
  };
  return (
    <Modal ref={modalRef} title='Filtrar recompensas' size='md'>
      <form onSubmit={submitter(handleOnSubmit)}>
        <div className='modal-body'>
          <SelectControlled
            isMulti
            control={control}
            checkError={errors}
            defaultValue={defaultValues.status}
            name='status'
            label='Status'
            options={[
              {
                label: postStatusFttr(PostStatus.UNDER_REVIEW),
                value: PostStatus.UNDER_REVIEW,
              },
              {
                label: postStatusFttr(PostStatus.APPROVED),
                value: PostStatus.APPROVED,
              },
              {
                label: postStatusFttr(PostStatus.REFUSED),
                value: PostStatus.REFUSED,
              },
            ]}
          />
        </div>
        <div className='modal-footer'>
          <button className='btn btn-outline-success rounded-lg px-3' type='submit'>
            Filtrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalFilter;
