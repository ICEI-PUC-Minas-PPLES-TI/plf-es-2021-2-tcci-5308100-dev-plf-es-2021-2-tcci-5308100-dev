import { AdministratorStatus, ExplorerStatus } from '@sec/common';
import moment, { Moment } from 'moment';

export const toCurrency = (value: number | bigint) => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone: string) => (phone ? phone.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4') : phone);

export const formatCPF = (cpf: string) => (cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4') : cpf);

export const formatDate = (date: Date | Moment | string) => moment(date).format('DD/MM/YYYY');

export const formatDatetime = (date: Date | Moment | string) => moment(date).format('DD/MM/YYYY HH:mm');

export const administratorStatusBadge = (status: AdministratorStatus) => {
  const administratorStatusBadges: { [key in AdministratorStatus]: string } = {
    ACTIVE: 'badge bg-primary',
    INACTIVE: 'badge bg-secondary',
  };

  return administratorStatusBadges[status];
};

export const administratorStatusFttr = (status: AdministratorStatus) => {
  const administratorStatus: { [key in AdministratorStatus]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
  };

  return administratorStatus[status];
};

export const explorerStatusBadge = (status: ExplorerStatus) => {
  const explorerStatusBadges: { [key in ExplorerStatus]: string } = {
    ACTIVE: 'badge bg-primary',
    INACTIVE: 'badge bg-secondary',
    BANNED: 'badge bg-danger',
    UNDER_REVIEW: 'badge bg-success',
  };

  return explorerStatusBadges[status];
};

export const explorerStatusFttr = (status: ExplorerStatus) => {
  const explorerStatus: { [key in ExplorerStatus]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    BANNED: 'Banido',
    UNDER_REVIEW: 'Sob revisão',
  };

  return explorerStatus[status];
};
