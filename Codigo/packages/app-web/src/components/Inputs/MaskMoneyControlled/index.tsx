import { MoneyMaskControlledProps } from '@GlobalTypes';
import { toCurrency } from '@Utils/formatters';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MoneyMaskControlled: React.FunctionComponent<MoneyMaskControlledProps> = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder='R$' isNumericString prefix={'R$ '} isMoneyMask format={(e) => toCurrency(+e / 100)} />;
};

export default MoneyMaskControlled;
