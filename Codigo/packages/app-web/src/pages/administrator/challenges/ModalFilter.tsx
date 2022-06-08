import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { ChallengeStatus } from '@sec/common';
import { GetAllChallengesFilters as FormInput } from '@Services/challengeService';
import { challengeStatusFttr } from '@Utils/formatters';
import InputControlled from '@Components/Inputs/InputControlled';

export type InitialFilters = {
  status: ChallengeStatus[];
};

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: InitialFilters;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  status: yup
    .array<ChallengeStatus[]>(yup.mixed<ChallengeStatus>().oneOf(Object.values(ChallengeStatus)).required())
    .required()
    .min(1),
  challengedExplorer: yup.string(),
  recompense: yup.string(),
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
              { label: challengeStatusFttr(ChallengeStatus.OPEN), value: ChallengeStatus.OPEN },
              { label: challengeStatusFttr(ChallengeStatus.DRAFT), value: ChallengeStatus.DRAFT },
              { label: challengeStatusFttr(ChallengeStatus.CLOSED), value: ChallengeStatus.CLOSED },
            ]}
          />
          <InputControlled
            control={control}
            checkError={errors}
            defaultValue={''}
            type='text'
            name='challengedExplorer'
            label='Explorador desafiado'
          />
          <InputControlled
            control={control}
            checkError={errors}
            defaultValue={''}
            type='text'
            name='recompense'
            label='Recompensa'
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
