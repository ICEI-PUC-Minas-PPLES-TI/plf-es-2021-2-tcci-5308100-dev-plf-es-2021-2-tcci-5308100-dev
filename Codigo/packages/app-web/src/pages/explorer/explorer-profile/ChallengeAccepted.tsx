import PageCard from '@Components/cards/PageCard';
import { GenericFileType } from '@GlobalTypes';
import { Challenge } from '@sec/common';
import { acceptChallenge } from '@Services/challengeAcceptedService';
import { getChallengeAsExplorer } from '@Services/challengeService';
import { ViewViewChallenge } from '@Views/ViewViewChallenge';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const ChallengesSave = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isAwaiting, setIsAwaiting] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | undefined>(undefined);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<GenericFileType[]>([]);
  const [images, setImages] = useState<GenericFileType[]>([]);

  useEffect(() => {
    if (id) fetchData(+id);
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      setIsAwaiting(true);
      const {
        payload: { challenge },
      } = await getChallengeAsExplorer(id);

      setChallenge(challenge);
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  const handleOnSubmit = async () => {
    try {
      if (!id || (!text && !files.length && !images.length)) {
        setHasErrorOnResponse(true);
      } else {
        setIsAwaiting(true);
        const { message, payload } = await acceptChallenge({ challengeId: +id, response: text });

        showToastSuccess({ message });
        navigate('/explorador/desafio-aceito/' + payload.challengeAccepted.id);
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      <ViewViewChallenge
        onSubmit={handleOnSubmit}
        challenge={isAwaiting ? undefined : challenge}
        hasErrorOnResponse={hasErrorOnResponse}
        textInput={{
          value: text,
          onChange: (value) => {
            setHasErrorOnResponse(false);
            setText(value);
          },
        }}
        fileInput={{
          value: files,
          onChange: (value) => {
            setHasErrorOnResponse(false);
            setFiles(value);
          },
        }}
        imageInput={{
          value: images,
          onChange: (value) => {
            setHasErrorOnResponse(false);
            setImages(value);
          },
        }}
      />
    </PageCard>
  );
};

export default ChallengesSave;
