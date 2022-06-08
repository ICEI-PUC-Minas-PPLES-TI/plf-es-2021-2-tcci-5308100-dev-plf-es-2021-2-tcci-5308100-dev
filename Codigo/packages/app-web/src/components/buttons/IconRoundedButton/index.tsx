import React, { ButtonHTMLAttributes, CSSProperties, HTMLProps } from 'react';

export type IconRoundedButtonProps = {
  icon: string | JSX.Element;
  iconColor?: CSSProperties['color'];
  label: string | JSX.Element;
  textGrey?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const IconRoundedButton: React.FunctionComponent<IconRoundedButtonProps> = ({
  icon,
  iconColor,
  label,
  textGrey,
  ...props
}) => {
  return (
    <button
      type='button'
      className={`mx-1 clickable ${textGrey ? 'text-grey' : ''}`}
      style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: textGrey ? '#495057' : undefined }}
      {...props}
    >
      {typeof icon === 'string' ? (
        <i className={icon + '  me-2'} style={{ borderRadius: '50%', fontSize: '1.3rem', color: iconColor }} />
      ) : (
        icon
      )}
      {label}
    </button>
  );
};

export default IconRoundedButton;
