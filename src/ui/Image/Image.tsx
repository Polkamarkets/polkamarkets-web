import { forwardRef } from 'react';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'ui/Skeleton';
import useEnhancedRef from 'ui/useEnhancedRef';
import useImage from 'ui/useImage';

import imageClasses from './Image.module.scss';

export type ImageProps = React.PropsWithChildren<
  Pick<
    React.ComponentPropsWithRef<'img'>,
    'src' | 'alt' | 'className' | 'ref'
  > & {
    $size?: 'x2s' | 'xs' | 'sm' | 'md' | 'lg';
    $radius?: 'xs' | 'sm' | 'md' | 'lg';
  }
>;

function Div(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      {...props}
    />
  );
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { alt, className, children, $radius, $size, ...props },
  ref
) {
  const [state, { ref: imageRef, ...imageProps }] = useImage();

  return (
    <div
      className={cn(
        imageClasses.root,
        {
          [imageClasses.radiusXs]: $radius === 'xs',
          [imageClasses.radiusSm]: $radius === 'sm',
          [imageClasses.radiusMd]: $radius === 'md',
          [imageClasses.radiusLg]: $radius === 'lg',
          [imageClasses.sizeX2s]: $size === 'x2s',
          [imageClasses.sizeXs]: $size === 'xs',
          [imageClasses.sizeSm]: $size === 'sm',
          [imageClasses.sizeMd]: $size === 'md',
          [imageClasses.sizeLg]: $size === 'lg'
        },
        className
      )}
    >
      <img
        alt={alt}
        ref={useEnhancedRef<HTMLImageElement>(ref, imageRef)}
        className={cn(imageClasses.element, {
          [imageClasses.elementHide]: state !== 'ok'
        })}
        {...imageProps}
        {...props}
      />
      <AnimatePresence>
        {state === 'load' && (
          <Div>
            <Skeleton className={imageClasses.skeleton} />
          </Div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === 'error' && (
          <Div className={imageClasses.fallback}>
            <div className={imageClasses.fallbackElement}>{children}</div>
          </Div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Image;
