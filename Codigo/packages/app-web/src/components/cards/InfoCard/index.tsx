import { BackgroundVariant } from '@GlobalTypes';
import { getBackgroundColorClass } from '@Utils/util';
import { FunctionComponent } from 'react';
import { Col, ColProps } from 'react-bootstrap';
import './styles.css';

type InfoCardProps = {
  sm?: ColProps['sm'];
  md?: ColProps['md'];
  lg?: ColProps['lg'];
  xl?: ColProps['xl'];
  xxl?: ColProps['xxl'];

  icon: string | JSX.Element;
  iconVariant?: BackgroundVariant;
  label: string | JSX.Element;
  value: string | number | JSX.Element;

  doubleLine?: boolean;
  isLoading?: boolean;
};

const InfoCard: FunctionComponent<InfoCardProps> = ({
  sm,
  md,
  lg,
  xl,
  xxl,
  icon,
  iconVariant,
  label,
  value,
  doubleLine,
  isLoading,
}) => {
  return (
    <Col sm={6 || sm} md={6 || md} lg={3 || lg} xl={3 || xl} xxl={xxl}>
      <div className='info-box rounded-md'>
        <span
          className={`info-box-icon elevation-1 rounded-md ${iconVariant ? getBackgroundColorClass(iconVariant) : ''}`}
        >
          {typeof icon === 'string' ? <i className={`${icon}`} /> : icon}
        </span>
        <div className='info-box-content'>
          <span
            className='info-box-text'
            style={{ height: doubleLine ? '58px' : '29px', whiteSpace: doubleLine ? 'initial' : 'nowrap' }}
          >
            {label}
          </span>
          <span className='info-box-number'>{isLoading ? '--' : value}</span>
        </div>
      </div>
    </Col>
  );
};

export default InfoCard;
