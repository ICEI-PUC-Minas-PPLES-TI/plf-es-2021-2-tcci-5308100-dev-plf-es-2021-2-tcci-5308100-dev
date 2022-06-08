import { ModalWithMethods as Modal, ModalMethods } from '@Components/modals/Modal';
import { RefObject, FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectControlled from '@Components/Inputs/SelectControlled';
import { SocialMediaName, SocialMediaParamStatus, SocialMediaParamType } from '@sec/common';
import { GetAllSocialMediaParamsFilters as FormInput } from '@Services/socialMediaService';
import {
  socialMediaParamStatusBadge,
  socialMediaParamStatusFttr,
  socialMediaParamTypeBadge,
  socialMediaParamTypeFttr,
  socialMediasFttr,
} from '@Utils/formatters';
import InputControlled from '@Components/Inputs/InputControlled';
import CheckBoxControlled from '@Components/Inputs/CheckBoxControlled';

export type InitialFilters = {
  type: SocialMediaParamType[];
  status: SocialMediaParamStatus[];
  onlyApproveAll: boolean;
  socialMedias: SocialMediaName[];
};

type ModalFilterProps = {
  modalRef: RefObject<ModalMethods>;
  onSubmit: (params: FormInput) => Promise<void>;
  defaultValues: InitialFilters;
};

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  type: yup
    .array<SocialMediaParamType[]>(
      yup.mixed<SocialMediaParamType>().oneOf(Object.values(SocialMediaParamType)).required()
    )
    .required(),
  status: yup
    .array<SocialMediaParamStatus[]>(
      yup.mixed<SocialMediaParamStatus>().oneOf(Object.values(SocialMediaParamStatus)).required()
    )
    .required(),
  socialMedias: yup
    .array<SocialMediaName[]>(yup.mixed<SocialMediaName>().oneOf(Object.values(SocialMediaName)).required())
    .required(),
  onlyApproveAll: yup.boolean().required(),
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
              { label: socialMediaParamTypeFttr(SocialMediaParamType.ACCOUNT), value: SocialMediaParamType.ACCOUNT },
              { label: socialMediaParamTypeFttr(SocialMediaParamType.HASHTAG), value: SocialMediaParamType.HASHTAG },
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
              {
                label: socialMediaParamStatusFttr(SocialMediaParamStatus.ACTIVE),
                value: SocialMediaParamStatus.ACTIVE,
              },
              {
                label: socialMediaParamStatusFttr(SocialMediaParamStatus.INACTIVE),
                value: SocialMediaParamStatus.INACTIVE,
              },
            ]}
          />
          <SelectControlled
            isMulti
            placeholder='Todas'
            control={control}
            checkError={errors}
            defaultValue={[
              SocialMediaName.INSTAGRAM,
              SocialMediaName.TIKTOK,
              SocialMediaName.TWITTER,
              SocialMediaName.FACEBOOK,
              SocialMediaName.LINKEDIN,
            ]}
            name='socialMedias'
            label='Redes Sociais'
            options={[
              { label: socialMediasFttr(SocialMediaName.INSTAGRAM), value: SocialMediaName.INSTAGRAM },
              { label: socialMediasFttr(SocialMediaName.TIKTOK), value: SocialMediaName.TIKTOK },
              { label: socialMediasFttr(SocialMediaName.TWITTER), value: SocialMediaName.TWITTER },
              { label: socialMediasFttr(SocialMediaName.FACEBOOK), value: SocialMediaName.FACEBOOK },
              { label: socialMediasFttr(SocialMediaName.LINKEDIN), value: SocialMediaName.LINKEDIN },
            ]}
          />

          <CheckBoxControlled
            control={control}
            defaultValue={false}
            name='onlyApproveAll'
            label='Apenas com "Aprovar tudo"'
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
