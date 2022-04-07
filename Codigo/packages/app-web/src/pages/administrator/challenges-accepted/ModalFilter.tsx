import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { ChallengeAcceptedStatus } from '@sec/common';
import { GetAllChallengesAcceptedFilters as FormInput } from '@Services/challengeAcceptedService';
import { challengeAcceptedStatusFttr } from '@Utils/formatters';
import InputControlled from '@Components/Inputs/InputControlled';

export type InitialFilters = {
  status: ChallengeAcceptedStatus[];
};

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: InitialFilters;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  status: yup
    .array<ChallengeAcceptedStatus[]>(
      yup.mixed<ChallengeAcceptedStatus>().oneOf(Object.values(ChallengeAcceptedStatus)).required()
    )
    .required()
    .min(1),
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
    <Modal ref={modalRef} title='Filtrar desafios' size='md'>
      <form onSubmit={submitter(handleOnSubmit)}>
        <div className='modal-body'>
          <SelectControlled
            isMulti
            control={control}
            hasError={!!errors.status}
            defaultValue={defaultValues.status}
            name='status'
            label='Status'
            options={[
              {
                label: challengeAcceptedStatusFttr(ChallengeAcceptedStatus.UNDER_REVIEW),
                value: ChallengeAcceptedStatus.UNDER_REVIEW,
              },
              {
                label: challengeAcceptedStatusFttr(ChallengeAcceptedStatus.PENDING),
                value: ChallengeAcceptedStatus.PENDING,
              },
              {
                label: challengeAcceptedStatusFttr(ChallengeAcceptedStatus.COMPLETE),
                value: ChallengeAcceptedStatus.COMPLETE,
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
