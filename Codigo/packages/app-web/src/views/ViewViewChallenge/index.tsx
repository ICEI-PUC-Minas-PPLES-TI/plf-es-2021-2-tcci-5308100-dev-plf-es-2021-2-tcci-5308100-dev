import useConfettiRealistic from '@Components/animations/ConfettiRealistic';
import useFireworksAnimation from '@Components/animations/Fireworks';
import ButtonRounded from '@Components/buttons/ButtonRounded';
import InputMultiValues from '@Components/Inputs/InputMultiValues';
import CardLoading from '@Components/loading/CardLoading';
import { GenericFileType } from '@GlobalTypes';
import {
  Challenge,
  ChallengeAccepted,
  ChallengeAcceptedResponse,
  ChallengeAcceptedStatus,
  FileType,
} from '@sec/common';
import { challengeAcceptedStatusFttr } from '@Utils/formatters';
import { mapSavedFileToGenericFile } from '@Utils/util';
import arraySort from 'array-sort';
import moment from 'moment';
import { useCallback, useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ReactCanvasConfetti from 'react-canvas-confetti';

const margin = 32;

export type ExplorerRespondeChallenge = {
  text: string;
  files: GenericFileType[];
  images: GenericFileType[];
};

export type ViewViewChallengeProps = {
  onSubmit?: (params: ExplorerRespondeChallenge) => Promise<void>;
  challenge: Challenge;
  challengeAccepted?: ChallengeAccepted;

  readOnly?: boolean;

  comments?: JSX.Element;
  previousAnswers?: JSX.Element;
  recompenseInformation?: JSX.Element;

  changeStatus?: (challengeAcceptedId: number, action: 'ACCEPT' | 'DECLINE') => void;

  onRedeemRecompense?: (challengeAcceptedId: number) => Promise<boolean>;
};

const ViewViewChallenge: React.FunctionComponent<ViewViewChallengeProps> = ({
  onSubmit,
  challenge,
  challengeAccepted,
  readOnly,
  comments,
  previousAnswers,
  recompenseInformation,
  changeStatus,
  onRedeemRecompense,
}) => {
  const recompenseInformationTabHeader = useRef<HTMLSpanElement | null>(null);
  const { fire, ReactCanvasConfetti } = useFireworksAnimation();

  const [lastResponses] = challengeAccepted
    ? (arraySort(challengeAccepted.responses, 'id', { reverse: true }) as [
        ChallengeAcceptedResponse | undefined,
        ChallengeAcceptedResponse[]
      ])
    : [];

  const [activeTab, setActiveTab] = useState('comments');
  const [isAwaiting, setIsAwaiting] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<GenericFileType[]>([]);
  const [images, setImages] = useState<GenericFileType[]>([]);
  const [isAwaitingRecompense, setIsAwaitingRecompense] = useState(false);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text && !files.length && !images.length) {
      setHasErrorOnResponse(true);
    } else {
      if (onSubmit) {
        setIsAwaiting(true);
        await onSubmit({ text, files, images });
        setIsAwaiting(false);
      }
    }
  };

  const handleChangeStatus: typeof changeStatus = async (challengeAcceptedId, action) => {
    if (changeStatus) {
      setIsAwaiting(true);
      await changeStatus(challengeAcceptedId, action);
      setIsAwaiting(false);
    }
  };

  const handleOnRedeemRecompense = async (challengeAcceptedId: number) => {
    if (onRedeemRecompense) {
      setIsAwaitingRecompense(true);
      const success = await onRedeemRecompense(challengeAcceptedId);
      setIsAwaitingRecompense(false);

      if (success) {
        setActiveTab('recompenseInformation');
        recompenseInformationTabHeader.current?.scrollIntoView();
        fire();
      }
    }
  };

  return (
    <>
      <form className='pt-3 px-3' onSubmit={handleOnSubmit} style={{ cursor: challenge ? undefined : 'wait' }}>
        <div>
          <img
            className='rounded-md'
            src={challenge.cover.urlPath}
            style={{
              height: '350px',
              width: `calc(100% + ${margin * 2}px)`,
              objectFit: 'cover',
              margin: `-${margin}px -${margin}px 16px -${margin}px`,
            }}
          />
        </div>
        <div className='row'>
          <div className='col-12 d-flex'>
            <h3 className='mb-0 text-grey'>{challenge.title}</h3>
            {challengeAccepted && (
              <span
                className='flex-center py-1 bg-secondary rounded-md rounded-lg text-white fw-bold ms-auto'
                style={{ width: '145px' }}
              >
                {challengeAcceptedStatusFttr(challengeAccepted.status)}
              </span>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            {challengeAccepted && (
              <p className='text-grey mb-0' style={{ fontSize: '0.9rem' }}>
                Participado em {moment(challengeAccepted.createdAt).format('DD/MM/YYYY')}
              </p>
            )}
            <p className='text-grey' style={{ fontSize: '0.9rem' }}>
              Recompensa: {challenge.recompense.name}
            </p>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <p className='text-grey' style={{ whiteSpace: 'pre-line' }}>
              {challenge.description}
            </p>
            {/* <pre className='text-grey'>{challenge.description}</pre> */}
          </div>
        </div>
        <div className='row position-relative'>
          {isAwaiting && <CardLoading />}
          <div className='col-12'>
            <InputMultiValues
              isLoading={isAwaiting}
              readOnly={readOnly}
              hasError={readOnly ? false : hasErrorOnResponse}
              textInput={
                readOnly
                  ? { value: lastResponses?.response || '', onChange: () => undefined }
                  : {
                      value: text,
                      onChange: (value) => {
                        setText(value);
                        setHasErrorOnResponse(false);
                      },
                    }
              }
              fileInput={
                readOnly
                  ? {
                      value:
                        lastResponses?.savedFiles
                          .filter((savedFile) => savedFile.type === FileType.ATTACHMENT)
                          .map(mapSavedFileToGenericFile) || [],
                      onChange: () => undefined,
                    }
                  : {
                      value: files,
                      onChange: (value) => {
                        setFiles(value);
                        setHasErrorOnResponse(false);
                      },
                    }
              }
              imageInput={
                readOnly
                  ? {
                      value:
                        lastResponses?.savedFiles
                          .filter((savedFile) => savedFile.type === FileType.PHOTO)
                          .map(mapSavedFileToGenericFile) || [],
                      onChange: () => undefined,
                    }
                  : {
                      value: images,
                      onChange: (value) => {
                        setImages(value);
                        setHasErrorOnResponse(false);
                      },
                    }
              }
            />
          </div>
          <div className='col-12 d-flex justify-content-end'>
            {!readOnly && challengeAccepted?.status !== ChallengeAcceptedStatus.COMPLETE && (
              <ButtonRounded type='submit' isLoading={isAwaiting}>
                Enviar resposta
              </ButtonRounded>
            )}
            {readOnly &&
              !changeStatus &&
              challengeAccepted &&
              challengeAccepted.status === ChallengeAcceptedStatus.COMPLETE &&
              onRedeemRecompense && (
                <div className='mb-3 w-100'>
                  {ReactCanvasConfetti}
                  <ButtonRounded
                    variant='primary'
                    className='w-100 flex-center bg-primary-gradient'
                    isLoading={isAwaitingRecompense}
                    style={{ marginTop: '-30px' }}
                    onClick={() => handleOnRedeemRecompense(challengeAccepted.id)}
                  >
                    Resgatar recompensa
                  </ButtonRounded>
                </div>
              )}
            {readOnly && changeStatus && challengeAccepted && (
              <div className='mb-3 flex-center w-100' style={{ marginTop: '-30px' }}>
                <ButtonRounded
                  disabled={isAwaiting}
                  style={{ width: '150px' }}
                  variant='danger'
                  onClick={() => handleChangeStatus(challengeAccepted.id, 'DECLINE')}
                >
                  Recusar
                </ButtonRounded>
                <div className='m-1' />
                <ButtonRounded
                  disabled={isAwaiting}
                  style={{ width: '150px' }}
                  variant='success'
                  onClick={() => handleChangeStatus(challengeAccepted.id, 'ACCEPT')}
                >
                  Aceitar
                </ButtonRounded>
              </div>
            )}
          </div>
        </div>
      </form>
      {(comments || previousAnswers || recompenseInformation) && (
        <Tabs
          id='ViewViewChallenge_uncontrolled-tab'
          className='mb-3'
          activeKey={activeTab}
          onSelect={(tab) => tab && setActiveTab(tab)}
        >
          {comments && (
            <Tab tabClassName='tab-color-fixed' className='px-3' eventKey='comments' title='Comentários'>
              {comments}
            </Tab>
          )}
          {previousAnswers && (
            <Tab
              tabClassName='tab-color-fixed'
              className='px-3'
              eventKey='previousAnswers'
              title='Respostas anteriores'
            >
              {previousAnswers}
            </Tab>
          )}
          {recompenseInformation && (
            <Tab
              tabClassName='tab-color-fixed'
              className='px-3'
              eventKey='recompenseInformation'
              title={
                <span
                  ref={recompenseInformationTabHeader}
                  className={isAwaitingRecompense ? '' : 'blink-tab-recompense'}
                >
                  Informações sobre a recompensa
                </span>
              }
            >
              {recompenseInformation}
            </Tab>
          )}
        </Tabs>
      )}
    </>
  );
};

export default ViewViewChallenge;
