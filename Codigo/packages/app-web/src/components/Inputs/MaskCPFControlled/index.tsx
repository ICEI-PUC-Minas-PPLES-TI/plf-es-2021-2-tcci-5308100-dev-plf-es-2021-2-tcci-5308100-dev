import { MaskCPFControlledProps } from '~/components/Inputs/BaseController/types';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCPFControlled: <T>(props: MaskCPFControlledProps<T>) => JSX.Element = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder='___.___.___-__' format='###.###.###-##' mask='_' isNumericString />;
};

export default MaskCPFControlled;
