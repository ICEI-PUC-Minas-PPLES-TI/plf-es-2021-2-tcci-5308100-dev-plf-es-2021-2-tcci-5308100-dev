import UserCommentCard from '@Components/cards/UserCommentCard';
import { Comment } from '@sec/common';
import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ButtonRounded from '@Components/buttons/ButtonRounded';

type CommentsViewProps = {
  comments: Comment[];
  onSubmit: (params: CommentInputData) => Promise<boolean>;
};

export type CommentInputData = {
  text: string;
};

const schema: yup.SchemaOf<CommentInputData> = yup.object().shape({
  text: yup.string().required(),
});

const CommentsView: FunctionComponent<CommentsViewProps> = ({ comments, onSubmit }) => {
  const {
    handleSubmit: submitter,
    formState: { errors },
    register,
    setValue,
  } = useForm<CommentInputData>({
    resolver: yupResolver(schema),
  });

  const [isSending, setIsSending] = useState(false);

  const handleOnSubmit = async (params: CommentInputData) => {
    setIsSending(true);
    const success = await onSubmit(params);
    setIsSending(false);

    if (success) setValue('text', '');
  };

  return (
    <div>
      {comments.map((comment) => (
        <UserCommentCard key={`CommentsView_${comment.id}`} comment={comment} />
      ))}

      <form
        className={`d-flex ${comments.length === 0 ? 'mt-3' : ''}`}
        onSubmit={submitter(handleOnSubmit)}
      >
        <input
          {...register('text')}
          className={`text-start btn rounded-lg me-2 flex-grow-1 border-grey ${errors.text ? 'has-error' : ''}`}
          type='text'
        />
        <ButtonRounded type='submit' isLoading={isSending}>
          Comentar
        </ButtonRounded>
      </form>
    </div>
  );
};

export default CommentsView;
