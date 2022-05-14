import React from 'react';

const SideCard: React.FunctionComponent = ({ children }) => {
  return (
    <div className='d-none d-lg-block ms-3 h-100 post-min-width' style={{ position: 'sticky', top: '120px' }}>
      {children}
    </div>
  );
};

export default SideCard;
