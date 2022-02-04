import { MaskCNPJControlledProps } from '@GlobalTypes';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCNPJControlled: React.FunctionComponent<MaskCNPJControlledProps> = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder="__.___.___/____-__" format="##.###.###/####-##" mask="_" isNumericString />;
};

export default MaskCNPJControlled;
