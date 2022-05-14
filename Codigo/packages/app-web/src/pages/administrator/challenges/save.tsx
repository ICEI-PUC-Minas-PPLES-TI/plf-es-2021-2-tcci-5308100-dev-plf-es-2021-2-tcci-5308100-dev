import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Challenge, ChallengeStatus, Explorer, Recompense } from '@sec/common';
import PageCard from '@Components/cards/PageCard';
import InputControlled from '@Components/Inputs/InputControlled';
import { createChallenge, getChallenge, getChallengeBase, updateChallenge } from '@Services/challengeService';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import CheckBoxControlled from '@Components/Inputs/CheckBoxControlled';
import TextAreaControlled from '@Components/Inputs/TextAreaControlled';
import FileDropzone from '@Components/Inputs/FileDropzone';
import { FileMixedSchema, NewFile } from '@Components/Inputs/FileDropzone/types';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { challengeStatusFttr, recompenseTypeFttr } from '@Utils/formatters';
import InfoCard from '@Components/cards/InfoCard';
import CardLoading from '@Components/loading/CardLoading';

type FormInput = {
  id?: number;
  challengedExplorerId?: number | null;
  recompenseId: number;

  status: ChallengeStatus;
  title: string;
  description: string;

  coverId?: number;
  newCover?: FileMixedSchema;
};

const ChallengesSave: FunctionComponent = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [isAwaiting, setIsAwaiting] = useState(false);

  const [recompenses, setRecompenses] = useState<Recompense[]>([]);
  const [explorers, setExplorers] = useState<Explorer[]>([]);

  const schema: yup.SchemaOf<FormInput> = yup.object().shape({
    id: yup.number().when('$idState', (idState, schema) => (idState ? schema.required() : schema)),

    challengedExplorerId: yup.number().nullable(),
    recompenseId: yup.number().required(),

    status: yup.mixed<ChallengeStatus>().oneOf(Object.values(ChallengeStatus)).required(),
    title: yup.string().required(),
    description: yup.string().required(),
    coverId: yup.number().when('$idState', (idState, schema) => (idState ? schema.required() : schema)),
    newCover: yup
      .mixed()
      .when('$idState', (idState) =>
        idState
          ? yup.object().shape({ isNew: yup.boolean().required() })
          : yup.object().shape({ isNew: yup.boolean().required().isTrue() }).required()
      ),
  });

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    context: {
      idState: id,
    },
  });

  useEffect(() => {
    if (id && Number(id)) {
      fetchData(+id);
    } else {
      fetchData();
    }
  }, [id]);

  const fillForm = (challenge: Challenge) => {
    reset({
      ...challenge,
      challengedExplorerId: challenge.challengedExplorer?.id,
      recompenseId: challenge.recompense.id,
      coverId: challenge.cover.id,
      newCover: { ...challenge.cover, urlPath: challenge.cover.urlPath, isNew: false },
    });
  };

  const fetchData = async (id?: number) => {
    try {
      setIsLoading(true);
      if (id) {
        const {
          payload: { challenge, explorers, recompenses },
        } = await getChallenge(id);

        fillForm(challenge);
        setRecompenses(recompenses);
        setExplorers(explorers);
      } else {
        const {
          payload: { explorers, recompenses },
        } = await getChallengeBase();

        setRecompenses(recompenses);
        setExplorers(explorers);
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
      navigate('/administrador/desafios');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (params: FormInput) => {
    try {
      setIsAwaiting(true);
      const {
        message,
        payload: { challenge },
      } = id
        ? await updateChallenge(
            { id: +id, coverId: params.coverId, ...params },
            params.newCover && params.newCover.isNew ? params.newCover.file : undefined
          )
        : await createChallenge(params, (params.newCover as NewFile).file);

      showToastSuccess({ message });
      if (!id) {
        navigate(`/administrador/desafios/salvar/${challenge.id}`);
      } else {
        fillForm(challenge);
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
      backButtonURL='/administrador/desafios'
      title={id ? 'Atualizar desafio' : 'Cadastrar desafio'}
    >
      {isLoading && <CardLoading />}
      <form className='pt-3 px-5' onSubmit={submitter(onSubmit)}>
        <div className='row'>
          <div className='col-sm-12'>
            <FileDropzone
              singleFile
              hasError={!!errors.newCover}
              label='Arquivo de capa'
              maxHeight={'300px'}
              file={watch('newCover')}
              onAcceptFile={(file) => {
                setValue('newCover', file, { shouldValidate: true });
              }}
              onRemoveFile={() => {
                setValue('newCover', undefined, { shouldValidate: true });
              }}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-8'>
            <InputControlled
              isRequired
              control={control}
              checkError={errors}
              type='text'
              defaultValue={''}
              name='title'
              label='Titulo do desafio'
            />
          </div>
          <div className='col-sm-12 col-md-4'>
            <SelectControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={ChallengeStatus.DRAFT}
              name='status'
              label='Status'
              options={[ChallengeStatus.DRAFT, ChallengeStatus.OPEN, ChallengeStatus.CLOSED].map((status) => ({
                value: status,
                label: challengeStatusFttr(status),
              }))}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <TextAreaControlled
              isRequired
              control={control}
              checkError={errors}
              defaultValue={''}
              height={'120px'}
              name='description'
              label='Descrição'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-6'>
            <SelectControlled
              isDoubleLine
              isRequired
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='recompenseId'
              label='Recompensa'
              options={recompenses.map((recompense) => ({
                value: recompense.id,
                label: recompense.name,
                type: recompenseTypeFttr(recompense.type),
              }))}
              formatOptionLabel={({ label, type }) => (
                <div className='w-100 d-flex flex-column'>
                  <span>{label}</span>
                  <small>Tipo: {type}</small>
                </div>
              )}
            />
          </div>
          <div className='col-sm-12 col-md-6'>
            <SelectControlled
              isClearable
              isDoubleLine
              isRequired
              control={control}
              checkError={errors}
              defaultValue={undefined}
              name='challengedExplorerId'
              label='Explorador desafiado'
              options={explorers.map((explorer) => ({
                value: explorer.id,
                label: explorer.name,
                email: explorer.email,
              }))}
              filterOptions={{ stringify: ({ data: { label, email } }) => `${label} ${email}` }}
              formatOptionLabel={({ label, email }) => (
                <div className='w-100 d-flex flex-column'>
                  <span>{label}</span>
                  <small>{email}</small>
                </div>
              )}
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

export default ChallengesSave;
