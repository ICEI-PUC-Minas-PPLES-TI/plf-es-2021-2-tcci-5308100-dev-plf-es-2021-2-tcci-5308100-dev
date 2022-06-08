import { MaskCEPControlledProps } from '~/components/Inputs/BaseController/types';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskCEPControlled: <T>(props: MaskCEPControlledProps<T>) => JSX.Element = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder='_____-___' format='#####-###' mask='_' isNumericString />;
};

export default MaskCEPControlled;
