import { ButtonRounded } from '@Components/buttons/ButtonRounded';
import { InputMultiValues } from '@Components/Inputs/InputMultiValues';
import { GenericFileType } from '@GlobalTypes';
import { Challenge } from '@sec/common';
import { useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

const margin = 32;

type Setter<T> = (setter: ((state: T) => T) | T) => void;

type InputProps<T> = { value: T; onChange: Setter<T> };

export type ViewViewChallengeProps = {
  onSubmit: () => Promise<void>;
  challenge: Challenge | undefined;
  hasErrorOnResponse?: boolean;
  textInput: InputProps<string>;
  fileInput: InputProps<GenericFileType[]>;
  imageInput: InputProps<GenericFileType[]>;
  readOnly?: boolean;
};

export const ViewViewChallenge: React.FunctionComponent<ViewViewChallengeProps> = ({
  onSubmit,
  challenge,
  hasErrorOnResponse,
  textInput,
  fileInput,
  imageInput,
  readOnly,
}) => {
  return (
    <form
      className='pt-3 px-3'
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      style={{ cursor: challenge ? undefined : 'wait' }}
    >
      {challenge ? (
        <div>
          <img
            className='rounded-md'
            src={
              // FIXME: Alterar quando for definido o sistema para upload de arquivos
              challenge.cover?.urlPath ||
              'https://viagemeturismo.abril.com.br/wp-content/uploads/2020/10/gettyimages-1187018564.jpg?quality=70&strip=info'
            }
            style={{
              height: '350px',
              width: `calc(100% + ${margin * 2}px)`,
              objectFit: 'cover',
              margin: `-${margin}px -${margin}px 16px -${margin}px`,
            }}
          />
        </div>
      ) : (
        <div className='d-flex justify-content-center'>
          <Skeleton
            circle
            height='250px'
            width='250px'
            containerClassName='avatar-skeleton'
            style={{
              margin: `-${margin}px -${margin}px 16px -${margin}px`,
            }}
          />
        </div>
      )}
      <div className='row'>
        <div className='col-12'>
          <h3 className='d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0 text-grey w-100'>
            {challenge?.title || <Skeleton />}
          </h3>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <p className='text-grey' style={{ fontSize: '0.9rem' }}>
            Recompensa: {challenge?.recompense.name || <Skeleton />}
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <p className='text-grey' style={{ whiteSpace: 'pre-line' }}>
            {challenge?.description || <Skeleton count={3} />}
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          {challenge ? (
            <InputMultiValues
              readOnly={readOnly}
              hasError={hasErrorOnResponse}
              textInput={textInput}
              fileInput={fileInput}
              imageInput={imageInput}
            />
          ) : (
            <Skeleton count={4} />
          )}
        </div>
        <div className='col-12 d-flex justify-content-end'>
          {challenge && <ButtonRounded>Enviar resposta</ButtonRounded>}
        </div>
      </div>
    </form>
  );
};
