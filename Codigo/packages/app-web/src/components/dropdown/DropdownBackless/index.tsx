import { Fragment, FunctionComponent } from 'react';
import { Dropdown } from 'react-bootstrap';

type LabelTypes = 'bars' | 'ellipsisV' | 'ellipsisH';
type DropdownBacklessMenu = {
  iconClass: string;
  title: string;
  subtitle: string;

  onClick?: () => void;
  href?: string;
};
type DropdownBacklessProps = {
  noCaret?: boolean;
  noShadow?: boolean;
  menus: DropdownBacklessMenu[];
  label?: LabelTypes;
  customLabel?: string | JSX.Element;
};

const DropdownBackless: FunctionComponent<DropdownBacklessProps> = ({
  noCaret,
  noShadow,
  label,
  customLabel,
  menus,
}) => {
  const labels: { [key in LabelTypes]: string } = {
    bars: 'fas fa-bars',
    ellipsisV: 'fas fa-ellipsis-v',
    ellipsisH: 'fas fa-ellipsis-h',
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        className={`btn dropdown-toggle ${noCaret ? 'no-caret' : ''} ${noShadow ? 'no-shadow' : ''}`}
        variant=''
      >
        {customLabel || <i className={labels[label || 'bars']} />}
      </Dropdown.Toggle>

      <Dropdown.Menu className='p-4 rounded-md border-0 shadow-lg'>
        {menus.map(({ iconClass, title, subtitle, onClick, href }, i) => (
          <Fragment key={`DropdownBackless_Menu_${title}`}>
            {i !== 0 && <Dropdown.Divider />}
            <Dropdown.Item
              className='p-0 no-active-highlight no-focus-highlight no-hover-highlight'
              href={href}
              onClick={onClick}
            >
              <div className='card-body p-0 d-flex'>
                <i className={`${iconClass} text-grey me-3 font-lg`} style={{ fontSize: '25px' }} />
                <span className='fw-600 font-xssss mt-0 me-4 pointer' style={{ fontSize: '12px', fontWeight: 600 }}>
                  {title}{' '}
                  <span
                    className='d-block font-xsssss fw-500 mt-1 lh-3'
                    style={{ fontWeight: 500, color: '#adb5bd', fontSize: '10px', lineHeight: 1.4 }}
                  >
                    {subtitle}
                  </span>
                </span>
              </div>
            </Dropdown.Item>
          </Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownBackless;
