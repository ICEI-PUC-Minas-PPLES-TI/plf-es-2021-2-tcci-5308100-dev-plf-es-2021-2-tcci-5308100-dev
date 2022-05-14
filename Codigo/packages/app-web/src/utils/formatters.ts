import {
  AdministratorStatus,
  ChallengeAcceptedStatus,
  ChallengeStatus,
  ExplorerStatus,
  PostStatus,
  RecompenseStatus,
  RecompenseType,
  SocialMediaName,
  SocialMediaParamStatus,
  SocialMediaParamType,
} from '@sec/common';
import moment, { Moment } from 'moment';

export const toCurrency = (value: number | bigint) => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone: string) =>
  phone ? phone.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4') : phone;

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

export const challengeStatusBadge = (status: ChallengeStatus) => {
  const challengeStatusBadges: { [key in ChallengeStatus]: string } = {
    OPEN: 'badge bg-success',
    DRAFT: 'badge bg-primary',
    CLOSED: 'badge bg-secondary',
  };

  return challengeStatusBadges[status];
};

export const challengeStatusFttr = (status: ChallengeStatus) => {
  const challengeStatus: { [key in ChallengeStatus]: string } = {
    OPEN: 'Aberto',
    DRAFT: 'Rascunho',
    CLOSED: 'Encerrado',
  };

  return challengeStatus[status];
};

export const recompenseStatusBadge = (status: RecompenseStatus) => {
  const recompenseStatusBadges: { [key in RecompenseStatus]: string } = {
    ACTIVE: 'badge bg-primary',
    INACTIVE: 'badge bg-secondary',
  };

  return recompenseStatusBadges[status];
};

export const recompenseStatusFttr = (status: RecompenseStatus) => {
  const recompenseStatus: { [key in RecompenseStatus]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
  };

  return recompenseStatus[status];
};

export const recompenseTypeBadge = (type: RecompenseType) => {
  const recompenseTypeBadges: { [key in RecompenseType]: string } = {
    GENERAL: 'badge bg-success',
    DISCOUNT_COUPON: 'badge bg-info',
    GIFT_CARD: 'badge bg-primary',
  };

  return recompenseTypeBadges[type];
};

export const recompenseTypeFttr = (status: RecompenseType) => {
  const recompenseType: { [key in RecompenseType]: string } = {
    GENERAL: 'Geral',
    DISCOUNT_COUPON: 'Cupom de desconto',
    GIFT_CARD: 'Cartão de presente',
  };

  return recompenseType[status];
};

export const challengeAcceptedStatusBadge = (status: ChallengeAcceptedStatus) => {
  const challengeAcceptedStatusBadges: { [key in ChallengeAcceptedStatus]: string } = {
    UNDER_REVIEW: 'badge bg-warning',
    PENDING: 'badge bg-info',
    COMPLETE: 'badge bg-secondary',
  };

  return challengeAcceptedStatusBadges[status];
};

export const challengeAcceptedStatusFttr = (status: ChallengeAcceptedStatus) => {
  const challengeAcceptedStatus: { [key in ChallengeAcceptedStatus]: string } = {
    UNDER_REVIEW: 'Em Análise',
    PENDING: 'Com Pendencias',
    COMPLETE: 'Conquistado',
  };

  return challengeAcceptedStatus[status];
};

export const socialMediaParamStatusBadge = (status: SocialMediaParamStatus) => {
  const socialMediaParamStatusBadges: { [key in SocialMediaParamStatus]: string } = {
    ACTIVE: 'badge bg-primary',
    INACTIVE: 'badge bg-secondary',
  };

  return socialMediaParamStatusBadges[status];
};

export const socialMediaParamStatusFttr = (status: SocialMediaParamStatus) => {
  const socialMediaParamStatus: { [key in SocialMediaParamStatus]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
  };

  return socialMediaParamStatus[status];
};

export const socialMediaParamTypeBadge = (type: SocialMediaParamType) => {
  const socialMediaParamTypeBadges: { [key in SocialMediaParamType]: string } = {
    ACCOUNT: 'badge bg-primary',
    HASHTAG: 'badge bg-info',
  };

  return socialMediaParamTypeBadges[type];
};

export const socialMediaParamTypeFttr = (status: SocialMediaParamType) => {
  const socialMediaParamType: { [key in SocialMediaParamType]: string } = {
    ACCOUNT: 'Perfil',
    HASHTAG: 'Hashtag',
  };

  return socialMediaParamType[status];
};

export const socialMediasBadge = (type: SocialMediaName) => {
  const socialMediaBadges: { [key in SocialMediaName]: string } = {
    INSTAGRAM: 'badge bg-instagram',
    TIKTOK: 'badge bg-tik-tok',
    TWITTER: 'badge bg-twitter',
    FACEBOOK: 'badge bg-facebook',
    LINKEDIN: 'badge bg-linked-in',
  };

  return socialMediaBadges[type];
};

export const socialMediasFttr = (status: SocialMediaName) => {
  const SocialMediaName: { [key in SocialMediaName]: string } = {
    INSTAGRAM: 'Instagram',
    TIKTOK: 'Tik Tok',
    TWITTER: 'Twitter',
    FACEBOOK: 'Facebook',
    LINKEDIN: 'Linked In',
  };

  return SocialMediaName[status];
};

export const postStatusFttr = (status: PostStatus) => {
  const postStatus: { [key in PostStatus]: string } = {
    APPROVED: 'Aprovado',
    REFUSED: 'Reprovado',
    UNDER_REVIEW: 'Sob revisão',
  };

  return postStatus[status];
};
