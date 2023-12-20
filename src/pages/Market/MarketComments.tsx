import { useCallback, useEffect, KeyboardEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { relativeTimeFromNow } from 'helpers/date';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import orderBy from 'lodash/orderBy';
import { changeData } from 'redux/ducks/market';
import { useAddCommentMutation } from 'services/Polkamarkets';
import type { Comment } from 'types/market';
import Avatar from 'ui/Avatar';

import { Icon, ProfileSignin } from 'components';
import { ButtonLoading } from 'components/Button';

import { useAppDispatch, useAppSelector, useLanguage } from 'hooks';

import styles from './MarketComments.module.scss';

type NewCommentForm = {
  comment: string;
};

function MarketNewComment() {
  const dispatch = useAppDispatch();

  // User
  const user = useAppSelector(state => state.polkamarkets.socialLoginInfo);
  const isLoadingUser = useAppSelector(
    state => state.polkamarkets.isLoading.login
  );
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  // User-derivated data
  const username = user?.name?.includes('#')
    ? user?.name?.split('#')[0]
    : user?.name?.split('@')[0];

  const avatar = user?.profileImage;

  // Market
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const marketComments = useAppSelector(state => state.market.market.comments);

  // Form
  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm
  } = useForm<NewCommentForm>();

  // Mutation
  const [
    addComment,
    {
      data: addCommentData,
      isLoading: isLoadingAddComment,
      isSuccess: isSuccessAddComment,
      reset: resetAddComment
    }
  ] = useAddCommentMutation();

  // Handlers
  const onSubmit: SubmitHandler<NewCommentForm> = async data => {
    if (user?.idToken) {
      await addComment({
        user: {
          authenticationToken: user.idToken
        },
        comment: {
          body: data.comment,
          marketSlug
        }
      });
    }
  };

  function onCmdCtrlEnter(callback) {
    return (e: KeyboardEvent) => {
      if (!isLoadingUser && !isLoggedIn) return;

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        callback();
      }
    };
  }

  const updateMarketComments = useCallback(
    (comment: Comment) => {
      dispatch(
        changeData({ data: { comments: [...marketComments, comment] } })
      );
    },
    [dispatch, marketComments]
  );

  useEffect(() => {
    if (isSuccessAddComment && addCommentData) {
      updateMarketComments(addCommentData);
      resetAddComment();
      resetForm();
    }
  }, [
    isSuccessAddComment,
    addCommentData,
    resetAddComment,
    resetForm,
    updateMarketComments
  ]);

  const comment = watch('comment');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.newComment}>
        <Avatar
          src={avatar}
          alt={username || 'Avatar'}
          $size="sm"
          className={styles.commentAvatar}
        />
        <div className={styles.newCommentBox}>
          <textarea
            rows={6}
            className={styles.newCommentBoxTextarea}
            placeholder="Share your thoughts..."
            onKeyDown={onCmdCtrlEnter(handleSubmit(onSubmit))}
            disabled={isLoadingAddComment}
            {...register('comment')}
          />
          <div className={styles.newCommentBoxFooter}>
            {!isLoadingUser && !isLoggedIn ? (
              <ProfileSignin size="xs" color="primary">
                <Icon
                  name="LogIn"
                  size="md"
                  className={styles.newCommentBoxFooterSigninIcon}
                />
                Sign In
              </ProfileSignin>
            ) : null}
            {isLoadingUser || (!isLoadingUser && isLoggedIn) ? (
              <ButtonLoading
                type="submit"
                size="xs"
                color="primary"
                loading={isLoadingAddComment}
                disabled={isLoadingUser || isEmpty(comment)}
              >
                Comment
              </ButtonLoading>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}

type MarketCommentProps = Comment;

function MarketComment({ user, body, timestamp }: MarketCommentProps) {
  const lang = useLanguage();

  return (
    <div className={`${styles.comment} notranslate`}>
      <Link to={`/user/${user.username}`}>
        <Avatar
          src={!isNull(user.avatar) ? user.avatar : undefined}
          alt={user.username}
          $size="sm"
          className={styles.commentAvatar}
        />
      </Link>
      <div className={styles.commentBody}>
        <p className={styles.commentBodyDetails}>
          <Link
            to={`/user/${user.username}`}
            className={styles.commentBodyDetailsUsername}
          >
            {user.username}
          </Link>
          <span className={styles.commentBodyDetailsDivider}>&middot;</span>
          {relativeTimeFromNow(timestamp * 1000, lang)}
        </p>
        <p className={styles.commentBodyContent}>{body}</p>
      </div>
    </div>
  );
}

export default function MarketComments() {
  const marketComments = useAppSelector(state => state.market.market.comments);

  const comments = orderBy(marketComments, ['timestamp'], ['desc']);

  return (
    <div className={styles.root}>
      <MarketNewComment />
      {!isEmpty(comments) ? (
        <ul className={styles.comments}>
          {comments.map((comment, index) => (
            <li
              key={comment.id}
              className={cn({
                'bg-3': index % 2 === 0
              })}
            >
              <MarketComment {...comment} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
