import { MaskCEPControlledProps } from '@GlobalTypes';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCEPControlled: React.FunctionComponent<MaskCEPControlledProps> = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder="_____-___" format="#####-###" mask="_" isNumericString />;
};

export default MaskCEPControlled;
