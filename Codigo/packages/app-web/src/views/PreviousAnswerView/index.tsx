import InputMultiValues from '@Components/Inputs/InputMultiValues';
import { ChallengeAcceptedResponse, FileType } from '@sec/common';
import { mapSavedFileToGenericFile } from '@Utils/util';
import moment from 'moment';
import { FunctionComponent } from 'react';

type PreviousAnswerViewProps = {
  answers: ChallengeAcceptedResponse[];
};
const PreviousAnswerView: FunctionComponent<PreviousAnswerViewProps> = ({ answers }) => {
  return (
    <div>
      {answers.map(({ id, createdAt, response, savedFiles }) => (
        <InputMultiValues
          key={`PreviousAnswerView_${id}`}
          label={<small className='text-muted'>{moment(createdAt).format('DD/MM/YYYY [as] HH:mm')}</small>}
          readOnly
          textInput={{ value: response || '', onChange: () => undefined }}
          fileInput={{
            value: savedFiles
              .filter((savedFile) => savedFile.type === FileType.ATTACHMENT)
              .map(mapSavedFileToGenericFile),
            onChange: () => undefined,
          }}
          imageInput={{
            value: savedFiles.filter((savedFile) => savedFile.type === FileType.PHOTO).map(mapSavedFileToGenericFile),
            onChange: () => undefined,
          }}
        />
      ))}
    </div>
  );
};

export default PreviousAnswerView;
