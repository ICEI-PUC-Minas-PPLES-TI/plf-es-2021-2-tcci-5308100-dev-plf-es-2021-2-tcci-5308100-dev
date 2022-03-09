import { MaskPhoneControlledProps } from '~/components/Inputs/BaseController/types';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskPhoneControlled: <T>(props: MaskPhoneControlledProps<T>) => JSX.Element = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder='(__) _ ____-____' format='(##) # ####-####' mask='_' isNumericString />;
};

export default MaskPhoneControlled;
