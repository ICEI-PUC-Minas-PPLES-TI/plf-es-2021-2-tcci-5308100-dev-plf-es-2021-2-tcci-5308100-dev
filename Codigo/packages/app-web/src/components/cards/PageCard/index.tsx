import { Variant } from '@GlobalTypes';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type PageCardActions = {
  variant: Variant;
  label: string;
  type: 'BUTTON' | 'LINK' | 'ROUTER';
  isDisabled?: boolean;
};

type PageCardActionsButton = PageCardActions & {
  type: 'BUTTON';
  onClick: () => void;
};

type PageCardActionsLink = PageCardActions & {
  type: 'LINK';
  href: string;
};

type PageCardActionsRouterLink = PageCardActions & {
  type: 'ROUTER';
  to: string;
};

interface PageCardProps {
  title: string | JSX.Element;
  showBackButton?: boolean;
  actions?: (PageCardActionsButton | PageCardActionsLink | PageCardActionsRouterLink)[];
}
const PageCard: React.FunctionComponent<PageCardProps> = ({ children, title, actions, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <div className='card rounded-md h-100'>
      <div
        className='card-header flex-center'
        style={{
          borderRadius: '15px 15px 0px 0px',
          backgroundColor: 'gray',
          color: 'white',
          fontWeight: '500',
          justifyContent: 'space-between',
          minHeight: '55px',
        }}
      >
        <div>{title}</div>
        <div>
          {actions?.map((action, i) =>
            action.type === 'BUTTON' ? (
              <button
                key={'PageCard_Button' + i}
                className={`ms-2 rounded-lg btn btn-${action.variant}`}
                onClick={action.onClick}
                disabled={!!action.isDisabled}
              >
                {action.label}
              </button>
            ) : action.type === 'LINK' ? (
              <a
                key={'PageCard_Link' + i}
                className={`ms-2 rounded-lg btn btn-${action.variant} ${action.isDisabled ? 'disabled' : ''}`}
                href={action.href}
              >
                {action.label}
              </a>
            ) : action.type === 'ROUTER' ? (
              <Link
                key={'PageCard_Router' + i}
                className={`ms-2 rounded-lg btn btn-${action.variant} ${action.isDisabled ? 'disabled' : ''}`}
                to={action.to}
              >
                {action.label}
              </Link>
            ) : (
              <></>
            )
          )}
        </div>
        {showBackButton && (
          <button className={`rounded-lg btn btn-secondary`} onClick={() => navigate(-1)}>
            Voltar
          </button>
        )}
      </div>

      <div className='card-body'>{children}</div>
    </div>
  );
};

export default PageCard;
