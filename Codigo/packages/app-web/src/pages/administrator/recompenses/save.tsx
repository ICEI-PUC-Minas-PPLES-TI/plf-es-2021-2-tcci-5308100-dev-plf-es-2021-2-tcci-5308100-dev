import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Recompense, RecompenseStatus, RecompenseType } from '@sec/common';
import PageCard from '@Components/cards/PageCard';
import InputControlled from '@Components/Inputs/InputControlled';
import { createRecompense, getRecompense, getRecompenseBase, updateRecompense } from '@Services/recompenseService';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import CheckBoxControlled from '@Components/Inputs/CheckBoxControlled';
import TextAreaControlled from '@Components/Inputs/TextAreaControlled';
import FileDropzone from '@Components/Inputs/FileDropzone';
import { NewFile } from '@Components/Inputs/FileDropzone/types';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { recompenseStatusFttr, recompenseTypeFttr } from '@Utils/formatters';
import { SelectControlledOption } from '@Components/Inputs/BaseController/types';

type FormInput = {
  id?: number;

  name: string;
  instructions: string;
  code?: string;

  type: RecompenseType;
  status: RecompenseStatus;
};

const RecompensesSave: FunctionComponent = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isAwaiting, setIsAwaiting] = useState(false);
  const [isAwaitingDiscountCoupons, setIsAwaitingDiscountCoupons] = useState(false);

  const [discountCoupons, setDiscountCoupons] = useState<SelectControlledOption[]>([]);

  const schema: yup.SchemaOf<FormInput> = yup.object().shape({
    id: yup.number().when('$idState', (idState, schema) => (idState ? schema.required() : schema)),

    name: yup.string().required(),
    instructions: yup.string().max(2000).required(),
    code: yup
      .string()
      .when('type', {
        is: RecompenseType.DISCOUNT_COUPON,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.nullable(),
      }),

    type: yup.mixed<RecompenseType>().oneOf(Object.values(RecompenseType)).required(),
    status: yup.mixed<RecompenseStatus>().oneOf(Object.values(RecompenseStatus)).required(),
  });

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    context: {
      idState: id,
    },
  });

  useEffect(() => {
    if (id) fetchData(+id);
  }, [id]);

  const fillForm = (recompense: Recompense) => {
    reset(recompense);
  };

  const fetchData = async (id: number) => {
    try {
      setIsAwaiting(true);
      const {
        payload: { recompense },
      } = await getRecompense(id);

      fillForm(recompense);
    } catch (error: unknown) {
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
        payload: { recompense },
      } = id ? await updateRecompense({ id: +id, ...params }) : await createRecompense(params);

      if (!id) {
        navigate(`/administrador/recompensas/salvar/${recompense.id}`);
      } else {
        showToastSuccess({ message });
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  return (
    <PageCard
      showBackButton
      backButtonURL='/administrador/recompensas'
      title={id ? 'Atualizar recompensa' : 'Cadastrar recompensa'}
    >
      <form className='pt-3 px-5' onSubmit={submitter(onSubmit, console.dir)}>
        <div className='row'>
          <div className='col-sm-6'>
            <InputControlled
              isRequired
              control={control}
              checkError={errors}
              type='text'
              defaultValue={''}
              name='name'
              label='Recompensa'
            />
          </div>

          <div className='col-sm-6'>
            <SelectControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={RecompenseStatus.ACTIVE}
              name='status'
              label='Status'
              options={[RecompenseStatus.ACTIVE, RecompenseStatus.INACTIVE].map((status) => ({
                value: status,
                label: recompenseStatusFttr(status),
              }))}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-6'>
            <SelectControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='type'
              label='Tipo'
              options={[RecompenseType.GENERAL, RecompenseType.DISCOUNT_COUPON].map((type) => ({
                value: type,
                label: recompenseTypeFttr(type),
              }))}
            />
          </div>

          <div className='col-sm-6'>
            <SelectControlled
              isRequired
              isDisabled={watch('type') !== RecompenseType.DISCOUNT_COUPON}
              isLoading={isAwaitingDiscountCoupons}
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='code'
              label='Cupom de desconto'
              options={discountCoupons}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <TextAreaControlled
              isRequired
              maxLength={2000}
              control={control}
              checkError={errors}
              defaultValue={''}
              height={'120px'}
              name='instructions'
              label='Instruções para o explorador'
            />
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-12 flex-center'>
            <button type='submit' className='btn btn-success rounded-lg px-5' disabled={isAwaiting}>
              {isAwaiting ? 'Processando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </form>
    </PageCard>
  );
};

export default RecompensesSave;