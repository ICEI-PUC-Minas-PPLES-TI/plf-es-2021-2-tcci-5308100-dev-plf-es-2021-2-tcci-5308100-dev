import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AdministratorStatus } from '@sec/common';
import PageCard from '@Components/cards/PageCard';
import InputControlled from '@Components/Inputs/InputControlled';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { createAdministrator, getAdministrator, updateAdministrator } from '@Services/administratorService';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { useLocation, useParams } from 'react-router-dom';
import CheckBoxControlled from '@Components/Inputs/CheckBoxControlled';

type FormInput = {
  nickname: string;
  name: string;
  email: string;
  status: AdministratorStatus;
  password?: string;
  randomPassword: boolean;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  nickname: yup.string().required(),
  name: yup.string().required(),
  status: yup.mixed<AdministratorStatus>().oneOf(Object.values(AdministratorStatus)).required(),
  email: yup.string().email().required(),
  password: yup.string(),
  randomPassword: yup.boolean().required(),
});

const AdministratorsSave: FunctionComponent = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const params = useParams<{ id: string }>();

  const [id, setId] = useState<number | null>(null);
  const [isAwaiting, setIsAwaiting] = useState(false);

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const { id } = params;

    if (id && Number(id)) {
      setId(+id);
      fetchData(+id);
    }
  }, [params]);

  const fetchData = async (id: number) => {
    try {
      setIsAwaiting(true);
      const {
        message,
        payload: { administrator },
      } = await getAdministrator(id);

      reset(administrator);
    } catch (error: any) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  const onSubmit = async (params: FormInput) => {
    try {
      setIsAwaiting(true);
      const {
        message,
        payload: { administrator },
      } = id ? await updateAdministrator({ id, ...params }) : await createAdministrator(params);
      setId(administrator.id);
      showToastSuccess({ message });
    } catch (error: any) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  return (
    <PageCard showBackButton title={id ? 'Atualizar administrador' : 'Cadastrar administrador'}>
      <form className='pt-3 px-5' onSubmit={submitter(onSubmit, console.log)} id='testedsdasdawsad'>
        <div className='row'>
          <div className='col-sm-12 col-md-4'>
            <InputControlled isRequired control={control} checkError={errors} type='text' defaultValue={''} name='nickname' label='Apelido' />
          </div>
          <div className='col-sm-12 col-md-8'>
            <InputControlled isRequired control={control} checkError={errors} type='text' defaultValue={''} name='name' label='Nome' />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-6'>
            <InputControlled isRequired control={control} checkError={errors} type='email' defaultValue={''} name='email' label='E-mail' />
          </div>
          <div className='col-sm-12 col-md-6'>
            <SelectControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={AdministratorStatus.ACTIVE}
              name='status'
              label='Status'
              options={[
                { label: 'Ativo', value: AdministratorStatus.ACTIVE },
                { label: 'Inativo', value: AdministratorStatus.INACTIVE },
              ]}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <InputControlled control={control} checkError={errors} type='password' defaultValue={''} name='password' label='Senha' />
            <CheckBoxControlled control={control} defaultValue={false} name='randomPassword' label='Senha' />
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12 flex-center'>
            <button type='submit' className='btn btn-success rounded-lg px-5'>
              Salvar
            </button>
          </div>
        </div>
      </form>
    </PageCard>
  );
};

export default AdministratorsSave;
