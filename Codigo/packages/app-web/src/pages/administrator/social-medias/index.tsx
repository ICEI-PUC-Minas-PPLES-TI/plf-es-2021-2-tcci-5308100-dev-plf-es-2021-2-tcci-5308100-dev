import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { SocialMedia, SocialMediaParam, SocialMediaParamStatus, SocialMediaParamType } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import { getAllSocialMediaParams, GetAllSocialMediaParamsFilters } from '@Services/socialMediaService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import {
  socialMediaParamStatusBadge,
  socialMediaParamStatusFttr,
  socialMediaParamTypeBadge,
  socialMediaParamTypeFttr,
  socialMediasBadge,
  socialMediasFttr,
} from '@Utils/formatters';

const SocialMedias: FunctionComponent = () => {
  const { showToastDanger } = useContext(ToastContext);
  const initialFilters: InitialFilters = {
    type: [SocialMediaParamType.ACCOUNT, SocialMediaParamType.HASHTAG],
    status: [SocialMediaParamStatus.ACTIVE],
    socialMedias: [],
    onlyApproveAll: false,
  };

  const [socialMediaParams, setSocialMediaParams] = useState<SocialMediaParam[]>([]);
  const [socialMediaParamsFiltered, setSocialMediaParamsFiltered] = useState<SocialMediaParam[]>([]);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalFilter = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    if (searchBox !== '') {
      setSocialMediaParamsFiltered([...matchSorter(socialMediaParams, searchBox, { keys: ['param'] })]);
    } else {
      setSocialMediaParamsFiltered([...socialMediaParams]);
    }
  }, [searchBox, socialMediaParams]);

  const fetchData = async (filter: GetAllSocialMediaParamsFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { socialMediaParams },
      } = await getAllSocialMediaParams(filter);

      setSocialMediaParams(socialMediaParams);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageCard
        title='Gerenciar parâmetros de redes sociais'
        actions={[
          {
            type: 'ROUTER',
            variant: 'success',
            to: '/administrador/redes-sociais/salvar',
            label: 'Cadastrar parâmetro de rede social',
          },
        ]}
      >
        <div className='card-filter'>
          <SearchInput value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
          <button className='btn btn-secondary rounded-lg' onClick={() => modalFilter.current?.showModal()}>
            Filtrar
          </button>
        </div>
        <TableWithActions
          isLoading={isLoading}
          emptyTableMessage='Nenhum parâmetro de rede social cadastrado.'
          columns={[
            { field: 'id', label: 'ID', alignment: 'center', width: '50px', sortable: true },
            {
              field: 'type',
              label: 'Tipo',
              alignment: 'center',
              width: '85px',
              classNameFttr: socialMediaParamTypeBadge,
              formatter: socialMediaParamTypeFttr,
            },
            { field: 'param', label: 'Parâmetro' },
            {
              field: 'socialMediaNames',
              label: 'Redes sociais',
              classNameFttr: (socialMediaName) => `${socialMediasBadge(socialMediaName)} d-inline-block me-1`,
              formatter: socialMediasFttr,
            },
            {
              field: 'status',
              label: 'Status',
              alignment: 'center',
              width: '80px',
              classNameFttr: socialMediaParamStatusBadge,
              formatter: socialMediaParamStatusFttr,
            },
          ]}
          actions={[
            {
              type: 'ROUTER',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              to: (a) => `/administrador/redes-sociais/salvar/${a.id}`,
            },
          ]}
          data={socialMediaParamsFiltered.map((socialMediaParam) => ({
            ...socialMediaParam,
            socialMediaNames: socialMediaParam.socialMedias
              .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
              .map(({ name }) => name),
          }))}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default SocialMedias;
