import React from 'react';

const Error404: React.FunctionComponent<{ fullPage?: boolean }> = ({ fullPage = false }) => {
  if (fullPage)
    return (
      <h1 style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Erro 404
      </h1>
    );
  else
    return (
      <div className='min-window-size d-flex justify-content-center align-items-center flex-column'>
        <h1>Erro 404</h1>
        <h6>Página não encontrada</h6>
      </div>
    );
};

export default Error404;
