import PageCard from '@Components/cards/PageCard';
import SideCard from '@Components/cards/SideCard';
import { indicateExplorer } from '@Services/explorerService';
import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { AuthContext } from '~/context/AuthContext';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { useForm } from 'react-hook-form';
import InputControlled from '@Components/Inputs/InputControlled';

const { Group, Control } = Form;

const ExplorerIndicate = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);

  const { handleSubmit: submitter, register } = useForm<{ email: string }>({});

  const onSubmit = async (formData: { email: string }) => {
    try {
      const { message } = await indicateExplorer(formData);

      showToastSuccess({ message });
      return true;
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
      return false;
    }
  };

  return (
    <div className='d-flex h-100'>
      <PageCard simpleVariant hidePaddingTopExtra>
        <h3 className='fw-normal mt-2 mb-3'>Indicar exploradores</h3>
        <p className='mb-0'>Conhece alguém que gostaria de usar o nosso sistema?</p>
        <p>Mande um convite para ele o e chame para participar da nossa comunidade!</p>
        <form onSubmit={submitter(onSubmit)}>
          <label>Email</label>
          <div className='input-group mb-3' style={{ maxWidth: '600px' }}>
            <input required {...register('email')} name='email' type='email' className='form-control' />
            <div className='input-group-append'>
              <button className='btn btn-outline-secondary' type='submit'>
                Indicar
              </button>
            </div>
          </div>
        </form>
      </PageCard>
      <SideCard>
        <div className='card rounded-md mb-2 flex-center' style={{ height: '40vh' }}>
          side card
        </div>
        <div className='card rounded-md flex-center' style={{ height: '40vh' }}>
          side card
        </div>
      </SideCard>
    </div>
  );
};

export default ExplorerIndicate;
