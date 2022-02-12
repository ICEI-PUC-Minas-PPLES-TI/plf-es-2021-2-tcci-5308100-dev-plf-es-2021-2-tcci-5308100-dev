import React from 'react';

const Error403: React.FunctionComponent<{ fullPage?: boolean }> = ({ fullPage = false }) => {
  if (fullPage)
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Erro 403</h1>
        <small>(usuário não autorizado a acessar este recurso)</small>
      </div>
    );
  else
    return (
      <div className='min-window-size d-flex justify-content-center align-items-center flex-column'>
        <h1>Erro 403</h1>
        <small>(usuário não autorizado a acessar este recurso)</small>
      </div>
    );
};

export default Error403;
