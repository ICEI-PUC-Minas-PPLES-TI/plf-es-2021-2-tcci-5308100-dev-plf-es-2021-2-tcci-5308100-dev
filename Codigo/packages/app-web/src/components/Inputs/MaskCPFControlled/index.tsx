import { MaskCPFControlledProps } from '@GlobalTypes';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCPFControlled: React.FunctionComponent<MaskCPFControlledProps> = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder="___.___.___-__" format="###.###.###-##" mask="_" isNumericString />;
};

export default MaskCPFControlled;
