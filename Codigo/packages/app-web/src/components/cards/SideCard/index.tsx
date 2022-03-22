import React from 'react';

export const SideCard: React.FunctionComponent = ({ children }) => {
  return (
    <div className='d-md-none d-lg-block ms-2 h-100' style={{ width: '315px', position: 'sticky', top: '120px' }}>
      {children}
    </div>
  );
};
