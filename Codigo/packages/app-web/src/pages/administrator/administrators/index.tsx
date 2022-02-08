import PageCard from '@Components/cards/PageCard';
import React from 'react';

const Administrators: React.FunctionComponent = () => {
  return (
    <PageCard
      title='Gerenciar desafios'
      buttons={[{ label: 'Cadastrar desafio', onclick: () => console.log('Cadastrar desafio'), variant: 'success' }]}
    >
      <div></div>
    </PageCard>
  );
};

export default Administrators;
