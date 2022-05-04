import { Fragment, FunctionComponent, RefObject, useContext, useEffect, useState } from 'react';
import { ToastContext } from '~/context/ToastContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Explorer, ExplorerStatus } from '@sec/common';
import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import SelectControlled from '@Components/Inputs/SelectControlled';
import moment from 'moment';
import FileDropzone from '@Components/Inputs/FileDropzone';
import { FileMixedSchema, NewFile } from '@Components/Inputs/FileDropzone/types';
import InputControlled from '@Components/Inputs/InputControlled';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { updateExplorerProfile } from '@Services/explorerService';

export type FormInput = {
  id: number;
  nickname: string;
  name: string;
  favoriteProduct?: string;
  biography?: string;
  instagram?: string;
  tikTok?: string;
  twitter?: string;
  facebook?: string;
  linkedIn?: string;

  avatarId?: number;
  newAvatar?: FileMixedSchema | undefined;
};

type ModalEditExplorerProfileProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (explorer: Explorer) => void;
  explorer: Explorer | undefined;
};

const ModalEditExplorerProfile: FunctionComponent<ModalEditExplorerProfileProps> = ({
  modalRef,
  onSubmit,
  explorer,
}) => {
  const { showToastDanger, showToastSuccess } = useContext(ToastContext);

  const schema: yup.SchemaOf<FormInput> = yup.object().shape({
    id: yup.number().required(),
    nickname: yup.string().required(),
    name: yup.string().required(),
    favoriteProduct: yup.string(),
    biography: yup.string(),
    instagram: yup.string(),
    tikTok: yup.string(),
    twitter: yup.string(),
    facebook: yup.string(),
    linkedIn: yup.string(),

    avatarId: yup.number(),
    newAvatar: yup.object().shape({ isNew: yup.boolean() }) as any,
  });

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    context: {
      // idState: id,
    },
  });

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (explorer) {
      fillForm(explorer);
    }
  }, [explorer]);

  const fillForm = (explorer: Explorer) => {
    reset({
      ...explorer,
      avatarId: explorer.avatar?.id,
      newAvatar: explorer.avatar ? { ...explorer.avatar, urlPath: explorer.avatar.urlPath, isNew: false } : undefined,

      favoriteProduct: explorer.favoriteProduct || '',
      biography: explorer.biography || '',
      instagram: explorer.instagram || '',
      tikTok: explorer.tikTok || '',
      twitter: explorer.twitter || '',
      facebook: explorer.facebook || '',
      linkedIn: explorer.linkedIn || '',
    });
  };

  const handleOnSubmit = async (params: FormInput) => {
    if (explorer) {
      try {
        setIsSending(true);
        const {
          message,
          payload: { explorer },
        } = await updateExplorerProfile(params, (params.newAvatar as NewFile).file);

        showToastSuccess({ message });

        fillForm(explorer);

        onSubmit(explorer);
      } catch (error: any) {
        defaultErrorHandler(error, showToastDanger);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <Modal rounded ref={modalRef} title='Meu perfil' size='md' headerClassName='bg-info'>
      <form onSubmit={submitter(handleOnSubmit, console.log)}>
        <div className='modal-body'>
          <div className='row'>
            <div className='col-sm-12'>
              <FileDropzone
                singleFile
                avatarDropzone
                hasError={!!errors.newAvatar}
                maxHeight={'300px'}
                file={watch('newAvatar')}
                onAcceptFile={(file) => {
                  setValue('newAvatar', file, { shouldValidate: true });
                }}
                onRemoveFile={() => {
                  setValue('avatarId', undefined);
                  setValue('newAvatar', undefined, { shouldValidate: true });
                }}
              />
              <small className='d-block mt-1 text-center text-grey fw-bold'>{explorer?.email}</small>
            </div>
          </div>

          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='nickname'
            label='Apelido'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='name'
            label='Nome'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='favoriteProduct'
            label='Produto favorito'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='biography'
            label='Biografia'
            maxLength={40}
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='instagram'
            label='Instagram'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='tikTok'
            label='Tik Tok'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='twitter'
            label='Twitter'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='facebook'
            label='Facebook'
          />
          <InputControlled
            type='text'
            control={control}
            checkError={errors}
            defaultValue={''}
            name='linkedIn'
            label='LinkedIn'
          />
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

export default ModalEditExplorerProfile;
