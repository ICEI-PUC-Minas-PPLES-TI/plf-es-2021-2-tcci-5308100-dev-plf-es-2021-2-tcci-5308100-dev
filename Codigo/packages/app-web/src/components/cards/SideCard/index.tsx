import React from 'react';

const SideCard: React.FunctionComponent = ({ children }) => {
  return (
    <div
      className='d-md-none d-lg-block ms-3 h-100'
      style={{ minWidth: '330px', width: '330px', position: 'sticky', top: '120px' }}
    >
      {children}
    </div>
  );
};

export default SideCard;
