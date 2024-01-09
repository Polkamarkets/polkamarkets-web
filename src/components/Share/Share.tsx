import { useCallback } from 'react';

import cn from 'classnames';

import useToastNotification from 'hooks/useToastNotification';

import { Button, ButtonProps } from '../Button';
import Icon from '../Icon';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';

type ShareProps = ButtonProps & {
  id: string;
  title?: string;
  link?: {
    title: string;
    url: string;
  };
  iconOnly?: boolean;
};

export default function Share({
  id,
  title = 'Share',
  link,
  iconOnly = true,
  size = 'sm',
  color = 'noborder',
  ...props
}: ShareProps) {
  const { show } = useToastNotification();

  const share = useCallback(async () => {
    try {
      await navigator.share({
        title: link?.title || document.title,
        url: link?.url || window.location.href
      });
      show(`${id}-success-share`);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        show(`${id}-error-share`);
      }
    }
  }, [id, link?.title, link?.url, show]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link?.url || window.location.href);
      show(`${id}-success-copy-to-clipboard`);
    } catch (error) {
      show(`${id}-error-copy-to-clipboard`);
    }
  }, [id, link?.url, show]);

  const handleClick = useCallback(async () => {
    if (typeof navigator.share === 'function') {
      await share();
    } else {
      await copyToClipboard();
    }
  }, [copyToClipboard, share]);

  return (
    <>
      <Button
        size={size}
        color={color}
        onClick={handleClick}
        {...props}
        className={cn(props.className, 'button-share')}
      >
        <Icon name="Share" title="Share" />
        {!iconOnly && title}
      </Button>
      <ToastNotification id={`${id}-success-share`} duration={2000}>
        <Toast variant="success" title="Success" description="Link shared!" />
      </ToastNotification>
      <ToastNotification id={`${id}-error-share`} duration={3000}>
        <Toast variant="danger" title="Error" description="Could not share!" />
      </ToastNotification>
      <ToastNotification id={`${id}-success-copy-to-clipboard`} duration={2000}>
        <Toast
          variant="success"
          title="Success"
          description="Link copied to clipboard!"
        />
      </ToastNotification>
      <ToastNotification id={`${id}-error-copy-to-clipboard`} duration={3000}>
        <Toast
          variant="danger"
          title="Error"
          description="Could not copy link to clipboard!"
        />
      </ToastNotification>
    </>
  );
}
