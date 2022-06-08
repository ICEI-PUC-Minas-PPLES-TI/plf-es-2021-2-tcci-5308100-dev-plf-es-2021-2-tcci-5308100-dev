import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { ExplorerStatus } from '@sec/common';
import { GetAllExplorersFilters as FormInput } from '@Services/explorerService';

export type InitialFilters = {
  status: ExplorerStatus[];
};

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: InitialFilters;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  status: yup
    .array<ExplorerStatus[]>(yup.mixed<ExplorerStatus>().oneOf(Object.values(ExplorerStatus)).required())
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
    <Modal ref={modalRef} title='Filtrar administradores' size='md'>
      <form onSubmit={submitter(handleOnSubmit)}>
        <div className='modal-body'>
          <SelectControlled
            isRequired
            isMulti
            control={control}
            hasError={!!errors.status}
            defaultValue={defaultValues.status}
            name='status'
            label='Status'
            options={[
              { label: 'Ativo', value: ExplorerStatus.ACTIVE },
              { label: 'Inativo', value: ExplorerStatus.INACTIVE },
              { label: 'Sob revisão', value: ExplorerStatus.UNDER_REVIEW },
              { label: 'Banido', value: ExplorerStatus.BANNED },
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
