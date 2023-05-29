import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { closeRightSidebar } from 'redux/ducks/ui';

import { Button } from 'components/Button';
import type { ButtonProps } from 'components/Button';

import { useAppDispatch } from 'hooks';

export default function CreateMarket({
  onCreateClick,
  ...props
}: ButtonProps & { onCreateClick?(): void }) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const handleCreateClick = useCallback(() => {
    dispatch(closeRightSidebar());
    onCreateClick?.();
    history.push('/market/create');
  }, [dispatch, history, onCreateClick]);

  return (
    <Button color="primary" size="sm" onClick={handleCreateClick} {...props}>
      Create Market
    </Button>
  );
}
