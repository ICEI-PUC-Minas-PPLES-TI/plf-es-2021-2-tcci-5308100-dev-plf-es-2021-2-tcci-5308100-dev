import { Variant } from '@GlobalTypes';
import React, { Fragment } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type PageCardActions = {
  variant: Variant;
  label: string | JSX.Element;
  type: 'BUTTON' | 'LINK' | 'ROUTER' | 'DROPDOWN';
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

type PageCardActionsDropdown = PageCardActions & {
  type: 'DROPDOWN';
  menus: { label: string; href?: string; onClick?: () => void; target?: React.HTMLAttributeAnchorTarget }[];
};

type PageCardDefaultProps = {
  title: string | JSX.Element;
  showBackButton?: boolean;
  backButtonURL?: string;
  actions?: (PageCardActionsButton | PageCardActionsLink | PageCardActionsRouterLink | PageCardActionsDropdown)[];
  simpleVariant?: false;
};
type PageCardSimpleProps = {
  simpleVariant: true;
  hidePaddingTopExtra?: boolean;
};

type PageCardProps = (PageCardDefaultProps | PageCardSimpleProps) & {
  hidePaddingBottomExtra?: boolean;
  simpleVariant?: boolean;
  limitedWidth?: boolean;
};

const PageCard: React.FunctionComponent<PageCardProps> = ({
  hidePaddingBottomExtra,
  limitedWidth,
  children,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div
      className='card rounded-md h-100 px-0 position-relative'
      style={{
        flexGrow: 1,
        marginLeft: limitedWidth ? 'auto' : undefined,
        marginRight: limitedWidth ? 'auto' : undefined,
        maxWidth: limitedWidth ? '990px' : undefined,
        paddingBottom: hidePaddingBottomExtra ? undefined : '75px',
        paddingTop: props.simpleVariant && !props.hidePaddingTopExtra ? '30px' : undefined,
      }}
    >
      {props.simpleVariant ? (
        <></>
      ) : (
        <>
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
            <div>{props.title}</div>
            <div className='d-flex flex-row' style={{ gap: '8px' }}>
              <div>
                {props.actions?.map((action, i) =>
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
                  ) : action.type === 'DROPDOWN' ? (
                    <Dropdown key={'PageCard_Dropdown' + i}>
                      <Dropdown.Toggle
                        variant={action.variant}
                        className={`ms-2 rounded-lg`}
                        disabled={action.isDisabled}
                      >
                        {action.label}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {action.menus.map((menu, i) => (
                          <Fragment key={`PageCard_Dropdown_Menu_${i}`}>
                            {i !== 0 && <Dropdown.Divider />}
                            <Dropdown.Item
                              href={menu.href}
                              onClick={menu.onClick}
                              target={menu.target}
                              rel={menu.target === '_blank' ? 'noreferrer' : undefined}
                            >
                              {menu.label}
                            </Dropdown.Item>
                          </Fragment>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <></>
                  )
                )}
              </div>
              {props.showBackButton && (
                <button
                  className={`rounded-lg btn btn-secondary`}
                  onClick={() => (props.backButtonURL ? navigate(props.backButtonURL) : navigate(-1))}
                >
                  Voltar
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className='card-body'>{children}</div>
    </div>
  );
};

export default PageCard;
