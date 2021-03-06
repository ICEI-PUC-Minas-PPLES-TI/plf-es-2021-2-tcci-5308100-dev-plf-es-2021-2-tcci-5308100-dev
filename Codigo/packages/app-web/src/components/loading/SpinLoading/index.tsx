import React, { CSSProperties } from 'react';
import './styles.css';

const SpinLoading: React.FunctionComponent<SpinLoadingProps> = ({
  size = '30px',
  radius = '5px',
  justifyContent = 'center',
  alignItems = 'center',
  noSize,
}) => {
  const style: CSSProperties = {
    width: size,
    height: size,
    border: `${radius} solid #f3f3f3`,
    borderTop: `${radius} solid #3498db`,
  };

  return (
    <div
      style={{
        display: 'flex',
        width: !noSize ? '100%' : undefined,
        height: !noSize ? '100%' : undefined,
        justifyContent: justifyContent,
        alignItems: alignItems,
      }}
    >
      <div style={style} className='loader' />
    </div>
  );
};

export default SpinLoading;
