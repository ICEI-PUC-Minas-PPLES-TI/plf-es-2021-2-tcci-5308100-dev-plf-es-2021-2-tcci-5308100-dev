import { MaskCNPJControlledProps } from '~/components/Inputs/BaseController/types';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCNPJControlled: <T>(props: MaskCNPJControlledProps<T>) => JSX.Element = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder='__.___.___/____-__' format='##.###.###/####-##' mask='_' isNumericString />;
};

export default MaskCNPJControlled;
