import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent, useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { Explorer, ExplorerStatus } from '@sec/common';
import { formatDatetime } from '@Utils/formatters';
import moment from 'moment';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { updateExplorer } from '@Services/explorerService';

export type FormInput = {
  status: ExplorerStatus;
};

type ModalSaveProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (explorers: Explorer[]) => void;
  explorer: Explorer | null;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  status: yup.mixed<ExplorerStatus>().oneOf(Object.values(ExplorerStatus)).required(),
});

const ModalSave: FunctionComponent<ModalSaveProps> = ({ modalRef, onSubmit, explorer }) => {
  const { showToastDanger } = useContext(ToastContext);

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (explorer) reset(explorer);
  }, [explorer]);

  const handleOnSubmit = async ({ status }: FormInput) => {
    if (explorer) {
      try {
        setIsSending(true);
        const { message, payload } = await updateExplorer({ id: explorer.id, status: status });
        onSubmit(payload.explorers);
      } catch (error: any) {
        defaultErrorHandler(error, showToastDanger);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <Modal ref={modalRef} title='Filtrar administradores' size='md'>
      <form onSubmit={submitter(handleOnSubmit)}>
        <div className='modal-body'>
          <SelectControlled
            isRequired
            control={control}
            hasError={!!errors.status}
            defaultValue={explorer?.status}
            name='status'
            label='Status'
            options={[
              { label: 'Ativo', value: ExplorerStatus.ACTIVE },
              { label: 'Inativo', value: ExplorerStatus.INACTIVE },
              { label: 'Sob revisão', value: ExplorerStatus.UNDER_REVIEW },
              { label: 'Banido', value: ExplorerStatus.BANNED },
            ]}
          />
          <span className='mt-3 d-block' />
          {[
            { label: 'Apelido', value: explorer?.nickname },
            { label: 'Email', value: explorer?.email },
            { label: 'Nome', value: explorer?.name },
            { label: 'Data de cadastro', value: explorer ? moment(explorer.createdAt).format('DD/MM/YYYY - HH:mm') : '-' },
            { label: 'Desafios conquistados', value: explorer?.countChallengeCompleted },
            { label: 'Biografia', value: explorer?.biography },
            { label: 'Produto favorito', value: explorer?.favoriteProduct },
            { label: 'Instagram', value: explorer?.instagram },
            { label: 'Tik Tok', value: explorer?.tikTok },
            { label: 'Twitter', value: explorer?.twitter },
            { label: 'Facebook', value: explorer?.facebook },
            { label: 'LinkedIn', value: explorer?.linkedIn },
          ].map((item) => (
            <>
              <dt>{item.label}</dt>
              <dd>{item.value || '-'}</dd>
            </>
          ))}
        </div>
        <div className='modal-footer'>
          <button className='btn btn-outline-success rounded-lg px-3' type='submit' disabled={isSending}>
            {isSending ? 'Processando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalSave;
