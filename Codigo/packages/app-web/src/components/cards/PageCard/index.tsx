import { Variant } from '@GlobalTypes';
import React from 'react';

interface PageCardProps {
  title: string | JSX.Element;
  buttons?: {
    variant: Variant;
    label: string;
    onclick: () => void;
  }[];
}
const PageCard: React.FunctionComponent<PageCardProps> = ({ children, title, buttons }) => {
  return (
    <div className='card' style={{ borderRadius: '25px 25px 0px 0px' }}>
      <div
        className='card-header flex-center'
        style={{ borderRadius: '25px 25px 0px 0px', backgroundColor: 'gray', color: 'white', fontWeight: '500', justifyContent: 'space-between' }}
      >
        <div>{title}</div>
        {buttons && (
          <div>
            {buttons.map((button) => (
              <button className={`rounded-lg btn btn-${button.variant}`} onClick={button.onclick}>
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className='card-body'>{children}</div>
    </div>
  );
};

export default PageCard;
