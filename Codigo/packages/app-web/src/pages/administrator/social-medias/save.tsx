import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SocialMediaName, SocialMediaParam, SocialMediaParamStatus, SocialMediaParamType } from '@sec/common';
import PageCard from '@Components/cards/PageCard';
import InputControlled from '@Components/Inputs/InputControlled';
import { createSocialMediaParam, getSocialMediaParam, updateSocialMediaParam } from '@Services/socialMediaService';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import CheckBoxControlled from '@Components/Inputs/CheckBoxControlled';
import TextAreaControlled from '@Components/Inputs/TextAreaControlled';
import FileDropzone from '@Components/Inputs/FileDropzone';
import { NewFile } from '@Components/Inputs/FileDropzone/types';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { socialMediaParamStatusFttr, socialMediaParamTypeFttr, socialMediasFttr } from '@Utils/formatters';
import { SelectControlledOption } from '@Components/Inputs/BaseController/types';

type FormInput = {
  id?: number;

  param: string;
  type: SocialMediaParamType;
  status: SocialMediaParamStatus;

  approveAll: boolean;
  socialMediaIds: number[];
};

const SocialMediaParamsSave: FunctionComponent = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isAwaiting, setIsAwaiting] = useState(false);

  const schema: yup.SchemaOf<FormInput> = yup.object().shape({
    id: yup.number().when('$idState', (idState, schema) => (idState ? schema.required() : schema)),

    param: yup.string().required(),

    type: yup.mixed<SocialMediaParamType>().oneOf(Object.values(SocialMediaParamType)).required(),
    status: yup.mixed<SocialMediaParamStatus>().oneOf(Object.values(SocialMediaParamStatus)).required(),

    approveAll: yup.boolean().required(),
    socialMediaIds: yup.array(yup.number().required()).required(),
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

  const fillForm = (socialMediaParam: SocialMediaParam) => {
    reset({ ...socialMediaParam, socialMediaIds: socialMediaParam.socialMedias.map(({ id }) => id) });
  };

  const fetchData = async (id: number) => {
    try {
      setIsAwaiting(true);
      const {
        payload: { socialMediaParam },
      } = await getSocialMediaParam(id);

      fillForm(socialMediaParam);
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
        payload: { socialMediaParam },
      } = id ? await updateSocialMediaParam({ id: +id, ...params }) : await createSocialMediaParam(params);

      if (!id) {
        navigate(`/administrador/redes-sociais/salvar/${socialMediaParam.id}`);
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
      backButtonURL='/administrador/redes-sociais'
      title={id ? 'Atualizar recompensa' : 'Cadastrar recompensa'}
    >
      <form className='pt-3 px-5' onSubmit={submitter(onSubmit)}>
        <div className='row'>
          <div className='col-sm-12'>
            <InputControlled
              isRequired
              control={control}
              checkError={errors}
              type='text'
              defaultValue={''}
              name='param'
              label='Parâmetro'
            />
            <CheckBoxControlled
              removeTopSpace
              control={control}
              defaultValue={false}
              name='approveAll'
              label='Aprovar tudo'
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
              options={[
                { value: SocialMediaParamType.ACCOUNT, label: socialMediaParamTypeFttr(SocialMediaParamType.ACCOUNT) },
                { value: SocialMediaParamType.HASHTAG, label: socialMediaParamTypeFttr(SocialMediaParamType.HASHTAG) },
              ]}
            />
          </div>

          <div className='col-sm-6'>
            <SelectControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='status'
              label='Status'
              options={[
                {
                  value: SocialMediaParamStatus.ACTIVE,
                  label: socialMediaParamStatusFttr(SocialMediaParamStatus.ACTIVE),
                },
                {
                  value: SocialMediaParamStatus.INACTIVE,
                  label: socialMediaParamStatusFttr(SocialMediaParamStatus.INACTIVE),
                },
              ]}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <SelectControlled
              isRequired
              isMulti
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='socialMediaIds'
              label='Redes sociais'
              options={[
                { value: 1, label: socialMediasFttr(SocialMediaName.INSTAGRAM) },
                { value: 2, label: socialMediasFttr(SocialMediaName.TIKTOK), isDisabled: true },
                { value: 3, label: socialMediasFttr(SocialMediaName.TWITTER) },
                { value: 4, label: socialMediasFttr(SocialMediaName.FACEBOOK), isDisabled: true },
                { value: 5, label: socialMediasFttr(SocialMediaName.LINKEDIN), isDisabled: true },
              ]}
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

export default SocialMediaParamsSave;
