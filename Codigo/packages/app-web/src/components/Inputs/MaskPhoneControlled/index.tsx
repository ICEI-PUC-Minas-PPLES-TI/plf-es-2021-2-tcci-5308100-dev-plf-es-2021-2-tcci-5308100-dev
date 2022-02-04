import { MaskPhoneControlledProps } from '@GlobalTypes';
import React from 'react';
import InputMaskControlled from '../InputMaskControlled';

const MaskPhoneControlled: React.FunctionComponent<MaskPhoneControlledProps> = ({ ...rest }) => {
  return <InputMaskControlled {...rest} placeholder="(__) _ ____-____" format="(##) # ####-####" mask="_" isNumericString />;
};

export default MaskPhoneControlled;
