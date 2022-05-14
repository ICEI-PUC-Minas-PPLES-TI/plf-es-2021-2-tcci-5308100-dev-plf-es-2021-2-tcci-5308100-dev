import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { RecompenseStatus, RecompenseType } from '@sec/common';
import { GetAllRecompensesFilters as FormInput } from '@Services/recompenseService';
import { recompenseStatusFttr, recompenseTypeFttr } from '@Utils/formatters';
import InputControlled from '@Components/Inputs/InputControlled';

export type InitialFilters = {
  type: RecompenseType[];
  status: RecompenseStatus[];
};

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: InitialFilters;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  type: yup
    .array<RecompenseType[]>(yup.mixed<RecompenseType>().oneOf(Object.values(RecompenseType)).required())
    .required()
    .min(1),
  status: yup
    .array<RecompenseStatus[]>(yup.mixed<RecompenseStatus>().oneOf(Object.values(RecompenseStatus)).required())
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
    <Modal ref={modalRef} title='Filtrar recompensas' size='md'>
      <form onSubmit={submitter(handleOnSubmit)}>
        <div className='modal-body'>
          <SelectControlled
            isMulti
            control={control}
            checkError={errors}
            defaultValue={defaultValues.type}
            name='type'
            label='Tipo'
            options={[
              { label: recompenseTypeFttr(RecompenseType.GENERAL), value: RecompenseType.GENERAL },
              { label: recompenseTypeFttr(RecompenseType.DISCOUNT_COUPON), value: RecompenseType.DISCOUNT_COUPON },
            ]}
          />
          <SelectControlled
            isMulti
            control={control}
            checkError={errors}
            defaultValue={defaultValues.status}
            name='status'
            label='Status'
            options={[
              { label: recompenseStatusFttr(RecompenseStatus.ACTIVE), value: RecompenseStatus.ACTIVE },
              { label: recompenseStatusFttr(RecompenseStatus.INACTIVE), value: RecompenseStatus.INACTIVE },
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
