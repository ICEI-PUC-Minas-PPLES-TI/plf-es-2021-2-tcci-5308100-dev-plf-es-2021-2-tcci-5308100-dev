import { MoneyMaskControlledProps } from '~/components/Inputs/BaseController/types';
import { toCurrency } from '@Utils/formatters';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MoneyMaskControlled: <T>(props: MoneyMaskControlledProps<T>) => JSX.Element = ({ ...rest }) => {
  return (
    <InputMaskControlled
      {...rest}
      placeholder='R$'
      isNumericString
      prefix={'R$ '}
      isMoneyMask
      format={(e) => toCurrency(+e / 100)}
    />
  );
};

export default MoneyMaskControlled;
